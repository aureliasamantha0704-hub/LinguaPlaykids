/**
 * Audio synthesis helper using Web Speech API for TTS and Web Audio API for FX.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.populateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.populateVoices();
      }
    }
  }

  private populateVoices() {
    try {
      this.voices = window.speechSynthesis.getVoices();
    } catch {
      this.voices = [];
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play procedural sound effects
  playClick() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio error fallback silent
    }
  }

  playCorrect() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch {
      // Audio error fallback
    }
  }

  playWrong() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + 0.25);
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio error fallback
    }
  }

  playFanfare() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const melody = [
        { f: 523.25, d: 0.15, delay: 0 },
        { f: 659.25, d: 0.15, delay: 0.15 },
        { f: 783.99, d: 0.15, delay: 0.3 },
        { f: 1046.5, d: 0.5, delay: 0.45 },
      ];

      melody.forEach((item) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, ctx.currentTime + item.delay);

        gain.gain.setValueAtTime(0.25, ctx.currentTime + item.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.delay + item.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + item.delay);
        osc.stop(ctx.currentTime + item.delay + item.d + 0.05);
      });
    } catch {
      // Audio error fallback
    }
  }

  speak(text: string, lang: 'en' | 'zh', speed: number = 0.85): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        this.playClick();
        resolve();
        return;
      }

      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance = utterance; // Prevent garbage collection in Chrome

        utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
        utterance.rate = Math.max(0.5, Math.min(1.5, speed));
        utterance.pitch = 1.1; // Slightly friendly kid pitch

        let resolved = false;
        const complete = () => {
          if (!resolved) {
            resolved = true;
            this.currentUtterance = null;
            resolve();
          }
        };

        utterance.onend = complete;
        utterance.onerror = complete;

        // Auto timeout fallback so speech never hangs game state
        setTimeout(complete, 4000);

        // Find appropriate voice
        if (this.voices.length === 0) {
          this.populateVoices();
        }

        if (this.voices.length > 0) {
          const matchingVoice = this.voices.find((v) =>
            lang === 'zh'
              ? v.lang.toLowerCase().includes('zh') || v.lang.toLowerCase().includes('cn')
              : v.lang.toLowerCase().includes('en-us') || v.lang.toLowerCase().includes('en')
          );
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }
        }

        window.speechSynthesis.speak(utterance);
      } catch {
        this.playClick();
        resolve();
      }
    });
  }
}

export const sound = new SoundEngine();
