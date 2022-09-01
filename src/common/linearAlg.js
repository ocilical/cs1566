"use strict";
/**
 * check if a vector is big enough, not sure if i'll need this?
 */
function vec_check(v) {
    if (v.length < 4) {
        throw new Error("vector must be at least 4 elements");
    }
}
/**
 * check if a matrix is big enough, not sure if i'll need this?
 */
function mat_check(m) {
    if (m.length < 4 || m[0].length < 4 || m[1].length < 4 || m[2].length < 4 || m[3].length < 4) {
        throw new Error("matrix must be 4x4");
    }
}
/**
 * print a vector
 */
function vec_print(v) {
    console.log(`[${v[0].toFixed(4)}, ${v[1].toFixed(4)}, ${v[2].toFixed(4)}, ${v[3].toFixed(4)}]`);
}
/**
 * multiply a vector by a scalar, s * v
 */
function vec_scale(s, v) {
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
function vec_add(v1, v2) {
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
function vec_sub(v1, v2) {
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
function vec_length(v) {
    return Math.sqrt(v[0] * v[0] +
        v[1] * v[1] +
        v[2] * v[2] +
        v[3] * v[3]);
}
/**
 * caluclate a normalized vector
 */
function vec_norm(v) {
    return vec_scale(1.0 / vec_length(v), v);
}
/**
 * calculate the dot product of two vectors
 */
function vec_dot(v1, v2) {
    return ((v1[0] * v2[0]) +
        (v1[1] * v2[1]) +
        (v1[2] * v2[2]) +
        (v1[3] * v2[3]));
}
/**
 * calculate the cross product of two vectors
 */
function vec_cross(v1, v2) {
    return [
        (v1[1] * v2[2]) - (v1[2] * v2[1]),
        (v1[2] * v2[0]) - (v1[0] * v2[2]),
        (v1[0] * v2[1]) - (v1[1] * v2[0]),
        0.0
    ];
}
/**
 * print a matrix
 */
function mat_print(m) {
    console.log(`${m[0][0]} ${m[1][0]} ${m[2][0]} ${m[3][0]}\n` +
        `${m[0][1]} ${m[1][1]} ${m[2][1]} ${m[3][1]}\n` +
        `${m[0][2]} ${m[1][2]} ${m[2][2]} ${m[3][2]}\n` +
        `${m[0][3]} ${m[1][3]} ${m[2][3]} ${m[3][3]}\n`);
}
/**
 * multiply a matrix by a scalar, s * m
 */
function mat_scale(s, m) {
    return [
        vec_scale(s, m[0]),
        vec_scale(s, m[1]),
        vec_scale(s, m[2]),
        vec_scale(s, m[3]),
    ];
}
/**
 * add two matrices, m1 + m2
 */
function mat_add(m1, m2) {
    return [
        vec_add(m1[0], m2[0]),
        vec_add(m1[1], m2[1]),
        vec_add(m1[2], m2[2]),
        vec_add(m1[3], m2[3]),
    ];
}
/**
 * subtract two matrices, m1 - m2
 */
function mat_sub(m1, m2) {
    return [
        vec_sub(m1[0], m2[0]),
        vec_sub(m1[1], m2[1]),
        vec_sub(m1[2], m2[2]),
        vec_sub(m1[3], m2[3]),
    ];
}
/**
 * multiply a vector with a matrix, m * V
 */
function mat_vec_mul(m, v) {
    let v0 = vec_scale(v[0], m[0]);
    let v1 = vec_scale(v[1], m[1]);
    let v2 = vec_scale(v[2], m[2]);
    let v3 = vec_scale(v[3], m[3]);
    return vec_add(vec_add(v0, v1), vec_add(v2, v3));
}
/**
 * multiply two matrices, m1 * m2
 */
function mat_mul(m1, m2) {
    return [
        mat_vec_mul(m1, m2[0]),
        mat_vec_mul(m1, m2[1]),
        mat_vec_mul(m1, m2[2]),
        mat_vec_mul(m1, m2[3]),
    ];
}
/**
 * calculate transpose of a matrix
 */
function mat_trans(m) {
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
function mat_inv(m) {
    //todo: implement this
    return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
}
