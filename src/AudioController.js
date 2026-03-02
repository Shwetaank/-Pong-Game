// AudioController.js
export class AudioController {
  constructor() {
    this.audioCtx = null;
    this.enabled = true; // Could be hooked up to Settings UI later
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(frequency, type, duration, vol = 0.1) {
    if (!this.enabled) return;
    this.init(); // Lazy init required by browsers (must happen after user interaction)
    
    // Ensure context is running (fixes Safari/Chrome strict autoplay policy sometimes)
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    
    // Quick fade out to avoid speaker pops
    gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start();
    oscillator.stop(this.audioCtx.currentTime + duration);
  }

  playPaddleHit() {
    // A classic mid-low "bop"
    this.playTone(300, 'square', 0.1, 0.15);
  }

  playWallHit() {
    // A slightly higher, shorter "bip"
    this.playTone(450, 'square', 0.05, 0.1);
  }

  playScore() {
    // A tiny celebratory arpeggio/slide
    this.init();
    if (!this.enabled || this.audioCtx.state === 'suspended') return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.3);
  }
}
