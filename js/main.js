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

