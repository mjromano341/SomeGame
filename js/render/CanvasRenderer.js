/**
 * CanvasRenderer.js
 * Handles all canvas drawing operations for MarkSweeper
 */

class CanvasRenderer {
    constructor(canvas, gameBoard, gameState) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameBoard = gameBoard;
        this.gameState = gameState;

        this.cellSize = Constants.CELL_SIZE;
        this.hoveredCell = { row: -1, col: -1 };

        // Animation state
        this.animatingCells = new Map(); // Map of "row,col" -> animationProgress
        this.explosionCells = new Set(); // Set of exploded mine cells
        this.revealQueue = []; // Queue of cells to animate revealing

        // Colors
        this.colors = {
            background: '#c0c0c0',
            cellHidden: '#bdbdbd',
            cellHiddenLight: '#ffffff',
            cellHiddenDark: '#7b7b7b',
            cellRevealed: '#c0c0c0',
            cellRevealedBorder: '#808080',
            cellHover: '#d4d4d4',
            gridLine: '#808080',
            mine: '#000000',
            mineRed: '#ff0000',
            flag: '#ff0000',
            flagPole: '#000000',
            numbers: {
                1: '#0000ff', // Blue
                2: '#008000', // Green
                3: '#ff0000', // Red
                4: '#000080', // Dark Blue
                5: '#800000', // Maroon
                6: '#008080', // Teal
                7: '#000000', // Black
                8: '#808080'  // Gray
            }
        };

