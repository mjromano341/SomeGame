# Phase 5: Event Handling & Integration - Detailed Planning

## Overview
Phase 5 focuses on comprehensive event handling, ensuring all user interactions work smoothly, adding advanced input methods (keyboard, touch), handling edge cases, and thoroughly testing all interactions. This phase ensures the game is robust, responsive, and handles all user scenarios correctly.

## Goals
- Complete event handling coverage (mouse, keyboard, touch)
- Robust error handling and edge case management
- Smooth integration between all components
- Comprehensive interaction testing
- User experience polish through better input handling
- Accessibility improvements through keyboard support

## Deliverables
1. Enhanced `js/main.js` - Complete event handling
2. `js/utils/EventHandlers.js` - Dedicated event handler module (optional)
3. Enhanced error handling throughout
4. Complete user interaction coverage
5. Robust, tested integration

---

## Step 1: Connect Canvas Click Events (Complete Integration)

### Objective
Ensure canvas click events are fully integrated with proper error handling, edge case management, and smooth coordination with game logic.

### Current State
Basic click handling exists from Phase 3. Enhance with:
- Better error handling
- Edge case management
- Prevent multiple rapid clicks
- Coordinate with UI updates
- Handle edge cases (clicking during transitions)

### Implementation Details

**File**: `js/main.js` (enhanced event handlers):

```javascript
/**
 * Enhanced canvas event handlers with error handling
 */

// Track click state to prevent double-clicks
let isProcessingClick = false;
let lastClickTime = 0;
const CLICK_DEBOUNCE_MS = 100; // Minimum time between clicks

/**
 * Handle canvas left-click with comprehensive error handling
 */
function handleCanvasClick(event) {
    // Prevent if already processing or game ended
    if (isProcessingClick || gameState.isEnded()) {
        return;
    }
    
    // Debounce rapid clicks
    const now = Date.now();
    if (now - lastClickTime < CLICK_DEBOUNCE_MS) {
        return;
    }
    lastClickTime = now;
    
    try {
        isProcessingClick = true;
        
        // Get mouse position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        // Convert to grid coordinates
        const cellPos = canvasRenderer.getCellFromCoordinates(x, y);
        if (!cellPos) {
            isProcessingClick = false;
            return; // Click outside grid
        }
        
        // Get cell to check state
        const cell = gameBoard.getCell(cellPos.row, cellPos.col);
        if (!cell || !cell.canReveal()) {
            isProcessingClick = false;
            return; // Cell can't be revealed
        }
        
        // Perform reveal action
        const result = gameLogic.revealCell(cellPos.row, cellPos.col);
        
        if (result.success) {
            // Update display
            canvasRenderer.render();
            updateUI();
            
            // Handle game over
            if (result.gameOver) {
                handleGameOver(result.won);
            }
        } else {
            // Log error (non-critical)
            console.warn('Reveal failed:', result.error);
        }
        
    } catch (error) {
        console.error('Error handling canvas click:', error);
        // Show user-friendly error message
        showError('An error occurred. Please try again.');
    } finally {
        isProcessingClick = false;
    }
}

/**
 * Handle canvas right-click with comprehensive error handling
 */
function handleCanvasRightClick(event) {
    event.preventDefault(); // Prevent browser context menu
    
    // Prevent if already processing or game ended
    if (isProcessingClick || gameState.isEnded()) {
        return;
    }
    
    try {
        isProcessingClick = true;
        
        // Get mouse position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        // Convert to grid coordinates
        const cellPos = canvasRenderer.getCellFromCoordinates(x, y);
        if (!cellPos) {
            isProcessingClick = false;
            return; // Click outside grid
        }
        
        // Get cell to check state
        const cell = gameBoard.getCell(cellPos.row, cellPos.col);
        if (!cell || cell.isRevealed) {
            isProcessingClick = false;
            return; // Can't flag revealed cells
        }
        
        // Perform flag action
        const result = gameLogic.flagCell(cellPos.row, cellPos.col);
        
        if (result.success) {
            // Update display
            canvasRenderer.render();
            updateMineCounter();
        } else {
            console.warn('Flag failed:', result.error);
        }
        
    } catch (error) {
        console.error('Error handling right-click:', error);
        showError('An error occurred. Please try again.');
    } finally {
        isProcessingClick = false;
    }
}

/**
 * Show user-friendly error message
 */
function showError(message) {
    // Optional: Show toast notification or alert
    console.error(message);
    // Could implement toast notification here
}

/**
 * Set up canvas event listeners
 */
function setupCanvasEvents() {
    // Left click (reveal)
    canvas.addEventListener('click', handleCanvasClick);
    
    // Right click (flag)
    canvas.addEventListener('contextmenu', handleCanvasRightClick);
    
    // Mouse move (hover)
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Mouse leave (clear hover)
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Prevent context menu on right-click
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}
```

