# Phase 3: Rendering - Detailed Planning

## Overview
Phase 3 brings MarkSweeper to life visually by implementing canvas rendering, drawing all game states, handling user interactions, and creating a polished visual experience. This phase connects the game logic from Phase 2 with the visual representation.

## Goals
- Create a clean, performant canvas rendering system
- Draw all cell states accurately (hidden, revealed, flagged, mine)
- Display numbers with proper colors
- Add visual feedback (hover effects, animations)
- Handle user input (mouse clicks, right-clicks)
- Ensure responsive canvas scaling
- Connect rendering to game logic

## Deliverables
1. `js/render/CanvasRenderer.js` - Main rendering engine
2. Enhanced `js/main.js` - Event handling and render loop integration
3. Enhanced `css/game.css` - Game-specific visual styles
4. Complete visual game experience

---

## Step 1: Create CanvasRenderer.js

### Objective
Create the CanvasRenderer class that handles all canvas drawing operations, manages the rendering loop, and provides a clean interface for drawing game states.

### Responsibilities

#### Core Responsibilities
- Initialize and manage canvas context
- Handle canvas sizing and scaling
- Draw all cell states
- Draw numbers and indicators
- Manage rendering loop
- Handle coordinate conversion (screen to grid)
- Provide drawing primitives

#### Methods Needed
- Constructor (canvas element, gameBoard)
- `resize()`: Handle canvas resizing
- `clear()`: Clear canvas
- `render()`: Main render method
- `drawCell(row, col, cell)`: Draw individual cell
- `getCellFromCoordinates(x, y)`: Convert screen coords to grid
- `drawHiddenCell(row, col)`: Draw hidden cell
- `drawRevealedCell(row, col, cell)`: Draw revealed cell
- `drawFlaggedCell(row, col)`: Draw flagged cell
- `drawMine(row, col)`: Draw mine
- `drawNumber(row, col, number)`: Draw number

### Implementation Details

**File**: `js/render/CanvasRenderer.js`

