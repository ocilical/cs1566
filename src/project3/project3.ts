namespace Project3 {
    // These variables must be global variables.
    // Some callback functions may need to access them.
    let gl: WebGLRenderingContext | null;
    let canvas: HTMLCanvasElement | null;

    let ctm_location: WebGLUniformLocation | null;
    let model_view_location: WebGLUniformLocation | null;
    let projection_location: WebGLUniformLocation | null;

    export const identity: mat4 = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];

    const viewscale = 0.05;
    const projection: mat4 = Camera.frustum(-viewscale, viewscale, -viewscale, viewscale, -0.1, -100);
    let model_view: mat4 = Camera.lookAt([6, 6, 6, 1], [0, 0, 0, 1], [0, 1, 0, 0]);

    let viewRadius: number = 10;
    let viewInclination: number = 44;
    let viewAzimuth: number = 44;

    export interface Object {
        offset: number;
        verts: number;
        ctm: mat4;
    }
    let objects: { [key: string]: Object; } = {};

    export const sphereBands = 16;
    export const sphereSegments = 32;

    let lightbulbPos: vec4 = [0.0, 5.0, 0.0, 1.0];

    let isAnimating = true;
    let animTime = 0;

    const rotPerMin = 30;
    const framesPerMin = 60 * 60;
    const rotateTime = framesPerMin / rotPerMin;

    let sphereRot = {
        innerSphere: identity,
        midInnerSphere: identity,
        midOuterSphere: identity,
        outerSphere: identity,
    };

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

        let positions: vec4[];
        let colors: vec4[];
        let normals: vec4[];

        [positions, colors, normals, objects] = Project3.initScene();

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

        model_view_location = gl.getUniformLocation(shaderProgram, "model_view");
        if (model_view_location === null) {
            alert("Unable to locate model_view");
            return -1;
        }
        projection_location = gl.getUniformLocation(shaderProgram, "projection");
        if (projection_location === null) {
            alert("Unable to locate projection");
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

        gl.uniformMatrix4fv(model_view_location, false, to1DF32Array(model_view));
        gl.uniformMatrix4fv(projection_location, false, to1DF32Array(projection));

        for (const key in objects) {
            const obj = objects[key];
            gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(obj.ctm));
            gl.drawArrays(gl.TRIANGLES, obj.offset, obj.verts);
        }

    }

    function idle() {
        let angle = -2 * Math.PI * ((animTime % (rotateTime * 8)) / (rotateTime * 8));

        // waitfac is just hand tweaked until it looks good
        let pos: vec4 = [Math.cos(angle * 8), 0.5, Math.sin(angle * 8), 0];
        let rot = isAnimating ? rotateAxis(-1 / rotateTime * 360, pos) : identity;
        sphereRot.innerSphere = matMul(rot, sphereRot.innerSphere);
        objects.innerSphere.ctm = matMul(translate(pos[0], pos[1], pos[2]), sphereRot.innerSphere);

        let waitFac = 0.41;
        objects.innerFrontCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 8) - waitFac), 0);
        objects.innerRightCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 8 + Math.PI / 2) - waitFac), 0);
        objects.innerBackCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 8 + Math.PI) - waitFac), 0);
        objects.innerLeftCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 8 + 3 * Math.PI / 2) - waitFac), 0);


        pos = [2 * Math.cos(angle * 4), 0.5, 2 * Math.sin(angle * 4), 0];
        rot = isAnimating ? rotateAxis(-1 / rotateTime * 360, pos) : identity;
        sphereRot.midInnerSphere = matMul(rot, sphereRot.midInnerSphere);
        objects.midInnerSphere.ctm = matMul(translate(pos[0], pos[1], pos[2]), sphereRot.midInnerSphere);

        waitFac = 0.44;
        objects.midInnerFrontCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 4) - waitFac), 0);
        objects.midInnerRightCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 4 + Math.PI / 2) - waitFac), 0);
        objects.midInnerBackCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 4 + Math.PI) - waitFac), 0);
        objects.midInnerLeftCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 4 + 3 * Math.PI / 2) - waitFac), 0);


        pos = [3 * Math.cos(angle * 2), 0.5, 3 * Math.sin(angle * 2), 0];
        rot = isAnimating ? rotateAxis(-1 / rotateTime * 360, pos) : identity;
        sphereRot.midOuterSphere = matMul(rot, sphereRot.midOuterSphere);
        objects.midOuterSphere.ctm = matMul(translate(pos[0], pos[1], pos[2]), sphereRot.midOuterSphere);

        waitFac = 0.46;
        objects.midOuterFrontCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 2) - waitFac), 0);
        objects.midOuterRightCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 2 + Math.PI / 2) - waitFac), 0);
        objects.midOuterBackCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 2 + Math.PI) - waitFac), 0);
        objects.midOuterLeftCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle * 2 + 3 * Math.PI / 2) - waitFac), 0);


        pos = [4 * Math.cos(angle), 0.5, 4 * Math.sin(angle), 0];
        rot = isAnimating ? rotateAxis(-1 / rotateTime * 360, pos) : identity;
        sphereRot.outerSphere = matMul(rot, sphereRot.outerSphere);
        objects.outerSphere.ctm = matMul(translate(pos[0], pos[1], pos[2]), sphereRot.outerSphere);

        waitFac = 0.48;
        objects.outerFrontCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle) - waitFac), 0);
        objects.outerRightCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle + Math.PI / 2) - waitFac), 0);
        objects.outerBackCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle + Math.PI) - waitFac), 0);
        objects.outerLeftCube.ctm = translate(0, Math.min(0, (1 - waitFac) * Math.sin(angle + 3 * Math.PI / 2) - waitFac), 0);

        objects.lightbulb.ctm = translate(lightbulbPos[0], lightbulbPos[1], lightbulbPos[2]);

        let viewPos: vec4 = [
            viewRadius * Math.sin(degToRad(viewInclination)) * Math.cos(degToRad(viewAzimuth)),
            viewRadius * Math.cos(degToRad(viewInclination)),
            viewRadius * Math.sin(degToRad(viewInclination)) * Math.sin(degToRad(viewAzimuth)),
            1.0,
        ];
        model_view = Camera.lookAt(viewPos, [0.0, 0.0, 0.0, 1.0], [0.0, 1.0, 0.0, 0.0]);

        // Draw
        display();

        if (isAnimating)
            animTime++;

        requestAnimationFrame(idle);
    }


    // This function will be called when a keyboard is pressed.
    function keyDownCallback(event: KeyboardEvent) {
        switch (event.key) {
            case " ":
                isAnimating = !isAnimating;
                break;
            case "w":
            case "W":
                viewInclination = Math.max(1, viewInclination - 2);
                break;
            case "s":
            case "S":
                viewInclination = Math.min(179, viewInclination + 2);
                break;
            case "a":
            case "A":
                viewAzimuth += 2;
                break;
            case "d":
            case "D":
                viewAzimuth -= 2;
                break;
            case "e":
            case "E":
                viewRadius = Math.max(1, viewRadius - 0.5);
                break;
            case "q":
            case "Q":
                viewRadius = Math.min(100, viewRadius + 0.5);
                break;
            case "i":
            case "I":
                lightbulbPos = vecAdd(lightbulbPos, [0, 0, -0.1, 0]);
                break;
            case "k":
            case "K":
                lightbulbPos = vecAdd(lightbulbPos, [0, 0, 0.1, 0]);
                break;
            case "j":
            case "J":
                lightbulbPos = vecAdd(lightbulbPos, [-0.1, 0, 0, 0]);
                break;
            case "l":
            case "L":
                lightbulbPos = vecAdd(lightbulbPos, [0.1, 0, 0, 0]);
                break;
            case "o":
            case "O":
                lightbulbPos = vecAdd(lightbulbPos, [0, 0.1, 0, 0]);
                break;
            case "u":
            case "U ":
                lightbulbPos = vecAdd(lightbulbPos, [0, -0.1, 0, 0]);
                break;

        }
    }

    export function main() {
        canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
        if (initGL(canvas) === -1)
            return -1;
        if (init() === -1)
            return -1;

        document.addEventListener("keydown", keyDownCallback);

        //display();

        requestAnimationFrame(idle);
    }
}