### Edge Cases to Handle
- [ ] Click outside canvas bounds
- [ ] Rapid multiple clicks (debouncing)
- [ ] Clicking during game over
- [ ] Clicking revealed/flagged cells
- [ ] Coordinate conversion errors
- [ ] Canvas scaling issues

### Testing Checklist
- [ ] Left-click reveals cells correctly
- [ ] Right-click flags cells correctly
- [ ] Rapid clicks are debounced
- [ ] Clicks are ignored during game over
- [ ] Clicks outside grid are ignored
- [ ] Errors are handled gracefully
- [ ] No double-reveals on rapid clicks
- [ ] Context menu is prevented

---

## Step 2: Handle Left-Click (Reveal) - Enhanced

### Objective
Enhance left-click handling with additional features like chord clicking (revealing neighbors when flagged count matches), visual feedback, and improved coordination.

### Advanced Features

#### Chord Clicking (Optional Enhancement)
When a revealed cell's adjacent flags match its number, clicking the cell reveals all unflagged neighbors.

```javascript
/**
 * Handle chord click (middle-click or Ctrl+click on numbered cell)
 * @param {number} row - Row index
 * @param {number} col - Column index
 */
function handleChordClick(row, col) {
    const cell = gameBoard.getCell(row, col);
    
    // Chord click only works on revealed numbered cells
    if (!cell || !cell.isRevealed || cell.adjacentMines === 0) {
        return;
    }
    
    // Count adjacent flagged cells
    const neighbors = gameBoard.getAdjacentCells(row, col);
    const flaggedCount = neighbors.filter(c => c.isFlagged).length;
    
    // If flagged count matches adjacent mines, reveal unflagged neighbors
    if (flaggedCount === cell.adjacentMines) {
        neighbors.forEach(neighbor => {
            if (!neighbor.isFlagged && !neighbor.isRevealed && !neighbor.isMine) {
                const result = gameLogic.revealCell(neighbor.row, neighbor.col);
                if (result.success && result.gameOver) {
                    handleGameOver(result.won);
                }
            }
        });
        
        canvasRenderer.render();
        updateUI();
    }
}
```

#### Visual Feedback on Click

```javascript
/**
 * Add visual feedback when clicking (cell "press" effect)
 */
function showClickFeedback(row, col) {
    // Temporarily change cell appearance
    const cell = gameBoard.getCell(row, col);
    if (cell && !cell.isRevealed) {
        // Draw pressed state
        canvasRenderer.drawPressedCell(row, col);
        
        // Reset after short delay
        setTimeout(() => {
            canvasRenderer.render();
        }, 100);
    }
}
```

### Enhanced Left-Click Handler

```javascript
/**
 * Enhanced left-click with visual feedback and chord support
 */
function handleCanvasClick(event) {
    // ... existing debounce and validation code ...
    
    // Add visual feedback
    showClickFeedback(cellPos.row, cellPos.col);
    
    // Check for chord click (Ctrl+click or middle-click)
    if (event.ctrlKey || event.button === 1) {
        handleChordClick(cellPos.row, cellPos.col);
        isProcessingClick = false;
        return;
    }
    
    // ... existing reveal logic ...
}
```

### Testing Checklist (Enhanced)
- [ ] Standard left-click works
- [ ] Visual feedback appears on click
- [ ] Chord click works (if implemented)
- [ ] Chord click validates flag count
- [ ] Chord click doesn't reveal mines incorrectly
- [ ] Multiple rapid clicks handled correctly

---

## Step 3: Handle Right-Click (Flag) - Enhanced

### Objective
Enhance right-click flagging with better visual feedback, preventing accidental flags, and smooth integration.

