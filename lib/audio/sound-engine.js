// ============================================================================
// ZERO-LAG WEB AUDIO SYNTHESIZER ENGINE (Pure Native AudioContext)
// No external MP3/WAV downloads needed - Works instantly on all devices!
// ============================================================================

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a synthesized beep/tone
 */
export function playTone(frequency = 440, type = "sine", duration = 0.2, gainValue = 0.2) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Audio play failed:", e.message);
  }
}

/**
 * 🔔 Correct Answer Chime (Bright 3-tone Major Chord: C5 - E5 - G5)
 */
export function playCorrectSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, "triangle", 0.35, 0.25);
    }, idx * 90);
  });
}

/**
 * ❌ Wrong Answer Buzz (Double Low Sawtooth Pulse)
 */
export function playWrongSound() {
  playTone(180, "sawtooth", 0.18, 0.3);
  setTimeout(() => {
    playTone(130, "sawtooth", 0.25, 0.3);
  }, 140);
}

/**
 * 🏆 Victory / Win Fanfare (Celebratory 5-Note Melody)
 */
export function playWinFanfare() {
  const melody = [
    { freq: 523.25, time: 0, dur: 0.15 },   // C5
    { freq: 659.25, time: 130, dur: 0.15 }, // E5
    { freq: 783.99, time: 260, dur: 0.15 }, // G5
    { freq: 1046.5, time: 390, dur: 0.45 }, // C6
    { freq: 1318.5, time: 650, dur: 0.6 }   // E6
  ];

  melody.forEach((m) => {
    setTimeout(() => {
      playTone(m.freq, "triangle", m.dur, 0.35);
    }, m.time);
  });
}

/**
 * 💥 Defeat / Game Over Sound (Descending Minor Drop)
 */
export function playDefeatSound() {
  const notes = [440, 392, 349, 293, 220];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, "sawtooth", 0.25, 0.25);
    }, idx * 120);
  });
}

/**
 * 🤝 Tie / Draw Sound (Harmonic Calm Dual-Chime)
 */
export function playTieSound() {
  playTone(440, "sine", 0.4, 0.2); // A4
  playTone(554.37, "sine", 0.4, 0.2); // C#5
}

/**
 * ♟️ Chess Piece Move / Hop Click
 */
export function playMovePieceSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Wooden tactile click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

/**
 * 🎲 Dice Roll Sound (Rattle sequence)
 */
export function playDiceRollSound() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      playTone(300 + Math.random() * 400, "square", 0.04, 0.1);
    }, i * 40);
  }
}

/**
 * 🌟 Streak / XP Level Up Power Chime
 */
export function playStreakChime() {
  const freqs = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
  freqs.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, "sine", 0.3, 0.25);
    }, i * 80);
  });
}
