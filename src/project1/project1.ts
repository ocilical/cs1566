namespace Project1 {
    // These variables must be global variables.
    // Some callback functions may need to access them.
    let gl: WebGLRenderingContext | null;
    let canvas: HTMLCanvasElement | null;
    let ctm_location: WebGLUniformLocation | null;
    let identity: mat4 = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];
    let ctm: mat4 = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ];
    let positions: vec4[];

    // stuff for switching object
    interface numDict { [key: string]: number; }
    let objOffsets: numDict = {};
    let objSizes: numDict = {};
    let currOffset: number;
    let currSize: number;

    // keep track of zoom
    let currZoom: number = 1;
    const minZoom: number = 0.1;
    const maxZoom: number = 5;

    // camera variables :)
    let mouseDown: boolean = false;
    let prevMousePos: [number, number];
    let currMousePos: [number, number];
    let currRotMat: mat4 = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
    let currRotAxis: vec4 = [0.0, 1.0, 0.0, 0.0];
    let currRotSpeed: number = 0.0;


    function initGL(canvas: HTMLCanvasElement) {
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
        if (!gl) return -1;
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

        let sphere = Mesh.sphere(32, 16).map(v => matVecMul(scale(2, 2, 2), v));
        objOffsets.sphere = positions.length;
        objSizes.sphere = sphere.length;
        positions.push(...sphere);

        let torus = Mesh.torus(64, 16);
        objOffsets.torus = positions.length;
        objSizes.torus = torus.length;
        positions.push(...torus);

        currOffset = objOffsets.cube;
        currSize = objSizes.cube;

        let colors: vec4[] = Mesh.randomColors(positions.length);

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
        if (mouseDown && prevMousePos && currMousePos) {
            const prevPos = mouseCoordsToGL(prevMousePos);
            const currPos = mouseCoordsToGL(currMousePos);
            if (currPos && prevPos) {
                if (vecEquals(currPos, prevPos)) {
                    currRotAxis = [0.0, 1.0, 0.0, 0.0];
                    currRotSpeed = 0.0;
                } else {
                    currRotAxis = vecCross(prevPos, currPos);
                    //vecPrint(currRotAxis);
                    currRotSpeed = Math.acos(vecDot(prevPos, currPos) / (vecLength(prevPos) * vecLength(currPos))) * 180 / Math.PI;
                }
            }
        }

        let rotMat = rotateAxis(currRotSpeed, currRotAxis);
        currRotMat = matMul(rotMat, currRotMat);

        if (currRotMat.some(arr => arr.some(isNaN))) {
            console.log("if you're seeing this, something horrible has happened and a NaN got into the rotation matrix, sorry :(");
            debugger;
        }

        let scaleMat = scale(currZoom, currZoom, currZoom);

        let temp = matMul(currRotMat, scaleMat);
        //matPrint(temp);
        ctm = temp;

        prevMousePos = currMousePos;

        // Draw
        display();

        //if (isAnimating === true)
        requestAnimationFrame(idle);
    }

    // This function will be called when a mouse button is down inside the canvas.
    function mouseDownCallback(event: MouseEvent) {
        event.preventDefault();
        console.log("mouseDownCallback(): " +
            "event.button = " + event.button +
            ", x = " + (event.clientX - canvas!.offsetLeft) +
            ", y = " + (event.clientY - canvas!.offsetTop));
        mouseDown = true;
        currMousePos = [event.clientX - canvas!.offsetLeft, event.clientY - canvas!.offsetTop];
        prevMousePos = currMousePos;
    }

    // This function will be called when a mouse button is up inside the canvas
    function mouseUpCallback(event: MouseEvent) {
        event.preventDefault();
        console.log("mouseUpCallback(): " +
            "event.button = " + event.button +
            ", x = " + (event.clientX - canvas!.offsetLeft) +
            ", y = " + (event.clientY - canvas!.offsetTop));
        mouseDown = false;
    }

    // This function will be called when a mouse pointer moves over the canvas.
    function mouseMoveCallback(event: MouseEvent) {
        if (mouseDown) {
            // prevMousePos gets updated when idle runs so it doesn't look choppy if this event fires twice before drawing
            currMousePos = [event.clientX - canvas!.offsetLeft, event.clientY - canvas!.offsetTop];
        }
    }

    function wheelCallback(event: WheelEvent) {
        console.log(`wheelCallback(): event.deltaY = ${event.deltaY}`);
        // stop it from actually scrolling
        event.preventDefault();
        // do the scaling part
        currZoom += -event.deltaY * 0.001;
        // don't want to zoom too far in or out
        currZoom = Math.min(maxZoom, Math.max(currZoom, minZoom));
        console.log(`currZoom = ${currZoom}`);
    }

    // This function will be called when a keyboard is pressed.
    function keyDownCallback(event: KeyboardEvent) {
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
            case "=":
                // zoom in
                currZoom += 0.05;
                currZoom = Math.min(maxZoom, Math.max(currZoom, minZoom));
                break;
            case "-":
                // zoom out
                currZoom -= 0.05;
                currZoom = Math.min(maxZoom, Math.max(currZoom, minZoom));
                break;
        }
    }

    /**
     * convert mouse coordinates to WebGL coordinates on a sphere, returns null if not on sphere
     */
    function mouseCoordsToGL(mousePos: [number, number]): vec4 | null {
        let x = (mousePos[0] / 512) * 2 - 1;
        let y = (1 - (mousePos[1] / 512)) * 2 - 1;
        let z = Math.sqrt(1 - x * x - y * y);
        if (isNaN(z)) {
            return null;
        }
        return [x, y, z, 0.0];
    }

    export function main() {
        canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
        if (initGL(canvas) === -1)
            return -1;
        if (init() === -1)
            return -1;

        // Register callback functions
        // Comment out those that are not used.
        canvas.addEventListener("mousedown", mouseDownCallback);
        canvas.addEventListener("mouseout", mouseUpCallback);
        canvas.addEventListener("mouseup", mouseUpCallback);
        canvas.addEventListener("mousemove", mouseMoveCallback);
        canvas.addEventListener("wheel", wheelCallback);
        document.addEventListener("keydown", keyDownCallback);


        display();

        //if (isAnimating)
        requestAnimationFrame(idle);
    }
}