```javascript
/**
 * CanvasRenderer.js
 * Handles all canvas rendering for MarkSweeper
 */

class CanvasRenderer {
    /**
     * Create a new CanvasRenderer
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {GameBoard} gameBoard - Game board instance
     */
    constructor(canvas, gameBoard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameBoard = gameBoard;
        
        // Cache cell size and dimensions
        this.cellSize = Constants.CELL_SIZE;
        this.cellPadding = Constants.CELL_PADDING;
        this.borderWidth = Constants.CANVAS_BORDER;
        
        // Track hover state
        this.hoveredCell = { row: -1, col: -1 };
        
        // Initialize canvas size
        this.resize();
        
        // Set up event listeners for hover
        this.setupEventListeners();
    }

    /**
     * Resize canvas to match board dimensions
     */
    resize() {
        const dimensions = Constants.getCanvasDimensions(this.gameBoard.difficulty);
        this.canvas.width = dimensions.width;
        this.canvas.height = dimensions.height;
        
        // Calculate actual cell size based on canvas
        this.cellSize = Constants.CELL_SIZE;
        this.cellPadding = Constants.CELL_PADDING;
        
        // Store grid dimensions
        this.rows = this.gameBoard.getRows();
        this.cols = this.gameBoard.getCols();
    }

    /**
     * Clear the entire canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Main render method - draws entire board
     */
    render() {
        this.clear();
        
        // Draw background/border
        this.drawBackground();
        
        // Draw each cell
        this.gameBoard.forEachCell((cell, row, col) => {
            this.drawCell(row, col, cell);
        });
        
        // Draw hover effect if applicable
        if (this.hoveredCell.row >= 0 && this.hoveredCell.col >= 0) {
            this.drawHoverEffect(this.hoveredCell.row, this.hoveredCell.col);
        }
    }

    /**
     * Draw background and border
     * @private
     */
    drawBackground() {
        this.ctx.fillStyle = Constants.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw border
        this.ctx.strokeStyle = Constants.COLORS.BORDER;
        this.ctx.lineWidth = this.borderWidth;
        this.ctx.strokeRect(
            this.borderWidth / 2,
            this.borderWidth / 2,
            this.canvas.width - this.borderWidth,
            this.canvas.height - this.borderWidth
        );
    }

    /**
     * Draw a single cell based on its state
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {Cell} cell - Cell object
     */
    drawCell(row, col, cell) {
        const x = this.getCellX(col);
        const y = this.getCellY(row);
        
        if (cell.isRevealed) {
            if (cell.isMine) {
                this.drawMine(row, col);
            } else {
                this.drawRevealedCell(row, col, cell);
            }
        } else if (cell.isFlagged) {
            this.drawFlaggedCell(row, col);
        } else {
            this.drawHiddenCell(row, col);
        }
    }

    /**
     * Draw a hidden (unrevealed) cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    drawHiddenCell(row, col) {
        const x = this.getCellX(col);
        const y = this.getCellY(row);
        const size = this.cellSize;
        
        // Draw 3D raised button effect
        this.ctx.fillStyle = Constants.COLORS.HIDDEN_CELL;
        this.ctx.fillRect(x, y, size, size);
        
        // Top and left highlight (light)
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(x + size, y);
        this.ctx.stroke();
        
        // Bottom and right shadow (dark)
        this.ctx.strokeStyle = '#808080';
        this.ctx.beginPath();
        this.ctx.moveTo(x + size, y);
        this.ctx.lineTo(x + size, y + size);
        this.ctx.lineTo(x, y + size);
        this.ctx.stroke();
    }

    /**
     * Draw a revealed cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {Cell} cell - Cell object
     */
    drawRevealedCell(row, col, cell) {
        const x = this.getCellX(col);
        const y = this.getCellY(row);
        const size = this.cellSize;
        
        // Draw flat revealed cell background
        this.ctx.fillStyle = Constants.COLORS.REVEALED_CELL;
        this.ctx.fillRect(x, y, size, size);
        
        // Draw inset border effect
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
        
        // Draw number if adjacent mines > 0
        if (cell.adjacentMines > 0) {
            this.drawNumber(row, col, cell.adjacentMines);
        }
    }

    /**
     * Draw a flagged cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    drawFlaggedCell(row, col) {
        // Draw as hidden cell first (raised button)
        this.drawHiddenCell(row, col);
        
        const x = this.getCellX(col);
        const y = this.getCellY(row);
        const size = this.cellSize;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        // Draw flag pole
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - size * 0.15, centerY - size * 0.25);
        this.ctx.lineTo(centerX - size * 0.15, centerY + size * 0.3);
        this.ctx.stroke();
        
        // Draw flag (red triangle)
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - size * 0.15, centerY - size * 0.25);
        this.ctx.lineTo(centerX + size * 0.25, centerY);
        this.ctx.lineTo(centerX - size * 0.15, centerY + size * 0.25);
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * Draw a mine
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    drawMine(row, col) {
        const x = this.getCellX(col);
        const y = this.getCellY(row);
        const size = this.cellSize;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size * 0.3;
        
        // Draw revealed cell background first
        this.ctx.fillStyle = Constants.COLORS.REVEALED_CELL;
        this.ctx.fillRect(x, y, size, size);
        
        // Draw mine (black circle)
        this.ctx.fillStyle = Constants.COLORS.MINE_CELL;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw red highlight if this is the clicked mine (exploded)
        // This will be enhanced in Phase 6 (polish)
    }

    /**
     * Draw a number (1-8)
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {number} number - Number to draw (1-8)
     */
    drawNumber(row, col, number) {
        if (number < 1 || number > 8) {
            return;
        }
        
        const x = this.getCellX(col);
        const y = this.getCellY(row);
        const size = this.cellSize;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        // Get color for number
        const color = Constants.COLORS.NUMBER_COLORS[number];
        
        // Draw number text
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${size * 0.6}px Arial, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(number.toString(), centerX, centerY);
    }

    /**
     * Draw hover effect on a cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    drawHoverEffect(row, col) {
        const cell = this.gameBoard.getCell(row, col);
        if (!cell || cell.isRevealed || this.gameState?.isEnded()) {
            return;
        }
        
        const x = this.getCellX(col);
        const y = this.getCellY(row);
        const size = this.cellSize;
        
        // Draw subtle highlight overlay
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x, y, size, size);
    }

    /**
     * Set hovered cell
     * @param {number} row - Row index (-1 to clear)
     * @param {number} col - Column index (-1 to clear)
     */
    setHoveredCell(row, col) {
        this.hoveredCell = { row, col };
    }

    /**
     * Convert screen coordinates to grid coordinates
     * @param {number} x - Screen X coordinate
     * @param {number} y - Screen Y coordinate
     * @returns {Object|null} {row, col} or null if outside grid
     */
    getCellFromCoordinates(x, y) {
        // Account for border
        const relativeX = x - this.borderWidth;
        const relativeY = y - this.borderWidth;
        
        // Check bounds
        if (relativeX < 0 || relativeY < 0) {
            return null;
        }
        
        const col = Math.floor(relativeX / this.cellSize);
        const row = Math.floor(relativeY / this.cellSize);
        
        // Validate grid bounds
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return { row, col };
        }
        
        return null;
    }

    /**
     * Get X coordinate for a column
     * @param {number} col - Column index
     * @returns {number}
     * @private
     */
    getCellX(col) {
        return this.borderWidth + col * this.cellSize;
    }

    /**
     * Get Y coordinate for a row
     * @param {number} row - Row index
     * @returns {number}
     * @private
     */
    getCellY(row) {
        return this.borderWidth + row * this.cellSize;
    }

    /**
     * Update game state reference (for hover effects)
     * @param {GameState} gameState - Game state instance
     */
    setGameState(gameState) {
        this.gameState = gameState;
    }
}
```

