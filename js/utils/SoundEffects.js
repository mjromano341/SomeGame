/**
 * SoundEffects.js
 * Procedural sound generation using Web Audio API
 * No external audio files needed!
 */

class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.enabled = true;

        // Initialize audio context on first user interaction
        this.initAudioContext();
    }

    /**
     * Initialize Web Audio API context
     */
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    /**
     * Ensure audio context is resumed (required for some browsers)
     */
    ensureResumed() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    /**
     * Play cell reveal sound (soft click)
     */
    playReveal() {
        if (!this.enabled) return;
        this.ensureResumed();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }

    /**
     * Play flag sound (higher pitch click)
     */
    playFlag() {
        if (!this.enabled) return;
        this.ensureResumed();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 1200;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.04);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.04);
    }

    /**
     * Play unflag sound (lower pitch)
     */
    playUnflag() {
        if (!this.enabled) return;
        this.ensureResumed();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 600;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.06, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.04);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.04);
    }

    /**
     * Play explosion sound (mine hit)
     */
    playExplosion() {
        if (!this.enabled) return;
        this.ensureResumed();

        // Create noise buffer
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;

        const gainNode = this.audioContext.createGain();

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        filter.frequency.setValueAtTime(500, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);

        noise.start(this.audioContext.currentTime);
        noise.stop(this.audioContext.currentTime + 0.5);
    }

    /**
     * Play victory sound (ascending arpeggio)
     */
    playVictory() {
        if (!this.enabled) return;
        this.ensureResumed();

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (major chord)
        const duration = 0.15;

        notes.forEach((frequency, index) => {
            const startTime = this.audioContext.currentTime + (index * duration);

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.15, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }

    /**
     * Play cascade sound (multiple reveals at once)
     */
    playCascade() {
        if (!this.enabled) return;
        this.ensureResumed();

        // Rapid ascending tones
        for (let i = 0; i < 5; i++) {
            const startTime = this.audioContext.currentTime + (i * 0.02);
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = 400 + (i * 100);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.05, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.05);
        }
    }

    /**
     * Toggle sound effects on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Check if sound is enabled
     */
    isEnabled() {
        return this.enabled;
    }
}
