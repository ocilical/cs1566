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
     * take generated normals for a sphere that hasn't been rotated and smooth them
     * @param segments number of segments in sphere
     * @param bands number of bands in sphere
     * @param norms array of normals
     * @returns smoothed normals
     */
    export function smoothSphereNormals(segments: number, bands: number, norms: vec4[]): vec4[] {
        const segLength = norms.length / segments;

        // always the same since the sphere is always the same orientation
        const topNorm = [0, 1, 0, 0];
        const botNorm = [0, -1, 0, 0];

        let res = Array(norms.length);

        for (let i = 0; i < segments; i++) {
            const offset = i * segLength;
            const next = (offset + segLength) % norms.length;

            // set top and bottom
            res[offset] = topNorm;
            res[offset + segLength - 1] = botNorm;

            // calculate other two normals of top and bottom triangles
            const tempTop = vecNorm(vecSum(
                norms[offset + 2],
                norms[offset + 7],
                norms[next + 1],
                norms[next + 3],
                norms[next + 8],
            ));
            res[offset + 2] =
                res[offset + 7] =
                res[next + 1] =
                res[next + 3] =
                res[next + 8] = tempTop;

            const tempBot = vecNorm(vecSum(
                norms[offset + segLength - 3],
                norms[offset + segLength - 6],
                norms[offset + segLength - 7],
                norms[next + segLength - 2],
                norms[next + segLength - 8],
            ));
            res[offset + segLength - 3] =
                res[offset + segLength - 6] =
                res[offset + segLength - 7] =
                res[next + segLength - 2] =
                res[next + segLength - 8] = tempBot;

            for (let v = offset + 3; v < offset + segLength - 9; v += 6) {
                const v2 = (v + segLength) % norms.length;
                const temp = vecNorm(vecSum(
                    norms[v + 2],
                    norms[v + 3],
                    norms[v + 10],
                    norms[v2 + 1],
                    norms[v2 + 6],
                    norms[v2 + 11],
                ));
                res[v + 2] =
                    res[v + 3] =
                    res[v + 10] =
                    res[v2 + 1] =
                    res[v2 + 6] =
                    res[v2 + 11] = temp;
            }
        }
        return res;
    }
}