### Design Decisions
- [ ] Rendering approach: immediate mode vs retained mode (chosen: immediate - redraw on demand)
- [ ] Coordinate system (chosen: grid-based with helper methods)
- [ ] Hover tracking (chosen: store in renderer, draw on render)
- [ ] Cell drawing order (chosen: background first, then content)
- [ ] 3D effect style (chosen: classic Minesweeper raised/sunken effect)

### Performance Considerations
- Clear and redraw entire board each frame (acceptable for board sizes)
- No complex graphics (just rectangles, circles, text)
- Minimal calculations per frame
- Consider requestAnimationFrame for smooth animations (future)

### Testing Checklist
- [ ] CanvasRenderer instantiates correctly
- [ ] Canvas resizes to match board dimensions
- [ ] Render method clears and redraws correctly
- [ ] Coordinate conversion works correctly
- [ ] Cell positions calculated correctly
- [ ] All cell types draw correctly
- [ ] Hover tracking works

---

## Step 2: Draw Basic Grid and Cells

### Objective
Implement the fundamental drawing methods that render the grid structure and basic cell states.

### Implementation Details

This is primarily covered in Step 1. Additional considerations:

#### Grid Structure
- Cells should align perfectly
- No gaps or overlaps
- Consistent spacing
- Clear visual separation

#### Cell States to Draw
1. **Hidden**: Raised 3D button effect
2. **Revealed**: Flat inset effect with optional number
3. **Flagged**: Hidden cell with flag icon overlay
4. **Mine**: Revealed cell with mine icon

### Enhanced Drawing Methods

**Grid Lines (Optional)**
```javascript
/**
 * Draw grid lines (optional, for debugging or visual separation)
 * @private
 */
drawGridLines() {
    this.ctx.strokeStyle = '#d0d0d0';
    this.ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let col = 0; col <= this.cols; col++) {
        const x = this.getCellX(col);
        this.ctx.beginPath();
        this.ctx.moveTo(x, this.borderWidth);
        this.ctx.lineTo(x, this.borderWidth + this.rows * this.cellSize);
        this.ctx.stroke();
    }
    
    // Horizontal lines
    for (let row = 0; row <= this.rows; row++) {
        const y = this.getCellY(row);
        this.ctx.beginPath();
        this.ctx.moveTo(this.borderWidth, y);
        this.ctx.lineTo(this.borderWidth + this.cols * this.cellSize, y);
        this.ctx.stroke();
    }
}
```

### Visual Design Specifications

#### Hidden Cell
- Base color: #c0c0c0 (light gray)
- Top/left highlight: #ffffff (white, 2px)
- Bottom/right shadow: #808080 (gray, 2px)
- Creates raised button effect

#### Revealed Cell
- Base color: #e0e0e0 (very light gray)
- Border: #808080 (gray, 1px inset)
- Flat appearance (no 3D effect)

#### Cell Dimensions
- Default: 30px × 30px
- Border: 2px
- Padding: 2px (internal, if needed)

