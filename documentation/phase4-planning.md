# Phase 4: User Interface - Detailed Planning

## Overview
Phase 4 focuses on polishing the user interface, enhancing visual design, improving user experience, and creating a cohesive, professional appearance. This phase builds upon the functional UI from Phase 3 and adds polish, better styling, enhanced interactions, and a dedicated UI management system.

## Goals
- Create a dedicated UI rendering/management system
- Enhance all UI elements with better styling
- Improve user feedback and interactions
- Add visual polish and animations
- Ensure consistent design language
- Create professional, modern appearance
- Enhance accessibility

## Deliverables
1. `js/render/UIRenderer.js` - UI management and rendering
2. Enhanced `css/game.css` - Polished game-specific styles
3. Enhanced `css/styles.css` - Refined global styles
4. Enhanced `js/main.js` - UI integration
5. Complete, polished user interface

---

## Step 1: Create UIRenderer.js

### Objective
Create a dedicated UIRenderer class that manages all non-canvas UI elements, handles updates, and provides a clean interface for UI operations.

### Responsibilities

#### Core Responsibilities
- Manage UI element updates
- Handle timer display formatting and updates
- Manage mine counter display
- Control game status overlay visibility
- Handle UI state transitions
- Provide clean API for UI updates

#### Methods Needed
- Constructor (UI element references)
- `updateTimer(seconds)`: Update timer display
- `updateMineCounter(count)`: Update mine counter
- `showGameOverOverlay(won)`: Show win/loss overlay
- `hideGameOverOverlay()`: Hide overlay
- `updateDifficultySelector(difficulty)`: Update selector
- `resetUI()`: Reset all UI elements
- `formatTime(seconds)`: Format time for display
- `formatMineCount(count)`: Format mine count

### Implementation Details

**File**: `js/render/UIRenderer.js`