### Enhancements

#### Visual Feedback

```javascript
/**
 * Show flag placement/removal feedback
 */
function showFlagFeedback(row, col, flagged) {
    // Add visual indication
    const cell = gameBoard.getCell(row, col);
    if (cell) {
        // Could add animation or color flash
        canvasRenderer.render();
        
        // Optional: Play sound (Phase 6)
        // playSound(flagged ? 'flag' : 'unflag');
    }
}
```

#### Prevent Accidental Flags

```javascript
/**
 * Enhanced right-click with confirmation for unflagged cells
 */
function handleCanvasRightClick(event) {
    // ... existing validation code ...
    
    const cell = gameBoard.getCell(cellPos.row, cellPos.col);
    
    // If unflagging, allow immediately
    if (cell.isFlagged) {
        const result = gameLogic.flagCell(cellPos.row, cellPos.col);
        if (result.success) {
            showFlagFeedback(cellPos.row, cellPos.col, false);
            canvasRenderer.render();
            updateMineCounter();
        }
        isProcessingClick = false;
        return;
    }
    
    // If flagging, check if mine counter is at zero
    if (gameState.minesRemaining === 0) {
        // Optional: Show warning
        console.warn('No more flags available');
        isProcessingClick = false;
        return;
    }
    
    // Perform flag action
    const result = gameLogic.flagCell(cellPos.row, cellPos.col);
    
    if (result.success) {
        showFlagFeedback(cellPos.row, cellPos.col, true);
        canvasRenderer.render();
        updateMineCounter();
    }
    
    // ... error handling ...
}
```

### Testing Checklist (Enhanced)
- [ ] Right-click flags cells correctly
- [ ] Right-click unflags cells correctly
- [ ] Visual feedback appears
- [ ] Flagging at zero flags prevented (if implemented)
- [ ] Multiple rapid right-clicks handled
- [ ] Can't flag revealed cells
- [ ] Mine counter updates correctly

---

## Step 4: Integrate Timer with Game Flow

### Objective
Ensure timer is properly integrated with all game states and transitions, with accurate start/stop behavior.

### Current State
Timer functionality exists but may need refinement for edge cases.

### Enhanced Timer Integration

**File**: `js/main.js` (timer integration):

```javascript
/**
 * Enhanced timer management
 */
let timerUpdateInterval = null;

/**
 * Start timer updates
 */
function startTimer() {
    // Clear any existing interval
    stopTimer();
    
    // Start timer if game is playing
    if (gameState && gameState.isPlaying()) {
        timerUpdateInterval = setInterval(() => {
            if (gameState && gameState.isPlaying()) {
                updateTimer();
            } else {
                stopTimer();
            }
        }, Constants.TIMER_INTERVAL);
    }
}

/**
 * Stop timer updates
 */
function stopTimer() {
    if (timerUpdateInterval) {
        clearInterval(timerUpdateInterval);
        timerUpdateInterval = null;
    }
}

/**
 * Reset timer display and state
 */
function resetTimer() {
    stopTimer();
    if (gameState) {
        gameState.reset();
    }
    updateTimer();
}

/**
 * Enhanced timer update with validation
 */
function updateTimer() {
    if (!gameState) return;
    
    const time = gameState.timer;
    
    // Validate time is reasonable (prevent overflow)
    if (time > 999) {
        console.warn('Timer exceeded maximum');
        return;
    }
    
    uiRenderer.updateTimer(time);
    
    // Optional: Color coding based on time
    const timerElement = uiRenderer.getElement('timer');
    timerElement.removeClass('fast normal slow');
    
    if (time < 60) {
        timerElement.addClass('fast');
    } else if (time < 180) {
        timerElement.addClass('normal');
    } else {
        timerElement.addClass('slow');
    }
}

/**
 * Hook into game state changes
 */
function setupGameStateHooks() {
    // Override gameState methods to trigger timer updates
    const originalStart = gameState.start.bind(gameState);
    gameState.start = function() {
        originalStart();
        startTimer();
    };
    
    const originalWin = gameState.win.bind(gameState);
    gameState.win = function() {
        originalWin();
        stopTimer();
        updateTimer(); // Final update
    };
    
    const originalLose = gameState.lose.bind(gameState);
    gameState.lose = function() {
        originalLose();
        stopTimer();
        updateTimer(); // Final update
    };
    
    const originalReset = gameState.reset.bind(gameState);
    gameState.reset = function(totalMines) {
        originalReset(totalMines);
        resetTimer();
    };
}
```

