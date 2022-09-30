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
     * generate quad, follows counterclockwise winding order
     * @returns array of vertices
     */
    export function quad(p1: vec4, p2: vec4, p3: vec4, p4: vec4): vec4[] {
        return [
            p1, p2, p3,
            p3, p4, p1,
        ];
    }

    /**
     * generate 1x1x1 cube, resize it if you want a different cube!
     * @returns array of vertices
     */
    export function cube(): vec4[] {
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

    /**
     * generate cone with height and base diameter 1
     * @param segments number of slices to generate the cone in, the cone will be twice this many tris, must be >=3
     * @returns array of vertices
     */
    export function cone(segments: number): vec4[] {
        // that's not enough for a cone!
        if (segments < 3) {
            return [];
        }

        // 3 verts per tri, two tris per segment
        let res: vec4[] = [];

        const tip: vec4 = [0.0, 0.5, 0.0, 1.0];
        const base: vec4 = [0.0, -0.5, 0.0, 1.0];

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
            res.push(
                tip,
                [newX, base[1], newZ, 1.0],
                [oldX, base[1], oldZ, 1.0],
            );

            // triangle on the base
            res.push(
                base,
                [oldX, base[1], oldZ, 1.0],
                [newX, base[1], newZ, 1.0],
            );

            // prepare for next iteration
            oldX = newX;
            oldZ = newZ;

        }

        return res;
    }

    export function cylinder(segments: number): vec4[] {
        // that's not enough for a cylinder!
        if (segments < 3) {
            return [];
        }

        // 3 verts per tri, 4 tris per segment
        let res: vec4[] = [];

        // centers of the top and bottom
        const top: vec4 = [0.0, 0.5, 0.0, 1.0];
        const bot: vec4 = [0.0, -0.5, 0.0, 1.0];

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
            res.push(
                top,
                [newX, top[1], newZ, 1.0],
                [oldX, top[1], oldZ, 1.0],
            );

            // the quad
            res.push(...quad(
                [newX, top[1], newZ, 1.0],
                [newX, bot[1], newZ, 1.0],
                [oldX, bot[1], oldZ, 1.0],
                [oldX, top[1], oldZ, 1.0],
            ));

            // bottom triangle
            res.push(
                bot,
                [oldX, bot[1], oldZ, 1.0],
                [newX, bot[1], newZ, 1.0],
            );

            // prepare for next iteration
            oldX = newX;
            oldZ = newZ;
        }

        return res;
    }

    /**
     * generate a sphere of diameter 1
     * @param segments number of vertical segments
     * @param bands number of horizontal bands
     * @returns array of vertices
     */
    export function sphere(segments: number, bands: number): vec4[] {
        return [];
    }

    /**
     * generate a torus with major diameter 1
     * @param segments number of vertical segments
     * @param bands number of horizontal bands
     * @param minorDiam [optional] minor diameter of torus, since you can't change it with a linear transformation
     * @returns 
     */
    export function torus(segments: number, bands: number, minorDiam?: number): vec4[] {
        // default minor diameter if not provided
        minorDiam = minorDiam ?? 0.2;

        return [];
    }
}
