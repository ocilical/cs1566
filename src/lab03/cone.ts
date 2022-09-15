namespace Lab03 {
    /**
     * generate colors for the number of triangles provided
     */
    export function genColors(triangles: number): vec4[] {
        return [...Array(triangles)].flatMap(() => {
            let color: vec4 = [Math.random(), Math.random(), Math.random(), 1.0];
            return [color, color, color];
        });
    }
}
