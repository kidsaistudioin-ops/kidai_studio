export function animateJump(setPosition, to) {
  let current = to - 5;

  const interval = setInterval(() => {
    current++;
    setPosition(current);

    if (current >= to) {
      clearInterval(interval);
    }
  }, 100);
}

export function animateSlide(setPosition, to) {
  let current = to + 5;

  const interval = setInterval(() => {
    current--;
    setPosition(current);

    if (current <= to) {
      clearInterval(interval);
    }
  }, 100);
}