### Testing Checklist
- [ ] Grid aligns perfectly (no gaps)
- [ ] All cells are same size
- [ ] Hidden cells have 3D effect
- [ ] Revealed cells are flat
- [ ] Cells don't overlap
- [ ] Border is consistent
- [ ] Works for all difficulty levels

### Visual Test Cases
- Beginner (9×9): 270×270 canvas
- Intermediate (16×16): 480×480 canvas
- Expert (30×16): 900×480 canvas

---

## Step 3: Draw Revealed Cells with Numbers

### Objective
Enhance the revealed cell drawing to display numbers (1-8) with proper colors based on adjacent mine count.

### Number Display Specifications

#### Number Colors (Traditional Minesweeper)
- 1: Blue (#0000ff)
- 2: Green (#008000)
- 3: Red (#ff0000)
- 4: Dark Blue (#000080)
- 5: Dark Red (#800000)
- 6: Teal (#008080)
- 7: Black (#000000)
- 8: Gray (#808080)

#### Typography
- Font: Arial, sans-serif (fallback)
- Weight: Bold
- Size: 60% of cell size (e.g., 18px for 30px cell)
- Alignment: Centered (horizontal and vertical)
- Baseline: Middle

### Implementation

The `drawNumber()` method is already implemented in Step 1. Verify and enhance:

```javascript
/**
 * Draw a number (1-8) - Enhanced version
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {number} number - Number to draw (1-8)
 */
drawNumber(row, col, number) {
    if (number < 1 || number > 8) {
        return; // Don't draw 0 or invalid numbers
    }
    
    const x = this.getCellX(col);
        const y = this.getCellY(row);
        const size = this.cellSize;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        // Get color for number
        const color = Constants.COLORS.NUMBER_COLORS[number];
        
        // Calculate font size (60% of cell size)
        const fontSize = Math.floor(size * 0.6);
        
        // Draw number text with proper styling
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Optional: Add text shadow for better readability
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 1;
        this.ctx.shadowOffsetX = 0.5;
        this.ctx.shadowOffsetY = 0.5;
        
        this.ctx.fillText(number.toString(), centerX, centerY);
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
}
```

### Edge Cases
- Cell with 0 adjacent mines: Don't draw number (already handled in drawRevealedCell)
- Invalid number: Skip drawing
- Font rendering differences: Test across browsers

### Testing Checklist
- [ ] All numbers 1-8 display correctly
- [ ] Numbers are centered in cells
- [ ] Colors match specification
- [ ] Font size scales with cell size
- [ ] Numbers are readable
- [ ] Cells with 0 adjacent mines show no number
- [ ] Works across all difficulty levels

### Visual Test Cases
Create test board manually:
```
[1][1][1][ ]
[1][8][1][ ]
[1][1][1][ ]
```
Verify each number displays with correct color.

---

## Step 4: Draw Flagged Cells

### Objective
Enhance flagged cell drawing to show a clear flag icon over the hidden cell appearance.

### Flag Design Specifications

#### Flag Appearance
- Base: Hidden cell (raised button effect)
- Flag pole: Black vertical line (2px width)
- Flag: Red triangle (filled)
- Position: Centered in cell
- Size: Proportional to cell size

#### Flag Dimensions
- Pole width: 2px
- Pole length: ~55% of cell height
- Flag size: ~40% of cell width
- Center position: Slightly left of center

### Implementation

The `drawFlaggedCell()` method is already implemented in Step 1. Verify positioning:

```javascript
drawFlaggedCell(row, col) {
    // Draw as hidden cell first (raised button)
    this.drawHiddenCell(row, col);
    
    const x = this.getCellX(col);
    const y = this.getCellY(row);
    const size = this.cellSize;
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    
    // Flag pole dimensions
    const poleX = centerX - size * 0.12;
    const poleTop = centerY - size * 0.25;
    const poleBottom = centerY + size * 0.3;
    const poleWidth = 2;
    
    // Draw flag pole
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(poleX - poleWidth / 2, poleTop, poleWidth, poleBottom - poleTop);
    
    // Flag triangle dimensions
    const flagSize = size * 0.4;
    const flagLeftX = poleX;
    const flagRightX = poleX + flagSize;
    const flagY = centerY - size * 0.15;
    
    // Draw flag (red triangle)
    this.ctx.fillStyle = '#ff0000';
    this.ctx.beginPath();
    this.ctx.moveTo(flagLeftX, poleTop);
    this.ctx.lineTo(flagRightX, flagY);
    this.ctx.lineTo(flagLeftX, flagY + (poleTop - flagY) * 2);
    this.ctx.closePath();
    this.ctx.fill();
}
```

### Alternative Flag Styles (Optional)

**Option 1: Simple Flag (Current)**
- Red triangle on black pole

**Option 2: Detailed Flag**
- Add white rectangle in flag center
- More detailed pole

**Option 3: Icon-Style Flag**
- Use Unicode flag emoji or SVG path
- More modern appearance

Recommendation: Start with Option 1 (simple), can enhance later.

### Testing Checklist
- [ ] Flag displays on flagged cells
- [ ] Flag is centered properly
- [ ] Flag pole is vertical
- [ ] Flag triangle is red
- [ ] Hidden cell appearance maintained
- [ ] Flag is proportional to cell size
- [ ] Multiple flagged cells render correctly

---

## Step 5: Draw Hidden Cells

### Objective
Ensure hidden cells are drawn with the classic 3D raised button effect that makes the game visually appealing.

### Implementation

The `drawHiddenCell()` method is already implemented in Step 1. This step ensures it's polished:

```javascript
drawHiddenCell(row, col) {
    const x = this.getCellX(col);
    const y = this.getCellY(row);
    const size = this.cellSize;
    
    // Base fill (light gray)
    this.ctx.fillStyle = Constants.COLORS.HIDDEN_CELL;
    this.ctx.fillRect(x, y, size, size);
    
    // Top and left highlight (white, bright)
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + size);
    this.ctx.lineTo(x, y);
    this.ctx.lineTo(x + size, y);
    this.ctx.stroke();
    
    // Bottom and right shadow (dark gray)
    this.ctx.strokeStyle = '#808080';
    this.ctx.beginPath();
    this.ctx.moveTo(x + size, y);
    this.ctx.lineTo(x + size, y + size);
    this.ctx.lineTo(x, y + size);
    this.ctx.stroke();
}
```

### 3D Effect Details

#### Light Source
- Assumed from top-left
- Top and left edges: White highlight
- Bottom and right edges: Dark shadow

#### Edge Rendering
- Line width: 2px
- Highlight color: #ffffff
- Shadow color: #808080
- Creates convincing 3D effect

### Visual Polish

**Optional Enhancements:**
- Gradient fill for depth
- Anti-aliasing for smooth edges
- Shadow blur for softer appearance

**Recommendation**: Keep simple for Phase 3, can enhance in Phase 6.

### Testing Checklist
- [ ] Hidden cells have 3D raised appearance
- [ ] Highlight and shadow are visible
- [ ] Effect is consistent across all cells
- [ ] Works at all difficulty levels
- [ ] Cells look clickable

---

## Step 6: Add Hover Effects

### Objective
Add visual feedback when hovering over cells to improve user experience and make the game feel responsive.

### Hover Behavior Specifications

#### When to Show Hover
- Cell is hidden (not revealed)
- Cell is not flagged (optional - can hover flagged cells)
- Game is not over
- Mouse is over cell

#### Hover Effect
- Subtle highlight overlay
- Lighten the cell slightly
- Optional: Slight scale or glow effect

### Implementation

The hover tracking is already in CanvasRenderer. Enhance with better effects:

```javascript
/**
 * Draw hover effect on a cell - Enhanced
 * @param {number} row - Row index
 * @param {number} col - Column index
 */
drawHoverEffect(row, col) {
    const cell = this.gameBoard.getCell(row, col);
    if (!cell || cell.isRevealed || this.gameState?.isEnded()) {
        return;
    }
    
    const x = this.getCellX(col);
    const y = this.getCellY(row);
    const size = this.cellSize;
    
    // Draw subtle highlight overlay
    // Option 1: Light overlay
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(x, y, size, size);
    
    // Option 2: Border highlight
    // this.ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
    // this.ctx.lineWidth = 2;
    // this.ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
    
    // Option 3: Combined (recommended)
    // Light overlay
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(x, y, size, size);
    
    // Subtle border
    this.ctx.strokeStyle = 'rgba(100, 150, 255, 0.4)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
}
```

### Event Handling for Hover

**File**: `js/main.js` (additions):

```javascript
/**
 * Handle mouse move on canvas
 */
function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const cellPos = canvasRenderer.getCellFromCoordinates(x, y);
    
    if (cellPos) {
        canvasRenderer.setHoveredCell(cellPos.row, cellPos.col);
        canvasRenderer.render(); // Re-render to show hover
    } else {
        canvasRenderer.setHoveredCell(-1, -1);
        canvasRenderer.render();
    }
}

/**
 * Handle mouse leave canvas
 */
function handleMouseLeave() {
    canvasRenderer.setHoveredCell(-1, -1);
    canvasRenderer.render();
}

// Add event listeners
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseleave', handleMouseLeave);
```

### Performance Consideration
- Re-render on every mouse move (acceptable for small boards)
- For large boards, consider debouncing or only rendering on cell change

### Testing Checklist
- [ ] Hover effect appears on hidden cells
- [ ] Hover effect doesn't appear on revealed cells
- [ ] Hover disappears when mouse leaves cell
- [ ] Hover disappears when mouse leaves canvas
- [ ] Effect is subtle but visible
- [ ] Performance is acceptable

---

## Step 7: Handle Canvas Scaling and Responsiveness

### Objective
Ensure the canvas scales properly for different screen sizes and maintains aspect ratio.

### Responsiveness Strategy

#### Approach
- Fixed pixel size for cells (maintains game design)
- Canvas container handles responsive sizing
- Optional: Scale down for very small screens
- Maintain aspect ratio

### Implementation

**CSS Updates** (`css/game.css`):

```css
.canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: auto;
    margin-bottom: 20px;
}

#game-canvas {
    border: 2px solid #333;
    border-radius: 4px;
    display: block;
    background: #c0c0c0;
    cursor: pointer;
    max-width: 100%;
    height: auto;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}
```

### Optional: Dynamic Scaling

For very small screens, can scale down:

```javascript
/**
 * Calculate appropriate scale for canvas
 * @returns {number} Scale factor (0-1)
 */
calculateScale() {
    const container = this.canvas.parentElement;
    const containerWidth = container.clientWidth - 40; // Padding
    const containerHeight = container.clientHeight - 40;
    
    const scaleX = containerWidth / this.canvas.width;
    const scaleY = containerHeight / this.canvas.height;
    
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
    
    return Math.max(scale, 0.5); // Minimum 50% scale
}

/**
 * Apply scale to canvas
 */
applyScale() {
    const scale = this.calculateScale();
    this.canvas.style.transform = `scale(${scale})`;
    this.canvas.style.transformOrigin = 'top left';
}
```

### High DPI Displays

Handle retina/high DPI displays:

```javascript
/**
 * Set up canvas for high DPI displays
 */
setupHighDPI() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    // Set actual size in memory (scaled for DPI)
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    // Scale context to handle DPI
    this.ctx.scale(dpr, dpr);
    
    // Set display size (CSS pixels)
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
}
```

**Note**: This adds complexity. Start simple, add if needed.

### Testing Checklist
- [ ] Canvas fits in container
- [ ] Canvas doesn't overflow container
- [ ] Aspect ratio maintained
- [ ] Works on different screen sizes
- [ ] Mobile devices (optional - touch handling in Phase 4)
- [ ] High DPI displays (optional)

---

## Step 8: Integrate Rendering with Game Logic

### Objective
Connect the CanvasRenderer to GameLogic so that game actions trigger re-renders and the game is fully playable.

### Integration Points

#### Event Flow
1. User clicks canvas
2. Convert coordinates to grid position
3. Call GameLogic.revealCell() or GameLogic.flagCell()
4. GameLogic updates game state
5. CanvasRenderer.render() updates display
6. UI elements update (timer, mine counter)

### Implementation

**File**: `js/main.js` (complete integration):

```javascript
$(document).ready(function() {
    // ... existing initialization ...
    
    let gameLogic = null;
    let canvasRenderer = null;
    
    /**
     * Initialize the game
     */
    function initGame() {
        // ... existing code ...
        
        // Initialize game logic
        gameLogic = new GameLogic(gameBoard, gameState);
        
        // Initialize canvas renderer
        canvasRenderer = new CanvasRenderer(canvas, gameBoard);
        canvasRenderer.setGameState(gameState);
        
        // Initial render
        canvasRenderer.render();
        
        // Set up event handlers
        setupEventHandlers();
        
        // ... existing code ...
    }
    
    /**
     * Set up canvas event handlers
     */
    function setupEventHandlers() {
        // Left click (reveal)
        canvas.addEventListener('click', function(event) {
            if (gameState.isEnded()) {
                return;
            }
            
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const cellPos = canvasRenderer.getCellFromCoordinates(x, y);
            if (!cellPos) {
                return;
            }
            
            const result = gameLogic.revealCell(cellPos.row, cellPos.col);
            
            if (result.success) {
                canvasRenderer.render();
                updateUI();
                
                if (result.gameOver) {
                    handleGameOver(result.won);
                }
            }
        });
        
        // Right click (flag)
        canvas.addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Prevent browser context menu
            
            if (gameState.isEnded()) {
                return;
            }
            
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const cellPos = canvasRenderer.getCellFromCoordinates(x, y);
            if (!cellPos) {
                return;
            }
            
            const result = gameLogic.flagCell(cellPos.row, cellPos.col);
            
            if (result.success) {
                canvasRenderer.render();
                updateMineCounter();
            }
        });
        
        // Mouse move (hover)
        canvas.addEventListener('mousemove', function(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const cellPos = canvasRenderer.getCellFromCoordinates(x, y);
            
            if (cellPos) {
                canvasRenderer.setHoveredCell(cellPos.row, cellPos.col);
            } else {
                canvasRenderer.setHoveredCell(-1, -1);
            }
            
            canvasRenderer.render();
        });
        
        // Mouse leave (clear hover)
        canvas.addEventListener('mouseleave', function() {
            canvasRenderer.setHoveredCell(-1, -1);
            canvasRenderer.render();
        });
    }
    
    /**
     * Update UI elements
     */
    function updateUI() {
        updateMineCounter();
        updateTimer();
    }
    
    /**
     * Handle game over
     */
    function handleGameOver(won) {
        const statusDiv = $('#game-status');
        const messageDiv = $('.status-message');
        
        statusDiv.removeClass('hidden');
        
        if (won) {
            messageDiv.text('Congratulations! You won!');
            messageDiv.css('color', '#4CAF50');
        } else {
            messageDiv.text('Game Over! You hit a mine.');
            messageDiv.css('color', '#f44336');
            
            // Reveal all mines (optional visual feedback)
            gameLogic.revealAllMines();
            canvasRenderer.render();
        }
        
        // Final UI update
        updateUI();
    }
    
    /**
     * Update mine counter display
     */
    function updateMineCounter() {
        if (gameState) {
            $('#mine-counter').text(gameState.minesRemaining);
        }
    }
    
    /**
     * Update timer display
     */
    function updateTimer() {
        if (gameState) {
            $('#timer').text(gameState.getFormattedTime());
        }
    }
    
    // Timer update interval
    setInterval(function() {
        if (gameState && gameState.isPlaying()) {
            updateTimer();
        }
    }, Constants.TIMER_INTERVAL);
    
    // Initialize game
    initGame();
    
    // ... existing code ...
});
```

### Coordinate Conversion

Ensure coordinate conversion accounts for canvas scaling:

```javascript
// If using CSS transforms, need to account for scale
const rect = canvas.getBoundingClientRect();
const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;

const x = (event.clientX - rect.left) * scaleX;
const y = (event.clientY - rect.top) * scaleY;
```

### Testing Checklist (Integration)
- [ ] Left-click reveals cells
- [ ] Right-click flags cells
- [ ] Hover effect works during gameplay
- [ ] Game renders after each action
- [ ] UI updates (timer, mine counter)
- [ ] Win condition shows message
- [ ] Loss condition shows message
- [ ] New game resets rendering
- [ ] Difficulty change updates canvas size
- [ ] No performance issues

---

## Phase 3 Integration Testing

### Complete Game Flow Test

1. **Page Load**
   - [ ] Canvas renders empty board
   - [ ] All cells appear as hidden (raised)
   - [ ] UI shows correct mine count and timer

2. **First Click**
   - [ ] Click cell → cell reveals
   - [ ] If empty, cascade reveals
   - [ ] If numbered, shows number with color
   - [ ] Timer starts
   - [ ] Mines are placed (excluding clicked area)

3. **Gameplay**
   - [ ] Left-click reveals cells
   - [ ] Right-click flags cells
   - [ ] Hover effect shows on hidden cells
   - [ ] Numbers display correctly
   - [ ] Flag displays correctly
   - [ ] Timer increments
   - [ ] Mine counter updates

4. **Win**
   - [ ] Reveal last non-mine cell
   - [ ] Win message appears
   - [ ] Timer stops
   - [ ] No more actions possible

5. **Loss**
   - [ ] Click mine
   - [ ] Loss message appears
   - [ ] All mines revealed
   - [ ] Timer stops

6. **New Game**
   - [ ] Click new game button
   - [ ] Board resets visually
   - [ ] All cells hidden again
   - [ ] Timer resets
   - [ ] Mine counter resets

### Visual Quality Checks
- [ ] All cells align perfectly
- [ ] Numbers are readable
- [ ] Flags are clear
- [ ] 3D effect is convincing
- [ ] Colors are accurate
- [ ] No visual glitches
- [ ] Smooth rendering

### Performance Checks
- [ ] Rendering is smooth (no lag)
- [ ] Clicks are responsive
- [ ] Hover updates smoothly
- [ ] Works on expert difficulty (largest board)
- [ ] No memory leaks (repeated games)

---

## Known Limitations After Phase 3

These features are intentionally NOT implemented:
- ❌ Animations (smooth reveals, explosions)
- ❌ Sound effects
- ❌ Advanced visual effects
- ❌ Touch device support (mobile)
- ❌ Keyboard navigation
- ❌ Advanced UI polish

These will be added in Phase 4 and Phase 6.

---

## Success Criteria

Phase 3 is complete when:
- ✅ Canvas renders game board correctly
- ✅ All cell states are visually distinct
- ✅ Numbers display with correct colors
- ✅ Flags are visible and clear
- ✅ Click events work (left and right)
- ✅ Hover effects provide feedback
- ✅ Game is fully playable visually
- ✅ UI elements update correctly
- ✅ Canvas scales appropriately
- ✅ Performance is acceptable
- ✅ No visual glitches or errors

---

## Performance Optimization Notes

### Current Performance
- **Rendering**: O(n) where n = number of cells
- **Click Handling**: O(1) per click
- **Hover**: O(1) per mouse move + render

### Optimization Opportunities (if needed)
1. **Dirty Rectangle Rendering**: Only redraw changed cells
2. **Layer Caching**: Cache static elements
3. **RequestAnimationFrame**: For smoother animations
4. **Offscreen Canvas**: Pre-render static elements

**Recommendation**: Start with simple approach. Optimize only if performance issues arise.

---

## Debugging Helpers

### Visual Debugging

Add to CanvasRenderer:

```javascript
/**
 * Debug: Draw grid coordinates
 */
debugDrawCoordinates() {
    this.gameBoard.forEachCell((cell, row, col) => {
        const x = this.getCellX(col);
        const y = this.getCellY(row);
        const size = this.cellSize;
        
        this.ctx.fillStyle = '#000';
        this.ctx.font = '8px Arial';
        this.ctx.fillText(`${row},${col}`, x + 2, y + 10);
    });
}

/**
 * Debug: Highlight specific cell
 */
debugHighlightCell(row, col, color = 'rgba(255, 0, 0, 0.5)') {
    const x = this.getCellX(col);
    const y = this.getCellY(row);
    const size = this.cellSize;
    
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, size, size);
}
```

### Console Debugging

```javascript
// Expose for debugging
window.markSweeper = {
    gameBoard: () => gameBoard,
    gameState: () => gameState,
    gameLogic: () => gameLogic,
    canvasRenderer: () => canvasRenderer,
    // ... existing ...
};
```

---

## Next Steps (Phase 4 Preview)

After Phase 3 completion, Phase 4 will:
- Enhance UI elements (better styling)
- Add game status messages
- Improve timer and mine counter displays
- Add difficulty selector enhancements
- Polish overall user experience
- Add any missing UI features

Phase 3 provides the core visual experience that Phase 4 will polish.

