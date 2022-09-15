namespace TestLinearAlgebra {
    let v1: vec4 = [1, 2, 3, 4];
    let v2: vec4 = [5, 6, 7, 8];

    let m1: mat4 = [
        [1, -5, 9, 13],
        [2, 6, -10, 14],
        [3, 7, 11, 15],
        [4, 8, 12, -16],
    ];

    let m2: mat4 = [
        [4, 8, 12, 16],
        [3, 7, 11, 15],
        [2, 6, 10, 14],
        [1, 5, 9, 13],
    ];

    let s = 3.0;
    console.log("Vector v1:");
    vecPrint(v1);
    console.log("Vector v2:");
    vecPrint(v2);
    console.log(`Scalar s: ${s}`);

    // vector tests
    console.log("s * v1:");
    vecPrint(vecScale(s, v1));
    console.log("v1 + v2:");
    vecPrint(vecAdd(v1, v2));
    console.log("v1 - v2:");
    vecPrint(vecSub(v1, v2));
    console.log(`|v1| (magnitude): ${vecLength(v1)}`);
    console.log("Normalized v1:");
    vecPrint(vecNorm(v1));
    console.log("v1 . v2 (dot product):");
    console.log(vecDot(v1, v2));
    console.log("v1 x v2 (cross product):");
    vecPrint(vecCross(v1, v2));

    console.log();

    // matrix tests
    console.log("Matrix m1:");
    matPrint(m1);
    console.log("Matrix m2:");
    matPrint(m2);
    console.log("s * m1:");
    matPrint(matScale(s, m1));
    console.log("m1 + m2:");
    matPrint(matAdd(m1, m2));
    console.log("m1 - m2:");
    matPrint(matSub(m1, m2));
    console.log("m1 * m2:");
    matPrint(matMul(m1, m2));
    console.log("m1^T (transpose):");
    matPrint(matTrans(m1));
    console.log("m1^{-1} (inverse):");
    matPrint(matInv(m1));
    console.log("m1 * m1^{-1}:");
    matPrint(matMul(m1, matInv(m1)));
    console.log("m1^{-1} * m1:");
    matPrint(matMul(matInv(m1), m1));
}