        this.setupCanvas();
    }

    /**
     * Setup canvas and calculate dimensions
     */
    setupCanvas() {
        const rows = this.gameBoard.getRows();
        const cols = this.gameBoard.getCols();

        this.canvas.width = cols * this.cellSize;
        this.canvas.height = rows * this.cellSize;

        // Enable image smoothing for better quality
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    /**
     * Main render method - draws the entire game board
     */
    render() {
        this.clear();
        this.drawGrid();
        this.drawCells();

        // Continue animation if needed
        if (this.animatingCells.size > 0 || this.revealQueue.length > 0) {
            requestAnimationFrame(() => this.render());
        }
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw the grid lines
     */
    drawGrid() {
        const rows = this.gameBoard.getRows();
        const cols = this.gameBoard.getCols();

        this.ctx.strokeStyle = this.colors.gridLine;
        this.ctx.lineWidth = 1;

        // Draw vertical lines
        for (let col = 0; col <= cols; col++) {
            const x = col * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for (let row = 0; row <= rows; row++) {
            const y = row * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    /**
     * Draw all cells
     */
    drawCells() {
        this.gameBoard.forEachCell((cell, row, col) => {
            const x = col * this.cellSize;
            const y = row * this.cellSize;

            const isHovered = this.hoveredCell.row === row && this.hoveredCell.col === col;
            const animKey = `${row},${col}`;
            const animProgress = this.animatingCells.get(animKey) || 1;
            const isExploded = this.explosionCells.has(animKey);

            if (cell.isRevealed) {
                this.drawRevealedCell(x, y, cell, animProgress, isExploded);
            } else if (cell.isFlagged) {
                this.drawFlaggedCell(x, y, isHovered);
            } else {
                this.drawHiddenCell(x, y, isHovered);
            }

            // Update animation progress
            if (animProgress < 1) {
                this.animatingCells.set(animKey, Math.min(1, animProgress + 0.15));
            } else {
                this.animatingCells.delete(animKey);
            }
        });
    }

    /**
     * Draw a hidden cell (3D button style)
     */
    drawHiddenCell(x, y, isHovered) {
        const size = this.cellSize;
        const bevel = 3;

        // Base color
        const baseColor = isHovered ? this.colors.cellHover : this.colors.cellHidden;
        this.ctx.fillStyle = baseColor;
        this.ctx.fillRect(x + 1, y + 1, size - 2, size - 2);

        // Top-left highlight (light)
        this.ctx.strokeStyle = this.colors.cellHiddenLight;
        this.ctx.lineWidth = bevel;
        this.ctx.beginPath();
        this.ctx.moveTo(x + bevel, y + size - bevel);
        this.ctx.lineTo(x + bevel, y + bevel);
        this.ctx.lineTo(x + size - bevel, y + bevel);
        this.ctx.stroke();

        // Bottom-right shadow (dark)
        this.ctx.strokeStyle = this.colors.cellHiddenDark;
        this.ctx.lineWidth = bevel;
        this.ctx.beginPath();
        this.ctx.moveTo(x + size - bevel, y + bevel);
        this.ctx.lineTo(x + size - bevel, y + size - bevel);
        this.ctx.lineTo(x + bevel, y + size - bevel);
        this.ctx.stroke();
    }

    /**
     * Draw a revealed cell
     */
    drawRevealedCell(x, y, cell, animProgress = 1, isExploded = false) {
        const size = this.cellSize;

        // Animate reveal with scale
        if (animProgress < 1) {
            const scale = 0.5 + (animProgress * 0.5);
            const offset = (size * (1 - scale)) / 2;

            this.ctx.save();
            this.ctx.translate(x + size / 2, y + size / 2);
            this.ctx.scale(scale, scale);
            this.ctx.translate(-size / 2, -size / 2);

            this.drawRevealedCellContent(0, 0, size, cell, isExploded);

            this.ctx.restore();
        } else {
            this.drawRevealedCellContent(x, y, size, cell, isExploded);
        }
    }

    /**
     * Draw revealed cell content
     */
    drawRevealedCellContent(x, y, size, cell, isExploded) {
        // Background
        this.ctx.fillStyle = this.colors.cellRevealed;
        this.ctx.fillRect(x + 1, y + 1, size - 2, size - 2);

        // Subtle border
        this.ctx.strokeStyle = this.colors.cellRevealedBorder;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);

        if (cell.isMine) {
            this.drawMine(x, y, isExploded);
        } else if (cell.adjacentMines > 0) {
            this.drawNumber(x, y, cell.adjacentMines);
        }
    }

    /**
     * Draw a flagged cell
     */
    drawFlaggedCell(x, y, isHovered) {
        // Draw as hidden cell first
        this.drawHiddenCell(x, y, isHovered);

        // Draw flag on top
        this.drawFlag(x, y);
    }

    /**
     * Draw a flag
     */
    drawFlag(x, y) {
        const size = this.cellSize;
        const centerX = x + size / 2;
        const centerY = y + size / 2;

        // Flag pole
        this.ctx.strokeStyle = this.colors.flagPole;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - 8);
        this.ctx.lineTo(centerX, centerY + 10);
        this.ctx.stroke();

        // Flag
        this.ctx.fillStyle = this.colors.flag;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - 8);
        this.ctx.lineTo(centerX + 10, centerY - 3);
        this.ctx.lineTo(centerX, centerY + 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * Draw a mine
     */
    drawMine(x, y, isExploded = false) {
        const size = this.cellSize;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 4;

        // Explosion background
        if (isExploded) {
            this.ctx.fillStyle = this.colors.mineRed;
            this.ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
        }

        // Mine body
        this.ctx.fillStyle = this.colors.mine;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Mine spikes
        const spikeLength = radius * 0.6;
        this.ctx.strokeStyle = this.colors.mine;
        this.ctx.lineWidth = 2;

        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + spikeLength);
            const y2 = centerY + Math.sin(angle) * (radius + spikeLength);

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }

        // Center highlight
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Draw a number (1-8)
     */
    drawNumber(x, y, num) {
        const size = this.cellSize;
        const centerX = x + size / 2;
        const centerY = y + size / 2;

        this.ctx.fillStyle = this.colors.numbers[num] || '#000000';
        this.ctx.font = 'bold ' + (size * 0.6) + 'px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(num.toString(), centerX, centerY);
    }

    /**
     * Set hovered cell for visual feedback
     */
    setHoveredCell(row, col) {
        if (this.hoveredCell.row !== row || this.hoveredCell.col !== col) {
            this.hoveredCell = { row, col };
            this.render();
        }
    }

    /**
     * Clear hovered cell
     */
    clearHoveredCell() {
        if (this.hoveredCell.row !== -1 || this.hoveredCell.col !== -1) {
            this.hoveredCell = { row: -1, col: -1 };
            this.render();
        }
    }

    /**
     * Animate cell reveal
     */
    animateReveal(row, col) {
        const key = `${row},${col}`;
        this.animatingCells.set(key, 0);
        this.render();
    }

    /**
     * Animate multiple cells revealing (for cascade)
     */
    animateRevealCascade(cells) {
        // Stagger the animations slightly for visual effect
        cells.forEach((cell, index) => {
            setTimeout(() => {
                this.animateReveal(cell.row, cell.col);
            }, index * 20);
        });
    }

    /**
     * Animate mine explosion
     */
    animateExplosion(row, col) {
        const key = `${row},${col}`;
        this.explosionCells.add(key);
        this.animateReveal(row, col);
    }

    /**
     * Convert screen coordinates to grid coordinates
     */
    screenToGrid(screenX, screenY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = screenX - rect.left;
        const y = screenY - rect.top;

        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        const rows = this.gameBoard.getRows();
        const cols = this.gameBoard.getCols();

        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            return { row, col };
        }

        return null;
    }

    /**
     * Reset renderer state
     */
    reset() {
        this.hoveredCell = { row: -1, col: -1 };
        this.animatingCells.clear();
        this.explosionCells.clear();
        this.revealQueue = [];
        this.setupCanvas();
        this.render();
    }
}
