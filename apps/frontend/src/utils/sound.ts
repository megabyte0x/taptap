class SoundManager {
    private static instance: SoundManager;
    private coinSound: HTMLAudioElement;
    private isMuted: boolean = false;

    private constructor() {
        this.coinSound = new Audio('/coin-sound.mp3');
        this.coinSound.volume = 0.3; // Adjust volume (0.0 to 1.0)
    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    public playTapSound() {
        if (!this.isMuted) {
            // Clone the audio to allow multiple simultaneous plays
            const sound = this.coinSound.cloneNode() as HTMLAudioElement;
            sound.play().catch(() => {
                // Ignore errors (some browsers block autoplay)
            });
        }
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