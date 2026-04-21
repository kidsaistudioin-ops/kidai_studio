'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const C = {
  bg: '#1e293b', road: '#293548', border: '#475569',
  orange: '#fb923c', text: '#f1f5f9', muted: '#94a3b8',
  red: '#ef4444', green: '#10b981', line: '#e2e8f0'
};

export default function CarRace() {
  const [lane, setLane] = useState(1); // 0 = Left, 1 = Center, 2 = Right
  const [survivalScore, setSurvivalScore] = useState(0);
  const [coinScore, setCoinScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lives, setLives] = useState(3);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);
  const [isHit, setIsHit] = useState(false); // Hit reaction ke liye
  const gameLoopRef = useRef();
  const lastSpawnTimeRef = useRef(0);
  const coinsSpawnedRef = useRef(0);
  const laneRef = useRef(1);
  const speedMultRef = useRef(1);
  const scoreRef = useRef(0);
  const isHitRef = useRef(false); // Double-crash aur life reset block karne ke liye

  useEffect(() => { laneRef.current = lane; }, [lane]);
  useEffect(() => { speedMultRef.current = speedMultiplier; }, [speedMultiplier]);

  // Main Game Engine Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    let intervalId;

    const handleCrash = () => {
      if (isHitRef.current) return;
      isHitRef.current = true; // React strict mode block

      // 🛑 CRASH HOTE HI AUTO-BRAKE LAGEGA
      speedMultRef.current = 0.5;
      setSpeedMultiplier(0.5);
      setIsHit(true);

      setCoinScore(prev => Math.max(0, prev - 50)); // 50 Coin penalty
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
          setIsPlaying(false);
          return 0;
        }
        return newLives;
      });

      setTimeout(() => { setIsHit(false); isHitRef.current = false; }, 1000); // 1 sec recovery time
    };

    const gameTick = () => {
      const timestamp = Date.now();
      scoreRef.current += 1;
      setSurvivalScore(Math.floor(scoreRef.current / 10)); // Score ab aaram se badhega

      // Speed Limit Logic (Max baseSpeed capped at 3.5)
      const baseSpeed = Math.min(3.5, 1.5 + (scoreRef.current / 1500));
      const speed = baseSpeed * speedMultRef.current;

      // Naye Obstacles aur Coins spawn karna
      if (timestamp - lastSpawnTimeRef.current > Math.max(300, 1000 - scoreRef.current / 5) / speedMultRef.current) {
        lastSpawnTimeRef.current = timestamp;
        const newLane = Math.floor(Math.random() * 3);
        const itemType = Math.random();

        if (itemType < 0.7) { // 70% chance obstacle ka
          const obsType = Math.random() > 0.4 ? 'car' : 'rock'; // Car ya Patthar
          setObstacles(prev => [...prev, { id: timestamp, lane: newLane, y: -15, type: obsType }]);
        } else if (coinsSpawnedRef.current < 20) { // Max 20 coins per game
          setCoins(prev => [...prev, { id: timestamp, lane: newLane, y: -15 }]);
          coinsSpawnedRef.current += 1;
        }
      }

      // Obstacles ko move karna aur collision check
      setObstacles(prevObs => {
        const updatedObs = prevObs.map(ob => ({ ...ob, y: ob.y + speed })).filter(ob => ob.y < 110);
        
        if (!isHitRef.current) {
          const crashed = updatedObs.some(ob => ob.y > 60 && ob.y < 85 && ob.lane === laneRef.current);
          if (crashed) {
            setTimeout(handleCrash, 0); // State updater ke bahar safely life cut hogi
            return []; // Screen clear kar do taaki player sambhal sake
          }
        }
        return updatedObs;
      });

      // Coins ko move karna aur collection check
      setCoins(prevCoins => {
        return prevCoins.map(c => ({ ...c, y: c.y + speed })).filter(c => {
          if (!isHitRef.current && c.y > 60 && c.y < 85 && c.lane === laneRef.current) {
            setCoinScore(s => s + 10); // 10 points per coin
            return false; // Coin ko gayab kar do
          }
          return c.y < 110;
        });
      });
    };

    // FIX: Monitor ki Hz speed se bachne ke liye fixed 30ms Tick Rate
    intervalId = setInterval(gameTick, 30);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, gameOver]);

  const startGame = () => {
    scoreRef.current = 0;
    setSurvivalScore(0);
    setCoinScore(0);
    setObstacles([]);
    setCoins([]);
    setLane(1);
    laneRef.current = 1;
    setLives(3);
    setSpeedMultiplier(1);
    speedMultRef.current = 1;
    coinsSpawnedRef.current = 0;
    isHitRef.current = false;
    setIsHit(false);
    setGameOver(false);
    setIsPlaying(true);
  };

  // Speed, Stage aur KM/H ka logic
  const currentStage = survivalScore < 100 ? 1 : survivalScore < 300 ? 2 : 3;
  const baseSpeedUI = Math.min(3.5, 1.5 + (survivalScore / 150));
  const speedKmh = Math.min(220, Math.floor(baseSpeedUI * speedMultiplier * 45));

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') {
        setLane(l => Math.max(0, l - 1));
      } else if (e.key === 'ArrowRight') {
        setLane(l => Math.min(2, l + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: '#07090f', color: C.text, minHeight: '100vh', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @keyframes scrollBg {
          from { background-position: 50% 0; }
          to { background-position: 50% 1000px; }
        }
        .road-moving {
          background-color: #293548;
          background-image: 
            linear-gradient(90deg, transparent 33%, rgba(226,232,240,0.5) 33%, rgba(226,232,240,0.5) 34%, transparent 34%, transparent 66%, rgba(226,232,240,0.5) 66%, rgba(226,232,240,0.5) 67%, transparent 67%),
            linear-gradient(0deg, transparent 0%, transparent 50%, rgba(226,232,240,0.2) 50%, rgba(226,232,240,0.2) 100%);
          background-size: 100% 100%, 100% 100px;
          animation: scrollBg ${2 / Math.max(0.5, baseSpeedUI * speedMultiplier)}s linear infinite;
        }
        .road-stopped {
          background-color: #293548;
          background-image: 
            linear-gradient(90deg, transparent 33%, rgba(226,232,240,0.5) 33%, rgba(226,232,240,0.5) 34%, transparent 34%, transparent 66%, rgba(226,232,240,0.5) 66%, rgba(226,232,240,0.5) 67%, transparent 67%),
            linear-gradient(0deg, transparent 0%, transparent 50%, rgba(226,232,240,0.2) 50%, rgba(226,232,240,0.2) 100%);
          background-size: 100% 100%, 100% 100px;
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/play" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Car <span style={{ color: C.orange }}>Race</span> 🏎️</h1>
      </div>

      <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ background: C.card, border: `2px solid ${currentStage === 3 ? C.red : currentStage === 2 ? C.orange : C.green}`, padding: '4px 16px', borderRadius: 12, fontWeight: 900, color: '#fff', fontSize: 14 }}>
            Stage {currentStage}
          </div>
          <div style={{ background: C.card, border: `2px solid ${speedKmh >= 200 ? C.red : C.border}`, padding: '4px 16px', borderRadius: 12, fontWeight: 900, color: speedKmh >= 200 ? C.red : C.green, fontSize: 14 }}>
            {speedKmh} KM/H
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 10, fontWeight: 800, fontSize: 16, background: C.border, padding: '8px', borderRadius: '12px' }}>
          <span style={{ color: C.red, letterSpacing: '2px' }}>{"❤️".repeat(lives)}{"🤍".repeat(3 - lives)}</span>
          <span style={{ color: C.green }}>Score: {Math.floor(survivalScore / 10)}</span>
          <span style={{ color: C.orange }}>Coins: {coinScore}</span>
          {!isPlaying && !gameOver && <button onClick={startGame} style={{ background: C.green, color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>Start 🏁</button>}
        </div>

        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{ perspective: '400px' }}>
            <div className={isPlaying && !gameOver ? "road-moving" : "road-stopped"} style={{ position: 'relative', width: '100%', height: 450, borderRadius: 12, border: `4px solid ${isHit ? C.red : C.border}`, overflow: 'hidden', boxShadow: `0 10px 30px ${isHit ? C.red : 'rgba(0,0,0,0.5)'}`, transform: 'rotateX(15deg)' }}>
            {/* Player Car - Hit hone par blink karega */}
            <div style={{ position: 'absolute', bottom: '10%', left: `${lane * 33.33}%`, width: '33.33%', display: 'flex', justifyContent: 'center', transition: 'left 0.15s ease-out', zIndex: 10, opacity: isHit ? 0.3 : 1 }}>
               <div style={{ width: 44, height: 80, background: 'linear-gradient(to bottom, #ef4444, #b91c1c)', borderRadius: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,255,255,0.4)', position: 'relative' }}>
                  {/* Car Windows */}
                  <div style={{ position: 'absolute', top: 15, left: 6, right: 6, height: 18, background: '#0f172a', borderRadius: '4px 4px 2px 2px' }}></div>
                  <div style={{ position: 'absolute', bottom: 15, left: 8, right: 8, height: 12, background: '#0f172a', borderRadius: '2px 2px 4px 4px' }}></div>
               </div>
            </div>

            {/* Enemy Cars & Rocks */}
            {obstacles.map(ob => (
              <div key={ob.id} style={{ position: 'absolute', top: `${ob.y}%`, left: `${ob.lane * 33.33}%`, width: '33.33%', display: 'flex', justifyContent: 'center', zIndex: 4, transform: `scale(${0.6 + ob.y/200})` }}>
                 {ob.type === 'car' ? (
                   <div style={{ width: 44, height: 80, background: 'linear-gradient(to bottom, #3b82f6, #1d4ed8)', borderRadius: 10, boxShadow: '0 5px 15px rgba(0,0,0,0.5)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 15, left: 8, right: 8, height: 12, background: '#0f172a', borderRadius: '4px 4px 2px 2px' }}></div>
                      <div style={{ position: 'absolute', bottom: 15, left: 6, right: 6, height: 18, background: '#0f172a', borderRadius: '2px 2px 4px 4px' }}></div>
                   </div>
                 ) : (
                   <div style={{ width: 35, height: 35, background: '#64748b', borderRadius: '50%', boxShadow: '0 5px 10px rgba(0,0,0,0.6)', marginTop: 20 }} />
                 )}
              </div>
            ))}

            {/* Coins */}
            {coins.map(c => (
              <div key={c.id} style={{ position: 'absolute', top: `${c.y}%`, left: `${c.lane * 33.33}%`, width: '33.33%', display: 'flex', justifyContent: 'center', zIndex: 3, transform: `scale(${0.6 + c.y/200})` }}>
                 <div style={{ width: 25, height: 25, background: '#f59e0b', borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 15px #f59e0b', marginTop: 20 }} />
              </div>
            ))}

            </div>
          </div>

          {gameOver && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,9,15,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50, borderRadius: 12, border: `2px solid ${C.red}` }}>
              <div style={{ fontSize: 60, marginBottom: 10 }}>💥</div>
              <div style={{ color: C.red, fontSize: 32, fontWeight: 900, marginBottom: 5 }}>GAME OVER</div>
              <div style={{ color: C.muted, fontSize: 16, marginBottom: 20 }}>3 Lives Khatam!</div>
              <div style={{ background: C.card, padding: '10px 20px', borderRadius: 8, marginBottom: 20, border: `1px solid ${C.border}` }}>
                <div style={{ color: C.green, fontWeight: 'bold', fontSize: 18 }}>Score: {Math.floor(survivalScore / 10)}</div>
                <div style={{ color: C.orange, fontWeight: 'bold', fontSize: 18 }}>Coins: {coinScore}</div>
              </div>
              <button onClick={startGame} style={{ background: C.orange, color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 800, cursor: 'pointer', fontSize: 18, boxShadow: '0 4px 15px rgba(251, 146, 60, 0.4)' }}>Play Again 🔄</button>
            </div>
          )}
        </div>

        {isPlaying && !gameOver && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 15 }}>
            <button onClick={() => setSpeedMultiplier(m => Math.max(0.6, m - 0.2))} style={{ padding: '8px 16px', borderRadius: 8, background: C.red, border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>🛑 Brake</button>
            <div style={{ padding: '8px', color: '#fff', fontWeight: 'bold', minWidth: '80px' }}>Gear {speedMultiplier.toFixed(1)}x</div>
            <button onClick={() => setSpeedMultiplier(m => Math.min(2.0, m + 0.2))} style={{ padding: '8px 16px', borderRadius: 8, background: C.green, border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>🚀 Gas</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 15 }}>
          <button onClick={() => setLane(l => Math.max(0, l - 1))} style={{ flex: 1, padding: 20, fontSize: 24, borderRadius: 16, background: C.border, border: 'none', color: '#fff', cursor: 'pointer' }}>⬅️ Left</button>
          <button onClick={() => setLane(l => Math.min(2, l + 1))} style={{ flex: 1, padding: 20, fontSize: 24, borderRadius: 16, background: C.border, border: 'none', color: '#fff', cursor: 'pointer' }}>Right ➡️</button>
        </div>
      </div>
    </div>
  );
}