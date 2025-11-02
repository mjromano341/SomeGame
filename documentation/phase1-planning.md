# Phase 1: Foundation (Core Structure) - Detailed Planning

## Overview
Phase 1 establishes the foundation of MarkSweeper by creating the basic project structure, core data models, and essential configuration. This phase sets up the scaffolding that all subsequent phases will build upon.

## Goals
- Create a clean, maintainable project structure
- Define core data models (Cell, GameBoard, GameState)
- Establish configuration constants
- Set up basic HTML/CSS layout
- Ensure proper code organization and separation of concerns

## Deliverables
1. `index.html` - Main HTML structure
2. `css/styles.css` - Basic styling framework
3. `css/game.css` - Game-specific styles (prepared for future use)
4. `js/utils/Constants.js` - Game configuration and constants
5. `js/game/Cell.js` - Cell class implementation
6. `js/game/GameBoard.js` - GameBoard class with grid initialization
7. `js/game/GameState.js` - GameState class for state management
8. `js/main.js` - Entry point and initialization script

---

## Step 1: Set Up HTML Structure with Canvas Element

### Objective
Create a clean, semantic HTML structure that provides the foundation for the game interface.

### HTML Structure Design

#### Required Elements
- **Container div**: Main game container with proper semantic structure
- **Canvas element**: For rendering the game board
- **UI Controls area**: 
  - Timer display
  - Mine counter
  - New game button
  - Difficulty selector
- **Game status area**: For win/loss messages (initially hidden)

#### Semantic Considerations
- Use semantic HTML5 elements where appropriate
- Include proper meta tags for viewport, charset
- Add title and basic SEO meta tags
- Include jQuery from CDN (latest stable version)

#### Accessibility
- Proper heading hierarchy
- ARIA labels for interactive elements
- Canvas with descriptive fallback text

### Implementation Details

**File**: `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MarkSweeper - Minesweeper Clone</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/game.css">
</head>
<body>
    <div class="game-container">
        <header>
            <h1>MarkSweeper</h1>
        </header>
        
        <div class="game-controls">
            <div class="difficulty-selector">
                <label for="difficulty">Difficulty:</label>
                <select id="difficulty">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                </select>
            </div>
            
            <button id="new-game-btn" class="new-game-btn">New Game</button>
        </div>
        
        <div class="game-info">
            <div class="info-item">
                <span class="label">Mines:</span>
                <span id="mine-counter" class="value">10</span>
            </div>
            <div class="info-item">
                <span class="label">Time:</span>
                <span id="timer" class="value">000</span>
            </div>
        </div>
        
        <div class="canvas-container">
            <canvas id="game-canvas" width="270" height="270">
                Your browser does not support the HTML5 Canvas element.
                Please use a modern browser to play MarkSweeper.
            </canvas>
        </div>
        
        <div id="game-status" class="game-status hidden">
            <div class="status-message"></div>
            <button id="play-again-btn" class="play-again-btn">Play Again</button>
        </div>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="js/utils/Constants.js"></script>
    <script src="js/game/Cell.js"></script>
    <script src="js/game/GameState.js"></script>
    <script src="js/game/GameBoard.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

### Canvas Specifications
- **Initial size**: Will be calculated dynamically based on difficulty
- **ID**: `game-canvas` for easy jQuery/vanilla JS access
- **Fallback text**: Descriptive message for accessibility

### Decisions to Make
- [ ] Canvas initial dimensions (will be set dynamically, but need default)
- [ ] Container max-width for responsive design
- [ ] Whether to use semantic HTML5 tags or divs

### Testing Checklist
- [ ] HTML validates (W3C validator)
- [ ] Canvas element renders
- [ ] All script tags are properly ordered (dependencies first)
- [ ] jQuery loads correctly
- [ ] Structure is accessible (screen reader test)

---

## Step 2: Create Basic CSS Layout

### Objective
Establish a clean, modern visual foundation that supports the game interface and provides good UX.

### CSS Architecture
- **styles.css**: Global styles, layout, typography, reset/normalize
- **game.css**: Game-specific styles (canvas styling, game board, UI controls)

### Design Principles
- Modern, clean aesthetic
- Good contrast ratios for accessibility
- Responsive design considerations
- Professional appearance

### Implementation Details

**File**: `css/styles.css`

#### Core Styles Needed
1. **Reset/Normalize**: Consistent baseline across browsers
2. **Typography**: Font choices, sizing hierarchy
3. **Layout**: Container, flexbox/grid for structure
4. **Color Scheme**: Base colors defined
5. **Spacing**: Consistent margins, padding
6. **Button Styles**: Base button styling

```css
/* Reset and Base Styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.game-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: 24px;
    max-width: 600px;
    width: 100%;
}

header {
    text-align: center;
    margin-bottom: 20px;
}

h1 {
    color: #333;
    font-size: 2.5em;
    font-weight: 700;
    letter-spacing: 2px;
}

/* Game Controls */
.game-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
}

