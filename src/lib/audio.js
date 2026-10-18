// Offline Sound Effects Manager (Feature 56)
// Rules:
// - Muted by default
// - Off under Reduce Effects or prefers-reduced-motion
// - Plays local audio files in /public/sounds/ with Web Audio API fallback

class SoundManager {
  constructor() {
    this.ctx = null;
    this.audioCache = {};
  }

  isReduceEffectsActive() {
    if (typeof window === 'undefined') return true;
    try {
      const saved = localStorage.getItem('ecomart_reduce_effects');
      if (saved !== null && JSON.parse(saved) === true) return true;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
      }
    } catch (_e) {}
    return false;
  }

  isEnabled() {
    if (this.isReduceEffectsActive()) return false;
    try {
      return localStorage.getItem('eco_sound_effects') === 'true';
    } catch {
      return false;
    }
  }

  setEnabled(val) {
    try {
      localStorage.setItem('eco_sound_effects', String(!!val));
    } catch (e) {
      console.warn(e);
    }
  }

  initWebAudio() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  // Play local audio file with web audio fallback
  playLocalFile(filename, fallbackFn) {
    if (!this.isEnabled()) return;

    try {
      let audio = this.audioCache[filename];
      if (!audio) {
        audio = new Audio(`/sounds/${filename}`);
        this.audioCache[filename] = audio;
      }
      audio.currentTime = 0;
      audio.volume = 0.4;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to Web Audio synthesis if local audio element is blocked
          if (fallbackFn) fallbackFn();
        });
      }
    } catch {
      if (fallbackFn) fallbackFn();
    }
  }

  // Play gentle pop
  playPop() {
    if (!this.isEnabled()) return;
    this.playLocalFile('pop.wav', () => this.synthesizePop());
  }

  synthesizePop() {
    this.initWebAudio();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }

  // Play harmonious success chime
  playSuccess() {
    if (!this.isEnabled()) return;
    this.playLocalFile('success.wav', () => this.synthesizeSuccess());
  }

  synthesizeSuccess() {
    this.initWebAudio();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.06, this.ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.26);
      });
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }

  // Play eco swap chime
  playSwap() {
    if (!this.isEnabled()) return;
    this.playLocalFile('swap.wav', () => this.synthesizeSwap());
  }

  synthesizeSwap() {
    this.initWebAudio();
    if (!this.ctx) return;
    try {
      const notes = [440, 554.37, 659.25]; // A4, C#5, E5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.07, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.32);
      });
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }

  // Play tactile click
  playClick() {
    if (!this.isEnabled()) return;
    this.playLocalFile('click.wav', () => this.synthesizePop());
  }
}

export const sound = new SoundManager();