```javascript
/**
 * UIRenderer.js
 * Manages all non-canvas UI elements
 */

class UIRenderer {
    /**
     * Create a new UIRenderer
     * @param {Object} elementIds - Object with UI element IDs
     */
    constructor(elementIds = {}) {
        // Store element references (using jQuery for convenience)
        this.elements = {
            timer: $(elementIds.timer || '#timer'),
            mineCounter: $(elementIds.mineCounter || '#mine-counter'),
            difficultySelector: $(elementIds.difficultySelector || '#difficulty'),
            newGameButton: $(elementIds.newGameButton || '#new-game-btn'),
            gameStatus: $(elementIds.gameStatus || '#game-status'),
            statusMessage: $(elementIds.statusMessage || '.status-message'),
            playAgainButton: $(elementIds.playAgainButton || '#play-again-btn'),
            gameInfo: $(elementIds.gameInfo || '.game-info')
        };
        
        // Initialize UI state
        this.currentDifficulty = 'beginner';
        this.isGameOver = false;
        
        // Set up event handlers (if needed)
        this.setupEventHandlers();
    }

    /**
     * Update timer display
     * @param {number} seconds - Time in seconds
     */
    updateTimer(seconds) {
        const formatted = this.formatTime(seconds);
        this.elements.timer.text(formatted);
        
        // Optional: Add visual feedback for timer updates
        this.elements.timer.addClass('pulse');
        setTimeout(() => {
            this.elements.timer.removeClass('pulse');
        }, 100);
    }

    /**
     * Format time for display
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string (000-999)
     */
    formatTime(seconds) {
        // Clamp to 0-999 (3 digits max)
        const clamped = Math.max(0, Math.min(999, seconds));
        return String(clamped).padStart(3, '0');
    }

    /**
     * Update mine counter display
     * @param {number} count - Remaining mines
     */
    updateMineCounter(count) {
        const formatted = this.formatMineCount(count);
        this.elements.mineCounter.text(formatted);
        
        // Visual feedback for mine counter
        if (count < 0) {
            this.elements.mineCounter.addClass('negative');
        } else {
            this.elements.mineCounter.removeClass('negative');
        }
    }

    /**
     * Format mine count for display
     * @param {number} count - Mine count
     * @returns {string} Formatted count string
     */
    formatMineCount(count) {
        // Format as 3 digits (000-999)
        const clamped = Math.max(-99, Math.min(999, count));
        if (clamped < 0) {
            return `-${String(Math.abs(clamped)).padStart(2, '0')}`;
        }
        return String(clamped).padStart(3, '0');
    }

    /**
     * Show game over overlay
     * @param {boolean} won - True if game was won
     * @param {Object} stats - Optional game statistics
     */
    showGameOverOverlay(won, stats = {}) {
        this.isGameOver = true;
        
        const message = won 
            ? this.getWinMessage(stats)
            : this.getLossMessage(stats);
        
        this.elements.statusMessage
            .text(message.text)
            .removeClass('win-message loss-message')
            .addClass(won ? 'win-message' : 'loss-message');
        
        this.elements.gameStatus.removeClass('hidden');
        
        // Add animation
        this.elements.gameStatus.addClass('show');
    }

    /**
     * Hide game over overlay
     */
    hideGameOverOverlay() {
        this.isGameOver = false;
        this.elements.gameStatus.removeClass('show');
        
        // Wait for animation, then hide
        setTimeout(() => {
            this.elements.gameStatus.addClass('hidden');
        }, 300);
    }

    /**
     * Get win message
     * @param {Object} stats - Game statistics
     * @returns {Object} Message object
     */
    getWinMessage(stats) {
        const messages = [
            'Congratulations! You won!',
            'Excellent! You cleared the board!',
            'Perfect! You found all the mines!',
            'Amazing! Victory!'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        return {
            text: randomMessage,
            subtext: stats.time ? `Time: ${this.formatTime(stats.time)}` : ''
        };
    }

    /**
     * Get loss message
     * @param {Object} stats - Game statistics
     * @returns {Object} Message object
     */
    getLossMessage(stats) {
        const messages = [
            'Game Over! You hit a mine.',
            'Boom! You found a mine.',
            'Oops! That was a mine.',
            'Game Over! Try again?'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        return {
            text: randomMessage,
            subtext: ''
        };
    }

    /**
     * Update difficulty selector
     * @param {string} difficulty - Difficulty level
     */
    updateDifficultySelector(difficulty) {
        this.currentDifficulty = difficulty;
        this.elements.difficultySelector.val(difficulty);
    }

    /**
     * Reset all UI elements to initial state
     */
    resetUI() {
        this.updateTimer(0);
        this.updateMineCounter(0);
        this.hideGameOverOverlay();
        this.isGameOver = false;
    }

    /**
     * Set mine counter to initial value
     * @param {number} totalMines - Total mines for current difficulty
     */
    initializeMineCounter(totalMines) {
        this.updateMineCounter(totalMines);
    }

    /**
     * Enable/disable difficulty selector
     * @param {boolean} enabled - Whether to enable
     */
    setDifficultySelectorEnabled(enabled) {
        if (enabled) {
            this.elements.difficultySelector.prop('disabled', false);
            this.elements.difficultySelector.removeClass('disabled');
        } else {
            this.elements.difficultySelector.prop('disabled', true);
            this.elements.difficultySelector.addClass('disabled');
        }
    }

    /**
     * Enable/disable new game button
     * @param {boolean} enabled - Whether to enable
     */
    setNewGameButtonEnabled(enabled) {
        if (enabled) {
            this.elements.newGameButton.prop('disabled', false);
            this.elements.newGameButton.removeClass('disabled');
        } else {
            this.elements.newGameButton.prop('disabled', true);
            this.elements.newGameButton.addClass('disabled');
        }
    }

    /**
     * Add visual feedback to new game button
     */
    pulseNewGameButton() {
        this.elements.newGameButton.addClass('pulse');
        setTimeout(() => {
            this.elements.newGameButton.removeClass('pulse');
        }, 200);
    }

    /**
     * Show loading state (during board generation)
     */
    showLoadingState() {
        this.elements.newGameButton.text('Generating...');
        this.elements.newGameButton.prop('disabled', true);
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        this.elements.newGameButton.text('New Game');
        this.elements.newGameButton.prop('disabled', false);
    }

    /**
     * Set up event handlers (if UIRenderer manages them)
     * @private
     */
    setupEventHandlers() {
        // Event handlers can be set up here if UIRenderer manages them
        // Otherwise, they can be set up in main.js
    }

    /**
     * Get element reference (for external event handlers)
     * @param {string} elementName - Name of element
     * @returns {jQuery} jQuery element
     */
    getElement(elementName) {
        return this.elements[elementName];
    }
}
```