### Timer Edge Cases

```javascript
/**
 * Handle edge cases for timer
 */
function validateTimer() {
    // Ensure timer doesn't continue after game ends
    if (gameState.isEnded() && timerUpdateInterval) {
        stopTimer();
    }
    
    // Ensure timer doesn't run before game starts
    if (gameState.isReady() && timerUpdateInterval) {
        stopTimer();
    }
    
    // Ensure timer starts when game begins
    if (gameState.isPlaying() && !timerUpdateInterval) {
        startTimer();
    }
}
```

### Testing Checklist
- [ ] Timer starts on first click
- [ ] Timer stops on win
- [ ] Timer stops on loss
- [ ] Timer resets on new game
- [ ] Timer doesn't run before game starts
- [ ] Timer doesn't continue after game ends
- [ ] Timer updates every second
- [ ] Timer display is accurate
- [ ] Timer handles edge cases correctly

---

## Step 5: Connect UI Controls to Game State

### Objective
Ensure all UI controls (new game, difficulty selector, etc.) are properly connected to game state with proper validation and feedback.

### Enhanced UI Control Integration

**File**: `js/main.js` (UI control handlers):

```javascript
/**
 * Enhanced new game button handler
 */
function handleNewGame() {
    // Prevent if already processing
    if (isProcessingClick) {
        return;
    }
    
    try {
        // Show loading state
        uiRenderer.showLoadingState();
        
        // Small delay for visual feedback
        setTimeout(() => {
            // Reset game
            initGame();
            
            // Hide loading state
            uiRenderer.hideLoadingState();
            
            // Pulse button for feedback
            uiRenderer.pulseNewGameButton();
        }, 50);
        
    } catch (error) {
        console.error('Error starting new game:', error);
        uiRenderer.hideLoadingState();
        showError('Failed to start new game. Please try again.');
    }
}

/**
 * Enhanced difficulty change handler
 */
function handleDifficultyChange() {
    const newDifficulty = $('#difficulty').val();
    
    // Validate difficulty
    if (!Constants.DIFFICULTIES[newDifficulty]) {
        console.error('Invalid difficulty:', newDifficulty);
        // Revert selector
        $('#difficulty').val(gameBoard.difficulty);
        return;
    }
    
    // If game is in progress, confirm change
    if (gameState && gameState.isPlaying()) {
        const confirmed = confirm(
            'Changing difficulty will start a new game. Continue?'
        );
        
        if (!confirmed) {
            // Revert selector to current difficulty
            uiRenderer.updateDifficultySelector(gameBoard.difficulty);
            return;
        }
    }
    
    // Start new game with new difficulty
    try {
        uiRenderer.showLoadingState();
        
        setTimeout(() => {
            initGame();
            uiRenderer.hideLoadingState();
        }, 50);
        
    } catch (error) {
        console.error('Error changing difficulty:', error);
        uiRenderer.hideLoadingState();
        showError('Failed to change difficulty. Please try again.');
        // Revert selector
        uiRenderer.updateDifficultySelector(gameBoard.difficulty);
    }
}

/**
 * Enhanced play again button handler
 */
function handlePlayAgain() {
    // Same as new game
    handleNewGame();
}

/**
 * Set up all UI control event handlers
 */
function setupUIControls() {
    // New game button
    $('#new-game-btn').off('click').on('click', handleNewGame);
    
    // Difficulty selector
    $('#difficulty').off('change').on('change', handleDifficultyChange);
    
    // Play again button (in overlay)
    $('#play-again-btn').off('click').on('click', function() {
        handlePlayAgain();
        uiRenderer.hideGameOverOverlay();
    });
    
    // Keyboard shortcuts (optional)
    setupKeyboardShortcuts();
}

/**
 * Enable/disable UI controls based on game state
 */
function updateUIControlsState() {
    if (gameState.isPlaying()) {
        // Disable difficulty selector during gameplay (optional)
        // uiRenderer.setDifficultySelectorEnabled(false);
        
        // Ensure new game button is enabled
        uiRenderer.setNewGameButtonEnabled(true);
    } else {
        // Enable all controls when not playing
        uiRenderer.setDifficultySelectorEnabled(true);
        uiRenderer.setNewGameButtonEnabled(true);
    }
}
```

