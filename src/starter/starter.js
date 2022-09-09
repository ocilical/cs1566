// Always execute in strict mode (less bug)
'use strict';
// These variables must be global variables.
// Some callback functions may need to access them.
let gl = null;
let canvas = null;
let ctm_location;
let identity = [
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0]
];
let middle_triangle_ctm = [
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0]
];
let top_right_triangle_ctm = [
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0]
];
let isAnimating = true;
let triangle_position = 0.0;
let position_modifier = 0.01;
let triangle_degree = 0.0;
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
    let positions = [
        // First Triangle (the one in the middle)
        [0.0, 0.5, 0.0, 1.0],
        [-0.5, -0.5, 0.0, 1.0],
        [0.5, -0.5, 0.0, 1.0],
        // Second Triangle (top-right triangle - back of the middle one)
        [0.5, 1.0, -0.5, 1.0],
        [0.0, 0.0, -0.5, 1.0],
        [1.0, 0.0, -0.5, 1.0],
        // Square (in front of the middle one)
        [-0.1, -0.1, 0.5, 1.0],
        [-0.9, -0.1, 0.5, 1.0],
        [-0.1, -0.9, 0.5, 1.0],
        [-0.1, -0.9, 0.5, 1.0],
        [-0.9, -0.1, 0.5, 1.0],
        [-0.9, -0.9, 0.5, 1.0]
    ];
    let colors = [
        // First Triangle (rainbow)
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        // Second Triangle (cyan)
        [0.0, 1.0, 1.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        // Square (magenta)
        [1.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0]
    ];
    // Load and compile shader programs
    let shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    if (shaderProgram == -1)
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
    if (vPosition_location == -1) {
        alert("Unable to locate vPosition");
        return -1;
    }
    gl.enableVertexAttribArray(vPosition_location);
    // vPosition starts at offset 0
    gl.vertexAttribPointer(vPosition_location, 4, gl.FLOAT, false, 0, 0);
    // Vertex Color - locate and enable vColor
    let vColor_location = gl.getAttribLocation(shaderProgram, "vColor");
    if (vColor_location == -1) {
        alert("Unable to locate vColor");
        return -1;
    }
    gl.enableVertexAttribArray(vColor_location);
    // vColor starts at the end of positions
    gl.vertexAttribPointer(vColor_location, 4, gl.FLOAT, false, 0, 4 * 4 * positions.length);
    // Current Transformation Matrix - locate and enable "ctm"
    ctm_location = gl.getUniformLocation(shaderProgram, "ctm");
    if (ctm_location == -1) {
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
    gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(middle_triangle_ctm));
    // Draw the middle triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // Set the ctm of the top-right triangle
    gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(top_right_triangle_ctm));
    // Draw the top-right triangle
    gl.drawArrays(gl.TRIANGLES, 3, 3);
    // Set the ctm of the square
    gl.uniformMatrix4fv(ctm_location, false, to1DF32Array(identity));
    // Draw the square
    gl.drawArrays(gl.TRIANGLES, 6, 6);
}
function idle() {
    // Calculate ctm for the middle triangle
    triangle_position += position_modifier;
    if (triangle_position >= 0.5)
        position_modifier = -0.01;
    else if (triangle_position <= -0.5)
        position_modifier = 0.01;
    middle_triangle_ctm = [[1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [triangle_position, 0.0, 0.0, 1.0]];
    // Calculate ctm for the top-right triangle
    triangle_degree += 0.1;
    if (triangle_degree > 360.0)
        triangle_degree = 0.0;
    top_right_triangle_ctm = rotateZ(triangle_degree);
    // Draw
    display();
    if (isAnimating == true)
        requestAnimationFrame(idle);
}
// This function will be called when a mouse button is down inside the canvas.
function mouseDownCallback(event) {
    console.log("mouseDownCallback(): " +
        "event.which = " + event.which +
        ", x = " + (event.clientX - canvas.offsetLeft) +
        ", y = " + (event.clientY - canvas.offsetTop));
}
// This function will be called when a mouse button is up inside the canvas
function mouseUpCallback(event) {
    console.log("mouseUpCallback(): " +
        "event.which = " + event.which +
        ", x = " + (event.clientX - canvas.offsetLeft) +
        ", y = " + (event.clientY - canvas.offsetTop));
}
// This function will be called when a mouse pointer moves over the canvas.
function mouseMoveCallback(event) {
    console.log("mouseMoveCallback(): " +
        "event.which = " + event.which +
        ", x = " + (event.clientX - canvas.offsetLeft) +
        ", y = " + (event.clientY - canvas.offsetTop));
}
// This function will be called when a keyboard is pressed.
function keyDownCallback(event) {
    console.log("keyDownCallback(): " +
        "event.keyCode = " + event.keyCode);
    if (event.keyCode == 32) {
        isAnimating = !isAnimating;
        requestAnimationFrame(idle);
    }
}
function main() {
    canvas = document.getElementById("gl-canvas");
    if (initGL(canvas) == -1)
        return -1;
    if (init() == -1)
        return -1;
    // Register callback functions
    // Comment out those that are not used.
    canvas.onmousedown = mouseDownCallback;
    canvas.onmouseup = mouseUpCallback;
    canvas.onmousemove = mouseMoveCallback;
    document.onkeydown = keyDownCallback;
    display();
    if (isAnimating)
        requestAnimationFrame(idle);
}
