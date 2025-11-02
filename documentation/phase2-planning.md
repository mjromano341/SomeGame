# Phase 2: Game Logic - Detailed Planning

## Overview
Phase 2 implements the core game logic that makes MarkSweeper playable. This phase adds mine placement, cell revealing, flagging, and win/loss detection. All the foundational components from Phase 1 will be utilized, and the game will become fully functional (though not yet visually rendered).

## Goals
- Implement intelligent mine placement with first-click safety
- Calculate adjacent mine counts for all cells
- Create reveal logic with cascade behavior for empty cells
- Add flag/unflag functionality
- Implement win and loss detection
- Ensure robust game flow and state transitions

## Deliverables
1. Enhanced `js/game/GameBoard.js` - Mine placement and adjacent counting methods
2. `js/game/GameLogic.js` - Core game logic controller
3. Enhanced `js/game/GameState.js` - Integration with game logic
4. Enhanced `js/main.js` - Connect game logic to UI events

---

## Step 1: Implement Mine Placement (Random, First-Click Safe)

### Objective
Add methods to GameBoard that can place mines randomly across the board, ensuring the first clicked cell is never a mine.

### Requirements

#### Mine Placement Algorithm
1. **Random Distribution**: Place specified number of mines randomly across board
2. **First-Click Safety**: Ensure first clicked cell and its neighbors are mine-free
3. **Validation**: Verify correct number of mines placed
4. **Reset Capability**: Clear all mines for new game

### Implementation Strategy

#### Approach
- Generate all valid positions (excluding first-click area)
- Randomly shuffle these positions
- Place mines at first N positions (where N = mine count)
- If first click hasn't occurred yet, place mines excluding a safety zone

#### First-Click Safety Algorithm
```
1. User clicks cell at (firstRow, firstCol)
2. Create "safety zone" - all cells adjacent to first click (including first click itself)
3. Generate list of all valid positions EXCLUDING safety zone
4. Randomly select mineCount positions from valid list
5. Place mines at selected positions
```

### Implementation Details

**File**: `js/game/GameBoard.js` (additions)

Add these methods to the GameBoard class:

```javascript
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
```

### Design Decisions
- [ ] Whether to place mines immediately or on first click (chosen: on first click for safety)
- [ ] Safety zone size (chosen: 3x3 around first click - standard Minesweeper)
- [ ] Shuffle algorithm (chosen: Fisher-Yates for true randomness)
- [ ] Whether to validate mine count vs board size (chosen: yes, with warning)