### Design Decisions
- [ ] Whether to use jQuery or vanilla JS (chosen: jQuery as allowed)
- [ ] Whether UIRenderer manages events or just display (chosen: display primarily, events in main.js)
- [ ] Whether to include animation classes (chosen: yes, for polish)
- [ ] Message variety (chosen: random messages for variety)

### Testing Checklist
- [ ] UIRenderer instantiates correctly
- [ ] Timer updates correctly
- [ ] Mine counter updates correctly
- [ ] Game over overlay shows/hides correctly
- [ ] Formatting functions work correctly
- [ ] UI state resets correctly
- [ ] Element references are valid

---

## Step 2: Add Timer Functionality (Enhancement)

### Objective
Enhance the timer functionality with better visual feedback, animations, and integration with UIRenderer.

### Current State
Timer functionality exists in Phase 3 but may need enhancement.

### Enhancements

#### Visual Enhancements
1. **Better formatting**: Already handled in UIRenderer
2. **Animation on update**: Pulse effect
3. **Color changes**: Color coding for different time ranges
4. **Performance indicators**: Optional speed indicators

#### Implementation

**CSS Additions** (`css/game.css`):

```css
/* Timer enhancements */
#timer {
    transition: all 0.2s ease;
    font-weight: 700;
    letter-spacing: 2px;
}

#timer.pulse {
    animation: pulse 0.3s ease;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

/* Timer color coding (optional) */
#timer.fast {
    color: #4CAF50; /* Green for fast times */
}

#timer.normal {
    color: #2196F3; /* Blue for normal */
}

#timer.slow {
    color: #FF9800; /* Orange for slower */
}

/* Info item styling */
.info-item {
    transition: transform 0.2s;
}

.info-item:hover {
    transform: scale(1.05);
}
```

**JavaScript Enhancements** (`js/main.js`):

```javascript
/**
 * Enhanced timer update with color coding
 */
function updateTimer() {
    if (gameState) {
        const time = gameState.timer;
        uiRenderer.updateTimer(time);
        
        // Optional: Color code by time
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
}
```

### Timer Integration

**Enhanced timer interval** (`js/main.js`):

```javascript
// Timer update interval with smooth updates
let timerInterval = null;

function startTimerUpdates() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(function() {
        if (gameState && gameState.isPlaying()) {
            updateTimer();
        }
    }, Constants.TIMER_INTERVAL);
}

function stopTimerUpdates() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Start when game starts
gameState.onStart = function() {
    startTimerUpdates();
};

gameState.onEnd = function() {
    stopTimerUpdates();
};
```

### Testing Checklist
- [ ] Timer updates every second
- [ ] Timer stops when game ends
- [ ] Timer resets on new game
- [ ] Pulse animation works
- [ ] Color coding works (if implemented)
- [ ] Formatting is correct (000-999)
- [ ] Timer doesn't update when game is not playing

---

## Step 3: Add Mine Counter (Enhancement)

### Objective
Enhance the mine counter with better visual feedback, negative number handling, and animations.

### Enhancements

#### Visual Enhancements
1. **Negative number display**: Show negative when too many flags
2. **Color coding**: Red for negative, normal for positive
3. **Animation on update**: Pulse effect
4. **Formatting**: Always 3 digits with leading zeros

