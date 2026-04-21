'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { C, PLAYERS, SAFE_SPOTS, DICE_FACES, getInitialTokens, getExpectedPos } from '@/lib/games/ludoEngine';
import LudoBoard from '@/components/games/LudoBoard';

export default function LudoGame() {
  const [tokens, setTokens] = useState(getInitialTokens());
  const [turn, setTurn] = useState('red');
  const [dice, setDice] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameState, setGameState] = useState('roll');
  const [winner, setWinner] = useState(null);
  const [logs, setLogs] = useState(["Game Start! Red ki baari."]);
  const [glowingTokens, setGlowingTokens] = useState([]); // Kon-si tokens glow karengi

  // Ultra-Safe Ref Memory (Taaki dice roll karte waqt React purana data na padh le)
  const tokensRef = useRef(tokens);
  const turnRef = useRef(turn);
  const diceRef = useRef(dice);
  const gameStateRef = useRef(gameState);
  const winnerRef = useRef(winner);
  const isRollingRef = useRef(false); // NEW: Double click dice roll roke ga

  useEffect(() => { tokensRef.current = tokens; }, [tokens]);
  useEffect(() => { turnRef.current = turn; }, [turn]);
  useEffect(() => { diceRef.current = dice; }, [dice]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { winnerRef.current = winner; }, [winner]);

  // Engine se match karne ke liye exact values use karte hain
  const START_POS = { red: 0, green: 13, yellow: 26, blue: 39 };
  const HOME_START = { red: 51, green: 57, yellow: 63, blue: 69 };
  const ENTRY_POINT = { red: 50, green: 11, yellow: 24, blue: 37 }; // Board ke index (0-51) jahan se token ghar ke raste mudta hai

  // Safe Name/Color getters
  const getPlayerName = (colorKey) => {
    if (!colorKey) return 'Player';
    return PLAYERS[colorKey]?.name || PLAYERS[colorKey.toLowerCase()]?.name || colorKey;
  };

  const checkValidMove = (t, diceValue) => {
    if (!t) return false;
    const color = t.color ? t.color.toLowerCase() : '';
    const currentPos = Number(t.pos);
    const homeStart = HOME_START[color];
    const entryPoint = ENTRY_POINT[color];
    const state = t.state ? t.state.toLowerCase() : 'home';
    
    if (state === 'home') {
      return Number(diceValue) === 6; // Sirf 6 aane par ghar se nikal sakti hai
    }
    
    if (state === 'homing') {
      // Home run me 6 steps hain (homeStart se homeStart+6 tak)
      return currentPos + Number(diceValue) <= homeStart + 6;
    }
    
    if (state === 'active') {
      // Calculate distance to entry point of home run
      let distToEntry = entryPoint - currentPos;
      if (distToEntry < 0) distToEntry += 52; // Circular track
      
      if (Number(diceValue) > distToEntry) {
        // Token will enter home run - check if it can finish
        const stepsIntoHome = Number(diceValue) - distToEntry;
        return stepsIntoHome <= 6; // Max 6 steps in home run
      }
      return true; // Normal move on track
    }
    return false;
  };

  const getWrappedPos = (t, diceValue) => {
    const color = t.color ? t.color.toLowerCase() : '';
    const currentPos = Number(t.pos);
    const homeStart = HOME_START[color];
    const entryPoint = ENTRY_POINT[color];
    const state = t.state ? t.state.toLowerCase() : 'home';
    
    if (state === 'home') return START_POS[color];
    
    if (state === 'homing') {
      // Simply add dice value - stays within home run
      return currentPos + Number(diceValue);
    }
    
    if (state === 'active') {
      // Calculate distance to entry point
      let distToEntry = entryPoint - currentPos;
      if (distToEntry < 0) distToEntry += 52;
      
      if (Number(diceValue) > distToEntry) {
        // Enter home run
        const stepsIntoHome = Number(diceValue) - distToEntry;
        return homeStart + stepsIntoHome;
      }
      // Normal movement on track
      return (currentPos + Number(diceValue)) % 52;
    }
    return -1;
  };

  // Pata lagana ki is waqt kaunsi gotiyan chal sakti hain (Taaki dice aur game stuck na ho)
  const validTokenIds = (gameState === 'move' && dice) 
    ? tokens.filter(t => t.color.toLowerCase() === turn.toLowerCase() && checkValidMove(t, dice)).map(t => t.id)
    : [];

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 3));

  const handleDiceRoll = () => {
    if (isRollingRef.current || gameStateRef.current !== 'roll' || winnerRef.current) return;
    isRollingRef.current = true;
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
        isRollingRef.current = false;

        const currentTurn = turnRef.current;
        const latestTokens = tokensRef.current;

        const movableTokens = latestTokens.filter(t => t.color.toLowerCase() === currentTurn.toLowerCase() && (t.state || '').toLowerCase() !== 'finished');
        const canMove = movableTokens.some(t => checkValidMove(t, finalDice));

        if (finalDice === 6) addLog(`${getPlayerName(currentTurn)} rolled a SIX! Extra turn!`);
        else addLog(`${getPlayerName(currentTurn)} rolled a ${finalDice}.`);

        // 🎯 GLOW LOGIC: Kon-si tokens glow karengi?
        // 1. Agar 6 aaya - current player ki saari tokens glow karengi (kyunki 6 par koi bhi move kar sakta hai)
        // 2. Agar 6 nahi aaya - sirf wahi tokens glow karengi jo valid move kar sakti hain
        if (finalDice === 6) {
          // 6 aaya - current player ki saari tokens glow (jo ghar se nikal sakti hain ya board par hain)
          const currentPlayerTokens = latestTokens.filter(t => 
            t.color.toLowerCase() === currentTurn.toLowerCase() && 
            (t.state || '').toLowerCase() !== 'finished'
          );
          setGlowingTokens(currentPlayerTokens.map(t => t.id));
        } else {
          // 6 nahi aaya - sirf valid moves glow karengi
          const validMoves = latestTokens.filter(t => 
            t.color.toLowerCase() === currentTurn.toLowerCase() && 
            checkValidMove(t, finalDice)
          ).map(t => t.id);
          setGlowingTokens(validMoves);
        }

        if (canMove) {
          setGameState('move');
          gameStateRef.current = 'move';
        } else {
          addLog(`No valid moves for ${getPlayerName(currentTurn)}.`);
          setTimeout(() => {
            setTurn(prev => {
              const playerKeys = Object.keys(PLAYERS);
              const nextIndex = (playerKeys.indexOf(prev) + 1) % playerKeys.length;
              const nextTurn = playerKeys[nextIndex];
              addLog(`${getPlayerName(nextTurn)} ki baari.`);
              return nextTurn;
            });
            setGameState('roll');
            gameStateRef.current = 'roll';
          }, 800); // Thoda ruk kar turn badlo taaki player ko padhne ka time mile
        }
      }
    }, 50);
  };

  const handleTokenClick = (tokenId) => {
    if (gameStateRef.current !== 'move' || winnerRef.current) return;
    
    const currentTokens = tokensRef.current;
    const currentTurn = turnRef.current;
    const currentDice = diceRef.current;

    const token = currentTokens.find(t => t.id === tokenId);
    if (!token) return;
    if (token.color.toLowerCase() !== currentTurn.toLowerCase()) return;

    if (!checkValidMove(token, currentDice)) {
      addLog("Cannot move.");
      return;
    }

    // INSTANT LOCK: Double-click bug ko turant rokne ke liye
    gameStateRef.current = 'roll';

    const newPos = getWrappedPos(token, currentDice);
    const color = token.color.toLowerCase();
    const homeStart = HOME_START[color];
    const entryPoint = ENTRY_POINT[color];
    const currentState = token.state ? token.state.toLowerCase() : 'home';

    let targetState = currentState;
    if (currentState === 'home') {
      // Coming out of home - now active on board
      targetState = 'active';
    } else if (currentState === 'active') {
      // Check if token will enter home run
      let distToEntry = entryPoint - Number(token.pos);
      if (distToEntry < 0) distToEntry += 52;
      
      if (Number(currentDice) > distToEntry) {
        targetState = 'homing';
      }
    }
    
    // Check if token finished (reached end of home run)
    if (targetState === 'homing' && newPos >= homeStart + 6) {
      targetState = 'finished';
    }

    setTokens(prevTokens => {
      let newTokens = [...prevTokens];
      
      // Check Kill (Sirf active state me maarega)
      if (targetState === 'active' && newPos < 52 && !SAFE_SPOTS.includes(newPos)) {
        newTokens = newTokens.map(t => {
          const tColor = t.color ? t.color.toLowerCase() : '';
          if (tColor !== currentTurn.toLowerCase() && t.pos === newPos && (t.state || '').toLowerCase() === 'active') {
            addLog(`⚔️ ${getPlayerName(currentTurn)} ne ${getPlayerName(tColor)} ki goti maar di!`);
            return { ...t, pos: -1, state: 'home' };
          }
          return t;
        });
      }

      newTokens = newTokens.map(t => {
        if (t.id === tokenId) {
          return { ...t, pos: newPos, state: targetState };
        }
        return t;
      });

      let isWin = false;
      const finishedCount = newTokens.filter(t => t.color.toLowerCase() === currentTurn.toLowerCase() && (t.state || '').toLowerCase() === 'finished').length;
      if (finishedCount === 4) {
        setWinner(currentTurn);
        addLog(`🎉🏆 ${getPlayerName(currentTurn)} WINS THE GAME! 🏆🎉`);
        isWin = true;
      }

      return newTokens;
    });

    setGameState('roll');
    // Agar 6 nahi aaya aur game nahi jeeta, toh hi agle player ki baari aayegi
    if (Number(currentDice) !== 6 && winnerRef.current === null) {
      setTurn(prev => {
        const playerKeys = Object.keys(PLAYERS);
        const nextIndex = (playerKeys.indexOf(prev) + 1) % playerKeys.length;
        const nextTurn = playerKeys[nextIndex];
        addLog(`${getPlayerName(nextTurn)} ki baari.`);
        return nextTurn;
      });
    }
  };

  const resetGame = () => {
    setTokens(getInitialTokens());
    setTurn('red');
    setDice(null);
    setGameState('roll');
    setWinner(null);
    setLogs(["Game Start! Red ki baari."]);
    setGlowingTokens([]); // Clear glow on reset
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', padding: 16 }}>
      <style>{`
        @keyframes dice-roll-anim {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(45deg) scale(1.2); }
          50% { transform: rotate(-45deg) scale(0.9); }
          75% { transform: rotate(90deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px currentColor; }
          50% { box-shadow: 0 0 25px currentColor, 0 0 40px currentColor; }
        }
        @keyframes token-glow-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.3); }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/play" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Real Ludo <span style={{ color: C.orange }}>Classic</span> 🎲</h1>
        <button onClick={resetGame} style={{ marginLeft: 'auto', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>🔄 Reset</button>
      </div>

      {/* Player Turn Indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {Object.keys(PLAYERS).map(p => (
          <div key={p} style={{ 
            padding: '6px 12px', 
            borderRadius: 20, 
            background: turn === p ? PLAYERS[p].color : C.card, 
            color: turn === p ? '#fff' : C.muted,
            fontWeight: turn === p ? 800 : 400,
            fontSize: 12,
            border: `2px solid ${PLAYERS[p].color}`,
            boxShadow: turn === p ? `0 0 15px ${PLAYERS[p].color}66` : 'none',
            transition: 'all 0.3s'
          }}>
            {PLAYERS[p].name}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        {winner !== null ? (
          <div style={{ background: C.card, padding: 30, borderRadius: 16, border: `2px solid ${PLAYERS[winner].color}`, textAlign: 'center', animation: 'pulse-glow 1s infinite' }}>
            <div style={{ fontSize: 64, marginBottom: 10 }}>🏆</div>
            <h2 style={{ color: PLAYERS[winner].color, margin: 0, fontSize: 28 }}>{PLAYERS[winner].name} Wins!</h2>
            <p style={{ color: C.muted, margin: '10px 0 20px' }}>🎉 Badhai ho! 🎉</p>
            <button onClick={resetGame} style={{ background: PLAYERS[winner].color, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: `0 4px 15px ${PLAYERS[winner].color}66` }}>Play Again 🔄</button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: C.card, padding: '16px 20px', borderRadius: 16, marginBottom: 16, border: `3px solid ${PLAYERS[turn].color}`, boxShadow: `0 0 30px ${PLAYERS[turn].color}33`, transition: 'all 0.3s' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', fontWeight: 'bold' }}>Current Turn</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: PLAYERS[turn].color, filter: `drop-shadow(0 0 5px ${PLAYERS[turn].color}88)` }}>{PLAYERS[turn].name}</div>
            </div>
            <div onClick={handleDiceRoll} style={{ width: 80, height: 80, background: PLAYERS[turn].color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, borderRadius: 16, cursor: gameState === 'roll' && !isRolling ? 'pointer' : 'not-allowed', color: '#fff', fontWeight: 900, animation: isRolling ? 'dice-roll-anim 0.3s infinite linear' : 'none', boxShadow: `0 8px 0 rgba(0,0,0,0.3), inset 0 4px 10px rgba(255,255,255,0.4)`, transition: 'all 0.1s', opacity: gameState === 'roll' ? 1 : 0.6 }}>
              {isRolling ? '🎲' : (dice ? DICE_FACES[dice] : '🎲')}
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: C.muted, width: 80 }}>
              {gameState === 'roll' ? <span style={{ color: PLAYERS[turn].color, fontWeight: 'bold' }}>Roll Dice!</span> : <span style={{ color: C.green, fontWeight: 'bold', animation: 'pulse-green 1s infinite' }}>Select Token 👇</span>}
            </div>
          </div>
        )}

        <LudoBoard 
          tokens={tokens}
          dice={dice}
          gameState={gameState}
          turn={turn}
          handleTokenClick={handleTokenClick}
          validTokenIds={validTokenIds}
          glowingTokens={glowingTokens}
        />

        <div style={{ marginTop: 20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, width: '100%', textAlign: 'left' }}>
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