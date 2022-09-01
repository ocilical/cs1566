"use strict";
let v1 = [1, 2, 3, 4];
let v2 = [5, 6, 7, 8];
let m1 = [
    [1, -5, 9, 13],
    [2, 6, -10, 14],
    [3, 7, 11, 15],
    [4, 8, 12, -16],
];
let m2 = [
    [4, 8, 12, 16],
    [3, 7, 11, 15],
    [2, 6, 10, 14],
    [1, 5, 9, 13],
];
let s = 3.0;
console.log("Vector v1:");
vec_print(v1);
console.log("Vector v2:");
vec_print(v2);
console.log(`Scalar s: ${s}`);
// vector tests
console.log("s * v1:");
vec_print(vec_scale(s, v1));
console.log("v1 + v2:");
vec_print(vec_add(v1, v2));
console.log("v1 - v2:");
vec_print(vec_sub(v1, v2));
console.log(`|v1| (magnitude): ${vec_length(v1)}`);
console.log("Normalized v1:");
vec_print(vec_norm(v1));
console.log("v1 . v2 (dot product):");
console.log(vec_dot(v1, v2));
console.log("v1 x v2 (cross product):");
vec_print(vec_cross(v1, v2));
console.log();
// matrix tests
console.log("Matrix m1:");
mat_print(m1);
console.log("Matrix m2:");
mat_print(m2);
console.log("s * m1:");
mat_print(mat_scale(s, m1));
console.log("m1 + m2:");
mat_print(mat_add(m1, m2));
console.log("m1 - m2:");
mat_print(mat_sub(m1, m2));
console.log("m1 * m2:");
mat_print(mat_mul(m1, m2));
console.log("m1^T (transpose):");
mat_print(mat_trans(m1));
console.log("m1^{-1} (inverse):");
mat_print(mat_inv(m1));
console.log("m1 * m1^{-1}:");
mat_print(mat_mul(m1, mat_inv(m1)));
console.log("m1^{-1} * m1:");
mat_print(mat_mul(mat_inv(m1), m1));
