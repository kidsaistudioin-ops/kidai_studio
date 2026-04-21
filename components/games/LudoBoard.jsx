'use client';
import React from 'react';

// Classic Ludo Colors
const C = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  yellow: '#eab308',
  bg: '#0f172a',
  board: '#ffffff',
  path: '#f8fafc',
  border: '#cbd5e1'
};

// All 52 Path Coordinates for perfect Token Animation movement
const PATH = [
  {r:7, c:2}, {r:7, c:3}, {r:7, c:4}, {r:7, c:5}, {r:7, c:6},
  {r:6, c:7}, {r:5, c:7}, {r:4, c:7}, {r:3, c:7}, {r:2, c:7}, {r:1, c:7},
  {r:1, c:8}, {r:1, c:9},
  {r:2, c:9}, {r:3, c:9}, {r:4, c:9}, {r:5, c:9}, {r:6, c:9},
  {r:7, c:10}, {r:7, c:11}, {r:7, c:12}, {r:7, c:13}, {r:7, c:14}, {r:7, c:15},
  {r:8, c:15}, {r:9, c:15},
  {r:9, c:14}, {r:9, c:13}, {r:9, c:12}, {r:9, c:11}, {r:9, c:10},
  {r:10, c:9}, {r:11, c:9}, {r:12, c:9}, {r:13, c:9}, {r:14, c:9}, {r:15, c:9},
  {r:15, c:8}, {r:15, c:7},
  {r:14, c:7}, {r:13, c:7}, {r:12, c:7}, {r:11, c:7}, {r:10, c:7},
  {r:9, c:6}, {r:9, c:5}, {r:9, c:4}, {r:9, c:3}, {r:9, c:2}, {r:9, c:1},
  {r:8, c:1}, {r:7, c:1}
];

// Final Safe Home Paths
const HOME_COLS = {
  red: [ {r:8, c:2}, {r:8, c:3}, {r:8, c:4}, {r:8, c:5}, {r:8, c:6} ],
  green: [ {r:2, c:8}, {r:3, c:8}, {r:4, c:8}, {r:5, c:8}, {r:6, c:8} ],
  yellow: [ {r:8, c:14}, {r:8, c:13}, {r:8, c:12}, {r:8, c:11}, {r:8, c:10} ],
  blue: [ {r:14, c:8}, {r:13, c:8}, {r:12, c:8}, {r:11, c:8}, {r:10, c:8} ],
};

// Internal Home Base Positions
const HOME_POS = {
  red: [ {r: 2.5, c: 2.5}, {r: 2.5, c: 4.5}, {r: 4.5, c: 2.5}, {r: 4.5, c: 4.5} ],
  green: [ {r: 2.5, c: 11.5}, {r: 2.5, c: 13.5}, {r: 4.5, c: 11.5}, {r: 4.5, c: 13.5} ],
  yellow: [ {r: 11.5, c: 11.5}, {r: 11.5, c: 13.5}, {r: 13.5, c: 11.5}, {r: 13.5, c: 13.5} ],
  blue: [ {r: 11.5, c: 2.5}, {r: 11.5, c: 4.5}, {r: 13.5, c: 2.5}, {r: 13.5, c: 4.5} ],
};

const SAFE_SPOTS = [0, 8, 13, 21, 26, 34, 39, 47];
const STAR_CELLS = SAFE_SPOTS.map(i => PATH[i]);
const isStar = (r, c) => STAR_CELLS.some(s => s.r === r && s.c === c);

const getCellColor = (r, c) => {
  // Colored Safe Paths leading to Center
  if (r === 8 && c >= 2 && c <= 6) return C.red;
  if (c === 8 && r >= 2 && r <= 6) return C.green;
  if (r === 8 && c >= 10 && c <= 14) return C.yellow;
  if (c === 8 && r >= 10 && r <= 14) return C.blue;
  // Starting Safe Spots
  if (r === 7 && c === 2) return C.red;
  if (r === 2 && c === 9) return C.green;
  if (r === 9 && c === 14) return C.yellow;
  if (r === 14 && c === 7) return C.blue;
  return C.path;
};

