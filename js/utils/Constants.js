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

