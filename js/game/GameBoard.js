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
     * Place mines randomly on the board
     * @param {number} excludeRow - Row to exclude from mine placement (for first-click safety)
     * @param {number} excludeCol - Column to exclude from mine placement (for first-click safety)
     * @returns {number} Number of mines actually placed
     */
    placeMines(excludeRow = -1, excludeCol = -1) {
        // Clear existing mines first
        this.clearMines();
        
        const totalCells = this.rows * this.cols;
        const maxMines = totalCells - 1; // Can't have mines in all cells
        
        if (this.mineCount > maxMines) {
            console.warn(`Too many mines for board size. Reducing to ${maxMines}`);
            this.mineCount = maxMines;
        }
        
        // Create list of all valid positions
        const validPositions = [];
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // If exclude position specified, skip it and its neighbors
                if (excludeRow >= 0 && excludeCol >= 0) {
                    if (this.isInSafetyZone(row, col, excludeRow, excludeCol)) {
                        continue; // Skip this position
                    }
                }
                validPositions.push({ row, col });
            }
        }
        
        // Shuffle valid positions (Fisher-Yates shuffle)
        this.shuffleArray(validPositions);
        
        // Place mines at first N positions
        const minesToPlace = Math.min(this.mineCount, validPositions.length);
        for (let i = 0; i < minesToPlace; i++) {
            const { row, col } = validPositions[i];
            this.grid[row][col].setMine();
        }
        
        // After placing mines, calculate adjacent counts
        this.calculateAdjacentMines();
        
        return minesToPlace;
    }

    /**
     * Check if a position is in the safety zone around excluded position
     * Safety zone includes the excluded cell and all its neighbors
     * @param {number} row - Row to check
     * @param {number} col - Column to check
     * @param {number} excludeRow - Excluded row (center of safety zone)
     * @param {number} excludeCol - Excluded column (center of safety zone)
     * @returns {boolean}
     * @private
     */
    isInSafetyZone(row, col, excludeRow, excludeCol) {
        const rowDiff = Math.abs(row - excludeRow);
        const colDiff = Math.abs(col - excludeCol);
        // Include cell itself and all 8 neighbors
        return rowDiff <= 1 && colDiff <= 1;
    }

    /**
     * Clear all mines from the board
     * @private
     */
    clearMines() {
        this.forEachCell((cell) => {
            if (cell.isMine) {
                cell.reset();
            }
        });
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @private
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Check if board has mines placed
     * @returns {boolean}
     */
    hasMinesPlaced() {
        let mineCount = 0;
        this.forEachCell((cell) => {
            if (cell.isMine) {
                mineCount++;
            }
        });
        return mineCount > 0;
    }

    /**
     * Get count of mines currently on board
     * @returns {number}
     */
    getCurrentMineCount() {
        let count = 0;
        this.forEachCell((cell) => {
            if (cell.isMine) {
                count++;
            }
        });
        return count;
    }

    /**
     * Calculate and set adjacent mine counts for all cells
     * Must be called after mines are placed
     */
    calculateAdjacentMines() {
        this.forEachCell((cell, row, col) => {
            const count = this.countAdjacentMines(row, col);
            cell.setAdjacentMines(count);
        });
    }

    /**
     * Count mines in cells adjacent to given position
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {number} Count of adjacent mines (0-8)
     */
    countAdjacentMines(row, col) {
        let count = 0;
        const adjacentCells = this.getAdjacentCells(row, col);
        
        adjacentCells.forEach(cell => {
            if (cell.isMine) {
                count++;
            }
        });
        
        return count;
    }

    /**
     * Recalculate adjacent mines for a specific cell and its neighbors
     * Useful when mine placement changes
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    recalculateCellAndNeighbors(row, col) {
        // Recalculate the cell itself
        const cell = this.getCell(row, col);
        if (cell) {
            cell.setAdjacentMines(this.countAdjacentMines(row, col));
        }
        
        // Recalculate all neighbors
        const neighbors = this.getAdjacentCells(row, col);
        neighbors.forEach(neighbor => {
            // Find neighbor's position (we need row/col from Cell)
            // Since Cell stores row/col, we can use that
            if (neighbor.row >= 0 && neighbor.col >= 0) {
                neighbor.setAdjacentMines(this.countAdjacentMines(neighbor.row, neighbor.col));
            }
        });
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

