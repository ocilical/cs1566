"use strict";
var Project1;
(function (Project1) {
    // These variables must be global variables.
    // Some callback functions may need to access them.
    let gl;
    let canvas;
    let ctm_location;
    let identity = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];
    let ctm = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ];
    let positions;
    let objOffsets = {};
    let objSizes = {};
    let currOffset;
    let currSize;
    function initGL(canvas) {
        gl = canvas.getContext("webgl");
        if (!gl) {
            alert("WebGL is not available...");
            return -1;
        }
        // Set the clear screen color to black (R, G, B, A)
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Enable hidden surface removal
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        return 0;
    }
    function init() {
        if (!gl)
            return -1;
        positions = [];
        // add objects
        let cube = Mesh.cube();
        objOffsets.cube = positions.length;
        objSizes.cube = cube.length;
        positions.push(...cube);
        let cone = Mesh.cone(128);
        objOffsets.cone = positions.length;
        objSizes.cone = cone.length;
        positions.push(...cone);
        let cylinder = Mesh.cylinder(128);
        objOffsets.cylinder = positions.length;
        objSizes.cylinder = cylinder.length;
        positions.push(...cylinder);
        let sphere = Mesh.sphere(32, 16);
        objOffsets.sphere = positions.length;
        objSizes.sphere = sphere.length;
        positions.push(...sphere);
        let torus = Mesh.torus(64, 16);
        objOffsets.torus = positions.length;
        objSizes.torus = torus.length;
        positions.push(...torus);
        currOffset = objOffsets.cube;
        currSize = objSizes.cube;
        let colors = Mesh.randomColors(positions.length);
        // Load and compile shader programs
        let shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
        if (shaderProgram === -1)
            return -1;
        gl.useProgram(shaderProgram);
        // Allocate memory in a graphics card
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, 4 * 4 * (positions.length + colors.length), gl.STATIC_DRAW);
        // Transfer positions and put it at the beginning of the buffer
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, to1DF32Array(positions));
        // Transfer colors and put it right after positions
        gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 4 * positions.length, to1DF32Array(colors));
        // Vertex Position - locate and enable "vPosition"
        let vPosition_location = gl.getAttribLocation(shaderProgram, "vPosition");
        if (vPosition_location === -1) {
            alert("Unable to locate vPosition");
            return -1;
        }
        gl.enableVertexAttribArray(vPosition_location);
        // vPosition starts at offset 0
        gl.vertexAttribPointer(vPosition_location, 4, gl.FLOAT, false, 0, 0);
        // Vertex Color - locate and enable vColor
        let vColor_location = gl.getAttribLocation(shaderProgram, "vColor");
        if (vColor_location === -1) {
            alert("Unable to locate vColor");
            return -1;
        }
        gl.enableVertexAttribArray(vColor_location);
        // vColor starts at the end of positions
        gl.vertexAttribPointer(vColor_location, 4, gl.FLOAT, false, 0, 4 * 4 * positions.length);
        // Current Transformation Matrix - locate and enable "ctm"
        ctm_location = gl.getUniformLocation(shaderProgram, "ctm");
        if (ctm_location === null) {
            alert("Unable to locate ctm");
            return -1;
        }
        return 0;
    }
    function display() {
        if (!gl) {
            console.log("WebGL not initialized");
            return;
        }
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Set the ctm of the middle triangle
        gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(ctm));
        // Draw the middle triangle
        gl.drawArrays(gl.TRIANGLES, currOffset, currSize);
    }
    function idle() {
        ctm = identity;
        // Draw
        display();
        //if (isAnimating === true)
        requestAnimationFrame(idle);
    }
    // This function will be called when a mouse button is down inside the canvas.
    function mouseDownCallback(event) {
        console.log("mouseDownCallback(): " +
            "event.button = " + event.button +
            ", x = " + (event.clientX - canvas.offsetLeft) +
            ", y = " + (event.clientY - canvas.offsetTop));
    }
    // This function will be called when a mouse button is up inside the canvas
    function mouseUpCallback(event) {
        console.log("mouseUpCallback(): " +
            "event.button = " + event.button +
            ", x = " + (event.clientX - canvas.offsetLeft) +
            ", y = " + (event.clientY - canvas.offsetTop));
    }
    // This function will be called when a mouse pointer moves over the canvas.
    function mouseMoveCallback(event) {
        console.log("mouseMoveCallback(): " +
            "event.button = " + event.button +
            ", x = " + (event.clientX - canvas.offsetLeft) +
            ", y = " + (event.clientY - canvas.offsetTop));
    }
    // This function will be called when a keyboard is pressed.
    function keyDownCallback(event) {
        console.log("keyDownCallback(): " +
            "event.key = " + event.key);
        switch (event.key) {
            case "c":
                currOffset = objOffsets.cube;
                currSize = objSizes.cube;
                console.log("displaying cube");
                break;
            case "o":
                currOffset = objOffsets.cone;
                currSize = objSizes.cone;
                console.log("displaying cone");
                break;
            case "l":
                currOffset = objOffsets.cylinder;
                currSize = objSizes.cylinder;
                console.log("displaying cylinder");
                break;
            case "s":
                currOffset = objOffsets.sphere;
                currSize = objSizes.sphere;
                console.log("displaying sphere");
                break;
            case "t":
                currOffset = objOffsets.torus;
                currSize = objSizes.torus;
                console.log("displaying torus");
                break;
        }
    }
    function main() {
        canvas = document.getElementById("gl-canvas");
        if (initGL(canvas) === -1)
            return -1;
        if (init() === -1)
            return -1;
        // Register callback functions
        // Comment out those that are not used.
        canvas.addEventListener("mousedown", mouseDownCallback);
        canvas.addEventListener("mouseup", mouseUpCallback);
        canvas.addEventListener("mousemove", mouseMoveCallback);
        document.addEventListener("keydown", keyDownCallback);
        display();
        //if (isAnimating)
        requestAnimationFrame(idle);
    }
    Project1.main = main;
})(Project1 || (Project1 = {}));
