/**
 * Cell.js
 * Represents a single cell in the Minesweeper grid
 */

class Cell {
    /**
     * Create a new Cell instance
     * @param {number} row - Row index (optional, for debugging)
     * @param {number} col - Column index (optional, for debugging)
     */
    constructor(row = -1, col = -1) {
        this.isMine = false;
        this.isRevealed = false;
        this.isFlagged = false;
        this.adjacentMines = 0;
        this.row = row;  // For debugging and future use
        this.col = col;  // For debugging and future use
    }

    /**
     * Reveal this cell
     * @returns {boolean} True if cell was successfully revealed, false if already revealed or flagged
     */
    reveal() {
        if (this.isRevealed || this.isFlagged) {
            return false;
        }
        this.isRevealed = true;
        return true;
    }

    /**
     * Toggle the flagged state of this cell
     * @returns {boolean} True if flagged, false if unflagged
     */
    flag() {
        if (this.isRevealed) {
            return false; // Cannot flag revealed cells
        }
        this.isFlagged = !this.isFlagged;
        return this.isFlagged;
    }

    /**
     * Remove flag from cell
     * @returns {boolean} True if flag was removed, false if not flagged
     */
    unflag() {
        if (this.isFlagged) {
            this.isFlagged = false;
            return true;
        }
        return false;
    }

    /**
     * Set this cell as a mine
     */
    setMine() {
        this.isMine = true;
    }

    /**
     * Set the adjacent mine count
     * @param {number} count - Number of adjacent mines (0-8)
     */
    setAdjacentMines(count) {
        if (count < 0 || count > 8) {
            throw new Error(`Adjacent mine count must be between 0 and 8, got ${count}`);
        }
        this.adjacentMines = count;
    }

    /**
     * Reset cell to initial state
     */
    reset() {
        this.isMine = false;
        this.isRevealed = false;
        this.isFlagged = false;
        this.adjacentMines = 0;
    }

    /**
     * Check if cell is hidden (not revealed and not flagged)
     * @returns {boolean}
     */
    isHidden() {
        return !this.isRevealed && !this.isFlagged;
    }

    /**
     * Check if cell can be revealed
     * @returns {boolean}
     */
    canReveal() {
        return !this.isRevealed && !this.isFlagged;
    }

    /**
     * Get debug string representation
     * @returns {string}
     */
    toString() {
        if (this.isFlagged) return 'F';
        if (!this.isRevealed) return '?';
        if (this.isMine) return '*';
        if (this.adjacentMines === 0) return ' ';
        return this.adjacentMines.toString();
    }
}

