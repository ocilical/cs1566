namespace Project4 {
    export function initScene(): [vec4[], vec4[], vec4[], { [key: string]: Object; }] {
        let positions: vec4[] = [];
        let colors: vec4[] = [];
        let normals: vec4[] = [];
        let objects: { [key: string]: Object; } = {};

        let tempPos: vec4[];

        tempPos = Mesh.cone(32);
        objects.cylinder = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, [1.0, 0.6, 0.922, 0.0]));
        normals.push(...Mesh.calcConeNormals(tempPos));

        tempPos = Mesh.sphere(sphereSegments, sphereBands).map(v => matVecMul(scale(0.2, 0.2, 0.2), v));
        objects.lightbulb = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: translate(0.0, 5.0, 0.0),
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, [1.0, 1.0, 1.0, 1.0]));
        normals.push(...Mesh.calcSphereNormals(tempPos).map(v => vecScale(-1, v))); // flip normals

        return [positions, colors, normals, objects];
    }
}
