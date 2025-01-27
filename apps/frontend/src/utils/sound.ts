class SoundManager {
    private static instance: SoundManager;
    private audioContext: AudioContext;
    private tapBuffer: AudioBuffer | null = null;
    private isMuted: boolean = false;
    private isInitialized: boolean = false;

    private constructor() {
        // Initialize the AudioContext
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    /**
     * Initializes the SoundManager by loading and decoding the tap sound.
     * This should be called in response to a user interaction to ensure the AudioContext is unlocked.
     * @param url The URL of the tap sound file.
     */
    public async initialize() {
        if (this.isInitialized) return;
        await this.loadTapSound('./coin-sound.webm');
        this.isInitialized = true;
    }

    /**
     * Loads and decodes the tap sound into an AudioBuffer.
     * @param url The URL of the tap sound file.
     */
    private async loadTapSound(url: string) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            this.tapBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to load tap sound:', error);
        }
    }

    /**
     * Plays the tap sound immediately.
     * Ensures the AudioContext is resumed if it was suspended.
     */
    public async playTapSound() {
        if (this.isMuted || !this.tapBuffer) {
            return;
        }

        // Resume the AudioContext if it's suspended (required in some browsers)
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.error('Failed to resume AudioContext:', error);
            }
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = this.tapBuffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    public setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    public isSoundMuted() {
        return this.isMuted;
    }
}

export default SoundManager; 