### UI State Synchronization

```javascript
/**
 * Ensure UI reflects current game state
 */
function synchronizeUIWithGameState() {
    // Update timer
    updateTimer();
    
    // Update mine counter
    updateMineCounter();
    
    // Update difficulty selector
    uiRenderer.updateDifficultySelector(gameBoard.difficulty);
    
    // Update control states
    updateUIControlsState();
    
    // Hide/show game over overlay
    if (gameState.isEnded()) {
        const won = gameState.getState() === Constants.GAME_STATES.WON;
        handleGameOver(won);
    } else {
        uiRenderer.hideGameOverOverlay();
    }
}
```

### Testing Checklist
- [ ] New game button resets everything
- [ ] Difficulty selector changes board
- [ ] Play again button works
- [ ] UI controls are enabled/disabled appropriately
- [ ] UI reflects game state correctly
- [ ] Loading states work
- [ ] Error handling works
- [ ] Confirmation dialogs work (if implemented)

---

## Step 6: Test All Interactions

### Objective
Comprehensively test all user interactions, edge cases, and integration points to ensure robust functionality.

### Comprehensive Test Plan

#### Test Category 1: Basic Interactions

**Mouse Interactions**
- [ ] Left-click reveals cell
- [ ] Right-click flags cell
- [ ] Hover shows visual feedback
- [ ] Click outside canvas is ignored
- [ ] Rapid clicks are handled correctly
- [ ] Multiple right-clicks toggle flag correctly

**Keyboard Interactions** (if implemented)
- [ ] Arrow keys navigate (if implemented)
- [ ] Space reveals cell (if implemented)
- [ ] F flags cell (if implemented)
- [ ] Enter starts new game (if implemented)

**Touch Interactions** (if implemented)
- [ ] Tap reveals cell
- [ ] Long press flags cell
- [ ] Touch events work on mobile

#### Test Category 2: Game Flow

**Game Start**
- [ ] New game initializes correctly
- [ ] Difficulty change works
- [ ] First click places mines safely
- [ ] Timer starts on first click
- [ ] UI displays correct initial state

**Gameplay**
- [ ] Revealing cells works
- [ ] Cascade reveal works correctly
- [ ] Flagging cells works
- [ ] Mine counter updates
- [ ] Timer increments
- [ ] Can't reveal flagged cells
- [ ] Can't flag revealed cells

**Game End**
- [ ] Win condition detected
- [ ] Loss condition detected
- [ ] Timer stops on game end
- [ ] Overlay appears correctly
- [ ] Can't continue playing after game end
- [ ] New game resets everything

#### Test Category 3: Edge Cases

