namespace Maze {
    /**
     * A single cell of the maze,
     * if up/down/left/right is true, there is a wall in that direction
     */
    export interface MazeCell {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    }

    /**
     * generate new maze, mazes are row major, *NOT* column major
     * @param width width of new maze
     * @param height height of new maze
     * @returns new maze, as a 2d array of `MazeCell`s
     */
    export function genMaze(width: number, height: number): MazeCell[][] {
        // set up outer walls
        let maze: MazeCell[][] = [...Array(height)].map((_, row) => {
            return [...Array(width)].map((_, col) => {
                return {
                    up: (row === 0),
                    down: (row === (height - 1)),
                    left: (col === 0),
                    right: (col === (width - 1)),
                } as MazeCell;
            }) as MazeCell[];
        });

        return maze;
    }
}