#### Implementation

**CSS Additions** (`css/game.css`):

```css
/* Mine counter enhancements */
#mine-counter {
    transition: all 0.2s ease;
    font-weight: 700;
    letter-spacing: 2px;
}

#mine-counter.pulse {
    animation: pulse 0.3s ease;
}

#mine-counter.negative {
    color: #f44336; /* Red for negative */
}

#mine-counter.positive {
    color: #4CAF50; /* Green when close to zero */
}
```

**JavaScript** (already in UIRenderer):
- `updateMineCounter()` handles negative numbers
- `formatMineCount()` formats correctly

### Mine Counter Integration

**Enhanced updates** (`js/main.js`):

```javascript
/**
 * Enhanced mine counter update
 */
function updateMineCounter() {
    if (gameState) {
        const count = gameState.minesRemaining;
        uiRenderer.updateMineCounter(count);
        
        // Optional: Color coding
        const counterElement = uiRenderer.getElement('mineCounter');
        counterElement.removeClass('positive');
        
        if (count === 0 && !gameState.isPlaying()) {
            counterElement.addClass('positive');
        }
    }
}
```

### Testing Checklist
- [ ] Mine counter updates on flag/unflag
- [ ] Negative numbers display correctly
- [ ] Formatting is correct (3 digits)
- [ ] Pulse animation works
- [ ] Color changes for negative (if implemented)
- [ ] Counter resets on new game

---

## Step 4: Add Difficulty Selector (Enhancement)

### Objective
Enhance the difficulty selector with better styling, visual feedback, and disabled state handling.

### Enhancements

#### Visual Enhancements
1. **Better styling**: Modern select dropdown
2. **Disabled state**: Visual indication when disabled
3. **Change confirmation**: Optional confirmation dialog
4. **Visual feedback**: Highlight selected option

#### Implementation

**CSS Enhancements** (`css/game.css`):

```css
/* Difficulty selector enhancements */
.difficulty-selector {
    display: flex;
    align-items: center;
    gap: 8px;
}

.difficulty-selector label {
    font-weight: 500;
    color: #555;
    white-space: nowrap;
}

#difficulty {
    padding: 10px 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 140px;
}

#difficulty:hover {
    border-color: #2196F3;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.1);
}

#difficulty:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

#difficulty.disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.6;
    border-color: #ccc;
}

#difficulty.disabled:hover {
    border-color: #ccc;
    box-shadow: none;
}

/* Option styling */
#difficulty option {
    padding: 8px;
    font-weight: 500;
}

#difficulty option:checked {
    background: #2196F3;
    color: white;
}
```

**JavaScript Enhancements** (`js/main.js`):

```javascript
/**
 * Handle difficulty change with confirmation
 */
function handleDifficultyChange() {
    const newDifficulty = $('#difficulty').val();
    
    // If game is in progress, confirm change
    if (gameState && gameState.isPlaying()) {
        const confirmed = confirm(
            'Changing difficulty will start a new game. Continue?'
        );
        if (!confirmed) {
            // Revert selector
            $('#difficulty').val(gameState.difficulty);
            return;
        }
    }
    
    // Start new game with new difficulty
    initGame();
}

// Enhanced event handler
$('#difficulty').on('change', handleDifficultyChange);
```

### Disabled State Management

```javascript
/**
 * Disable difficulty selector during gameplay
 */
function disableDifficultySelector() {
    uiRenderer.setDifficultySelectorEnabled(false);
}

/**
 * Enable difficulty selector
 */
function enableDifficultySelector() {
    uiRenderer.setDifficultySelectorEnabled(true);
}

// Disable during gameplay
if (gameState && gameState.isPlaying()) {
    disableDifficultySelector();
}
```

### Testing Checklist
- [ ] Difficulty selector changes board size
- [ ] Selector is disabled during gameplay (optional)
- [ ] Confirmation dialog works (if implemented)
- [ ] Visual styling is polished
- [ ] Hover effects work
- [ ] Focus states work
- [ ] Selected option is clear