.difficulty-selector label {
    margin-right: 8px;
    font-weight: 500;
    color: #555;
}

#difficulty {
    padding: 8px 12px;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    cursor: pointer;
}

.new-game-btn {
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
}

.new-game-btn:hover {
    background: #45a049;
}

.new-game-btn:active {
    transform: scale(0.98);
}

/* Game Info */
.game-info {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;
}

.info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.info-item .label {
    font-size: 12px;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
}

.info-item .value {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    font-family: 'Courier New', monospace;
}

/* Canvas Container */
.canvas-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

#game-canvas {
    border: 2px solid #333;
    border-radius: 4px;
    display: block;
    background: #c0c0c0;
    cursor: pointer;
}

/* Game Status Overlay */
.game-status {
    text-align: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    margin-top: 20px;
}

.game-status.hidden {
    display: none;
}

.status-message {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 15px;
}

.play-again-btn {
    padding: 12px 24px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
}

/* Utility Classes */
.hidden {
    display: none !important;
}
```

**File**: `css/game.css`
*(Reserved for game-specific styles that will be added in later phases)*

```css
/* Game-specific styles */
/* Will be populated in Phase 3 (Rendering) */
```

### Design Decisions
- [ ] Color scheme (chosen: modern gradient background, clean white container)
- [ ] Font choices (chosen: system fonts for performance)
- [ ] Border radius and spacing values
- [ ] Responsive breakpoints (if needed)

### Testing Checklist
- [ ] Layout renders correctly in major browsers
- [ ] Responsive on different screen sizes
- [ ] Colors meet WCAG contrast requirements
- [ ] Buttons are properly styled and interactive
- [ ] Canvas container centers properly
- [ ] CSS validates

---

## Step 3: Implement Constants.js with Difficulty Presets

### Objective
Create a centralized configuration file that defines all game constants, difficulty levels, and configuration values.

### Constants to Define

1. **Difficulty Presets**
   - Beginner: 9x9 grid, 10 mines
   - Intermediate: 16x16 grid, 40 mines
   - Expert: 30x16 grid, 99 mines

2. **Visual Constants**
   - Cell size (in pixels)
   - Colors for numbers
   - Colors for cells (hidden, revealed, flagged)

3. **Game Rules Constants**
   - Default difficulty
   - Timer format

### Implementation Details

**File**: `js/utils/Constants.js`

```javascript
/**
 * Constants.js
 * Centralized configuration for MarkSweeper game
 */

const Constants = {
    // Difficulty Presets
    DIFFICULTIES: {
        beginner: {
            rows: 9,
            cols: 9,
            mines: 10,
            name: 'Beginner',
            label: 'beginner'
        },
        intermediate: {
            rows: 16,
            cols: 16,
            mines: 40,
            name: 'Intermediate',
            label: 'intermediate'
        },
        expert: {
            rows: 16,
            cols: 30,
            mines: 99,
            name: 'Expert',
            label: 'expert'
        }
    },

    // Default difficulty
    DEFAULT_DIFFICULTY: 'beginner',

    // Cell dimensions (pixels)
    CELL_SIZE: 30,
    CELL_PADDING: 2,

    // Colors
    COLORS: {
        // Cell states
        HIDDEN_CELL: '#c0c0c0',
        REVEALED_CELL: '#e0e0e0',
        FLAGGED_CELL: '#ffcccc',
        MINE_CELL: '#000000',
        
        // Numbers (traditional Minesweeper colors)
        NUMBER_COLORS: {
            1: '#0000ff',  // Blue
            2: '#008000',  // Green
            3: '#ff0000',  // Red
            4: '#000080',  // Dark Blue
            5: '#800000',  // Dark Red
            6: '#008080',  // Teal
            7: '#000000',  // Black
            8: '#808080'   // Gray
        },
        
        // UI Colors
        BACKGROUND: '#ffffff',
        BORDER: '#333333',
        TEXT_PRIMARY: '#333333',
        TEXT_SECONDARY: '#777777'
    },

    // Game States
    GAME_STATES: {
        READY: 'READY',
        PLAYING: 'PLAYING',
        WON: 'WON',
        LOST: 'LOST'
    },

    // Timer settings
    TIMER_INTERVAL: 1000, // milliseconds
    TIMER_FORMAT: '000',  // 3-digit format with leading zeros

    // Canvas settings
    CANVAS_BORDER: 2,

    // Helper function to get difficulty config
    getDifficultyConfig: function(difficulty) {
        return this.DIFFICULTIES[difficulty] || this.DIFFICULTIES[this.DEFAULT_DIFFICULTY];
    },

    // Helper function to calculate canvas dimensions
    getCanvasDimensions: function(difficulty) {
        const config = this.getDifficultyConfig(difficulty);
        const width = config.cols * this.CELL_SIZE + (this.CANVAS_BORDER * 2);
        const height = config.rows * this.CELL_SIZE + (this.CANVAS_BORDER * 2);
        return { width, height, rows: config.rows, cols: config.cols };
    }
};

