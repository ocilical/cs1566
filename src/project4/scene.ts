namespace Project4 {
    export function initScene(): [vec4[], vec4[], vec4[], { [key: string]: Object; }] {
        let positions: vec4[] = [];
        let colors: vec4[] = [];
        let normals: vec4[] = [];
        let objects: { [key: string]: Object; } = {};

        const cylinderRes = 32;
        const armColor: vec4 = [1.0, 0.6, 0.922, 0.0];

        let tempPos: vec4[];

        tempPos = Mesh.cylinder(cylinderRes);
        objects.base = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 0.5, 0), scale(2.5, 1, 2.5)),
            ctm: identity,
            parent: null,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.cylinder(cylinderRes);
        objects.arm0 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 1, 0), scale(1.5, 2, 1.5)),
            ctm: identity,
            parent: "base",
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.cylinder(cylinderRes);
        objects.joint1 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 2, 0), rotateX(90), scale(2, 2, 2)),
            ctm: identity,
            parent: "arm0",
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.cylinder(cylinderRes);
        objects.arm1 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 4, 0), scale(1.5, 4, 1.5)),
            ctm: identity,
            parent: "joint1",
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.cylinder(cylinderRes);
        objects.joint2 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 6, 0), rotateX(90), scale(2, 2, 2)),
            ctm: identity,
            parent: "arm1",
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.cylinder(cylinderRes);
        objects.arm2 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 8, 0), scale(1.5, 4, 1.5)),
            ctm: identity,
            parent: "joint2",
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.cylinder(cylinderRes);
        objects.joint3 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 10, 0), rotateX(90), scale(2, 2, 2)),
            ctm: identity,
            parent: "arm2",
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.cylinder(cylinderRes);
        objects.arm3 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 11, 0), scale(1.5, 2, 1.5)),
            ctm: identity,
            parent: "joint3"
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.cylinder(cylinderRes);
        objects.wrist = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 12.25, 0), scale(2, 0.5, 2)),
            ctm: identity,
            parent: "arm3",
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.cube();
        objects.palm = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 12.75, 0), scale(0.5, 0.5, 2)),
            ctm: identity,
            parent: "wrist",
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcNormals(tempPos));

        tempPos = Mesh.cube();
        objects.finger1 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 13.5, 0.2), scale(0.4, 1.0, 0.4)),
            ctm: identity,
            parent: "palm",
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcNormals(tempPos));

        tempPos = Mesh.cube();
        objects.finger2 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 13.5, -0.2), scale(0.4, 1.0, 0.4)),
            ctm: identity,
            parent: "palm",
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, armColor));
        normals.push(...Mesh.calcNormals(tempPos));

        tempPos = Mesh.cylinder(cylinderRes * 2);
        objects.floor = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, -0.5, 0), scale(20.0, 1.0, 20.0)),
            ctm: identity,
            parent: null,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, [0.416, 0.525, 0.831, 1.0]));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.sphere(32, 16);
        objects.object2 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(-5, 1, 0), scale(2.0, 2.0, 2.0)),
            ctm: identity,
            parent: null,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, [1, 1, 1, 1.0]));
        normals.push(...Mesh.calcSphereNormals(tempPos));

        tempPos = Mesh.cone(cylinderRes);
        objects.object1 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(6, 1, 0), scale(2.0, 2.0, 2.0)),
            ctm: identity,
            parent: null,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, [0.961, 0.463, 0.553, 1.0]));
        normals.push(...Mesh.calcConeNormals(tempPos));

        tempPos = Mesh.cylinder(cylinderRes);
        objects.object3 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 1, 7), scale(2.0, 2.0, 2.0)),
            ctm: identity,
            parent: null,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, [0.463, 0.961, 0.51, 1.0]));
        normals.push(...Mesh.calcCylNormals(tempPos));

        tempPos = Mesh.cube();
        objects.object4 = {
            offset: positions.length,
            verts: tempPos.length,
            basetrans: composeTrans(translate(0, 1, -7), scale(2.0, 2.0, 2.0)),
            ctm: identity,
            parent: null,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, [0.961, 0.725, 0.463, 1.0]));
        normals.push(...Mesh.calcNormals(tempPos));

        return [positions, colors, normals, objects];
    }
}