---

## Step 5: Add New Game Button (Enhancement)

### Objective
Enhance the new game button with better styling, animations, and visual feedback.

### Enhancements

#### Visual Enhancements
1. **Better styling**: Modern button design
2. **Icon**: Optional emoji or icon
3. **Animations**: Hover, click, pulse effects
4. **Loading state**: Show "Generating..." during reset

#### Implementation

**CSS Enhancements** (`css/game.css`):

```css
/* New game button enhancements */
.new-game-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
    position: relative;
    overflow: hidden;
}

.new-game-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.new-game-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
    background: linear-gradient(135deg, #45a049 0%, #4CAF50 100%);
}

.new-game-btn:hover::before {
    width: 300px;
    height: 300px;
}

.new-game-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.new-game-btn.pulse {
    animation: pulse 0.5s ease;
}

.new-game-btn.disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
}

.new-game-btn.disabled:hover {
    transform: none;
    box-shadow: none;
}

/* Optional: Add icon/emoji */
.new-game-btn::after {
    content: '🔄';
    margin-left: 8px;
    display: inline-block;
    transition: transform 0.3s;
}

.new-game-btn:hover::after {
    transform: rotate(180deg);
}
```

**JavaScript** (use UIRenderer methods):
- `pulseNewGameButton()` for feedback
- `showLoadingState()` / `hideLoadingState()` for reset

### Testing Checklist
- [ ] Button styling is polished
- [ ] Hover effects work
- [ ] Click animation works
- [ ] Loading state shows during reset
- [ ] Pulse effect works
- [ ] Button is always enabled (or disabled appropriately)
- [ ] Icon/emoji rotates on hover (if implemented)

---

## Step 6: Add Game Over Overlay (Enhancement)

### Objective
Enhance the game over overlay with better styling, animations, and improved messaging.

### Enhancements

#### Visual Enhancements
1. **Better styling**: Modern overlay design
2. **Animations**: Fade in, slide in effects
3. **Better messaging**: Multiple message variations
4. **Statistics**: Optional time, difficulty display
5. **Visual distinction**: Different styling for win vs loss

#### Implementation

**CSS Enhancements** (`css/game.css`):

```css
/* Game status overlay enhancements */
.game-status {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.game-status.show {
    opacity: 1;
    visibility: visible;
}

.game-status.hidden {
    display: none;
}

.status-message {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;
    text-align: center;
    padding: 20px;
    border-radius: 8px;
    animation: slideIn 0.5s ease;
}

.status-message.win-message {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.1);
    border: 2px solid #4CAF50;
}

.status-message.loss-message {
    color: #f44336;
    background: rgba(244, 67, 54, 0.1);
    border: 2px solid #f44336;
}

.status-subtext {
    font-size: 18px;
    color: #888;
    margin-top: 10px;
    font-weight: 400;
}

.play-again-btn {
    padding: 14px 28px;
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
    margin-top: 20px;
    animation: slideIn 0.5s ease 0.2s both;
}

.play-again-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
    background: linear-gradient(135deg, #1976D2 0%, #2196F3 100%);
}

.play-again-btn:active {
    transform: translateY(0);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Container positioning for overlay */
.game-container {
    position: relative; /* Required for absolute overlay */
}
```

**HTML Update** (if needed):

```html
<div id="game-status" class="game-status hidden">
    <div class="status-message"></div>
    <div class="status-subtext"></div>
    <button id="play-again-btn" class="play-again-btn">Play Again</button>
</div>
```

**JavaScript** (use UIRenderer methods):
- `showGameOverOverlay(won, stats)` for display
- `hideGameOverOverlay()` for hiding

### Enhanced Overlay with Statistics

