"use strict";
var Lab03;
(function (Lab03) {
    /**
     * generate colors for the number of triangles provided
     */
    function genColors(triangles) {
        return [...Array(triangles)].flatMap(() => {
            let color = [Math.random(), Math.random(), Math.random(), 1.0];
            return [color, color, color];
        });
    }
    Lab03.genColors = genColors;
})(Lab03 || (Lab03 = {}));
