export function getReward(position) {
  if (position === 100) return 50;
  if (position > 50) return 20;
  return 5;
}