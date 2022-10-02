"use strict";
var Mesh;
(function (Mesh) {
    /**
     * generate colors for triangles
     * @param triangles number of triangles
     * @returns array of vertex colors
     */
    function randomColors(triangles) {
        return [...Array(triangles)].flatMap(() => {
            let color = [Math.random(), Math.random(), Math.random(), 1.0];
            return [color, color, color];
        });
    }
    Mesh.randomColors = randomColors;
    /**
     * generate quad, follows counterclockwise winding order
     * @returns array of vertices
     */
    function quad(p1, p2, p3, p4) {
        return [
            p1, p2, p3,
            p3, p4, p1,
        ];
    }
    Mesh.quad = quad;
    /**
     * generate 1x1x1 cube, resize it if you want a different cube!
     * @returns array of vertices
     */
    function cube() {
        return [
            // top face
            ...quad([0.5, 0.5, 0.5, 1.0], [0.5, 0.5, -0.5, 1.0], [-0.5, 0.5, -0.5, 1.0], [-0.5, 0.5, 0.5, 1.0]),
            // bottom face
            ...quad([-0.5, -0.5, -0.5, 1.0], [0.5, -0.5, -0.5, 1.0], [0.5, -0.5, 0.5, 1.0], [-0.5, -0.5, 0.5, 1.0]),
            // left face
            ...quad([-0.5, -0.5, -0.5, 1.0], [-0.5, -0.5, 0.5, 1.0], [-0.5, 0.5, 0.5, 1.0], [-0.5, 0.5, -0.5, 1.0]),
            // right face
            ...quad([0.5, 0.5, 0.5, 1.0], [0.5, -0.5, 0.5, 1.0], [0.5, -0.5, -0.5, 1.0], [0.5, 0.5, -0.5, 1.0]),
            // front face
            ...quad([0.5, 0.5, 0.5, 1.0], [-0.5, 0.5, 0.5, 1.0], [-0.5, -0.5, 0.5, 1.0], [0.5, -0.5, 0.5, 1.0]),
            // back face
            ...quad([-0.5, -0.5, -0.5, 1.0], [-0.5, 0.5, -0.5, 1.0], [0.5, 0.5, -0.5, 1.0], [0.5, -0.5, -0.5, 1.0]),
        ];
    }
    Mesh.cube = cube;
    /**
     * generate cone with height and base diameter 1
     * @param segments number of slices to generate the cone in, the cone will be twice this many tris, must be >=3
     * @returns array of vertices
     */
    function cone(segments) {
        // that's not enough for a cone!
        if (segments < 3) {
            return [];
        }
        // 3 verts per tri, two tris per segment
        let res = [];
        const tip = [0.0, 0.5, 0.0, 1.0];
        const base = [0.0, -0.5, 0.0, 1.0];
        // set up first vertex
        let oldX = 0.5;
        let oldZ = 0;
        // iterate over each segment (counterclockwise when looking at the bottom)
        for (let i = 0; i < segments; i++) {
            // calculate current angle, i + 1 since the calculated vertex is shared with next segment
            let angle = ((i + 1) / segments) * (2 * Math.PI);
            // calculate position of next vertex around the cone's base
            let newX = 0.5 * Math.cos(angle);
            let newZ = 0.5 * Math.sin(angle);
            // triangle that goes to the tip of the cone
            res.push(tip, [newX, base[1], newZ, 1.0], [oldX, base[1], oldZ, 1.0]);
            // triangle on the base
            res.push(base, [oldX, base[1], oldZ, 1.0], [newX, base[1], newZ, 1.0]);
            // prepare for next iteration
            oldX = newX;
            oldZ = newZ;
        }
        return res;
    }
    Mesh.cone = cone;
    function cylinder(segments) {
        // that's not enough for a cylinder!
        if (segments < 3) {
            return [];
        }
        // 3 verts per tri, 4 tris per segment
        let res = [];
        // centers of the top and bottom
        const top = [0.0, 0.5, 0.0, 1.0];
        const bot = [0.0, -0.5, 0.0, 1.0];
        // set up first vertex
        let oldX = 0.5;
        let oldZ = 0;
        for (let i = 0; i < segments; i++) {
            // calculate current angle, i + 1 since the calculated vertex is shared with next segment
            let angle = ((i + 1) / segments) * (2 * Math.PI);
            // calculate position of next vertex around the cone's base
            let newX = 0.5 * Math.cos(angle);
            let newZ = 0.5 * Math.sin(angle);
            // top triangle
            res.push(top, [newX, top[1], newZ, 1.0], [oldX, top[1], oldZ, 1.0]);
            // the quad
            res.push(...quad([newX, top[1], newZ, 1.0], [newX, bot[1], newZ, 1.0], [oldX, bot[1], oldZ, 1.0], [oldX, top[1], oldZ, 1.0]));
            // bottom triangle
            res.push(bot, [oldX, bot[1], oldZ, 1.0], [newX, bot[1], newZ, 1.0]);
            // prepare for next iteration
            oldX = newX;
            oldZ = newZ;
        }
        return res;
    }
    Mesh.cylinder = cylinder;
    /**
     * generate a sphere of diameter 1
     * @param segments number of vertical segments
     * @param bands number of horizontal bands
     * @returns array of vertices
     */
    function sphere(segments, bands) {
        if (segments < 3 || bands < 3) {
            return [];
        }
        // top and bottom of the sphere
        const top = [0.0, 0.5, 0.0, 1.0];
        const bot = [0.0, -0.5, 0.0, 1.0];
        // band uses 180 because it's only accross half the sphere 
        const segmentAngle = (1 / segments) * 360;
        const bandAngle = (1 / bands) * 180;
        // build first segment
        let segment = [];
        const segmentRot = rotateY(segmentAngle);
        const bandRot = rotateX(bandAngle);
        // rotate into position for first triangle
        let old1 = matVecMul(bandRot, top);
        let old2 = matVecMul(segmentRot, old1);
        // top triangle
        segment.push(top, old1, old2);
        // 2 less because the triangles on each part of it aren't counted
        for (let i = 0; i < (bands - 2); i++) {
            // calculate new points
            let new1 = matVecMul(bandRot, old1);
            let new2 = matVecMul(segmentRot, new1);
            // 1 quad on the segment
            segment.push(...quad(old1, new1, new2, old2));
            old1 = new1;
            old2 = new2;
        }
        // bottom triangle
        segment.push(bot, old2, old1);
        // build full sphere
        let res = [...segment];
        for (let i = 1; i < segments; i++) {
            // rotate a copy of the segment to the right place and add it
            let rot = rotateY(segmentAngle * i);
            res.push(...segment.map(v => matVecMul(rot, v)));
        }
        return res;
    }
    Mesh.sphere = sphere;
    /**
     * generate a torus with major diameter 1
     * @param segments number of vertical segments
     * @param bands number of horizontal bands
     * @param minorDiam [optional] minor diameter of torus, since you can't change it with a linear transformation
     * @returns
     */
    function torus(segments, bands, minorDiam) {
        // make sure it can actually be constructed with the provided numbers
        if (segments < 3 || bands < 3) {
            return [];
        }
        // default minor diameter if not provided
        minorDiam = minorDiam !== null && minorDiam !== void 0 ? minorDiam : 0.2;
        // calculate angles
        const segmentAngle = (1 / segments) * 360;
        const bandAngle = (1 / bands) * 360;
        // build first segment
        let segment = [];
        const segmentRot = rotateY(segmentAngle);
        const bandRot = rotateZ(bandAngle);
        const diamTrans = translate(0.5, 0.0, 0.0);
        // starting position on the circle
        let currPoint = [minorDiam, 0.0, 0.0, 1.0];
        for (let i = 0; i < segments; i++) {
            // next point on the circle
            let newPoint = matVecMul(bandRot, currPoint);
            // translate/rotate each point to it's correct position and make a quad
            segment.push(...quad(matVecMul(diamTrans, currPoint), matVecMul(segmentRot, matVecMul(diamTrans, currPoint)), matVecMul(segmentRot, matVecMul(diamTrans, newPoint)), matVecMul(diamTrans, newPoint)));
            currPoint = newPoint;
        }
        // build full torus
        let res = [...segment];
        for (let i = 1; i < segments; i++) {
            // rotate a copy of the segment to the right place and add it
            let rot = rotateY(segmentAngle * i);
            res.push(...segment.map(v => matVecMul(rot, v)));
        }
        return res;
    }
    Mesh.torus = torus;
})(Mesh || (Mesh = {}));
