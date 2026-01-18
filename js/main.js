/**
 * main.js
 * Entry point and initialization for MarkSweeper
 */

$(document).ready(function() {
    // Initialize game components
    let gameBoard = null;
    let gameState = null;
    let gameLogic = null;
    let renderer = null;
    let canvas = null;
    let timerUpdateInterval = null;
    let soundEffects = new SoundEffects();

    /**
     * Initialize the game
     */
    function initGame() {
        // Get current difficulty
        const difficulty = $('#difficulty').val();

        // Stop timer updates if running
        stopTimerUpdates();

        // Remove old canvas event listeners
        if (canvas) {
            canvas.onmousemove = null;
            canvas.onmouseleave = null;
            canvas.onclick = null;
            canvas.oncontextmenu = null;
        }

        // Get canvas element
        canvas = document.getElementById('game-canvas');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        // Initialize game board
        gameBoard = new GameBoard(difficulty);

        // Initialize game state
        const config = Constants.getDifficultyConfig(difficulty);
        gameState = new GameState(config.mines);

        // Initialize game logic
        gameLogic = new GameLogic(gameBoard, gameState);

        // Initialize renderer
        renderer = new CanvasRenderer(canvas, gameBoard, gameState);
        renderer.render();

        // Setup canvas event listeners
        setupCanvasEvents();

        // Add visual class for canvas
        $(canvas).removeClass('playing');

        // Update UI
        updateMineCounter();
        updateTimer();

        // Hide game over overlay
        $('#game-status').addClass('hidden');

        // Log for debugging
        console.log('Game initialized:', {
            difficulty,
            rows: gameBoard.getRows(),
            cols: gameBoard.getCols(),
            mines: config.mines
        });
    }

    /**
     * Setup canvas event listeners
     */
    function setupCanvasEvents() {
        // Mouse move for hover effect
        canvas.onmousemove = function(e) {
            if (!gameState.isPlaying() && gameState.getState() !== 'READY') {
                return; // Don't show hover if game is over
            }

            const coords = renderer.screenToGrid(e.clientX, e.clientY);
            if (coords) {
                const cell = gameBoard.getCell(coords.row, coords.col);
                // Only show hover on unrevealed, unflagged cells
                if (!cell.isRevealed && !cell.isFlagged) {
                    renderer.setHoveredCell(coords.row, coords.col);
                    canvas.style.cursor = 'pointer';
                } else {
                    renderer.clearHoveredCell();
                    canvas.style.cursor = 'default';
                }
            } else {
                renderer.clearHoveredCell();
                canvas.style.cursor = 'default';
            }
        };

        // Mouse leave - clear hover
        canvas.onmouseleave = function() {
            renderer.clearHoveredCell();
            canvas.style.cursor = 'default';
        };

        // Left click - reveal cell
        canvas.onclick = function(e) {
            const coords = renderer.screenToGrid(e.clientX, e.clientY);
            if (coords) {
                handleLeftClick(coords.row, coords.col);
            }
        };

        // Right click - flag cell
        canvas.oncontextmenu = function(e) {
            e.preventDefault(); // Prevent context menu

            const coords = renderer.screenToGrid(e.clientX, e.clientY);
            if (coords) {
                handleRightClick(coords.row, coords.col);
            }

            return false;
        };
    }

    /**
     * Handle left click (reveal)
     */
    function handleLeftClick(row, col) {
        const cell = gameBoard.getCell(row, col);

        // Can't click revealed cells
        if (cell.isRevealed) {
            return;
        }

        // Can't click flagged cells
        if (cell.isFlagged) {
            return;
        }

        // Can't play if game is over
        if (gameState.hasWon() || gameState.hasLost()) {
            return;
        }

        // Handle the click
        const result = gameLogic.handleCellClick(row, col);

        // Play appropriate sound
        if (result.revealed && result.revealed.length > 1) {
            soundEffects.playCascade();
        } else {
            soundEffects.playReveal();
        }

        // Animate the reveal
        if (result.revealed && result.revealed.length > 0) {
            renderer.animateRevealCascade(result.revealed);
        } else {
            renderer.animateReveal(row, col);
        }

        // Update UI
        updateUI();
        renderer.render();

        // Check for game over
        if (gameState.hasWon()) {
            soundEffects.playVictory();
            handleGameOver(true);
        } else if (gameState.hasLost()) {
            soundEffects.playExplosion();
            // Animate explosion
            renderer.animateExplosion(row, col);
            setTimeout(() => {
                handleGameOver(false);
            }, 300);
        }
    }

    /**
     * Handle right click (flag)
     */
    function handleRightClick(row, col) {
        const cell = gameBoard.getCell(row, col);

        // Can't flag revealed cells
        if (cell.isRevealed) {
            return;
        }

        // Can't play if game is over
        if (gameState.hasWon() || gameState.hasLost()) {
            return;
        }

        // Check if cell is currently flagged
        const wasFlagged = cell.isFlagged;

        // Toggle flag
        gameLogic.handleCellFlag(row, col);

        // Play appropriate sound
        if (wasFlagged) {
            soundEffects.playUnflag();
        } else {
            soundEffects.playFlag();
        }

        // Update UI
        updateUI();
        renderer.render();
    }

    /**
     * Start timer updates
     */
    function startTimerUpdates() {
        if (timerUpdateInterval) {
            clearInterval(timerUpdateInterval);
        }

        timerUpdateInterval = setInterval(function() {
            if (gameState && gameState.isPlaying()) {
                updateTimer();
            }
        }, Constants.TIMER_INTERVAL);
    }

    /**
     * Stop timer updates
     */
    function stopTimerUpdates() {
        if (timerUpdateInterval) {
            clearInterval(timerUpdateInterval);
            timerUpdateInterval = null;
        }
    }

    /**
     * Update mine counter display
     */
    function updateMineCounter() {
        if (gameState) {
            const remaining = gameState.minesRemaining;
            $('#mine-counter').text(remaining.toString().padStart(3, '0'));
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
     * Handle game over
     */
    function handleGameOver(won) {
        stopTimerUpdates();
        const statusDiv = $('#game-status');
        const messageDiv = $('.status-message');

        // Remove old animation classes
        statusDiv.removeClass('victory defeat');

        if (won) {
            messageDiv.text('🎉 Congratulations! You won!');
            messageDiv.css('color', '#4CAF50');
            statusDiv.addClass('victory');
        } else {
            messageDiv.text('💥 Game Over! You hit a mine.');
            messageDiv.css('color', '#f44336');
            statusDiv.addClass('defeat');

            // Reveal all mines
            if (gameLogic) {
                gameLogic.revealAllMines();
            }
        }

        // Render final state
        renderer.render();

        // Show game over overlay with delay
        setTimeout(() => {
            statusDiv.removeClass('hidden');
        }, 400);
    }

    /**
     * Update UI elements
     */
    function updateUI() {
        updateMineCounter();
        updateTimer();
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

    /**
     * Handle play again button
     */
    $('#play-again-btn').on('click', function() {
        initGame();
    });

    // Hook into GameState to start timer updates
    // Override start method to trigger timer updates
    const originalGameStateStart = GameState.prototype.start;
    GameState.prototype.start = function() {
        originalGameStateStart.call(this);
        startTimerUpdates();
        $(canvas).addClass('playing');
    };

    // Initialize game on page load
    initGame();

    // Expose for debugging
    window.markSweeper = {
        gameBoard: () => gameBoard,
        gameState: () => gameState,
        gameLogic: () => gameLogic,
        renderer: () => renderer,
        canvas: () => canvas
    };
});
