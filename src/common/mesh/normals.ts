namespace Mesh {
    /**
     * generate normals for any mesh, results in flat shading
     * @param verts array of verts (must be divisible by 3)
     * @returns array of normals
     */
    export function calcNormals(verts: vec4[]): vec4[] {
        let res: vec4[] = [];

        for (let i = 0; i < verts.length; i += 3) {
            let normal = vecNorm(vecCross(vecSub(verts[i + 1], verts[i]), vecSub(verts[i + 2], verts[i])));
            res.push(normal, normal, normal);
        }

        return res;
    }

    /**
     * calculate normals of a sphere
     * @param verts array of vertices, must be a sphere
     * @returns array of normals
     */
    export function calcSphereNormals(verts: vec4[]): vec4[] {
        return verts.map(v => vecNorm([v[0], v[1], v[2], 0.0]));
    }

    /**
     * calculate normals of a cylinder
     * @param verts
     */
    export function calcCylNormals(verts: vec4[]): vec4[] {
        let res: vec4[] = [];
        for (let i = 0; i < verts.length; i += 12) {
            // top
            let normal = vecNorm(vecCross(vecSub(verts[i + 1], verts[i]), vecSub(verts[i + 2], verts[i])));
            res.push(normal, normal, normal);

            // quad
            res.push(vecNorm([verts[i + 3][0], 0, verts[i + 3][2], 0]));
            res.push(vecNorm([verts[i + 4][0], 0, verts[i + 4][2], 0]));
            res.push(vecNorm([verts[i + 5][0], 0, verts[i + 5][2], 0]));
            res.push(vecNorm([verts[i + 6][0], 0, verts[i + 6][2], 0]));
            res.push(vecNorm([verts[i + 7][0], 0, verts[i + 7][2], 0]));
            res.push(vecNorm([verts[i + 8][0], 0, verts[i + 8][2], 0]));

            // bottom
            normal = vecNorm(vecCross(vecSub(verts[i + 10], verts[i + 9]), vecSub(verts[i + 11], verts[i + 9])));
            res.push(normal, normal, normal);
        }
        return res;
    }

    export function calcConeNormals(verts: vec4[]): vec4[] {
        let res: vec4[] = [];
        for (let i = 0; i < verts.length; i += 6) {
            // tip triangle
            let normal = vecNorm(vecCross(vecSub(verts[i + 1], verts[i]), vecSub(verts[i + 2], verts[i])));
            res.push(
                [0, 1, 0, 0],
                vecNorm([verts[i + 1][0], normal[1], verts[i + 1][2], 0]),
                vecNorm([verts[i + 2][0], normal[1], verts[i + 2][2], 0]),
            );

            // base triangle
            normal = vecNorm(vecCross(vecSub(verts[i + 4], verts[i + 3]), vecSub(verts[i + 5], verts[i + 3])));
            res.push(normal, normal, normal);
        }
        return res;
    }
}
