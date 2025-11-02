/**
 * GameBoard.js
 * Manages the grid of cells for the Minesweeper game
 */

class GameBoard {
    /**
     * Create a new GameBoard
     * @param {string} difficulty - Difficulty level ('beginner', 'intermediate', 'expert')
     */
    constructor(difficulty = Constants.DEFAULT_DIFFICULTY) {
        const config = Constants.getDifficultyConfig(difficulty);
        this.rows = config.rows;
        this.cols = config.cols;
        this.mineCount = config.mines;
        this.difficulty = difficulty;
        
        // Initialize empty grid of cells
        this.grid = [];
        this.initializeGrid();
    }

    /**
     * Initialize the grid with empty Cell objects
     * @private
     */
    initializeGrid() {
        this.grid = [];
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = new Cell(row, col);
            }
        }
    }

    /**
     * Get cell at specified position
     * @param {number} row - Row index (0-based)
     * @param {number} col - Column index (0-based)
     * @returns {Cell|null} Cell object or null if out of bounds
     */
    getCell(row, col) {
        if (this.isValidPosition(row, col)) {
            return this.grid[row][col];
        }
        return null;
    }

    /**
     * Check if position is within board bounds
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {boolean}
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    /**
     * Get all adjacent cells (8 directions)
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {Array<Cell>} Array of adjacent Cell objects
     */
    getAdjacentCells(row, col) {
        const adjacent = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            const cell = this.getCell(newRow, newCol);
            if (cell !== null) {
                adjacent.push(cell);
            }
        }

        return adjacent;
    }

    /**
     * Get number of rows
     * @returns {number}
     */
    getRows() {
        return this.rows;
    }

    /**
     * Get number of columns
     * @returns {number}
     */
    getCols() {
        return this.cols;
    }

    /**
     * Get total number of cells
     * @returns {number}
     */
    getTotalCells() {
        return this.rows * this.cols;
    }

    /**
     * Get expected mine count for this difficulty
     * @returns {number}
     */
    getMineCount() {
        return this.mineCount;
    }

    /**
     * Iterate over all cells with a callback
     * @param {function} callback - Function(cell, row, col) to call for each cell
     */
    forEachCell(callback) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                callback(this.grid[row][col], row, col);
            }
        }
    }

    /**
     * Reset the entire board (clear all cells)
     */
    reset() {
        this.initializeGrid();
    }

    /**
     * Create a new board with different difficulty
     * @param {string} difficulty - New difficulty level
     */
    changeDifficulty(difficulty) {
        const config = Constants.getDifficultyConfig(difficulty);
        this.rows = config.rows;
        this.cols = config.cols;
        this.mineCount = config.mines;
        this.difficulty = difficulty;
        this.initializeGrid();
    }

    /**
     * Get debug string representation of board
     * @returns {string}
     */
    toString() {
        let result = '';
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                result += this.grid[row][col].toString() + ' ';
            }
            result += '\n';
        }
        return result;
    }
}