### Edge Cases to Handle
- Board too small for requested mines (reduce mine count)
- All cells would be in safety zone (shouldn't happen with standard difficulties)
- Multiple calls to placeMines (clear first)
- Mines already placed when resetting

### Testing Checklist
- [ ] Mines are placed randomly (multiple games verify randomness)
- [ ] Correct number of mines placed
- [ ] First-click safety: first clicked cell is never a mine
- [ ] First-click safety: neighbors of first click are never mines
- [ ] clearMines() removes all mines
- [ ] hasMinesPlaced() correctly reports mine status
- [ ] Edge case: board with 1 cell (handled gracefully)
- [ ] Edge case: more mines than valid positions (reduces appropriately)

### Test Cases
```javascript
// Test 1: Basic mine placement
board.placeMines();
assert(board.getCurrentMineCount() === board.mineCount);

// Test 2: First-click safety
board.placeMines(4, 4); // Exclude center cell
const cell = board.getCell(4, 4);
assert(!cell.isMine);
const adjacent = board.getAdjacentCells(4, 4);
adjacent.forEach(cell => assert(!cell.isMine));

// Test 3: Clear mines
board.placeMines();
board.clearMines();
assert(board.getCurrentMineCount() === 0);
```

---

## Step 2: Implement Adjacent Mine Counting

### Objective
Calculate and store the number of adjacent mines for each cell on the board. This must happen after mines are placed.

### Requirements

#### Counting Algorithm
1. For each cell, count mines in 8 adjacent cells
2. Store count in Cell.adjacentMines property
3. Handle edge/corner cells correctly (fewer than 8 neighbors)
4. Recalculate when mines change

### Implementation Details

**File**: `js/game/GameBoard.js` (additions)

Add these methods:

```javascript
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
```

### Integration with Mine Placement

Update `placeMines()` to automatically calculate adjacent counts:

```javascript
placeMines(excludeRow = -1, excludeCol = -1) {
    // ... existing mine placement code ...
    
    // After placing mines, calculate adjacent counts
    this.calculateAdjacentMines();
    
    return minesToPlace;
}
```

### Design Decisions
- [ ] When to calculate (chosen: after mine placement, automatically)
- [ ] Whether to recalculate all cells or just affected ones (chosen: all cells for simplicity, performance is fine)
- [ ] Whether to store in Cell or calculate on-demand (chosen: store in Cell for performance)
- [ ] Whether to provide method to recalculate single cell (chosen: yes, for future flexibility)

### Edge Cases to Handle
- Cell with no adjacent cells (edge case - handled by getAdjacentCells)
- All 8 neighbors are mines (returns 8)
- No neighbors have mines (returns 0)
- Mines placed after calculation (recalculate needed)

### Testing Checklist
- [ ] All cells have correct adjacent mine count
- [ ] Corner cells count correctly (3 neighbors)
- [ ] Edge cells count correctly (5 neighbors)
- [ ] Center cells count correctly (8 neighbors)
- [ ] Cells with 0 adjacent mines work correctly
- [ ] Cells with 8 adjacent mines work correctly
- [ ] Recalculation works after mine changes

### Test Cases
```javascript
// Test 1: Cell with no adjacent mines
// Place mines far from a cell, verify count is 0
board.placeMines();
const cell = board.getCell(0, 0);
assert(cell.adjacentMines >= 0 && cell.adjacentMines <= 8);

// Test 2: Manual placement and count
const testCell = board.getCell(5, 5);
// Manually set adjacent cells as mines
board.getCell(4, 4).setMine();
board.getCell(4, 5).setMine();
board.getCell(5, 4).setMine();
board.calculateAdjacentMines();
assert(testCell.adjacentMines === 3);
```

---

## Step 3: Create GameLogic.js with Reveal Logic

### Objective
Create the GameLogic class that orchestrates game actions: revealing cells, checking win/loss, and coordinating between GameBoard and GameState.

### Responsibilities

#### Core Responsibilities
- Handle left-click (reveal cell)
- Coordinate mine placement on first click
- Check for win/loss conditions
- Update game state appropriately
- Provide interface for UI interactions

#### Methods Needed
- `revealCell(row, col)`: Reveal a cell (main game action)
- `flagCell(row, col)`: Toggle flag on a cell
- `isFirstClick()`: Check if this is the first click
- `checkWinCondition()`: Check if game is won
- `checkLossCondition(cell)`: Check if cell reveal causes loss

### Implementation Details

**File**: `js/game/GameLogic.js`

```javascript
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
}
```

### Algorithm: Cascade Reveal (Flood Fill)

The cascade reveal uses a **breadth-first search (BFS)** approach:

1. Start with initial empty cell (adjacentMines === 0)
2. Add cell to queue and reveal it
3. For each cell in queue:
   - If cell has adjacent mines > 0: stop cascading (reveal only this cell)
   - If cell has adjacent mines === 0: reveal it and add all neighbors to queue
4. Continue until queue is empty or all reachable empty cells are revealed

**Why BFS?** Ensures we reveal in layers, which is visually pleasing and efficient.

### Design Decisions
- [ ] Reveal algorithm: BFS vs DFS (chosen: BFS for layer-by-layer reveal)
- [ ] Whether to reveal neighbors of numbered cells (chosen: no, only empty cells cascade)
- [ ] Return value structure (chosen: object with success flags for flexibility)
- [ ] When to check win condition (chosen: after each reveal)
- [ ] Whether to allow flagging during game over (chosen: no)

### Edge Cases to Handle
- First click on already revealed cell (shouldn't happen, but validate)
- Clicking flagged cell (prevent reveal)
- Cascading from edge cells (handled by getAdjacentCells)
- Cascading with mines nearby (stop at numbered cells)
- Win condition checked correctly (all non-mines revealed)

### Testing Checklist
- [ ] First click places mines safely
- [ ] First click starts timer
- [ ] Revealing mine ends game
- [ ] Revealing numbered cell works (no cascade)
- [ ] Revealing empty cell triggers cascade
- [ ] Cascade stops at numbered cells
- [ ] Cascade reveals all connected empty cells
- [ ] Flagging prevents reveal
- [ ] Can't flag revealed cells
- [ ] Mine counter updates on flag/unflag
- [ ] Win condition detected correctly
- [ ] Can't reveal after game over

### Test Cases
```javascript
// Test 1: First click safety
logic.revealCell(5, 5);
const firstCell = board.getCell(5, 5);
assert(!firstCell.isMine);
assert(board.hasMinesPlaced());

// Test 2: Cascade reveal
// Set up board with empty area
// Verify all connected empty cells are revealed

// Test 3: Win condition
// Reveal all non-mine cells
// Verify win is detected
```

---

## Step 4: Implement Reveal Cascade (Flood Fill for Empty Cells)

### Objective
Ensure the cascade reveal algorithm works correctly for all scenarios. This is primarily covered in Step 3, but requires thorough testing and edge case handling.

### Algorithm Deep Dive

#### Flood Fill Implementation Details

**Queue-Based BFS Approach** (implemented in Step 3):
```javascript
1. Initialize queue with starting position
2. Initialize visited set
3. While queue not empty:
   a. Dequeue position
   b. If visited, skip
   c. Mark visited
   d. If cell valid and revealable:
      - Reveal cell
      - If cell.adjacentMines === 0:
        - Add all neighbors to queue
      - Else:
        - Stop (don't cascade through numbered cells)
4. Return all revealed cells
```

#### Key Characteristics
- **Stops at numbered cells**: Cells with adjacentMines > 0 don't cascade
- **Reveals in layers**: BFS ensures visual layer-by-layer reveal
- **Handles all edge cases**: Corners, edges, isolated empty areas

### Edge Case Scenarios

#### Scenario 1: Isolated Empty Area
```
[M][1][ ][ ][2][M]
[1][1][ ][ ][2][M]
[ ][ ][ ][ ][1][1]
```
Clicking any empty cell should reveal all connected empty cells.

#### Scenario 2: Multiple Empty Areas
```
[ ][1][M][1][ ]
[1][2][M][2][1]
[M][2][1][2][M]
```
Empty areas separated by numbered cells should be independent.

#### Scenario 3: Corner Empty Cell
```
[ ][1][M]
[1][2][M]
[M][M][M]
```
Corner cell with only 3 neighbors should cascade correctly.

### Performance Considerations
- **Visited Set**: Use Set for O(1) lookup (important for large boards)
- **Queue Management**: Array.shift() is O(n), but for typical boards (< 500 cells), acceptable
- **For very large boards**: Consider using proper queue implementation

### Testing Strategy for Cascade

#### Test Pattern 1: Single Empty Cell
```
[1][1][1]
[1][ ][1]
[1][1][1]
```
Clicking center should reveal only that cell.

#### Test Pattern 2: Large Empty Area
```
[ ][ ][ ][ ]
[ ][ ][ ][ ]
[ ][ ][ ][ ]
[1][1][1][1]
```
Clicking any empty cell should reveal all 12 empty cells.

#### Test Pattern 3: Branching Paths
```
[ ][ ][1][M]
[ ][ ][2][M]
[ ][1][3][M]
```
Clicking top-left should reveal 4 cells (the left branch).

### Testing Checklist (Cascade Specific)
- [ ] Single empty cell reveals only itself
- [ ] Large empty area reveals all connected cells
- [ ] Cascade stops at numbered cells
- [ ] Multiple isolated areas work independently
- [ ] Edge cells cascade correctly
- [ ] Corner cells cascade correctly
- [ ] Cascade doesn't reveal mines
- [ ] Cascade doesn't reveal flagged cells
- [ ] Cascade doesn't re-reveal already revealed cells
- [ ] Performance: Large boards (expert) cascade quickly

---

## Step 5: Add Flag/Unflag Functionality

### Objective
Complete the flag/unflag functionality in GameLogic. This was started in Step 3, but needs UI integration and additional features.

### Current Implementation
Flag/unflag is already implemented in `GameLogic.flagCell()`. This step focuses on:
1. Ensuring it works correctly
2. Adding any missing features
3. Preparing for UI integration

### Additional Considerations

#### Right-Click Handling
- Prevent browser context menu on canvas
- Map right-click to flag action
- Handle touch devices (long press)

#### Flag Validation
- Can't flag revealed cells
- Can't flag during game over (optional - some games allow it)
- Mine counter updates correctly

### Enhanced Flag Logic

**File**: `js/game/GameLogic.js` (already implemented, verify):

```javascript
flagCell(row, col) {
    // Implementation from Step 3 is complete
    // Verify:
    // - Position validation
    // - Game state checking
    // - Cell state checking
    // - Mine counter updates
    // - Return value provides feedback
}
```

### Flag Count Validation

Optional enhancement: Validate that flag count doesn't exceed mine count visually (though functionally it can for user convenience).

### Testing Checklist (Flag Specific)
- [ ] Right-click flags cell
- [ ] Right-click on flagged cell unf lags it
- [ ] Can't flag revealed cells
- [ ] Can't flag after game over (if implemented)
- [ ] Mine counter decrements on flag
- [ ] Mine counter increments on unflag
- [ ] Mine counter can go negative (user convenience)
- [ ] Flagged cells can't be revealed
- [ ] Flag persists through cascade (flagged cells not affected)

---

## Step 6: Implement Win/Loss Detection

### Objective
Ensure win and loss conditions are correctly detected and game state transitions appropriately.

### Win Condition

**Definition**: All non-mine cells are revealed.

**Implementation** (already in GameLogic.checkWinCondition()):
```javascript
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
```

**When to Check**:
- After each cell reveal
- After cascade reveal completes
- Before checking loss condition

### Loss Condition

**Definition**: A mine cell is revealed.

**Implementation** (handled in revealCell):
```javascript
if (cell.isMine) {
    this.gameState.lose();
    return { won: false, lost: true, gameOver: true };
}
```

### Game State Transitions

#### Valid Transitions
1. READY → PLAYING (first click)
2. PLAYING → WON (all non-mines revealed)
3. PLAYING → LOST (mine revealed)
4. Any → READY (new game)

#### Invalid Transitions (should be prevented)
- WON → PLAYING (without reset)
- LOST → PLAYING (without reset)
- READY → WON (impossible)
- READY → LOST (impossible)

### Win/Loss Handling

#### On Win
- Stop timer
- Show win message
- Optionally: Mark all mines as flagged (visual polish for Phase 3)
- Prevent further actions

#### On Loss
- Stop timer
- Show loss message
- Reveal all mines (for visual feedback in Phase 3)
- Prevent further actions

### Enhanced GameLogic Methods

**File**: `js/game/GameLogic.js` (additions):

```javascript
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
```

### Testing Checklist (Win/Loss)
- [ ] Win detected when all non-mines revealed
- [ ] Win detected correctly with flagged cells
- [ ] Loss detected immediately when mine revealed
- [ ] Timer stops on win
- [ ] Timer stops on loss
- [ ] Game state transitions correctly
- [ ] No actions allowed after win
- [ ] No actions allowed after loss
- [ ] Win works with all mines correctly flagged
- [ ] Win works with all mines unflagged
- [ ] Edge case: Revealing last cell triggers win

### Test Scenarios

#### Win Scenario 1: Perfect Game
- User reveals all non-mine cells
- Some mines are flagged, some are not
- Win condition: All non-mines revealed ✓

#### Win Scenario 2: All Mines Flagged
- User flags all mines correctly
- User reveals all non-mine cells
- Win condition: All non-mines revealed ✓

#### Loss Scenario 1: Direct Mine Click
- User clicks on mine
- Loss detected immediately
- Game ends

#### Loss Scenario 2: Cascade to Mine (shouldn't happen)
- Cascade should never reveal mines
- If it does, it's a bug

---

## Phase 2 Integration Testing

### Integration Points

#### GameLogic ↔ GameBoard
- [ ] GameLogic correctly accesses GameBoard methods
- [ ] Mine placement coordinates correctly
- [ ] Adjacent counting works with revealed cells
- [ ] Cascade uses getAdjacentCells correctly

#### GameLogic ↔ GameState
- [ ] GameState.start() called on first click
- [ ] GameState.win() called on win condition
- [ ] GameState.lose() called on loss condition
- [ ] Mine counter updates correctly
- [ ] Timer starts/stops correctly

#### Main.js Integration (preparation for Phase 3)
- [ ] GameLogic instance created
- [ ] Event handlers ready (to be connected in Phase 3)
- [ ] Components communicate correctly

### End-to-End Test Flow

1. **Game Start**
   - [ ] Page loads, game initializes
   - [ ] Board has no mines placed
   - [ ] GameState is READY

2. **First Click**
   - [ ] Click cell → mines placed (excluding clicked area)
   - [ ] Timer starts
   - [ ] GameState is PLAYING
   - [ ] Clicked cell is revealed (and cascade if empty)

3. **Gameplay**
   - [ ] Left-click reveals cells
   - [ ] Right-click flags cells
   - [ ] Cascade works correctly
   - [ ] Mine counter updates
   - [ ] Timer increments

4. **Win**
   - [ ] Reveal last non-mine cell
   - [ ] Win detected
   - [ ] Timer stops
   - [ ] GameState is WON
   - [ ] No more actions allowed

5. **Loss**
   - [ ] Click on mine
   - [ ] Loss detected
   - [ ] Timer stops
   - [ ] GameState is LOST
   - [ ] No more actions allowed

6. **New Game**
   - [ ] Click new game button
   - [ ] Board resets
   - [ ] GameState resets to READY
   - [ ] Timer resets
   - [ ] Mine counter resets

### Testing Checklist (Integration)
- [ ] All components work together
- [ ] State transitions are correct
- [ ] No memory leaks (repeated new games)
- [ ] Performance is acceptable (expert difficulty)
- [ ] Edge cases handled across components
- [ ] Error conditions handled gracefully

---

## Dependencies & Integration

### Phase 1 Components Used
- ✅ `Constants.js` - Difficulty configs, colors, constants
- ✅ `Cell.js` - Cell state and methods
- ✅ `GameBoard.js` - Enhanced with mine placement and counting
- ✅ `GameState.js` - Used for state management and timer
- ✅ `main.js` - Will be enhanced to connect GameLogic

### New Components
- ✅ `GameLogic.js` - New core logic controller

### Integration Order
1. Enhance GameBoard with mine methods
2. Create GameLogic class
3. Update main.js to instantiate GameLogic
4. Connect event handlers (preparation, full connection in Phase 3)

---

## Known Limitations After Phase 2

These features are intentionally NOT implemented:
- ❌ Visual rendering (canvas drawing)
- ❌ UI event handling (click events on canvas)
- ❌ Visual feedback (animations, colors)
- ❌ Game status messages display
- ❌ Timer display updates (structure ready)
- ❌ Mine counter display updates (structure ready)

These will be added in Phase 3 (Rendering).

---

## Success Criteria

Phase 2 is complete when:
- ✅ Mines can be placed randomly with first-click safety
- ✅ Adjacent mine counts are calculated correctly
- ✅ Cells can be revealed with cascade behavior
- ✅ Cells can be flagged/unflagged
- ✅ Win condition is detected correctly
- ✅ Loss condition is detected correctly
- ✅ Game state transitions correctly
- ✅ All components integrate properly
- ✅ No JavaScript errors
- ✅ Code is clean and well-organized

---

## Debugging Helpers

### Console Debugging

Add to GameLogic for development:

```javascript
/**
 * Debug method: Print board state to console
 */
debugPrintBoard() {
    console.log('Board State:');
    console.log(this.gameBoard.toString());
    console.log('Mines placed:', this.minesPlaced);
    console.log('Game state:', this.gameState.getState());
    console.log('Mines remaining:', this.gameState.minesRemaining);
}
```

### Testing Helpers

Add methods to expose for testing:

```javascript
// In main.js, expose for console testing
window.markSweeper = {
    gameBoard: () => gameBoard,
    gameState: () => gameState,
    gameLogic: () => gameLogic,
    // ... existing ...
};
```

---

## Performance Notes

### Expected Performance
- **Mine Placement**: O(n) where n = board size (acceptable)
- **Adjacent Counting**: O(n) where n = board size (acceptable)
- **Cascade Reveal**: O(n) worst case where n = board size (acceptable)
- **Win Check**: O(n) where n = board size (acceptable)

For expert difficulty (480 cells), all operations should be < 100ms.

### Optimization Opportunities (if needed)
- Cache revealed count instead of recalculating
- Use typed arrays for large boards
- Optimize cascade with better data structures

---

## Next Steps (Phase 3 Preview)

After Phase 2 completion, Phase 3 will:
- Create CanvasRenderer for visual rendering
- Draw all cell states (hidden, revealed, flagged, mine)
- Draw numbers and indicators
- Connect click events to GameLogic
- Update UI displays (timer, mine counter)
- Add visual polish and animations

Phase 2 components will be fully utilized by Phase 3.

