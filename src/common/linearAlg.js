"use strict";
/**
 * convert array of vec4s to Float32Array (works on mat4)
 */
function to1DF32Array(v) {
    return new Float32Array(v.flat());
}
/**
 * print a vector
 */
function vecPrint(v) {
    console.log(`[${v[0].toFixed(4)}, ${v[1].toFixed(4)}, ${v[2].toFixed(4)}, ${v[3].toFixed(4)}]`);
}
/**
 * check vectors for equality
 */
function vecEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * multiply a vector by a scalar, s * v
 */
function vecScale(s, v) {
    return [
        s * v[0],
        s * v[1],
        s * v[2],
        s * v[3],
    ];
}
/**
 * add two vectors, v1 + v2
 */
function vecAdd(v1, v2) {
    return [
        v1[0] + v2[0],
        v1[1] + v2[1],
        v1[2] + v2[2],
        v1[3] + v2[3],
    ];
}
/**
 * subtract two vectors, v1 - v2
 */
function vecSub(v1, v2) {
    return [
        v1[0] - v2[0],
        v1[1] - v2[1],
        v1[2] - v2[2],
        v1[3] - v2[3],
    ];
}
/**
 * calculate magnitude of a vector
 */
function vecLength(v) {
    return Math.sqrt(vecDot(v, v));
}
/**
 * caluclate a normalized vector
 */
function vecNorm(v) {
    return vecScale(1.0 / vecLength(v), v);
}
/**
 * calculate the dot product of two vectors
 */
function vecDot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] + v1[3] * v2[3];
}
/**
 * calculate the cross product of two vectors
 */
function vecCross(v1, v2) {
    return [
        (v1[1] * v2[2]) - (v1[2] * v2[1]),
        (v1[2] * v2[0]) - (v1[0] * v2[2]),
        (v1[0] * v2[1]) - (v1[1] * v2[0]),
        0.0,
    ];
}
/**
 * print a matrix
 */
function matPrint(m) {
    console.log(`${m[0][0].toFixed(4)} ${m[1][0].toFixed(4)} ${m[2][0].toFixed(4)} ${m[3][0].toFixed(4)}\n` +
        `${m[0][1].toFixed(4)} ${m[1][1].toFixed(4)} ${m[2][1].toFixed(4)} ${m[3][1].toFixed(4)}\n` +
        `${m[0][2].toFixed(4)} ${m[1][2].toFixed(4)} ${m[2][2].toFixed(4)} ${m[3][2].toFixed(4)}\n` +
        `${m[0][3].toFixed(4)} ${m[1][3].toFixed(4)} ${m[2][3].toFixed(4)} ${m[3][3].toFixed(4)}\n`);
}
/**
 * multiply a matrix by a scalar, s * m
 */
function matScale(s, m) {
    return [
        vecScale(s, m[0]),
        vecScale(s, m[1]),
        vecScale(s, m[2]),
        vecScale(s, m[3]),
    ];
}
/**
 * add two matrices, m1 + m2
 */
function matAdd(m1, m2) {
    return [
        vecAdd(m1[0], m2[0]),
        vecAdd(m1[1], m2[1]),
        vecAdd(m1[2], m2[2]),
        vecAdd(m1[3], m2[3]),
    ];
}
/**
 * subtract two matrices, m1 - m2
 */
function matSub(m1, m2) {
    return [
        vecSub(m1[0], m2[0]),
        vecSub(m1[1], m2[1]),
        vecSub(m1[2], m2[2]),
        vecSub(m1[3], m2[3]),
    ];
}
/**
 * multiply a vector with a matrix, m * V
 */
function matVecMul(m, v) {
    let v0 = vecScale(v[0], m[0]);
    let v1 = vecScale(v[1], m[1]);
    let v2 = vecScale(v[2], m[2]);
    let v3 = vecScale(v[3], m[3]);
    return vecAdd(vecAdd(v0, v1), vecAdd(v2, v3));
}
/**
 * multiply two matrices, m1 * m2
 */
function matMul(m1, m2) {
    return [
        matVecMul(m1, m2[0]),
        matVecMul(m1, m2[1]),
        matVecMul(m1, m2[2]),
        matVecMul(m1, m2[3]),
    ];
}
/**
 * calculate transpose of a matrix
 */
function matTransp(m) {
    return [
        [m[0][0], m[1][0], m[2][0], m[3][0]],
        [m[0][1], m[1][1], m[2][1], m[3][1]],
        [m[0][2], m[1][2], m[2][2], m[3][2]],
        [m[0][3], m[1][3], m[2][3], m[3][3]],
    ];
}
/**
 * calculate inverse of a matrix
 */
function matInv(m) {
    let minor = matMinor(m);
    let cofactor = matCofactor(minor);
    let transpose = matTransp(cofactor);
    let determinant = matDet(m, minor);
    if (determinant === 0) {
        throw new Error("matrix is not invertable");
    }
    return matScale(1 / determinant, transpose);
}
/**
 * calculate minor matrix
 */
