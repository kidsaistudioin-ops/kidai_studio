export function animateJump(setPosition, from, to) {
  // CSS transition automatically smooth jump karega, 
  // isliye hum direct final position set kar denge
  setPosition(to);
}

export function animateSlide(setPosition, from, to) {
  // Saanp ke kaatne par bhi CSS transition se smooth slide hoga
  setPosition(to);
}