import { snakes, ladders } from "./config";
import { animateJump, animateSlide } from "./animationHelpers";

export function movePlayer(current, dice, onUpdate, onComplete, onEvent) {
  let steps = 0;

  const interval = setInterval(() => {
    steps++;
    current++;

    if (current > 100) current = 100;

    onUpdate(current);

    if (steps === dice) {
      clearInterval(interval);

      if (ladders[current]) {
        const to = ladders[current];
        onEvent("ladder", current, to);

        setTimeout(() => {
          animateJump(onUpdate, to);
        }, 300);
      } else if (snakes[current]) {
        const to = snakes[current];
        onEvent("snake", current, to);

        setTimeout(() => {
          animateSlide(onUpdate, to);
        }, 300);
      }

      onComplete();
    }
  }, 150);
}