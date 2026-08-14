// A short two-tone "ding" synthesized on the fly rather than loading an
// audio file. Browsers block audio from playing before the user has
// interacted with the page at all (autoplay policy) — this is a real
// browser limitation, not a bug here, so the very first notification after
// a fresh page load may play silently if the admin hasn't clicked/typed
// anything yet. Every notification after that first interaction plays fine.
export function playNotificationChime() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    // Two ascending notes, like a typical notification "ding-dong"
    playTone(880, now, 0.18);
    playTone(1320, now + 0.12, 0.22);

    // Clean up the audio context shortly after both tones finish
    setTimeout(() => ctx.close(), 600);
  } catch {
    // Silently ignore — a missed notification sound isn't worth surfacing
    // an error over.
  }
}
