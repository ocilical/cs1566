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
        // fun recursive part
        genMazeHelper(maze, [0, height - 1, 0, width - 1]);
        // make entrance/exit
        maze[0][0].left = false;
        maze[maze.length - 1][maze[0].length - 1].right = false;
        return maze;
    }
    Maze.genMaze = genMaze;
    /**
     * recursive helper function for genMaze
     * @param maze maze to recurseively generate
     * @param bounds bounds to generate it, used as `[rowStart, rowEnd, colStart, colEnd]`
     */
    function genMazeHelper(maze, bounds) {
        let [rowStart, rowEnd, colStart, colEnd] = bounds;
        if (rowEnd - rowStart < 1 || colEnd - colStart < 1) {
            return;
        }
        // refers to down right corner of picked index
        let [randRow, randCol] = [randInt(rowStart, rowEnd), randInt(colStart, colEnd)];
        // put in new vertical wall
        for (let row = rowStart; row <= rowEnd; row++) {
            maze[row][randCol].right = true;
            maze[row][randCol + 1].left = true;
        }
        // put in new horizontal wall
        for (let col = colStart; col <= colEnd; col++) {
            maze[randRow][col].down = true;
            maze[randRow + 1][col].up = true;
        }
        // pick hole to not poke
        let skippedHole = randInt(0, 4);
        // poke holes
        if (skippedHole !== 0) {
            // up hole
            let holeRow = randInt(rowStart, randRow + 1);
            maze[holeRow][randCol].right = false;
            maze[holeRow][randCol + 1].left = false;
        }
        if (skippedHole !== 1) {
            // down hole
            let holeRow = randInt(randRow + 1, rowEnd);
            maze[holeRow][randCol].right = false;
            maze[holeRow][randCol + 1].left = false;
        }
        if (skippedHole !== 2) {
            // left hole
            let holeCol = randInt(colStart, randCol + 1);
            maze[randRow][holeCol].down = false;
            maze[randRow + 1][holeCol].up = false;
        }
        if (skippedHole !== 3) {
            // right hole
            let holeCol = randInt(randCol + 1, colEnd);
            maze[randRow][holeCol].down = false;
            maze[randRow + 1][holeCol].up = false;
        }
        //console.log(toString(maze));
        // recurse
        // up left corner
        genMazeHelper(maze, [rowStart, randRow, colStart, randCol]);
        // down left corner
        genMazeHelper(maze, [randRow + 1, rowEnd, colStart, randCol]);
        // up right corner
        genMazeHelper(maze, [rowStart, randRow, randCol + 1, colEnd]);
        // down right corner
        genMazeHelper(maze, [randRow + 1, rowEnd, randCol + 1, colEnd]);
    }
    /**
     * get a random integer
     * @param min minimum (inclusive)
     * @param max maximum (exclusive)
     * @returns random integer
     */
    function randInt(min, max) {
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
    }
    /**
     * turn a maze into a string
     * @param maze the maze
     * @returns a string that looks like the maze when printed
     */
    function toString(maze) {
        let res = [...Array(maze.length * 2 + 1)].map(() => "");
        // do top wall
        for (let i = 0; i < maze[0].length; i++) {
            res[0] = res[0].concat("+");
            if (maze[0][i].up) {
                res[0] = res[0].concat("---");
            }
            else {
                res[0] = res[0].concat("   ");
            }
        }
        res[0] = res[0].concat("+");
        // do left wall
        for (let i = 0; i < maze.length; i++) {
            if (maze[i][0].left) {
                res[i * 2 + 1] = res[i * 2 + 1].concat("|");
            }
            else {
                res[i * 2 + 1] = res[i * 2 + 1].concat(" ");
            }
            res[i * 2 + 2] = res[i * 2 + 2].concat("+");
        }
        // do rest of maze
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[0].length; col++) {
                // middle of cell and right wall
                res[row * 2 + 1] = res[row * 2 + 1].concat("   ");
                if (maze[row][col].right) {
                    res[row * 2 + 1] = res[row * 2 + 1].concat("|");
                }
                else {
                    res[row * 2 + 1] = res[row * 2 + 1].concat(" ");
                }
                // bottom wall and "vertex" bit
                if (maze[row][col].down) {
                    res[row * 2 + 2] = res[row * 2 + 2].concat("---");
                }
                else {
                    res[row * 2 + 2] = res[row * 2 + 2].concat("   ");
                }
                res[row * 2 + 2] = res[row * 2 + 2].concat("+");
            }
        }
        return res.join("\n");
    }
    Maze.toString = toString;
})(Maze || (Maze = {}));