// 3D Moving Tokens (Characters) Component
const Token = ({ token, turn, onClick, allTokens, validTokenIds, glowingTokens = [] }) => {
  const color = token.color ? token.color.toLowerCase() : '';
  const state = token.state ? token.state.toLowerCase() : 'home';
  const isGlowing = glowingTokens.includes(token.id);
  let pos = null;
  
  // Positioning Logic
  if (state === 'home') {
    // ID se sahi number nikalna taaki 4 gotiyan 4 alag kono me dikhein
    const numMatch = token.id.match(/\d+/);
    const idx = numMatch ? parseInt(numMatch[0]) % 4 : 0;
    pos = HOME_POS[color] ? HOME_POS[color][idx] : {r:8, c:8};
  } else if (state === 'finished') {
    pos = { r: 8, c: 8 }; // Winner Area
  } else {
    // Page.js ke HOME_START values se match karne ke liye
    let hStartVal = 51; // red
    if (color === 'green') hStartVal = 57;
    if (color === 'yellow') hStartVal = 63;
    if (color === 'blue') hStartVal = 69;

    if (state === 'active') {
      const safePos = (Number(token.pos) % 52 + 52) % 52; // Circular safety
      pos = PATH[safePos] || {r:8, c:8};
    } else if (state === 'homing') {
      let idx = Number(token.pos) - hStartVal - 1; 
      if (idx < 0) idx = 0; if (idx > 4) idx = 4;
      pos = HOME_COLS[color] ? HOME_COLS[color][idx] : {r:8, c:8};
    }
  }

  if (!pos) return null;

  // Sirf wahi goti chamkegi jo us dice number par chal sakti hai
  const canMove = validTokenIds && validTokenIds.includes(token.id);
  
  // Smart Overlapping (Multiple tokens in one box)
  const overlapping = allTokens.filter(ot => ot.pos === token.pos && ot.state === token.state && ot.state !== 'home' && ot.state !== 'finished');
  const isMultiple = overlapping.length > 1;
  const overlapIdx = overlapping.findIndex(ot => ot.id === token.id);
  const offsetX = isMultiple ? (overlapIdx % 2 === 0 ? -15 : 15) : 0;
  const offsetY = isMultiple ? (overlapIdx < 2 ? -15 : 15) : 0;

  return (
    <div 
      onClick={() => canMove && onClick(token.id)}
      style={{
        position: 'absolute',
        top: `${(pos.r - 1) * 6.666}%`,
        left: `${(pos.c - 1) * 6.666}%`,
        width: '6.666%',
        height: '6.666%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: canMove ? 'pointer' : 'default',
        zIndex: canMove ? 20 : (state === 'home' ? 5 : 10),
        transition: 'all 0.4s ease-in-out',
        transform: `translate(${offsetX}%, ${offsetY}%) scale(${isMultiple ? 0.75 : 1})`,
      }}
    >
      <img
        src="/characters/player.svg"
        alt="player token"
        style={{
          width: '160%',
          height: '160%',
          objectFit: 'contain',
          transform: canMove ? 'translateY(-25%) scale(1.15)' : 'translateY(-15%) scale(1)',
          filter: `drop-shadow(0 5px 8px rgba(0,0,0,0.5)) ${
            color === 'red' ? 'hue-rotate(320deg) saturate(1.5)' :
            color === 'green' ? 'hue-rotate(80deg) saturate(1.5)' :
            color === 'yellow' ? 'hue-rotate(30deg) saturate(2)' :
            color === 'blue' ? 'hue-rotate(180deg) saturate(2)' : ''
          }`,
          animation: isGlowing 
            ? 'token-glow-pulse 0.8s ease-in-out infinite' 
            : canMove 
              ? 'pulse-green 1s infinite' 
              : 'none'
        }}
      />
    </div>
  );
};

