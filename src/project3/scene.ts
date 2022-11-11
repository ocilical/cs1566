namespace Project3 {
    export function initScene(): [vec4[], vec4[], { [key: string]: Object; }] {
        let positions: vec4[] = [];
        let colors: vec4[] = [];
        let objects: { [key: string]: Object; } = {};

        let tempPos: vec4[];

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(2.5, -0.1, 2.5), scale(4, 0.2, 4)), v));
        objects.frontRightCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(-2.5, -0.1, 2.5), scale(4, 0.2, 4)), v));
        objects.frontLeftCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(2.5, -0.1, -2.5), scale(4, 0.2, 4)), v));
        objects.backRightCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(-2.5, -0.1, -2.5), scale(4, 0.2, 4)), v));
        objects.backLeftCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(0.0, -0.1, 1.0), scale(1, 0.2, 1)), v));
        objects.innerFrontCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(0.0, -0.1, -1.0), scale(1, 0.2, 1)), v));
        objects.innerBackCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(-1.0, -0.1, 0.0), scale(1, 0.2, 1)), v));
        objects.innerLeftCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(1.0, -0.1, 0.0), scale(1, 0.2, 1)), v));
        objects.innerRightCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(0.0, -0.1, 2.0), scale(1, 0.2, 1)), v));
        objects.midInnerFrontCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(0.0, -0.1, -2.0), scale(1, 0.2, 1)), v));
        objects.midInnerBackCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(-2.0, -0.1, 0.0), scale(1, 0.2, 1)), v));
        objects.midInnerLeftCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(2.0, -0.1, 0.0), scale(1, 0.2, 1)), v));
        objects.midInnerRightCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(0.0, -0.1, 3.0), scale(1, 0.2, 1)), v));
        objects.midOuterFrontCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(0.0, -0.1, -3.0), scale(1, 0.2, 1)), v));
        objects.midOuterBackCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(-3.0, -0.1, 0.0), scale(1, 0.2, 1)), v));
        objects.midOuterLeftCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(3.0, -0.1, 0.0), scale(1, 0.2, 1)), v));
        objects.midOuterRightCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(0.0, -0.1, 4.0), scale(1, 0.2, 1)), v));
        objects.outerFrontCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(0.0, -0.1, -4.0), scale(1, 0.2, 1)), v));
        objects.outerBackCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(-4.0, -0.1, 0.0), scale(1, 0.2, 1)), v));
        objects.outerLeftCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.cube().map(v => matVecMul(matMul(translate(4.0, -0.1, 0.0), scale(1, 0.2, 1)), v));
        objects.outerRightCube = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.cubeAxisColors());

        tempPos = Mesh.sphere(sphereSegments, sphereBands).map(v => matVecMul(translate(1.0, 0.5, 0.0), v));
        objects.innerSphere = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.twoColorSphere(tempPos.length / 3, [0.451, 0.941, 0.925, 1.0], [0.847, 0.506, 0.89, 1.0]));

        tempPos = Mesh.sphere(sphereSegments, sphereBands).map(v => matVecMul(translate(2.0, 0.5, 0.0), v));
        objects.midInnerSphere = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.twoColorSphere(tempPos.length / 3, [0.451, 0.941, 0.925, 1.0], [0.847, 0.506, 0.89, 1.0]));

        tempPos = Mesh.sphere(sphereSegments, sphereBands).map(v => matVecMul(translate(3.0, 0.5, 0.0), v));
        objects.midOuterSphere = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.twoColorSphere(tempPos.length / 3, [0.451, 0.941, 0.925, 1.0], [0.847, 0.506, 0.89, 1.0]));

        tempPos = Mesh.sphere(sphereSegments, sphereBands).map(v => matVecMul(translate(4.0, 0.5, 0.0), v));
        objects.outerSphere = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.twoColorSphere(tempPos.length / 3, [0.451, 0.941, 0.925, 1.0], [0.847, 0.506, 0.89, 1.0]));

        tempPos = Mesh.sphere(sphereSegments, sphereBands).map(v => matVecMul(matMul(translate(0.0, 5.0, 0.0), scale(0.4, 0.4, 0.4)), v));
        objects.lightbulb = {
            offset: positions.length,
            verts: tempPos.length,
            ctm: identity,
        };
        positions.push(...tempPos);
        colors.push(...Mesh.solidColor(tempPos.length / 3, [1.0, 1.0, 1.0, 1.0]));

        return [positions, colors, objects];
    }
}
