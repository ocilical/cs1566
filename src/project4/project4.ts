namespace Project4 {
    // These variables must be global variables.
    // Some callback functions may need to access them.
    let gl: WebGLRenderingContext | null;
    let canvas: HTMLCanvasElement | null;

    let ctm_location: WebGLUniformLocation | null;
    let model_view_location: WebGLUniformLocation | null;
    let projection_location: WebGLUniformLocation | null;
    let light_pos_location: WebGLUniformLocation | null;
    let shininess_location: WebGLUniformLocation | null;
    let constant_location: WebGLUniformLocation | null;
    let linear_location: WebGLUniformLocation | null;
    let quadratic_location: WebGLUniformLocation | null;

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
        basetrans: mat4;
        ctm: mat4;
        parent: string | null;
    }
    let objects: { [key: string]: Object; } = {};

    export const sphereBands = 16;
    export const sphereSegments = 32;

    let lightbulbPos: vec4 = [0.0, 5.0, 0.0, 1.0];

    let isAnimating = true;
    let animTime = 0;

    const shininess = 100;
    const attenuation_constant = 0;
    const attenuation_linear = 0.5;
    const attenuation_quadratic = 0;

    let ctmCache: { [key: string]: mat4; };

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

        [positions, colors, normals, objects] = Project4.initScene();

        // Load and compile shader programs
        let shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
        if (shaderProgram === -1)
            return -1;
        gl.useProgram(shaderProgram);

        // Allocate memory in a graphics card
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, 4 * 4 * (positions.length + colors.length + normals.length), gl.STATIC_DRAW);
        // Transfer positions and put it at the beginning of the buffer
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, to1DF32Array(positions));
        // Transfer colors and put it right after positions
        gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 4 * positions.length, to1DF32Array(colors));
        // Transfer normals and put it right after colors
        gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 4 * (positions.length + colors.length), to1DF32Array(normals));

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

        // Vertex Normal - locate and enable vNormal
        let vNormal_location = gl.getAttribLocation(shaderProgram, "vNormal");
        if (vNormal_location === -1) {
            alert("Unable to locate vNormal");
            return -1;
        }
        gl.enableVertexAttribArray(vNormal_location);
        // vColor starts at the end of positions
        gl.vertexAttribPointer(vNormal_location, 4, gl.FLOAT, false, 0, 4 * 4 * (positions.length + colors.length));


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

        light_pos_location = gl.getUniformLocation(shaderProgram, "light_position");
        if (light_pos_location === null) {
            alert("Unable to locate light_position");
        }

        shininess_location = gl.getUniformLocation(shaderProgram, "shininess");
        if (shininess_location === null) {
            alert("Unable to locate shininess");
            return -1;
        }
        gl.uniform1f(shininess_location, shininess);

        constant_location = gl.getUniformLocation(shaderProgram, "attenuation_constant");
        if (constant_location === null) {
            alert("Unable to locate attenuation_constant");
            return -1;
        }
        gl.uniform1f(constant_location, attenuation_constant);

        linear_location = gl.getUniformLocation(shaderProgram, "attenuation_linear");
        if (linear_location === null) {
            alert("Unable to locate attenuation_linear");
            return -1;
        }
        gl.uniform1f(linear_location, attenuation_linear);

        quadratic_location = gl.getUniformLocation(shaderProgram, "attenuation_quadratic");
        if (quadratic_location === null) {
            alert("Unable to locate attenuation_quadratic");
            return -1;
        }
        gl.uniform1f(quadratic_location, attenuation_quadratic);

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

        gl.uniform4fv(light_pos_location, new Float32Array(lightbulbPos));

        ctmCache = {};

        for (const key in objects) {
            const obj = objects[key];
            const ctm = applyCtm(key);
            gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(matMul(ctm, obj.basetrans)));
            gl.drawArrays(gl.TRIANGLES, obj.offset, obj.verts);
        }

    }

    function applyCtm(obj: string): mat4 {
        if (objects[obj].parent === null) {
            return objects[obj].ctm;
        } else if (obj in ctmCache) {
            return ctmCache[obj];
        } else if (obj in objects) {
            return matMul(applyCtm(objects[obj].parent!), objects[obj].ctm);
        } else {
            throw new Error(`object ${obj} does not exist`);
        }
    }

    function idle() {

        objects.lightbulb.ctm = translate(lightbulbPos[0], lightbulbPos[1], lightbulbPos[2]);

        let viewPos: vec4 = [
            viewRadius * Math.sin(degToRad(viewInclination)) * Math.cos(degToRad(viewAzimuth)),
            viewRadius * Math.cos(degToRad(viewInclination)),
            viewRadius * Math.sin(degToRad(viewInclination)) * Math.sin(degToRad(viewAzimuth)),
            1.0,
        ];
        model_view = Camera.lookAt(viewPos, [0.0, 0.0, 0.0, 1.0], [0.0, 1.0, 0.0, 0.0]);

        objects.joint2.ctm = rotateZ(animTime, [0, 6, 0, 1]);
        objects.joint3.ctm = rotateZ(-animTime / 2, [0, 10, 0, 1]);
        objects.base.ctm = rotateY(animTime);

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