// Export for use in other modules (in browser, this will be global)
if (typeof window !== 'undefined') {
    window.Constants = Constants;
}
```

### Design Decisions
- [ ] Cell size (chosen: 30px - good balance of visibility and compactness)
- [ ] Number color scheme (chosen: traditional Minesweeper colors)
- [ ] Whether to use helper functions or keep pure constants
- [ ] How to expose constants (global vs module system)

### Testing Checklist
- [ ] Constants object is properly defined
- [ ] Difficulty configs are accessible
- [ ] Helper functions work correctly
- [ ] Canvas dimensions calculate correctly for all difficulties
- [ ] Constants are accessible from other scripts (if global)

---

## Step 4: Create Cell.js Class

### Objective
Implement the Cell class that represents a single cell in the minesweeper grid. This is a fundamental data model.

### Cell Properties

#### Required Properties
- `isMine`: Boolean - whether this cell contains a mine
- `isRevealed`: Boolean - whether this cell has been revealed
- `isFlagged`: Boolean - whether this cell has been flagged
- `adjacentMines`: Number - count of adjacent mines (0-8)

#### Optional Properties (for future use)
- `row`: Number - row index
- `col`: Number - column index

### Cell Methods

#### Required Methods
- `reveal()`: Mark cell as revealed
- `flag()`: Toggle flag status
- `reset()`: Reset cell to initial state

#### Optional Helper Methods
- `isHidden()`: Check if cell is hidden (not revealed and not flagged)
- `canReveal()`: Check if cell can be revealed (not flagged, not already revealed)
- `toString()`: Debug representation

### Implementation Details

**File**: `js/game/Cell.js`

```javascript
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
```

### Design Decisions
- [ ] Whether to store row/col in Cell (chosen: yes for debugging)
- [ ] Whether to validate adjacentMines in setter (chosen: yes)
- [ ] Whether to return boolean from reveal/flag methods (chosen: yes for feedback)
- [ ] Class vs function constructor pattern (chosen: ES6 class)

### Testing Considerations
Test cases to verify:
- [ ] New cell initializes with correct default values
- [ ] reveal() works on hidden cell
- [ ] reveal() returns false if already revealed
- [ ] reveal() returns false if flagged
- [ ] flag() toggles correctly
- [ ] flag() returns false if cell is revealed
- [ ] setAdjacentMines() validates range
- [ ] reset() clears all state
- [ ] isHidden() and canReveal() work correctly

### Testing Checklist
- [ ] Cell class can be instantiated
- [ ] All methods work as expected
- [ ] Edge cases handled (flagging revealed cells, etc.)
- [ ] toString() provides useful debug info

---

## Step 5: Create GameBoard.js with Basic Grid Initialization

### Objective
Implement the GameBoard class that manages the grid of cells, handles board initialization, and provides access to cells.

### GameBoard Responsibilities

#### Core Responsibilities
- Maintain 2D array of Cell objects
- Initialize empty grid
- Provide cell access methods
- Track board dimensions
- (Future: Mine placement, adjacent counting - but NOT in Phase 1)

#### Methods Needed
- Constructor with difficulty parameter
- `getCell(row, col)`: Get cell at position
- `getRows()`: Get number of rows
- `getCols()`: Get number of columns
- `reset()`: Reset entire board
- `forEachCell(callback)`: Iterator for all cells

### Implementation Details

**File**: `js/game/GameBoard.js`

```javascript
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
```

### Design Decisions
- [ ] Grid representation (chosen: 2D array)
- [ ] Whether to store difficulty or just dimensions (chosen: store difficulty for future use)
- [ ] Whether to validate positions in getCell (chosen: yes, return null)
- [ ] Whether to include getAdjacentCells now or later (chosen: include now - useful utility)
- [ ] Whether to include iterator method (chosen: yes - useful pattern)

### Testing Considerations
- [ ] Board initializes with correct dimensions for each difficulty
- [ ] getCell() returns correct cell
- [ ] getCell() returns null for out-of-bounds
- [ ] isValidPosition() works correctly
- [ ] getAdjacentCells() returns correct cells (8 for center, fewer for edges)
- [ ] forEachCell() iterates all cells
- [ ] reset() clears board
- [ ] changeDifficulty() resizes correctly

### Testing Checklist
- [ ] GameBoard can be instantiated with each difficulty
- [ ] Grid dimensions match difficulty config
- [ ] All cells are Cell instances
- [ ] Cell access methods work correctly
- [ ] Boundary checking works
- [ ] Adjacent cell calculation works for various positions

---

## Step 6: Create GameState.js for State Management

### Objective
Implement the GameState class that manages the overall game state, timer, and game status.

### GameState Responsibilities

#### Core Responsibilities
- Track current game state (READY, PLAYING, WON, LOST)
- Manage timer
- Track mine counter (remaining flags)
- Provide state transition methods

#### Properties
- `state`: Current game state
- `timer`: Current time in seconds
- `timerInterval`: Reference to timer interval
- `minesRemaining`: Number of unflagged mines
- `totalMines`: Total mines for current difficulty
- `firstClick`: Whether first click has occurred

#### Methods Needed
- `start()`: Start the game (transition to PLAYING)
- `pause()`: Pause timer (for future use)
- `reset()`: Reset game state
- `win()`: Transition to WON state
- `lose()`: Transition to LOST state
- `decrementMines()`: Decrease mine counter (flag placed)
- `incrementMines()`: Increase mine counter (flag removed)
- `getFormattedTime()`: Get formatted time string

### Implementation Details

**File**: `js/game/GameState.js`

```javascript
/**
 * GameState.js
 * Manages game state, timer, and game status
 */

