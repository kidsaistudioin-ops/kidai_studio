export default function playSound(type) {
  const audio = new Audio(`/sounds/${type}.mp3`);
  audio.play();
}