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

