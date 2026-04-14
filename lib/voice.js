// Web Speech API — Browser built-in, ZERO cost
// Works: Chrome, Firefox, Safari, Edge
// NOT open source — browser proprietary feature

export function speak(text, options = {}) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = options.lang || "en-IN";       // Indian English accent
  utt.rate = options.rate || 0.88;           // Slightly slow for kids
  utt.pitch = options.pitch || 1.1;          // Natural pitch
  utt.volume = options.volume || 1;

  if (options.onStart) utt.onstart = options.onStart;
  if (options.onEnd) utt.onend = options.onEnd;
  if (options.onError) utt.onerror = options.onError;

  window.speechSynthesis.speak(utt);
}

export const stopSpeaking = () => {
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
};

export const isSpeaking = () => {
  if (typeof window === "undefined") return false;
  return window.speechSynthesis?.speaking || false;
};

export const isSupported = () => {
  return typeof window !== "undefined" && "speechSynthesis" in window;
};
