"use strict";
var Maze;
(function (Maze) {
    /**
     * generate new maze, mazes are row major, *NOT* column major
     * @param width width of new maze
     * @param height height of new maze
     * @returns new maze, as a 2d array of `MazeCell`s
     */
    function genMaze(width, height) {
        // set up outer walls
        let maze = [...Array(height)].map((_, row) => {
            return [...Array(width)].map((_, col) => {
                return {
                    up: (row === 0),
                    down: (row === (height - 1)),
                    left: (col === 0),
                    right: (col === (width - 1)),
                };
            });
        });
        return maze;
    }
    Maze.genMaze = genMaze;
})(Maze || (Maze = {}));
