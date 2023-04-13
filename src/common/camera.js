"use strict";
/**
 * namespace for functions related to viewing
 */
var Camera;
(function (Camera) {
    /**
     * make model view matrix camera at position looking at a point
     * @param eye point camera is positioned at
     * @param at point camera is looking at
     * @param up up vector for camera
     * @returns model view matrix
     */
    function lookAt(eye, at, up) {
        if (vecEquals(eye, at)) {
            throw new Error("can't lookAt same point as camera position!");
        }
        const vpn = vecSub(eye, at);
        const n = vecNorm(vpn);
        const u = vecNorm(vecCross(up, n));
        const v = vecNorm(vecCross(n, u));
        const rot = [
            [u[0], v[0], n[0], 0],
            [u[1], v[1], n[1], 0],
            [u[2], v[2], n[2], 0],
            [0, 0, 0, 1],
        ];
        const trans = translate(-eye[0], -eye[1], -eye[2]);
        return matMul(rot, trans);
    }
    Camera.lookAt = lookAt;
    /**
     * creates an orthographic projection matrix
     * @param left left < right
     * @param right right > left
     * @param bottom bottom < top
     * @param top top > bottom
     * @param near near < far
     * @param far far > near
     * @returns projection matrix
     */
    function ortho(left, right, bottom, top, near, far) {
        return [
            [2 / (right - left), 0, 0, 0],
            [0, 2 / (top - bottom), 0, 0],
            [0, 0, 2 / (near - far), 0],
            [-(right + left) / (right - left), -(top + bottom) / (top - bottom), -(near + far) / (near - far), 1],
        ];
    }
    Camera.ortho = ortho;
    /**
     * generate perspective projection matrix
     * @param left left < right
     * @param right right > left
     * @param bottom bottom < top
     * @param top top > bottom
     * @param near far < near < 0
     * @param far far < near < 0
     * @returns projection matrix
     */
    function frustum(left, right, bottom, top, near, far) {
        return [
            [-(2 * near) / (right - left), 0, 0, 0],
            [0, -(2 * near) / (top - bottom), 0, 0],
            [(left + right) / (right - left), (bottom + top) / (top - bottom), (near + far) / (far - near), -1],
            [0, 0, -(2 * near * far) / (far - near), 0],
        ];
    }
    Camera.frustum = frustum;
})(Camera || (Camera = {}));
