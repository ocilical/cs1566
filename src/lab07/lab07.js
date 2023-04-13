"use strict";
var Lab07;
(function (Lab07) {
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
    let topCubesCTM = identity;
    let leftCubeCTM = identity;
    let rightCubeCTM = identity;
    let isAnimating = true;
    let currAngle = 0;
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
        let positions = [];
        let colors = [];
        positions.push(...Mesh.cube().map(v => matVecMul(composeTrans(translate(-0.5, 0.5, 0), scale(0.5, 0.5, 0.5)), v)));
        colors.push(...Mesh.cubeAxisColors());
        positions.push(...Mesh.cube().map(v => matVecMul(composeTrans(translate(0.5, 0.5, 0), scale(0.5, 0.5, 0.5)), v)));
        colors.push(...Mesh.cubeAxisColors());
        positions.push(...Mesh.cube().map(v => matVecMul(composeTrans(translate(-0.5, -0.5, 0), scale(0.5, 0.5, 0.5)), v)));
        colors.push(...Mesh.cubeAxisColors());
        positions.push(...Mesh.cube().map(v => matVecMul(composeTrans(translate(0.5, -0.5, 0), scale(0.5, 0.5, 0.5)), v)));
        colors.push(...Mesh.cubeAxisColors());
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
        gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(topCubesCTM));
        // Draw the middle triangle
        gl.drawArrays(gl.TRIANGLES, 0, 36 * 2);
        // Set the ctm of the top-right triangle
        gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(leftCubeCTM));
        // Draw the top-right triangle
        gl.drawArrays(gl.TRIANGLES, 36 * 2, 36);
        // Set the ctm of the square
        gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(rightCubeCTM));
        // Draw the square
        gl.drawArrays(gl.TRIANGLES, 36 * 3, 36);
    }
    function idle() {
        topCubesCTM = rotateY(currAngle, [0, 0.5, 0, 1]);
        leftCubeCTM = rotateZ(currAngle, [-0.5, -0.5, 0, 1]);
        rightCubeCTM = rotateX(currAngle, [0.5, -0.5, 0, 1]);
        currAngle = (currAngle + 1) % 360;
        // Draw
        display();
        if (isAnimating === true)
            requestAnimationFrame(idle);
    }
    // This function will be called when a keyboard is pressed.
    function keyDownCallback(event) {
        if (event.key === " ") {
            isAnimating = !isAnimating;
            if (isAnimating)
                requestAnimationFrame(idle);
        }
    }
    function main() {
        canvas = document.getElementById("gl-canvas");
        if (initGL(canvas) === -1)
            return -1;
        if (init() === -1)
            return -1;
        document.addEventListener("keydown", keyDownCallback);
        display();
        if (isAnimating)
            requestAnimationFrame(idle);
    }
    Lab07.main = main;
})(Lab07 || (Lab07 = {}));
