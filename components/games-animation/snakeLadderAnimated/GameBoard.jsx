'use client';
import { useState } from 'react';
import Player from './Player';
import Dice from './Dice';

const LADDERS = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };
const SNAKES = { 17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78 };

// Board ke upar saanp aur seedhi draw karne ke liye coordinates function
const getCoordinates = (cellNum) => {
  const rowIndex = Math.floor((cellNum - 1) / 10);
  const colIndex = rowIndex % 2 === 0 ? (cellNum - 1) % 10 : 9 - ((cellNum - 1) % 10);
  const rowFromTop = 9 - rowIndex;
  return { x: colIndex * 10 + 5, y: rowFromTop * 10 + 5 }; // 10% blocks ke center (5%)
};

// Sound play karne ka function
const playSound = (fileName) => {
  try {
    const audio = new Audio(`/sounds/${fileName}`);
    audio.play().catch(e => console.log("Audio block (Browser policy):", e));
  } catch (e) {}
};

export default function GameBoard({ onGameEnd }) {
  const [position, setPosition] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState("Pasa (Dice) phenko! 🎲");
  const [emotion, setEmotion] = useState("normal");

  const handleRoll = (val) => {
    if (isRolling || position >= 100) return;
    setIsRolling(true);
    
    let currentStep = position;
    let targetPos = position + val;
    
    if (targetPos > 100) {
      setMessage(`100 par jane ke liye ${100 - position} chahiye!`);
      setIsRolling(false);
      return;
    }

    setMessage(`Aapne ${val} roll kiya!`);
    const isFast = val >= 4;
    setEmotion(isFast ? "walk_fast" : "walk_normal");
    
    const speed = isFast ? 250 : 450; // Fast roll ke liye tezi se bhagega

    const moveInterval = setInterval(() => {
      currentStep++;
      setPosition(currentStep);

      if (currentStep >= targetPos) {
        clearInterval(moveInterval);
        
        setTimeout(() => {
          if (LADDERS[targetPos]) {
            playSound('ladder.mp3'); // 🔊 Ladder Sound
            setMessage("YAY! Seedhi (Ladder) mil gayi! 🪜");
            setEmotion("ladder");
            setTimeout(() => {
              setPosition(LADDERS[targetPos]);
              finishRoll(LADDERS[targetPos]);
            }, 1000);
          } else if (SNAKES[targetPos]) {
            playSound('snake.mp3'); // 🔊 Snake Sound
            setMessage("OH NO! Saanp (Snake) ne kaat liya! 🐍");
            setEmotion("snake");
            setTimeout(() => {
              setPosition(SNAKES[targetPos]);
              finishRoll(SNAKES[targetPos]);
            }, 1500);
          } else {
            setEmotion("normal");
            finishRoll(targetPos);
          }
        }, 300); // Thoda pause lene ke baad react karega
      }
    }, speed);
  };

  const finishRoll = (finalPos) => {
    setTimeout(() => {
      setIsRolling(false);
      if (finalPos === 100) {
        playSound('win.mp3'); // 🔊 Win Sound
        setEmotion("win");
        setMessage("Aap Jeet Gaye! 🎉🏆");
        if (onGameEnd) {
          setTimeout(() => onGameEnd(), 2500);
        }
      }
    }, 500);
  };

  // 100 Cells Zig-Zag Logic
  const cells = [];
  let isLeftToRight = true;
  
  // Loop from top row (90-100) down to bottom row (1-10)
  for (let row = 9; row >= 0; row--) {
    let rowCells = [];
    for (let col = 1; col <= 10; col++) {
      let cellNumber = row * 10 + col;
      rowCells.push(cellNumber);
    }
    // Reverse every alternate row for zig-zag pattern
    if (!isLeftToRight) {
      rowCells.reverse();
    }
    isLeftToRight = !isLeftToRight;
    cells.push(...rowCells);
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: '#10b981' }}>🐍 Snake & Ladder 🪜</h2>
      
      <div style={{ marginBottom: 16, background: '#1e2d45', padding: 16, borderRadius: 12, border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#f1f5f9', fontSize: 15 }}>{message}</h3>
        {position < 100 && <Dice onRoll={handleRoll} disabled={isRolling} />}
      </div>

      <div style={{ position: 'relative', background: '#1e2d45', padding: 4, borderRadius: 12, border: '4px solid #334155' }}>
        
        {/* Asli Snakes aur Ladders (SVG Overlay) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          <style>{`
            @keyframes snakeHead { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(1px, -2px); } }
            @keyframes ladderPulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; filter: drop-shadow(0 0 4px #d97706); } }
          `}</style>
          {Object.entries(LADDERS).map(([s, e]) => {
            const start = getCoordinates(parseInt(s));
            const end = getCoordinates(parseInt(e));
            
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            return (
              <g key={`l-${s}`} transform={`translate(${start.x}, ${start.y}) rotate(${angle})`}>
                <g style={{ animation: 'ladderPulse 2s infinite' }}>
                  {/* Seedhi ki do side lines */}
                  <line x1="0" y1="-3" x2={length} y2="-3" stroke="#d97706" strokeWidth="2.5" />
                  <line x1="0" y1="3" x2={length} y2="3" stroke="#d97706" strokeWidth="2.5" />
                  {/* Seedhi ke steps (Paiydan) */}
                  {Array.from({ length: Math.max(3, Math.floor(length / 8)) }).map((_, i, arr) => {
                    const stepX = (length / (arr.length + 1)) * (i + 1);
                    return <line key={i} x1={stepX} y1="-3" x2={stepX} y2="3" stroke="#d97706" strokeWidth="2" />;
                  })}
                </g>
              </g>
            )
          })}
          {Object.entries(SNAKES).map(([s, e]) => {
            const head = getCoordinates(parseInt(s));
            const tail = getCoordinates(parseInt(e));
            
            const dx = tail.x - head.x;
            const dy = tail.y - head.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            {/* Saanp ke body ke liye wavy curve */}
            const wave = `M 0 0 Q ${length*0.25} 12, ${length*0.5} 0 T ${length} 0`;
            
            return (
              <g key={`s-${s}`} transform={`translate(${head.x}, ${head.y}) rotate(${angle})`}>
                <g style={{ animation: 'snakeHead 1.5s infinite alternate ease-in-out' }}>
                  {/* Wavy Saanp (Body) */}
                  <path d={wave} stroke="#10b981" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  {/* Saanp ka Head & Eyes */}
                  <circle cx="0" cy="0" r="4" fill="#059669" />
                  <circle cx="-1.5" cy="-1.5" r="1" fill="#fff" />
                  <circle cx="-1.5" cy="1.5" r="1" fill="#fff" />
                </g>
              </g>
            )
          })}
        </svg>

        {/* Grid Cells & Player */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 2, position: 'relative', zIndex: 3 }}>
          {cells.map((num) => (
            <div key={num} style={{ aspectRatio: '1', background: num % 2 === 0 ? '#0f1520' : '#161e30', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, borderRadius: 4, position: 'relative', zIndex: position === num ? 10 : 1 }}>
              <span style={{ position: 'absolute', top: 2, left: 2, fontSize: 8, opacity: 0.6 }}>{num}</span>
              {position === num && <Player emotion={emotion} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}