// Hinglish language detector + normalizer

const NORMALIZATIONS = {
  "kya h": "kya hai",
  "kese": "kaise",
  "nai": "nahi",
  "maths": "math",
  "sci": "science",
  "eng": "english",
  "btw": "by the way",
  "idk": "I dont know",
  "bta": "batao",
  "smjh nai": "samajh nahi",
  "h ": "hai ",
  " h$": " hai",
};

export function detectLanguage(text) {
  const hasHindi = /[ािीुूेैोौंःअआइईउऊकखगचजटडतदनपबमयरलवशसह]/.test(text);
  const hasEnglish = /[a-zA-Z]/.test(text);
  if (hasHindi && hasEnglish) return "hinglish";
  if (hasHindi) return "hindi";
  return "english";
}

export function normalizeText(text) {
  let normalized = text.toLowerCase().trim();
  Object.entries(NORMALIZATIONS).forEach(([k, v]) => {
    normalized = normalized.replace(new RegExp(k, "gi"), v);
  });
  return normalized;
}

export function detectSubject(text) {
  const t = text.toLowerCase();
  if (/math|maths|plus|minus|table|guna|bhag|fraction|number|addition|subtract|multiply|divide|algebra|geometry/.test(t)) return "math";
  if (/science|planet|space|animal|experiment|earth|sun|moon|water|plant|body|vigyan|biology|chemistry|physics/.test(t)) return "science";
  if (/english|grammar|noun|verb|story|word|sentence|spelling|paragraph|vocabulary|adjective|tense/.test(t)) return "english";
  if (/hindi|shabd|vyakaran|kahani|kavita|barakhadi|vilom|paryayvachi/.test(t)) return "hindi";
  if (/ai|artificial|machine learning|neural|robot|algorithm|data|model|chatgpt|claude/.test(t)) return "ai";
  return null;
}