function matMinor(m) {
    return [
        [
            mat3Det([[m[1][1], m[1][2], m[1][3]], [m[2][1], m[2][2], m[2][3]], [m[3][1], m[3][2], m[3][3]]]),
            mat3Det([[m[1][0], m[1][2], m[1][3]], [m[2][0], m[2][2], m[2][3]], [m[3][0], m[3][2], m[3][3]]]),
            mat3Det([[m[1][0], m[1][1], m[1][3]], [m[2][0], m[2][1], m[2][3]], [m[3][0], m[3][1], m[3][3]]]),
            mat3Det([[m[1][0], m[1][1], m[1][2]], [m[2][0], m[2][1], m[2][2]], [m[3][0], m[3][1], m[3][2]]]),
        ],
        [
            mat3Det([[m[0][1], m[0][2], m[0][3]], [m[2][1], m[2][2], m[2][3]], [m[3][1], m[3][2], m[3][3]]]),
            mat3Det([[m[0][0], m[0][2], m[0][3]], [m[2][0], m[2][2], m[2][3]], [m[3][0], m[3][2], m[3][3]]]),
            mat3Det([[m[0][0], m[0][1], m[0][3]], [m[2][0], m[2][1], m[2][3]], [m[3][0], m[3][1], m[3][3]]]),
            mat3Det([[m[0][0], m[0][1], m[0][2]], [m[2][0], m[2][1], m[2][2]], [m[3][0], m[3][1], m[3][2]]]),
        ],
        [
            mat3Det([[m[0][1], m[0][2], m[0][3]], [m[1][1], m[1][2], m[1][3]], [m[3][1], m[3][2], m[3][3]]]),
            mat3Det([[m[0][0], m[0][2], m[0][3]], [m[1][0], m[1][2], m[1][3]], [m[3][0], m[3][2], m[3][3]]]),
            mat3Det([[m[0][0], m[0][1], m[0][3]], [m[1][0], m[1][1], m[1][3]], [m[3][0], m[3][1], m[3][3]]]),
            mat3Det([[m[0][0], m[0][1], m[0][2]], [m[1][0], m[1][1], m[1][2]], [m[3][0], m[3][1], m[3][2]]]),
        ],
        [
            mat3Det([[m[0][1], m[0][2], m[0][3]], [m[1][1], m[1][2], m[1][3]], [m[2][1], m[2][2], m[2][3]]]),
            mat3Det([[m[0][0], m[0][2], m[0][3]], [m[1][0], m[1][2], m[1][3]], [m[2][0], m[2][2], m[2][3]]]),
            mat3Det([[m[0][0], m[0][1], m[0][3]], [m[1][0], m[1][1], m[1][3]], [m[2][0], m[2][1], m[2][3]]]),
            mat3Det([[m[0][0], m[0][1], m[0][2]], [m[1][0], m[1][1], m[1][2]], [m[2][0], m[2][1], m[2][2]]]),
        ],
    ];
}
/**
 * calculate cofactor of a matrix
 */
function matCofactor(m) {
    return [
        [m[0][0], -m[0][1], m[0][2], -m[0][3]],
        [-m[1][0], m[1][1], -m[1][2], m[1][3]],
        [m[2][0], -m[2][1], m[2][2], -m[2][3]],
        [-m[3][0], m[3][1], -m[3][2], m[3][3]],
    ];
}
/**
 * calculate determinant of a matrix,
 * m is the matrix to find the det of,
 * minor is the minor matrix of m,
 * if minor is not provided it will be calculated
 */
function matDet(m, minor) {
    minor = minor !== null && minor !== void 0 ? minor : matMinor(m);
    return m[0][0] * minor[0][0] - m[0][1] * minor[0][1] + m[0][2] * minor[0][2] - m[0][3] * minor[0][3];
}
/**
 * calculate determinant of a 3x3 matrix
 */
function mat3Det(m) {
    return (m[0][0] * m[1][1] * m[2][2] +
        m[1][0] * m[2][1] * m[0][2] +
        m[2][0] * m[0][1] * m[1][2] -
        m[0][2] * m[1][1] * m[2][0] -
        m[1][2] * m[2][1] * m[0][0] -
        m[2][2] * m[0][1] * m[1][0]);
}
/**
 * linearly interpolate between a and b, point in interpolation controlled by t
 */
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}
/**
 * linearly interpolate between two vec4s, a and b, point in interpolation controlled by t
 */
function vecLerp(a, b, t) {
    return [
        lerp(a[0], b[0], t),
        lerp(a[1], b[1], t),
        lerp(a[2], b[2], t),
        lerp(a[3], b[3], t),
    ];
}
/**
 * returns a transformation that translates by x, y, and z along respective axes
 */
function translate(x, y, z) {
    return [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [x, y, z, 1.0],
    ];
}
/**
 * returns a transformation matrix that scales by x, y, and z along respective axes
 */
function scale(x, y, z) {
    return [
        [x, 0.0, 0.0, 0.0],
        [0.0, y, 0.0, 0.0],
        [0.0, 0.0, z, 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ];
}
/**
 * returns rotation matrix about the x-axis for a given degree
 */
function rotateX(degree) {
    // A result is a 4 x 4 matrix (column major)
    let result = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0], // fourth column
    ];
    let radian = degree * Math.PI / 180.0;
    result[1][1] = Math.cos(radian);
    result[1][2] = Math.sin(radian);
    result[2][1] = -Math.sin(radian);
    result[2][2] = Math.cos(radian);
    return result;
}
/**
 * returns rotation matrix about the y-axis for a given degree
 */
function rotateY(degree) {
    // A result is a 4 x 4 matrix (column major)
    let result = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0], // fourth column
    ];
    let radian = degree * Math.PI / 180.0;
    result[0][0] = Math.cos(radian);
    result[2][0] = Math.sin(radian);
    result[0][2] = -Math.sin(radian);
    result[2][2] = Math.cos(radian);
    return result;
}
/**
 * returns rotation matrix about the z-axis for a given degree
 */
function rotateZ(degree) {
    // A result is a 4 x 4 matrix (column major)
    let result = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0], // fourth column
    ];
    let radian = degree * Math.PI / 180.0;
    result[0][0] = Math.cos(radian);
    result[0][1] = Math.sin(radian);
    result[1][0] = -Math.sin(radian);
    result[1][1] = Math.cos(radian);
    return result;
}