**Input Edge Cases**
- [ ] Rapid clicking doesn't break game
- [ ] Clicking during game over
- [ ] Right-click on revealed cell
- [ ] Clicking outside bounds
- [ ] Multiple flags on same cell (shouldn't happen)

**State Edge Cases**
- [ ] Starting new game during gameplay
- [ ] Changing difficulty during gameplay
- [ ] Timer behavior at game boundaries
- [ ] Mine counter going negative
- [ ] All cells revealed except mines
- [ ] All mines flagged correctly

**Error Cases**
- [ ] Invalid coordinates
- [ ] Missing game components
- [ ] Canvas not initialized
- [ ] Event handler errors
- [ ] State inconsistencies

#### Test Category 4: Integration

**Component Integration**
- [ ] GameLogic ↔ GameBoard integration
- [ ] GameLogic ↔ GameState integration
- [ ] CanvasRenderer ↔ GameBoard integration
- [ ] UIRenderer ↔ GameState integration
- [ ] Event handlers ↔ All components

**State Synchronization**
- [ ] UI reflects game state
- [ ] Canvas reflects game state
- [ ] Timer reflects game state
- [ ] Mine counter reflects game state
- [ ] Difficulty selector reflects state

#### Test Category 5: Performance

**Performance Tests**
- [ ] Rapid clicks don't cause lag
- [ ] Rendering is smooth
- [ ] Timer updates don't cause lag
- [ ] Large boards (expert) perform well
- [ ] Memory doesn't leak (repeated games)

### Test Implementation

**File**: `js/utils/TestHelpers.js` (optional, for development):

```javascript
/**
 * Test helpers for manual testing
 */
const TestHelpers = {
    /**
     * Test reveal cascade
     */
    testCascade() {
        // Set up test board
        // Verify cascade works
    },
    
    /**
     * Test win condition
     */
    testWin() {
        // Manually reveal all non-mines
        // Verify win detected
    },
    
    /**
     * Test timer
     */
    testTimer() {
        // Start game
        // Wait
        // Verify timer increments
    },
    
    // ... more test helpers
};

// Expose for console testing
window.TestHelpers = TestHelpers;
```

### Automated Test Scenarios

Create test scenarios to run manually:

1. **Happy Path**
   - Start game → Play → Win
   - Verify all steps work correctly

2. **Loss Path**
   - Start game → Click mine → Lose
   - Verify loss handled correctly

3. **Flagging Path**
   - Start game → Flag cells → Win
   - Verify flags work correctly

4. **New Game Path**
   - Play → New game → Play again
   - Verify reset works correctly

5. **Difficulty Change Path**
   - Play beginner → Change to expert → Play
   - Verify change works correctly

### Testing Checklist Summary

- [ ] All basic interactions work
- [ ] All game flows work
- [ ] Edge cases handled
- [ ] Error cases handled
- [ ] Integration works
- [ ] Performance acceptable
- [ ] No console errors
- [ ] No visual glitches
- [ ] State remains consistent
- [ ] User experience is smooth

---

## Additional Event Handling: Keyboard Support

### Objective (Optional Enhancement)
Add keyboard support for accessibility and power users.

### Keyboard Shortcuts

```javascript
/**
 * Set up keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    $(document).on('keydown', function(event) {
        // Ignore if typing in input fields
        if ($(event.target).is('input, select, textarea')) {
            return;
        }
        
        // Ignore modifier-only keys
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        
        switch(event.key) {
            case 'n':
            case 'N':
                // New game
                event.preventDefault();
                handleNewGame();
                break;
                
            case 'r':
            case 'R':
                // Reset current game
                event.preventDefault();
                handleNewGame();
                break;
                
            case '1':
                // Beginner difficulty
                event.preventDefault();
                $('#difficulty').val('beginner').trigger('change');
                break;
                
            case '2':
                // Intermediate difficulty
                event.preventDefault();
                $('#difficulty').val('intermediate').trigger('change');
                break;
                
            case '3':
                // Expert difficulty
                event.preventDefault();
                $('#difficulty').val('expert').trigger('change');
                break;
                
            case 'Escape':
                // Close overlay if open
                if (!uiRenderer.getElement('gameStatus').hasClass('hidden')) {
                    uiRenderer.hideGameOverOverlay();
                }
                break;
        }
    });
}
```

### Testing Checklist (Keyboard)
- [ ] All keyboard shortcuts work
- [ ] Shortcuts don't interfere with typing
- [ ] Shortcuts are documented (tooltip/help)
- [ ] Escape closes overlay

---

## Additional Event Handling: Touch Support

### Objective (Optional Enhancement)
Add touch device support for mobile/tablet users.

### Touch Event Handling

```javascript
/**
 * Set up touch event handlers
 */
function setupTouchEvents() {
    let touchStartTime = 0;
    let touchStartPos = null;
    const LONG_PRESS_MS = 500; // Time for long press (flag)
    
    canvas.addEventListener('touchstart', function(event) {
        event.preventDefault();
        
        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        
        touchStartTime = Date.now();
        touchStartPos = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    });
    
    canvas.addEventListener('touchend', function(event) {
        event.preventDefault();
        
        if (!touchStartPos) return;
        
        const touch = event.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const touchEndPos = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
        
        const touchDuration = Date.now() - touchStartTime;
        const distance = Math.sqrt(
            Math.pow(touchEndPos.x - touchStartPos.x, 2) +
            Math.pow(touchEndPos.y - touchStartPos.y, 2)
        );
        
        // If moved too far, ignore
        if (distance > 10) {
            touchStartPos = null;
            return;
        }
        
        // Long press = flag, short tap = reveal
        if (touchDuration >= LONG_PRESS_MS) {
            // Right-click equivalent (flag)
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = touchStartPos.x * scaleX;
            const y = touchStartPos.y * scaleY;
            const cellPos = canvasRenderer.getCellFromCoordinates(x, y);
            
            if (cellPos) {
                handleCanvasRightClick({ clientX: touch.clientX, clientY: touch.clientY });
            }
        } else {
            // Left-click equivalent (reveal)
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = touchStartPos.x * scaleX;
            const y = touchStartPos.y * scaleY;
            const cellPos = canvasRenderer.getCellFromCoordinates(x, y);
            
            if (cellPos) {
                handleCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
            }
        }
        
        touchStartPos = null;
    });
    
    canvas.addEventListener('touchmove', function(event) {
        event.preventDefault();
        // Cancel touch if moved too far
    });
    
    canvas.addEventListener('touchcancel', function(event) {
        touchStartPos = null;
    });
}
```

### Testing Checklist (Touch)
- [ ] Tap reveals cells
- [ ] Long press flags cells
- [ ] Touch events don't interfere with mouse
- [ ] Works on mobile devices
- [ ] Works on tablets

---

## Error Handling & Recovery

### Objective
Implement comprehensive error handling throughout event handlers.

### Error Handling Strategy

```javascript
/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    // Could show user-friendly message
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

/**
 * Wrapper for event handlers with error catching
 */
function safeEventHandler(handler) {
    return function(event) {
        try {
            handler(event);
        } catch (error) {
            console.error('Error in event handler:', error);
            showError('An error occurred. The game may need to be reset.');
        }
    };
}

// Use wrapper for all event handlers
canvas.addEventListener('click', safeEventHandler(handleCanvasClick));
```

### Recovery Mechanisms

```javascript
/**
 * Recover from error state
 */
function recoverFromError() {
    try {
        // Reset game state
        initGame();
        
        // Clear any intervals
        stopTimer();
        
        // Reset UI
        synchronizeUIWithGameState();
        
    } catch (error) {
        console.error('Recovery failed:', error);
        // Last resort: reload page
        if (confirm('Game error. Reload page?')) {
            location.reload();
        }
    }
}
```

### Testing Checklist (Error Handling)
- [ ] Errors are caught and logged
- [ ] User sees friendly error messages
- [ ] Game can recover from errors
- [ ] No unhandled exceptions
- [ ] Errors don't break game permanently

---

## Phase 5 Integration Testing

### Complete Integration Test

1. **Full Game Playthrough**
   - [ ] Start game
   - [ ] Play to completion (win)
   - [ ] Verify all interactions work
   - [ ] Start new game
   - [ ] Play to completion (loss)
   - [ ] Verify all interactions work

2. **Edge Case Testing**
   - [ ] Rapid clicking
   - [ ] Rapid flagging
   - [ ] Changing difficulty mid-game
   - [ ] Multiple new games quickly
   - [ ] Clicking during transitions

3. **Error Recovery**
   - [ ] Simulate errors
   - [ ] Verify recovery
   - [ ] Verify game continues

4. **Performance**
   - [ ] No lag during gameplay
   - [ ] Smooth interactions
   - [ ] Memory doesn't accumulate

### Success Criteria

Phase 5 is complete when:
- ✅ All event handlers work correctly
- ✅ Edge cases are handled
- ✅ Error handling is robust
- ✅ UI controls are integrated
- ✅ Timer integration is complete
- ✅ All interactions are tested
- ✅ Keyboard support works (if implemented)
- ✅ Touch support works (if implemented)
- ✅ Game is robust and stable
- ✅ No critical bugs

---

## Known Limitations After Phase 5

These features are intentionally NOT implemented:
- ❌ Advanced animations (smooth reveals)
- ❌ Sound effects
- ❌ Advanced visual effects
- ❌ Replay functionality
- ❌ Statistics tracking

These will be added in Phase 6 (Polish & Refinement).

---

## Next Steps (Phase 6 Preview)

After Phase 5 completion, Phase 6 will:
- Add smooth animations
- Improve visual polish
- Add sound effects (optional)
- Optimize performance
- Final testing and refinement

Phase 5 provides the robust, tested foundation for final polish.