class GameState {
    /**
     * Create a new GameState
     * @param {number} totalMines - Total number of mines for current difficulty
     */
    constructor(totalMines) {
        this.totalMines = totalMines;
        this.minesRemaining = totalMines;
        this.state = Constants.GAME_STATES.READY;
        this.timer = 0;
        this.timerInterval = null;
        this.firstClick = false;
        this.startTime = null;
    }

    /**
     * Start the game (called on first click)
     */
    start() {
        if (this.state !== Constants.GAME_STATES.READY) {
            return; // Can only start from READY state
        }
        
        this.state = Constants.GAME_STATES.PLAYING;
        this.firstClick = true;
        this.startTime = Date.now();
        this.startTimer();
    }

    /**
     * Start the timer
     * @private
     */
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (this.state === Constants.GAME_STATES.PLAYING) {
                this.timer++;
                this.notifyTimerUpdate();
            }
        }, Constants.TIMER_INTERVAL);
    }

    /**
     * Stop the timer
     * @private
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Win the game
     */
    win() {
        if (this.state !== Constants.GAME_STATES.PLAYING) {
            return;
        }
        this.state = Constants.GAME_STATES.WON;
        this.stopTimer();
        this.notifyGameEnd();
    }

    /**
     * Lose the game
     */
    lose() {
        if (this.state !== Constants.GAME_STATES.PLAYING) {
            return;
        }
        this.state = Constants.GAME_STATES.LOST;
        this.stopTimer();
        this.notifyGameEnd();
    }

    /**
     * Reset game state
     * @param {number} totalMines - Total mines for new game (optional, uses current if not provided)
     */
    reset(totalMines = null) {
        this.stopTimer();
        this.state = Constants.GAME_STATES.READY;
        this.timer = 0;
        this.firstClick = false;
        this.startTime = null;
        
        if (totalMines !== null) {
            this.totalMines = totalMines;
            this.minesRemaining = totalMines;
        } else {
            this.minesRemaining = this.totalMines;
        }
        
        this.notifyTimerUpdate();
        this.notifyMineCounterUpdate();
    }

    /**
     * Decrement mine counter (flag placed)
     */
    decrementMines() {
        if (this.minesRemaining > 0) {
            this.minesRemaining--;
            this.notifyMineCounterUpdate();
        }
    }

    /**
     * Increment mine counter (flag removed)
     */
    incrementMines() {
        if (this.minesRemaining < this.totalMines) {
            this.minesRemaining++;
            this.notifyMineCounterUpdate();
        }
    }

    /**
     * Get formatted time string (3 digits with leading zeros)
     * @returns {string}
     */
    getFormattedTime() {
        return String(this.timer).padStart(3, '0');
    }

    /**
     * Get current game state
     * @returns {string}
     */
    getState() {
        return this.state;
    }

    /**
     * Check if game is in playing state
     * @returns {boolean}
     */
    isPlaying() {
        return this.state === Constants.GAME_STATES.PLAYING;
    }

    /**
     * Check if game is ready to start
     * @returns {boolean}
     */
    isReady() {
        return this.state === Constants.GAME_STATES.READY;
    }

    /**
     * Check if game has ended (won or lost)
     * @returns {boolean}
     */
    isEnded() {
        return this.state === Constants.GAME_STATES.WON || 
               this.state === Constants.GAME_STATES.LOST;
    }

    /**
     * Notify that timer has updated (to be implemented with event system or callback)
     * @private
     */
    notifyTimerUpdate() {
        // TODO: Implement event system or callback in Phase 2
        // For now, this is a placeholder
    }

    /**
     * Notify that mine counter has updated
     * @private
     */
    notifyMineCounterUpdate() {
        // TODO: Implement event system or callback in Phase 2
        // For now, this is a placeholder
    }

    /**
     * Notify that game has ended
     * @private
     */
    notifyGameEnd() {
        // TODO: Implement event system or callback in Phase 2
        // For now, this is a placeholder
    }
}
```

### Design Decisions
- [ ] Whether to use events or callbacks for notifications (deferred to Phase 2)
- [ ] Whether to calculate timer or use intervals (chosen: interval for simplicity)
- [ ] Whether to track firstClick in GameState or GameLogic (chosen: GameState - it's state)
- [ ] Timer max value consideration (no max for now)
- [ ] Whether to pause/resume (not needed for Minesweeper, but included for extensibility)

### Testing Considerations
- [ ] State transitions work correctly (READY → PLAYING → WON/LOST)
- [ ] Timer starts on start()
- [ ] Timer stops on win/lose
- [ ] Timer increments correctly
- [ ] Mine counter decrements/increments correctly
- [ ] reset() clears all state
- [ ] State cannot transition incorrectly (e.g., WON → PLAYING)

### Testing Checklist
- [ ] GameState initializes with correct values
- [ ] start() transitions from READY to PLAYING
- [ ] Timer increments while playing
- [ ] win() stops timer and transitions to WON
- [ ] lose() stops timer and transitions to LOST
- [ ] reset() returns to READY state
- [ ] Mine counter methods work correctly
- [ ] getFormattedTime() formats correctly

---

## Step 7: Create main.js Entry Point

### Objective
Create the main initialization script that ties everything together and sets up the basic structure for Phase 2.

### main.js Responsibilities

#### Initial Responsibilities (Phase 1)
- Initialize game components when DOM is ready
- Set up basic structure
- Connect difficulty selector to GameBoard
- Prepare for Phase 2 integration

#### Structure
- DOM ready handler
- Component initialization
- Basic event listeners (new game button, difficulty selector)
- Canvas setup (size calculation)

### Implementation Details

**File**: `js/main.js`

```javascript
/**
 * main.js
 * Entry point and initialization for MarkSweeper
 */

