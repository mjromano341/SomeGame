# MarkSweeper 💣

A modern, polished Minesweeper clone built with vanilla JavaScript, HTML5 Canvas, and CSS3.

![MarkSweeper](https://img.shields.io/badge/version-1.0.0-blue)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

## Features ✨

- **Beautiful UI**: Modern gradient design with smooth animations
- **Canvas Rendering**: Crisp, responsive game board with 3D-style cells
- **Sound Effects**: Procedurally generated audio using Web Audio API
- **Three Difficulty Levels**:
  - 🟢 Beginner: 9×9 grid, 10 mines
  - 🟡 Intermediate: 16×16 grid, 40 mines
  - 🔴 Expert: 30×16 grid, 99 mines
- **Smooth Animations**: Cell reveals, flag placement, and explosions
- **First-Click Safety**: You'll never hit a mine on your first click
- **Smart Reveal**: Click empty cells to cascade reveal adjacent cells
- **Responsive Design**: Works on desktop and mobile devices

## How to Play 🎮

1. **Left-click** a cell to reveal it
2. **Right-click** a cell to flag it as a mine
3. **Numbers** show how many mines are adjacent to that cell
4. **Win** by revealing all non-mine cells
5. **Lose** if you reveal a mine

### Game Mechanics

- **First Click Safety**: The board regenerates if your first click would hit a mine
- **Cascade Reveal**: Clicking an empty cell (0 adjacent mines) automatically reveals all connected empty cells
- **Mine Counter**: Shows remaining mines (total mines - flags placed)
- **Timer**: Starts on first click, tracks your solve time

## Installation 🚀

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/mjromano341/SomeGame.git
   cd SomeGame
   ```

2. Open `index.html` in your browser:
   ```bash
   # On Windows
   start index.html

   # On macOS
   open index.html

   # On Linux
   xdg-open index.html
   ```

   Or serve with a local server:
   ```bash
   # Python 3
   python -m http.server 8080

   # Node.js
   npx http-server
   ```

3. Play! 🎉

## Project Structure 📁

```
SomeGame/
├── index.html                 # Main HTML entry point
├── css/
│   ├── styles.css            # Main stylesheet
│   └── game.css              # Game-specific styles
├── js/
│   ├── main.js               # Entry point, initialization
│   ├── game/
│   │   ├── Cell.js           # Cell state management
│   │   ├── GameBoard.js      # Board state and logic
│   │   ├── GameLogic.js      # Game rules and mechanics
│   │   └── GameState.js      # Game state management
│   ├── render/
│   │   └── CanvasRenderer.js # Canvas drawing logic
│   └── utils/
│       ├── Constants.js      # Game constants
│       └── SoundEffects.js   # Audio generation
└── documentation/
    ├── developmentPlan.md    # Project planning
    └── phase*-*.md           # Phase documentation
```

## Technology Stack 💻

- **HTML5**: Structure and Canvas element
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Vanilla JavaScript, no frameworks
- **jQuery**: DOM manipulation and event handling
- **Canvas API**: Game rendering
- **Web Audio API**: Procedural sound generation

## Architecture 🏗️

### Clean Separation of Concerns

- **Game Logic** (`game/`): Pure game mechanics, no rendering
- **Rendering** (`render/`): Canvas drawing, completely decoupled from logic
- **State Management** (`GameState.js`): Centralized game state
- **Main Controller** (`main.js`): Coordinates all components

### Key Design Patterns

- **Module Pattern**: Each component is self-contained
- **Observer Pattern**: State changes trigger UI updates
- **Facade Pattern**: Simple public interfaces for complex operations

## Development 🔧

### Phased Development Approach

This project was built in 6 phases:

1. **Phase 1**: Foundation - Core structure and components
2. **Phase 2**: Game Logic - Mine placement, reveal mechanics, win/loss detection
3. **Phase 3**: Rendering - Canvas drawing and visual representation
4. **Phase 4**: User Interface - Controls, timer, mine counter
5. **Phase 5**: Event Handling - Click events and integration
6. **Phase 6**: Polish - Animations, sounds, and refinements

### Git Workflow

- **Main Branch**: Production-ready code
- **Development Branch**: Integration branch for QA
- **Feature Branches**: Individual phase implementations

See `agents.md` for detailed workflow rules.

## Browser Support 🌐

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires support for:
- HTML5 Canvas
- ES6+ JavaScript
- Web Audio API (for sounds)
- CSS Grid/Flexbox

## Performance ⚡

- **Efficient Rendering**: Only redraws when state changes
- **Optimized Algorithms**: Flood fill for cascade reveal
- **Smooth Animations**: 60 FPS with requestAnimationFrame
- **Minimal DOM Manipulation**: Canvas-based rendering

## Credits 👏

Built with ❤️ by the MarkSweeper team

- **Design**: Modern UI/UX with gradient aesthetics
- **Sound**: Procedural audio synthesis
- **Graphics**: Canvas-based rendering with 3D effects

## License 📄

MIT License - feel free to use this project for learning or as a base for your own games!

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements 🚀

Potential features for future versions:

- 📊 Score tracking and leaderboards
- 🎨 Multiple themes/skins
- 🎯 Custom difficulty settings
- 💾 Save/load game state
- 📱 Progressive Web App (PWA)
- 🏆 Achievements system
- 🎓 Tutorial mode
- 📈 Statistics tracking

## Acknowledgments 🙏

Inspired by the classic Microsoft Minesweeper, reimagined with modern web technologies.

---

**Enjoy playing MarkSweeper!** 🎮💣✨
