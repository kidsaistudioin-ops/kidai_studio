'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Player from '@/components/games-animation/snakeLadderAnimated/Player';
import { movePlayer } from '@/lib/games-animation/snakeLadder/movement';
import { C, DICE_FACES } from '@/lib/games/ludoEngine'; // Ludo se colors aur dice le rahe hain

export default function SnakeLadderGame() {
  const [positions, setPositions] = useState({ p1: 1, p2: 1 });
  const [turn, setTurn] = useState('p1');
  const [dice, setDice] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [winner, setWinner] = useState(null);
  const [logs, setLogs] = useState(["Game Start! Aapki baari."]);

  const isMovingRef = useRef(isMoving);
  useEffect(() => { isMovingRef.current = isMoving; }, [isMoving]);

  // 🤖 PURE JAVASCRIPT BOT (0% AI API COST)
  useEffect(() => {
    if (turn === 'p2' && !winner && !isRolling && !isMovingRef.current) {
      const timer = setTimeout(() => handleDiceRoll(), 1000);
      return () => clearTimeout(timer);
    }
  }, [turn, winner, isRolling, isMoving]);

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 3));

  const handleDiceRoll = () => {
    if (isRolling || isMovingRef.current || winner) return;
    if (turn !== 'p1' && turn !== 'p2') return; // Safety check

    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        const finalDice = Math.floor(Math.random() * 6) + 1;
        setDice(finalDice);
        setIsRolling(false);

        const playerName = turn === 'p1' ? 'Aap' : 'Computer';
        addLog(`${playerName} rolled a ${finalDice}.`);
        
        setIsMoving(true);
        const currentPosition = positions[turn];

        movePlayer(
          currentPosition,
          finalDice,
          (newPos) => { // onUpdate
            setPositions(prev => ({ ...prev, [turn]: newPos }));
          },
          () => { // onComplete
            const finalPosition = positions[turn] + finalDice > 100 ? 100 : positions[turn] + finalDice;
            
            // Check for win after move animation
            setTimeout(() => {
                if (positions[turn] >= 100) {
                    setWinner(turn);
                    addLog(`🎉🏆 ${playerName} WINS THE GAME! 🏆🎉`);
                } else {
                    setTurn(turn === 'p1' ? 'p2' : 'p1');
                    if (turn === 'p1') addLog("Computer ki baari...");
                    else addLog("Aapki baari.");
                }
                setIsMoving(false);
            }, 500); // Wait for snake/ladder animation
          },
          (eventType, from, to) => { // onEvent
            if (eventType === 'snake') addLog(`🐍 Oh no! Saanp ne kaata ${from} se ${to} par!`);
            if (eventType === 'ladder') addLog(`🪜 Yay! Seedhi mili ${from} se ${to} par!`);
          }
        );
      }
    }, 50);
  };

  const resetGame = () => {
    setPositions({ p1: 1, p2: 1 });
    setTurn('p1');
    setDice(null);
    setWinner(null);
    setLogs(["Game Start! Aapki baari."]);
    setIsMoving(false);
    setIsRolling(false);
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/play" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Saanp Seedhi <span style={{ color: C.green }}>3D</span></h1>
        <button onClick={resetGame} style={{ marginLeft: 'auto', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>🔄 Reset</button>
      </div>

      <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        {winner ? (
          <div style={{ background: C.card, padding: 30, borderRadius: 16, border: `2px solid ${C.green}` }}>
            <div style={{ fontSize: 64, marginBottom: 10 }}>{winner === 'p1' ? '🏆' : '🤖'}</div>
            <h2 style={{ color: C.green, margin: 0, fontSize: 28 }}>{winner === 'p1' ? 'You Win!' : 'Computer Wins!'}</h2>
            <button onClick={resetGame} style={{ background: C.green, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', marginTop: 20 }}>Play Again 🔄</button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: C.card, padding: '16px 20px', borderRadius: 16, marginBottom: 16, border: `3px solid ${turn === 'p1' ? C.cyan : C.red}`, transition: 'all 0.3s' }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 'bold' }}>TURN</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: turn === 'p1' ? C.cyan : C.red }}>{turn === 'p1' ? 'You' : 'Computer'}</div>
            </div>
            <div onClick={turn === 'p1' ? handleDiceRoll : undefined} style={{ width: 80, height: 80, background: turn === 'p1' ? C.cyan : C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, borderRadius: 16, cursor: turn === 'p1' && !isRolling && !isMoving ? 'pointer' : 'not-allowed', color: '#fff', fontWeight: 900, animation: isRolling ? 'dice-roll-anim 0.3s infinite linear' : 'none' }}>
              {isRolling ? '🎲' : (dice ? DICE_FACES[dice] : '🎲')}
            </div>
            <div style={{ fontSize: 13, color: C.muted, width: 80 }}>
              {turn === 'p1' ? <span style={{ color: C.cyan, fontWeight: 'bold' }}>Roll Dice!</span> : <span style={{ color: C.red, fontWeight: 'bold' }}>Thinking...</span>}
            </div>
          </div>
        )}

        {/* Game Board */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px', aspectRatio: '1 / 1', margin: '0 auto', background: `url('/board/snakes.svg')`, backgroundSize: 'cover', borderRadius: 12, border: `4px solid ${C.border}` }}>
          <Player position={positions.p1} color="blue" imageSrc="/characters/player.svg" />
          <Player position={positions.p2} color="red" imageSrc="/characters/player2.svg" />
        </div>

        {/* Logs */}
        <div style={{ marginTop: 20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 8 }}>GAME LOGS</div>
          {logs.map((log, i) => (
            <div key={i} style={{ fontSize: 13, color: i === 0 ? C.text : C.muted, marginBottom: 4, opacity: 1 - (i * 0.2) }}>
              {i === 0 ? '▶ ' : ''}{log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}