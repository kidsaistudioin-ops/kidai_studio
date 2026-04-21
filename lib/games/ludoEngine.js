// --- CORE GAME CONSTANTS ---

export const C = {
    bg: '#07090f', card: '#0f1520', border: '#1e2d45',
    orange: '#ff6b35', purple: '#7c3aed', text: '#f1f5f9', muted: '#64748b',
    red: '#ef4444', green: '#22c55e', yellow: '#f59e0b', blue: '#3b82f6'
};

export const PLAYERS = {
    red: { name: 'Red', color: C.red, start: 0, homeStart: 51 },
    green: { name: 'Green', color: C.green, start: 13, homeStart: 57 },
    yellow: { name: 'Yellow', color: C.yellow, start: 26, homeStart: 63 },
    blue: { name: 'Blue', color: C.blue, start: 39, homeStart: 69 }
};

export const SAFE_SPOTS = [0, 8, 13, 21, 26, 34, 39, 47];
export const DICE_FACES = { 1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅' };

// Defines the 52-step path around the board using grid coordinates
export const PATH = [
    {r: 7, c: 2}, {r: 7, c: 3}, {r: 7, c: 4}, {r: 7, c: 5}, {r: 7, c: 6},
    {r: 6, c: 7}, {r: 5, c: 7}, {r: 4, c: 7}, {r: 3, c: 7}, {r: 2, c: 7}, {r: 1, c: 7},
    {r: 1, c: 8}, {r: 1, c: 9},
    {r: 2, c: 9}, {r: 3, c: 9}, {r: 4, c: 9}, {r: 5, c: 9}, {r: 6, c: 9},
    {r: 7, c: 10}, {r: 7, c: 11}, {r: 7, c: 12}, {r: 7, c: 13}, {r: 7, c: 14}, {r: 7, c: 15},
    {r: 8, c: 15}, {r: 9, c: 15},
    {r: 9, c: 14}, {r: 9, c: 13}, {r: 9, c: 12}, {r: 9, c: 11}, {r: 9, c: 10},
    {r: 10, c: 9}, {r: 11, c: 9}, {r: 12, c: 9}, {r: 13, c: 9}, {r: 14, c: 9}, {r: 15, c: 9},
    {r: 15, c: 8}, {r: 15, c: 7},
    {r: 14, c: 7}, {r: 13, c: 7}, {r: 12, c: 7}, {r: 11, c: 7}, {r: 10, c: 7},
    {r: 9, c: 6}, {r: 9, c: 5}, {r: 9, c: 4}, {r: 9, c: 3}, {r: 9, c: 2}, {r: 9, c: 1},
    {r: 8, c: 1}, {r: 7, c: 1}
];

// --- PURE LOGIC FUNCTIONS ---

/**
 * Generates the initial state for all 16 tokens.
 * @returns {Array<Object>} An array of token objects.
 */
export const getInitialTokens = () => {
  let tokens = [];
  Object.keys(PLAYERS).forEach(color => {
    for (let i = 0; i < 4; i++) {
      // pos: -1 means the token is in the home yard.
      tokens.push({ id: `${color[0]}${i}`, color, pos: -1, state: 'home' });
    }
  });
  return tokens;
};

/**
 * Calculates the potential next position of a token without actually moving it.
 * @param {Object} token - The token to check.
 * @param {number} rolledDice - The value of the dice.
 * @returns {number} The potential new position, or -1 if the move is invalid.
 */
export const getExpectedPos = (token, rolledDice) => {
  if (!rolledDice || token.state === 'finished') return -1;

  // Rule: Token can only leave home on a 6.
  if (token.state === 'home') {
    return rolledDice === 6 ? PLAYERS[token.color].start : -1;
  }

  // Rule: Move along the home run path.
  if (token.state === 'homing') {
    return token.pos + rolledDice;
  }
  
  // Rule: Standard movement on the main track.
  let newPos = token.pos + rolledDice;
  const homeStart = PLAYERS[token.color].homeStart;
  const entryPoint = (PLAYERS[token.color].start + 50) % 52;
  
  // Logic to transition from the main track to the player's home run.
  if (token.pos <= entryPoint && newPos > entryPoint) {
    // The token has passed its home entry, so it moves into the home run.
    newPos = homeStart + (newPos - entryPoint - 1);
  } else {
    // Standard circular movement.
    newPos %= 52;
  }
  return newPos;
};