```javascript
/**
 * Show game over with statistics
 */
function handleGameOver(won) {
    const stats = {
        time: gameState.timer,
        difficulty: gameBoard.difficulty,
        mines: gameBoard.getMineCount()
    };
    
    uiRenderer.showGameOverOverlay(won, stats);
    
    // Update subtext if needed
    if (stats.time !== undefined) {
        const subtext = `Time: ${uiRenderer.formatTime(stats.time)}`;
        uiRenderer.getElement('gameStatus').find('.status-subtext').text(subtext);
    }
}
```

### Testing Checklist
- [ ] Overlay shows on win
- [ ] Overlay shows on loss
- [ ] Win message is green
- [ ] Loss message is red
- [ ] Animation works (fade in)
- [ ] Play again button works
- [ ] Overlay hides correctly
- [ ] Statistics display correctly (if implemented)
- [ ] Overlay doesn't interfere with canvas

---

## Step 7: Style All UI Elements

### Objective
Create a cohesive, polished design system for all UI elements with consistent styling, spacing, and visual hierarchy.

### Design System

#### Color Palette
- **Primary**: #2196F3 (Blue)
- **Success**: #4CAF50 (Green)
- **Error**: #f44336 (Red)
- **Background**: White / Light gray gradients
- **Text**: #333 (dark), #777 (medium), #aaa (light)

#### Typography
- **Headers**: Bold, 2.5em
- **Labels**: Medium weight, 14px
- **Values**: Bold, 24px, monospace for numbers
- **Buttons**: Semi-bold, 16-18px

#### Spacing
- Consistent padding: 12px, 20px, 24px
- Gap between elements: 8px, 12px, 20px
- Border radius: 6px, 8px, 12px

#### Shadows
- Subtle shadows for depth
- Hover: Larger shadows
- Active: Smaller shadows

### Complete CSS Styling

**File**: `css/game.css` (complete):

```css
/* ============================================
   MarkSweeper - Game-Specific Styles
   ============================================ */

/* Game Controls */
.game-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
}

.difficulty-selector {
    display: flex;
    align-items: center;
    gap: 8px;
}

.difficulty-selector label {
    font-weight: 500;
    color: #555;
    white-space: nowrap;
}

#difficulty {
    padding: 10px 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 140px;
}

#difficulty:hover {
    border-color: #2196F3;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.1);
}

#difficulty:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

#difficulty.disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.6;
}

/* New Game Button */
.new-game-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.new-game-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
}

.new-game-btn:active {
    transform: translateY(0);
}

.new-game-btn.disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
}

/* Game Info */
.game-info {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    padding: 16px;
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
    border-radius: 8px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s;
}

.info-item:hover {
    transform: scale(1.05);
}

.info-item .label {
    font-size: 12px;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
    font-weight: 500;
}

.info-item .value {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
    transition: all 0.2s;
}

#timer.pulse,
#mine-counter.pulse {
    animation: pulse 0.3s ease;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

#mine-counter.negative {
    color: #f44336;
}

#timer.fast {
    color: #4CAF50;
}

#timer.normal {
    color: #2196F3;
}

#timer.slow {
    color: #FF9800;
}

/* Canvas Container */
.canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    padding: 20px;
    background: #f0f0f0;
    border-radius: 8px;
}

#game-canvas {
    border: 3px solid #333;
    border-radius: 4px;
    display: block;
    background: #c0c0c0;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s;
}

#game-canvas:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* Game Status Overlay */
.game-container {
    position: relative;
}

.game-status {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.game-status.show {
    opacity: 1;
    visibility: visible;
}

.game-status.hidden {
    display: none;
}

.status-message {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;
    text-align: center;
    padding: 24px 32px;
    border-radius: 8px;
    animation: slideIn 0.5s ease;
}

.status-message.win-message {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.1);
    border: 2px solid #4CAF50;
}

.status-message.loss-message {
    color: #f44336;
    background: rgba(244, 67, 54, 0.1);
    border: 2px solid #f44336;
}

.status-subtext {
    font-size: 18px;
    color: #aaa;
    margin-top: 10px;
    font-weight: 400;
}

.play-again-btn {
    padding: 14px 28px;
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
    margin-top: 20px;
    animation: slideIn 0.5s ease 0.2s both;
}

.play-again-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
}

.play-again-btn:active {
    transform: translateY(0);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .game-controls {
        flex-direction: column;
        align-items: stretch;
    }
    
    .difficulty-selector {
        width: 100%;
    }
    
    #difficulty {
        width: 100%;
    }
    
    .new-game-btn {
        width: 100%;
    }
    
    .status-message {
        font-size: 24px;
        padding: 16px 24px;
    }
}
```

