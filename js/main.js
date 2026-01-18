/**
 * main.js
 * Entry point and initialization for MarkSweeper
 */

$(document).ready(function() {
    // Initialize game components
    let gameBoard = null;
    let gameState = null;
    let gameLogic = null;
    let canvas = null;
    let ctx = null;
    let timerUpdateInterval = null;
    
    /**
     * Initialize the game
     */
    function initGame() {
        // Get current difficulty
        const difficulty = $('#difficulty').val();
        
        // Stop timer updates if running
        stopTimerUpdates();
        
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
        
        // Initialize game logic
        gameLogic = new GameLogic(gameBoard, gameState);
        
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
     * Handle game over
     */
    function handleGameOver(won) {
        stopTimerUpdates();
        const statusDiv = $('#game-status');
        const messageDiv = $('.status-message');
        
        statusDiv.removeClass('hidden');
        
        if (won) {
            messageDiv.text('Congratulations! You won!');
            messageDiv.css('color', '#4CAF50');
        } else {
            messageDiv.text('Game Over! You hit a mine.');
            messageDiv.css('color', '#f44336');
            
            // Reveal all mines (for Phase 3 rendering)
            if (gameLogic) {
                gameLogic.revealAllMines();
            }
        }
        
        // Final UI update
        updateUI();
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
    };
    
    // Initialize game on page load
    initGame();
    
    // Expose for debugging (remove in production)
    window.markSweeper = {
        gameBoard: () => gameBoard,
        gameState: () => gameState,
        gameLogic: () => gameLogic,
        canvas: () => canvas,
        ctx: () => ctx
    };
});

