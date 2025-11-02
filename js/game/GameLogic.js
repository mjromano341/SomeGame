/**
 * GameLogic.js
 * Orchestrates game actions and rules
 */

class GameLogic {
    /**
     * Create new GameLogic instance
     * @param {GameBoard} gameBoard - The game board
     * @param {GameState} gameState - The game state
     */
    constructor(gameBoard, gameState) {
        this.gameBoard = gameBoard;
        this.gameState = gameState;
        this.minesPlaced = false;
    }

    /**
     * Reveal a cell (main game action)
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {Object} Result object with success, gameOver, won, lost flags
     */
    revealCell(row, col) {
        // Validate position
        if (!this.gameBoard.isValidPosition(row, col)) {
            return { success: false, error: 'Invalid position' };
        }

        // Don't allow reveals if game is over
        if (this.gameState.isEnded()) {
            return { success: false, error: 'Game is over' };
        }

        const cell = this.gameBoard.getCell(row, col);
        
        // Can't reveal flagged cells
        if (cell.isFlagged) {
            return { success: false, error: 'Cell is flagged' };
        }

        // Can't reveal already revealed cells
        if (cell.isRevealed) {
            return { success: false, error: 'Cell already revealed' };
        }

        // Handle first click: place mines (excluding this cell and neighbors)
        if (!this.minesPlaced) {
            this.placeMinesSafely(row, col);
            this.gameState.start(); // Start timer
        }

        // Reveal the cell
        const revealed = cell.reveal();
        
        if (!revealed) {
            return { success: false, error: 'Could not reveal cell' };
        }

        // Check if revealed a mine
        if (cell.isMine) {
            this.gameState.lose();
            return { 
                success: true, 
                gameOver: true, 
                won: false, 
                lost: true,
                revealedCells: [cell]
            };
        }

        // If cell has no adjacent mines, cascade reveal
        let revealedCells = [cell];
        if (cell.adjacentMines === 0) {
            const cascadeRevealed = this.cascadeReveal(row, col);
            revealedCells = revealedCells.concat(cascadeRevealed);
        }

        // Check win condition
        const won = this.checkWinCondition();
        if (won) {
            this.gameState.win();
            return {
                success: true,
                gameOver: true,
                won: true,
                lost: false,
                revealedCells: revealedCells
            };
        }

        return {
            success: true,
            gameOver: false,
            won: false,
            lost: false,
            revealedCells: revealedCells
        };
    }

    /**
     * Place mines with first-click safety
     * @param {number} safeRow - Safe row (first click position)
     * @param {number} safeCol - Safe column (first click position)
     * @private
     */
    placeMinesSafely(safeRow, safeCol) {
        this.gameBoard.placeMines(safeRow, safeCol);
        this.minesPlaced = true;
    }

    /**
     * Cascade reveal empty cells (flood fill algorithm)
     * @param {number} startRow - Starting row
     * @param {number} startCol - Starting column
     * @returns {Array<Cell>} Array of revealed cells
     * @private
     */
    cascadeReveal(startRow, startCol) {
        const revealedCells = [];
        const queue = [{ row: startRow, col: startCol }];
        const visited = new Set();

        while (queue.length > 0) {
            const { row, col } = queue.shift();
            const key = `${row},${col}`;

            // Skip if already visited
            if (visited.has(key)) {
                continue;
            }
            visited.add(key);

            const cell = this.gameBoard.getCell(row, col);
            
            // Skip if invalid, already revealed, flagged, or is a mine
            if (!cell || cell.isRevealed || cell.isFlagged || cell.isMine) {
                continue;
            }

            // Reveal this cell
            cell.reveal();
            revealedCells.push(cell);

            // If cell has adjacent mines, stop cascading here
            if (cell.adjacentMines > 0) {
                continue;
            }

            // Add all neighbors to queue for processing
            const neighbors = this.gameBoard.getAdjacentCells(row, col);
            neighbors.forEach(neighbor => {
                const neighborKey = `${neighbor.row},${neighbor.col}`;
                if (!visited.has(neighborKey) && !neighbor.isRevealed && !neighbor.isFlagged) {
                    queue.push({ row: neighbor.row, col: neighbor.col });
                }
            });
        }

        return revealedCells;
    }

    /**
     * Toggle flag on a cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {Object} Result object with success and flagged status
     */
    flagCell(row, col) {
        // Validate position
        if (!this.gameBoard.isValidPosition(row, col)) {
            return { success: false, error: 'Invalid position' };
        }

        // Don't allow flagging if game is over
        if (this.gameState.isEnded()) {
            return { success: false, error: 'Game is over' };
        }

        // Can't flag revealed cells
        const cell = this.gameBoard.getCell(row, col);
        if (cell.isRevealed) {
            return { success: false, error: 'Cannot flag revealed cell' };
        }

        // Toggle flag
        const wasFlagged = cell.isFlagged;
        const nowFlagged = cell.flag();

        // Update mine counter
        if (nowFlagged && !wasFlagged) {
            this.gameState.decrementMines();
        } else if (!nowFlagged && wasFlagged) {
            this.gameState.incrementMines();
        }

        return {
            success: true,
            flagged: nowFlagged,
            minesRemaining: this.gameState.minesRemaining
        };
    }

    /**
     * Check if game is won
     * Game is won when all non-mine cells are revealed
     * @returns {boolean}
     */
    checkWinCondition() {
        let revealedCount = 0;
        let totalNonMineCells = 0;

        this.gameBoard.forEachCell((cell) => {
            if (!cell.isMine) {
                totalNonMineCells++;
                if (cell.isRevealed) {
                    revealedCount++;
                }
            }
        });

        return revealedCount === totalNonMineCells;
    }

    /**
     * Check if game is lost (revealed a mine)
     * @param {Cell} cell - The cell that was revealed
     * @returns {boolean}
     */
    checkLossCondition(cell) {
        return cell.isMine;
    }

    /**
     * Reset the game logic
     */
    reset() {
        this.minesPlaced = false;
    }

    /**
     * Get whether mines have been placed
     * @returns {boolean}
     */
    hasMinesPlaced() {
        return this.minesPlaced;
    }

    /**
     * Reveal all mines (for loss scenario)
     * @returns {Array<Cell>} Array of mine cells
     */
    revealAllMines() {
        const mineCells = [];
        this.gameBoard.forEachCell((cell) => {
            if (cell.isMine && !cell.isRevealed) {
                // Don't reveal flagged mines (or do? Design choice)
                if (!cell.isFlagged) {
                    cell.reveal();
                    mineCells.push(cell);
                }
            }
        });
        return mineCells;
    }

    /**
     * Get all incorrectly flagged cells (flagged but not mine)
     * @returns {Array<Cell>}
     */
    getIncorrectlyFlaggedCells() {
        const incorrect = [];
        this.gameBoard.forEachCell((cell) => {
            if (cell.isFlagged && !cell.isMine) {
                incorrect.push(cell);
            }
        });
        return incorrect;
    }

    /**
     * Get all unflagged mines (for win scenario)
     * @returns {Array<Cell>}
     */
    getUnflaggedMines() {
        const mines = [];
        this.gameBoard.forEachCell((cell) => {
            if (cell.isMine && !cell.isFlagged) {
                mines.push(cell);
            }
        });
        return mines;
    }
}

