export function getEmotion(dice, event) {
  if (event === "snake") return "sad";
  if (event === "ladder") return "happy";

  if (dice === 1) return "normal";
  if (dice <= 3) return "smile";
  if (dice <= 5) return "happy";
  if (dice === 6) return "super";

  return "normal";
}