$(document).ready(function() {
    // Initialize game components
    let gameBoard = null;
    let gameState = null;
    let canvas = null;
    let ctx = null;
    
    /**
     * Initialize the game
     */
    function initGame() {
        // Get current difficulty
        const difficulty = $('#difficulty').val();
        
        // Get canvas element
        canvas = document.getElementById('game-canvas');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        ctx = canvas.getContext('2d');
        
        // Calculate canvas dimensions based on difficulty
        const dimensions = Constants.getCanvasDimensions(difficulty);
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        
        // Initialize game board
        gameBoard = new GameBoard(difficulty);
        
        // Initialize game state
        const config = Constants.getDifficultyConfig(difficulty);
        gameState = new GameState(config.mines);
        
        // Update UI
        updateMineCounter();
        updateTimer();
        
        // Log for debugging
        console.log('Game initialized:', {
            difficulty,
            rows: gameBoard.getRows(),
            cols: gameBoard.getCols(),
            mines: config.mines
        });
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
    
    /**
     * Handle new game button click
     */
    $('#new-game-btn').on('click', function() {
        initGame();
    });
    
    /**
     * Handle difficulty change
     */
    $('#difficulty').on('change', function() {
        initGame();
    });
    
    // Initialize game on page load
    initGame();
    
    // Expose for debugging (remove in production)
    window.markSweeper = {
        gameBoard: () => gameBoard,
        gameState: () => gameState,
        canvas: () => canvas,
        ctx: () => ctx
    };
});
```

### Design Decisions
- [ ] Whether to expose debug objects (chosen: yes for development)
- [ ] How to structure initialization (chosen: single initGame function)
- [ ] Whether to use jQuery or vanilla JS (chosen: jQuery as allowed)
- [ ] Whether to set up canvas event handlers now (deferred to Phase 2)

### Testing Checklist
- [ ] Game initializes on page load
- [ ] Canvas dimensions are correct for each difficulty
- [ ] GameBoard is created with correct dimensions
- [ ] GameState is created with correct mine count
- [ ] New game button resets game
- [ ] Difficulty change resets game
- [ ] Mine counter displays correctly
- [ ] Timer displays correctly (000 initially)
- [ ] No console errors

---

## Phase 1 Integration Testing

### End-to-End Testing

After completing all steps, verify:

1. **Page Load**
   - [ ] Page loads without errors
   - [ ] All scripts load in correct order
   - [ ] Canvas is visible and correctly sized
   - [ ] UI elements display correctly

2. **Component Integration**
   - [ ] GameBoard initializes with correct dimensions
   - [ ] GameState initializes with correct mine count
   - [ ] Canvas matches board dimensions
   - [ ] All cells are Cell instances

3. **Interaction**
   - [ ] Difficulty selector changes board size
   - [ ] New game button resets everything
   - [ ] No errors in console

4. **Code Quality**
   - [ ] No global variable pollution (except Constants, classes)
   - [ ] Code is readable and well-commented
   - [ ] Consistent naming conventions

---

## Dependencies & Prerequisites

### External Dependencies
- jQuery 3.x (loaded from CDN)
- Modern browser with Canvas support

### Internal Dependencies (Order Matters)
1. Constants.js (no dependencies)
2. Cell.js (no dependencies)
3. GameState.js (depends on Constants.js)
4. GameBoard.js (depends on Constants.js, Cell.js)
5. main.js (depends on all above)

### Browser Requirements
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- ES6 class support required

---

## Known Limitations After Phase 1

These features are intentionally NOT implemented in Phase 1:
- ❌ Mine placement
- ❌ Adjacent mine counting
- ❌ Cell clicking/revealing
- ❌ Flagging
- ❌ Win/loss detection
- ❌ Canvas rendering
- ❌ Timer functionality (structure only)
- ❌ Game logic

These will be added in Phase 2 and beyond.

---

## Success Criteria

Phase 1 is complete when:
- ✅ All files are created and properly structured
- ✅ No JavaScript errors on page load
- ✅ GameBoard initializes with correct grid for all difficulties
- ✅ GameState initializes with correct values
- ✅ Canvas is sized correctly
- ✅ Basic UI elements are functional (new game, difficulty selector)
- ✅ Code follows separation of concerns
- ✅ All components are testable in isolation

---

## Notes & Considerations

1. **Global Namespace**: Currently using global window object for classes. This is acceptable for vanilla JS approach.

2. **Error Handling**: Basic error handling is in place (null returns, validation), but comprehensive error handling will be added in later phases.

3. **Performance**: Phase 1 components are lightweight. Performance optimization will be considered in Phase 3 (Rendering).

4. **Testing**: Manual testing is expected in Phase 1. Automated testing framework could be added later if needed.

5. **Documentation**: Code is well-commented. Additional documentation can be added if needed.

---

## Next Steps (Phase 2 Preview)

After Phase 1 completion, Phase 2 will:
- Implement mine placement logic
- Calculate adjacent mine counts
- Implement reveal logic
- Add flag/unflag functionality
- Implement win/loss detection

All Phase 1 components will be used by Phase 2 components.