### Testing Checklist
- [ ] All elements are styled consistently
- [ ] Color scheme is cohesive
- [ ] Typography is readable
- [ ] Spacing is consistent
- [ ] Hover effects work on all interactive elements
- [ ] Focus states are visible
- [ ] Responsive design works on mobile
- [ ] Animations are smooth
- [ ] No visual glitches

---

## Phase 4 Integration Testing

### Complete UI Flow Test

1. **Page Load**
   - [ ] All UI elements render correctly
   - [ ] Styling is consistent
   - [ ] Default values are correct
   - [ ] No layout issues

2. **Game Start**
   - [ ] Timer shows 000
   - [ ] Mine counter shows correct value
   - [ ] Difficulty selector works
   - [ ] New game button works

3. **During Gameplay**
   - [ ] Timer updates smoothly
   - [ ] Mine counter updates on flag/unflag
   - [ ] UI elements provide feedback
   - [ ] Hover effects work

4. **Game Over**
   - [ ] Overlay appears with animation
   - [ ] Message is appropriate (win/loss)
   - [ ] Play again button works
   - [ ] Overlay can be dismissed

5. **New Game**
   - [ ] All UI resets correctly
   - [ ] Overlay hides
   - [ ] Timer resets
   - [ ] Mine counter resets

### Visual Quality Checks
- [ ] Design is cohesive
- [ ] Colors work well together
- [ ] Typography is clear
- [ ] Spacing is consistent
- [ ] Animations are smooth
- [ ] No visual glitches
- [ ] Professional appearance

### Accessibility Checks
- [ ] Color contrast meets WCAG standards
- [ ] Focus states are visible
- [ ] Text is readable
- [ ] Interactive elements are clear
- [ ] Keyboard navigation works (if implemented)

---

## Known Limitations After Phase 4

These features are intentionally NOT implemented:
- ❌ Advanced animations (smooth reveals, explosions)
- ❌ Sound effects
- ❌ Keyboard shortcuts
- ❌ Touch device optimization
- ❌ Advanced statistics tracking
- ❌ Themes/skins

These can be added in Phase 6 (Polish & Refinement).

---

## Success Criteria

Phase 4 is complete when:
- ✅ UIRenderer manages all UI elements
- ✅ Timer functionality is enhanced and polished
- ✅ Mine counter functionality is enhanced and polished
- ✅ Difficulty selector is polished
- ✅ New game button is polished
- ✅ Game over overlay is polished
- ✅ All UI elements are consistently styled
- ✅ Animations and transitions are smooth
- ✅ Design is cohesive and professional
- ✅ UI provides good user feedback
- ✅ Accessibility considerations are met

---

## Performance Notes

### UI Updates
- **Timer updates**: Every second (acceptable)
- **Mine counter**: On flag/unflag (acceptable)
- **Animations**: CSS-based (performant)
- **Overlay**: Only shown when needed (efficient)

### Optimization Opportunities
- Debounce rapid UI updates if needed
- Use CSS transforms for animations (GPU accelerated)
- Minimize DOM manipulation

---

## Next Steps (Phase 5 & 6 Preview)

After Phase 4 completion:
- **Phase 5**: Event handling integration (mostly done, may need polish)
- **Phase 6**: Final polish - animations, sound, advanced features

Phase 4 provides the polished UI foundation for final enhancements.