// The Main Beautiful Ludo Board Component
export default function LudoBoard({ tokens = [], turn, handleTokenClick, validTokenIds = [], glowingTokens = [] }) {
  const gridCells = [];
  
  // Rendering the entire 15x15 visual grid correctly
  for (let r = 1; r <= 15; r++) {
    for (let c = 1; c <= 15; c++) {
      const color = getCellColor(r, c);
      const star = isStar(r, c);
      const isCenter = r >= 7 && r <= 9 && c >= 7 && c <= 9;
      
      const isRedHome = r >= 1 && r <= 6 && c >= 1 && c <= 6;
      const isGreenHome = r >= 1 && r <= 6 && c >= 10 && c <= 15;
      const isYellowHome = r >= 10 && r <= 15 && c >= 10 && c <= 15;
      const isBlueHome = r >= 10 && r <= 15 && c >= 1 && c <= 6;

      // Center & Homes are drawn as big overlay boxes below, so skip individual cells here
      if (isCenter || isRedHome || isGreenHome || isYellowHome || isBlueHome) continue;

      gridCells.push(
        <div key={`${r}-${c}`} style={{
          gridRow: r, gridColumn: c,
          backgroundColor: color,
          border: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)'
        }}>
          {star && <span style={{ color: '#000', opacity: 0.15, fontSize: '1.2rem' }}>★</span>}
        </div>
      );
    }
  }

  return (
    <div style={{
      width: '100%', maxWidth: '600px', aspectRatio: '1/1',
      position: 'relative',
      backgroundColor: C.board,
      border: `12px solid ${C.bg}`,
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.1)',
      padding: '4px',
      transform: 'perspective(1000px) rotateX(25deg) rotateZ(0deg)',
      transformStyle: 'preserve-3d',
      margin: '0 auto'
    }}>
      {/* 15x15 Perfect Grid Base */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gridTemplateRows: 'repeat(15, 1fr)', width: '100%', height: '100%', position: 'relative' }}>
         {gridCells}
         
         {/* Big Home Area Boxes */}
         <div style={{ gridRow: '1/7', gridColumn: '1/7', backgroundColor: C.red, border: `1px solid ${C.border}`, padding: '15%', borderRadius: 12, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)' }}>
           <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
             <div style={{ background: C.red, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.red, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.red, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.red, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} />
           </div>
         </div>
         <div style={{ gridRow: '1/7', gridColumn: '10/16', backgroundColor: C.green, border: `1px solid ${C.border}`, padding: '15%', borderRadius: 12, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)' }}>
           <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
             <div style={{ background: C.green, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.green, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.green, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.green, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} />
           </div>
         </div>
         <div style={{ gridRow: '10/16', gridColumn: '10/16', backgroundColor: C.yellow, border: `1px solid ${C.border}`, padding: '15%', borderRadius: 12, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)' }}>
           <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
             <div style={{ background: C.yellow, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.yellow, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.yellow, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.yellow, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} />
           </div>
         </div>
         <div style={{ gridRow: '10/16', gridColumn: '1/7', backgroundColor: C.blue, border: `1px solid ${C.border}`, padding: '15%', borderRadius: 12, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)' }}>
           <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
             <div style={{ background: C.blue, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.blue, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.blue, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} /><div style={{ background: C.blue, borderRadius: '50%', border: '2px solid #fff', boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)' }} />
           </div>
         </div>

         {/* Center Winning Triangle Hub */}
         <div style={{ gridRow: '7/10', gridColumn: '7/10', position: 'relative', overflow: 'hidden', border: `1px solid ${C.border}` }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `conic-gradient(${C.blue} 0 90deg, ${C.green} 90deg 180deg, ${C.yellow} 180deg 270deg, ${C.red} 270deg 360deg)` }} />
         </div>

         {/* Tokens mapped absolutely over the grid for smooth glide animations! */}
         {tokens.map(t => <Token key={t.id} token={t} turn={turn} onClick={handleTokenClick} allTokens={tokens} validTokenIds={validTokenIds} glowingTokens={glowingTokens} />)}
      </div>
    </div>
  );
}