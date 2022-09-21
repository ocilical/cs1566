namespace Mesh {
    /**
     * generate colors for triangles
     * @param triangles number of triangles
     * @returns array of vertex colors
     */
    export function randomColors(triangles: number): vec4[] {
        return [...Array(triangles)].flatMap(() => {
            let color: vec4 = [Math.random(), Math.random(), Math.random(), 1.0];
            return [color, color, color];
        });
    }

    /**
     * generate cone with height and base diameter 2.0
     * @param segments number of slices to generate the cone in, the cone will be twice this many tris, must be >=3
     * @returns array of verticies
     */
    export function cone(segments: number): vec4[] {
        // that's not enough for a cone!
        if (segments < 3) {
            return [];
        }

        // 3 vertices per triangle, two v
        let res: vec4[] = Array(segments * 3 * 2);

        const tip: vec4 = [0.0, 1.0, 0.0, 1.0];
        const base: vec4 = [0.0, -1.0, 0.0, 1.0];

        // set up first vertex
        let prevX = 1;
        let prevZ = 0;

        // iterate over each segment (counterclockwise when looking at the bottom)
        for (let i = 0; i < res.length; i += 6) {
            // calculate current angle, i + 1 since the calculated vertex is shared with next segment
            let angle = (((i / 6) + 1) / segments) * (2 * Math.PI);

            // calculate position of next vertex around the cone's base
            let newX = Math.cos(angle);
            let newZ = Math.sin(angle);

            // triangle that goes to the tip of the cone
            res[i + 0] = tip;
            res[i + 1] = [newX, base[1], newZ, 1.0];
            res[i + 2] = [prevX, base[1], prevZ, 1.0];

            // triangle on the base
            res[i + 3] = base;
            res[i + 4] = [prevX, base[1], prevZ, 1.0];
            res[i + 5] = [newX, base[1], newZ, 1.0];

            // prepare for next iteration
            prevX = newX;
            prevZ = newZ;

        }

        return res;
    }
}
