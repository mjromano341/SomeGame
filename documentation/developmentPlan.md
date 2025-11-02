# MarkSweeper Development Plan

## Project Overview
Build a high-quality Minesweeper clone called "MarkSweeper" using vanilla HTML, JavaScript, CSS, and HTML5 Canvas. The game should be simple to understand but polished in execution, with clean code organization.

## Technical Stack
- **HTML5**: Structure and Canvas element
- **Vanilla JavaScript (ES6+)**: Core game logic
- **CSS3**: Styling and animations
- **Canvas API**: Game rendering
- **jQuery**: DOM manipulation and event handling (allowed)
- **No frameworks**: React, Vue, Angular, etc. are not allowed

## Architecture & Code Organization

### Directory Structure
```
SomeGame/
├── index.html              # Main HTML entry point
├── css/
│   ├── styles.css          # Main stylesheet
│   └── game.css            # Game-specific styles
├── js/
│   ├── main.js             # Entry point, initialization
│   ├── game/
│   │   ├── GameBoard.js    # Board state and logic
│   │   ├── Cell.js         # Individual cell state
│   │   ├── GameLogic.js    # Game rules (reveal, flag, win/loss)
│   │   └── GameState.js    # Game state management
│   ├── render/
│   │   ├── CanvasRenderer.js # Canvas drawing logic
│   │   └── UIRenderer.js     # UI elements (timer, mine count, etc.)
│   └── utils/
│       ├── Constants.js    # Game constants (difficulties, sizes)
│       └── Helpers.js      # Utility functions
└── assets/
    └── (sprites/sounds if needed)
```

### Core Components

#### 1. **GameBoard.js**
- Manages the grid of cells
- Handles board initialization
- Places mines randomly
- Calculates adjacent mine counts
- Provides cell access methods

#### 2. **Cell.js**
- Represents a single cell
- Properties: isMine, isRevealed, isFlagged, adjacentMines
- Methods: reveal(), flag(), reset()

#### 3. **GameLogic.js**
- Game flow control
- Handle cell clicks (left/right)
- Reveal cascade (flood fill for empty cells)
- Win/loss detection
- First-click safety (never mine on first click)

#### 4. **GameState.js**
- Current game state: PLAYING, WON, LOST, READY
- Timer management
- Mine counter
- Difficulty level

#### 5. **CanvasRenderer.js**
- All canvas drawing operations
- Draw cells (hidden, revealed, flagged, mine)
- Draw numbers and indicators
- Handle canvas sizing and scaling
- Responsive canvas rendering

#### 6. **UIRenderer.js**
- Non-canvas UI elements
- Timer display
- Mine counter
- Difficulty selector
- New game button
- Game status messages

#### 7. **Constants.js**
- Difficulty presets:
  - Beginner: 9x9, 10 mines
  - Intermediate: 16x16, 40 mines
  - Expert: 30x16, 99 mines
- Cell size
- Colors and styling constants

#### 8. **main.js**
- Initialize game
- Set up event listeners
- Coordinate between components
- Handle jQuery DOM ready

## Features

### Core Gameplay
- [x] Grid-based board with hidden mines
- [x] Left-click to reveal cells
- [x] Right-click to flag cells
- [x] Reveal cascade for empty cells
- [x] Adjacent mine count display (1-8)
- [x] Win condition: reveal all non-mine cells
- [x] Loss condition: reveal a mine
- [x] First-click safety (no mine on first click)

### User Interface
- [x] Canvas-based game board
- [x] Timer (starts on first click, stops on win/loss)
- [x] Mine counter (remaining flags)
- [x] Difficulty selector (Beginner, Intermediate, Expert)
- [x] New game button
- [x] Visual feedback for clicks
- [x] Game over overlay (win/loss message)
- [x] Responsive design

### Visual Polish
- [x] Clean, modern styling
- [x] Smooth animations
- [x] Hover effects on cells
- [x] Color-coded numbers (traditional Minesweeper colors)
- [x] Visual distinction: hidden, revealed, flagged states
- [x] Mine explosion animation on loss
- [x] Happy face / sad face indicator (optional)

### Code Quality
- [x] Clean separation of concerns
- [x] Modular, reusable components
- [x] Well-commented code
- [x] Consistent naming conventions
- [x] Error handling
- [x] No global pollution

## Implementation Phases

### Phase 1: Foundation (Core Structure)
1. Set up HTML structure with canvas element
2. Create basic CSS layout
3. Implement Constants.js with difficulty presets
4. Create Cell.js class
5. Create GameBoard.js with basic grid initialization
6. Create GameState.js for state management

### Phase 2: Game Logic
1. Implement mine placement (random, first-click safe)
2. Implement adjacent mine counting
3. Create GameLogic.js with reveal logic
4. Implement reveal cascade (flood fill for empty cells)
5. Add flag/unflag functionality
6. Implement win/loss detection

### Phase 3: Rendering
1. Create CanvasRenderer.js
2. Draw basic grid and cells
3. Draw revealed cells with numbers
4. Draw flagged cells
5. Draw hidden cells
6. Add hover effects
7. Handle canvas scaling and responsiveness

### Phase 4: User Interface
1. Create UIRenderer.js
2. Add timer functionality
3. Add mine counter
4. Add difficulty selector
5. Add new game button
6. Add game over overlay
7. Style all UI elements

### Phase 5: Event Handling & Integration
1. Connect canvas click events
2. Handle left-click (reveal)
3. Handle right-click (flag)
4. Integrate timer with game flow
5. Connect UI controls to game state
6. Test all interactions

### Phase 6: Polish & Refinement
1. Add animations (reveal, flag, explosion)
2. Improve visual design
3. Add sound effects (optional)
4. Optimize performance
5. Test edge cases
6. Cross-browser testing
7. Mobile responsiveness (touch events)

## Technical Considerations

### Canvas Rendering
- Use requestAnimationFrame for smooth animations
- Implement proper coordinate mapping (screen to grid)
- Handle canvas scaling for different screen sizes
- Clear and redraw on each frame or on state change

### Performance
- Efficient board representation (2D array)
- Optimize reveal cascade algorithm
- Minimize canvas redraws (only on changes)
- Efficient event handling (event delegation)

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Canvas API support
- ES6+ JavaScript features
- CSS Grid/Flexbox for layout

### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- High contrast mode support
- Clear visual feedback

## Game Rules Implementation

### Cell States
- **Hidden**: Default state, clickable
- **Revealed**: Shows number or empty, not clickable
- **Flagged**: Marked as potential mine, prevents accidental reveal

### Reveal Behavior
- Left-click on hidden cell: Reveal cell
- If cell is empty (0 mines): Cascade reveal all adjacent empty cells
- If cell has mines adjacent: Show number (1-8)
- If cell is a mine: Game over

### Flag Behavior
- Right-click on hidden cell: Toggle flag
- Right-click on flagged cell: Remove flag
- Flagged cells cannot be revealed by left-click

### First Click Safety
- First left-click cannot be a mine
- Regenerate board if first click location has mine
- Ensures fair gameplay

## Visual Design Guidelines

### Color Scheme
- Background: Light gray (#c0c0c0 or modern flat design)
- Hidden cells: Raised/3D button style
- Revealed cells: Flat, slightly inset
- Numbers: Color-coded (1-blue, 2-green, 3-red, 4-dark blue, etc.)
- Mines: Black with red circle
- Flags: Red flag icon

### Typography
- Clear, readable font for numbers
- Consistent sizing
- Good contrast ratios

### Animations
- Smooth cell reveal (fade or slide)
- Flag placement/removal animation
- Mine explosion on game over
- Subtle hover effects

## Testing Checklist

- [ ] Beginner difficulty works correctly
- [ ] Intermediate difficulty works correctly
- [ ] Expert difficulty works correctly
- [ ] First click is never a mine
- [ ] Reveal cascade works correctly
- [ ] Flag/unflag toggles properly
- [ ] Win condition detected correctly
- [ ] Loss condition detected correctly
- [ ] Timer starts/stops correctly
- [ ] Mine counter updates correctly
- [ ] New game resets properly
- [ ] Canvas renders correctly at different sizes
- [ ] Right-click context menu is prevented
- [ ] Edge cases (all mines flagged, etc.)
- [ ] Mobile/touch device compatibility

## Future Enhancements (Optional)
- Score tracking / high scores
- Custom difficulty settings
- Themes/skins
- Tutorial/help mode
- Statistics tracking
- Sound effects and music
- Hint system

## Notes
- Keep code clean and well-documented
- Follow JavaScript best practices
- Use meaningful variable and function names
- Comment complex algorithms (reveal cascade, mine placement)
- Test thoroughly before considering complete
- Prioritize user experience and visual polish

