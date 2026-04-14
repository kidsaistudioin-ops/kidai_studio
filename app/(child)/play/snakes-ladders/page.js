'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  red: '#ef4444', yellow: '#f59e0b', text: '#f1f5f9', muted: '#64748b'
};

// 🐍 SNAKES AND LADDERS LOGIC 🪜
const SNAKES = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
const LADDERS = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };
const DICE_FACES = { 1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅' };

// Board Generation (100 to 1)
const generateBoard = () => {
  let cells = [];
  for (let row = 9; row >= 0; row--) {
    let rowCells = [];
    for (let col = 1; col <= 10; col++) {
      rowCells.push(row * 10 + col);
    }
    if (row % 2 !== 0) rowCells.reverse(); // 'S' shape path
    cells.push(...rowCells);
  }
  return cells;
};

const BOARD_CELLS = generateBoard();

export default function SnakesAndLadders() {
  // Game Modes & Multiplayer States
  const [mode, setMode] = useState('menu'); // 'menu', 'ai', 'multi'
  const [room, setRoom] = useState('');
  const [role, setRole] = useState(null); // 'p1' (Host) or 'p2' (Guest)
  const [gameStarted, setGameStarted] = useState(false);
  const channelRef = useRef(null);

  // Core Game States
  const [p1Pos, setP1Pos] = useState(0);
  const [p2Pos, setP2Pos] = useState(0);
  const [turn, setTurn] = useState('p1'); // 'p1' or 'p2'
  const [dice, setDice] = useState(null);
  const [logs, setLogs] = useState(["Game Start! Player 1 ki baari."]);
  const [gameOver, setGameOver] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 4));
  };

  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const checkSnakeOrLadder = (pos, name) => {
    if (SNAKES[pos]) {
      addLog(`🐍 Oh no! Snake bit ${name}. Down to ${SNAKES[pos]}`);
      return SNAKES[pos];
    }
    if (LADDERS[pos]) {
      addLog(`🚀 Great! ${name} took a rocket to ${LADDERS[pos]}!`);
      return LADDERS[pos];
    }
    return pos;
  };

  const handleMove = () => {
    if (gameOver || isRolling) return;
    if (mode === 'multi' && turn !== role) return; // Multiplayer: Dusre ki turn pe click nahi hoga
    if (mode === 'ai' && turn !== 'p1') return; // AI mode: Arya ki turn pe click nahi hoga

    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDice(rollDice());
      count++;
      if (count > 6) {
        clearInterval(interval);
        const rolled = rollDice();
        setDice(rolled);
        setIsRolling(false);
        
        const playerName = mode === 'multi' ? (turn === 'p1' ? 'Player 1' : 'Player 2') : 'You';
        addLog(`${playerName} ne ${rolled} roll kiya!`);
        
        const currentPos = turn === 'p1' ? p1Pos : p2Pos;
        let newPos = currentPos + rolled;
        
        if (newPos > 100) {
          addLog(`100 pahunchne ke liye exact number chahiye!`);
          newPos = currentPos;
        } else {
          newPos = checkSnakeOrLadder(newPos, playerName);
        }

        if (turn === 'p1') setP1Pos(newPos); else setP2Pos(newPos);
        
        let isOver = false;
        let nextTurn = rolled === 6 ? turn : (turn === 'p1' ? 'p2' : 'p1'); // 6 = Extra turn!

        if (newPos === 100) {
          setGameOver(turn);
          addLog(`🎉 ${playerName} WON!`);
          isOver = true;
          nextTurn = turn;
        } else {
          if (rolled === 6) addLog(`🎲 Wow! ${playerName} ko mila Extra Turn!`);
          setTurn(nextTurn);
        }

        // Broadcast move if multiplayer
        if (mode === 'multi' && channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'MOVE',
            payload: {
              p1Pos: turn === 'p1' ? newPos : p1Pos,
              p2Pos: turn === 'p2' ? newPos : p2Pos,
              turn: nextTurn,
              dice: rolled,
              log: `${playerName} rolled ${rolled}.`,
              gameOver: isOver ? turn : false
            }
          });
        }
      }
    }, 80); // Fast flashing numbers
  };

  // AI Turn Logic
  useEffect(() => {
    let timer;
    let interval;
    if (mode === 'ai' && turn === 'p2' && !gameOver) {
      // 1 second ka delay taaki pata chale ki AI ki baari aayi hai
      timer = setTimeout(() => {
        setIsRolling(true);
        let count = 0;
        interval = setInterval(() => {
          setDice(rollDice());
          count++;
          if (count > 10) {
            clearInterval(interval);
            const rolled = rollDice();
            setDice(rolled);
            setIsRolling(false);
            
            addLog(`🤖 Arya ne ${rolled} roll kiya.`);
            let newPos = p2Pos + rolled;
            if (newPos > 100) newPos = p2Pos;
            else newPos = checkSnakeOrLadder(newPos, "Arya");
  
            setP2Pos(newPos);
            if (newPos === 100) {
              setGameOver('p2');
              addLog(`🤖 ARYA WON!`);
            } else {
              if (rolled === 6) addLog(`🎲 Arya ko mila Extra Turn!`);
              setTurn(rolled === 6 ? 'p2' : 'p1');
            }
          }
        }, 80);
      }, 1000); // 1000ms = 1 second pause
    }
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [turn, p2Pos, gameOver, mode]);

  // Multiplayer: Setup Supabase Channel
  const startMultiplayer = async (selectedRole) => {
    if (!room.trim()) return alert("Room code daalo pehle!");
    setRole(selectedRole);
    setMode('multi');
    
    const channel = supabase.channel(`snakes_${room.trim()}`, {
      config: { broadcast: { self: false } }
    });

    channel.on('broadcast', { event: 'JOIN' }, () => {
      if (selectedRole === 'p1') {
        addLog("Player 2 joined! Game Starting.");
        setGameStarted(true);
        channel.send({ type: 'broadcast', event: 'SYNC', payload: { gameStarted: true } });
      }
    });

    channel.on('broadcast', { event: 'SYNC' }, (payload) => {
      if (payload.payload.gameStarted) {
        setGameStarted(true);
        addLog("Connected to Host! Game Starting.");
      }
    });

    channel.on('broadcast', { event: 'MOVE' }, ({ payload }) => {
      setP1Pos(payload.p1Pos);
      setP2Pos(payload.p2Pos);
      setTurn(payload.turn);
      setDice(payload.dice);
      addLog(payload.log);
      if (payload.gameOver) {
        setGameOver(payload.gameOver);
        addLog(`🎉 ${payload.gameOver === 'p1' ? 'Player 1' : 'Player 2'} WON!`);
      }
    });

    await channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        if (selectedRole === 'p2') {
          await channel.send({ type: 'broadcast', event: 'JOIN', payload: {} });
        }
      }
    });

    channelRef.current = channel;
  };

  const quitRoom = () => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    setMode('menu');
    setGameStarted(false);
    resetGame();
  };

  useEffect(() => {
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  const resetGame = () => {
    setP1Pos(0); setP2Pos(0); setTurn('p1'); setGameOver(false); setDice(null);
    setLogs(["Naya Game Shuru! Player 1 ki baari."]);
  };

  const canRoll = !isRolling && !gameOver && (mode === 'ai' ? turn === 'p1' : turn === role);

  // ---------------- UI RENDERERS ----------------
  
  if (mode === 'menu') {
    return (
      <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
          <Link href="/play" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Saanp <span style={{ color: C.green }}>Rocket</span> 🐍🚀</h1>
        </div>
        
        <div style={{ background: C.card, padding: 24, borderRadius: 16, border: `1px solid ${C.border}`, textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
          <h2 style={{ marginBottom: 24, color: C.text }}>Mode Select Karo</h2>
          
          <button onClick={() => { setMode('ai'); setGameStarted(true); resetGame(); }} style={{ width: '100%', padding: 16, borderRadius: 12, background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`, color: '#fff', fontSize: 16, fontWeight: 800, border: 'none', marginBottom: 30, cursor: 'pointer' }}>
            🤖 Play vs Arya (AI)
          </button>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
            <h3 style={{ marginBottom: 16, color: C.yellow }}>👥 Online Multiplayer</h3>
            <input 
              placeholder="Enter Room Code (e.g. 1234)" 
              value={room} onChange={(e) => setRoom(e.target.value)}
              style={{ width: '100%', padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, background: C.card2, color: C.text, marginBottom: 16, textAlign: 'center', outline: 'none', fontSize: 16 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => startMultiplayer('p1')} style={{ flex: 1, padding: 14, borderRadius: 12, background: C.green, color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                🏠 Host
              </button>
              <button onClick={() => startMultiplayer('p2')} style={{ flex: 1, padding: 14, borderRadius: 12, background: C.orange, color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                🔗 Join
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'multi' && !gameStarted) {
    return (
      <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', padding: 40, textAlign: 'center' }}>
        <h2 style={{ color: C.cyan, marginBottom: 20 }}>Room Code: {room}</h2>
        <p style={{ color: C.muted, marginBottom: 30 }}>{role === 'p1' ? 'Apne friend ko room code do aur wait karo...' : 'Joining room...'}</p>
        <div style={{ fontSize: 60, animation: 'spin 3s linear infinite', marginBottom: 30 }}>⏳</div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <button onClick={quitRoom} style={{ padding: '10px 20px', borderRadius: 8, border: `1px solid ${C.red}`, background: 'transparent', color: C.red, cursor: 'pointer' }}>Cancel</button>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={quitRoom} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 24, marginRight: 16, cursor: 'pointer' }}>←</button>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Saanp <span style={{ color: C.green }}>Rocket</span> 🐍🚀</h1>
        {mode === 'multi' && <div style={{ marginLeft: 'auto', background: C.card2, padding: '4px 10px', borderRadius: 8, fontSize: 12, color: C.muted }}>Room: {room}</div>}
      </div>

      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, background: C.card, padding: 12, borderRadius: 16, border: `1px solid ${C.border}` }}>
          <div style={{ textAlign: 'center', opacity: turn === 'p1' ? 1 : 0.5 }}>
            <div style={{ fontSize: 24 }}>😊</div>
            <div style={{ fontWeight: 800, color: C.cyan }}>{mode === 'multi' ? (role === 'p1' ? 'You (P1)' : 'Host (P1)') : 'You'}: {p1Pos}</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, lineHeight: 1, color: C.yellow }}>{dice ? DICE_FACES[dice] : '🎲'}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
              {isRolling ? 'Rolling... 🎲' : 
                mode === 'ai' ? (turn === 'p1' ? 'Your Turn 😊' : "Arya's Turn 🤖") :
                (turn === role ? 'Your Turn 😊' : "Opponent's Turn 😎")}
            </div>
          </div>

          <div style={{ textAlign: 'center', opacity: turn === 'p2' ? 1 : 0.5 }}>
            <div style={{ fontSize: 24 }}>{mode === 'ai' ? '🤖' : '😎'}</div>
            <div style={{ fontWeight: 800, color: C.orange }}>{mode === 'ai' ? 'Arya' : (role === 'p2' ? 'You (P2)' : 'Guest (P2)')}: {p2Pos}</div>
          </div>
        </div>

        {/* The Board */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 2, 
          background: C.border, padding: 4, borderRadius: 12, marginBottom: 20,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5)`
        }}>
          {BOARD_CELLS.map((cell) => {
            const isSnakeHead = Object.keys(SNAKES).includes(cell.toString());
            const isLadderBottom = Object.keys(LADDERS).includes(cell.toString());
            const hasP1 = p1Pos === cell;
            const hasP2 = p2Pos === cell;
            const isEvenRow = Math.floor((cell - 1) / 10) % 2 === 0;
            const isEvenCell = cell % 2 === 0;
            let bg = (isEvenRow ? !isEvenCell : isEvenCell) ? C.card2 : C.card;
            
            if (isSnakeHead) bg = '#ef444433'; // Light Red for Snake
            if (isLadderBottom) bg = '#10b98133'; // Light Green for Ladder

            return (
              <div key={cell} style={{ 
                aspectRatio: '1', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', fontSize: 10, fontWeight: 700, color: C.text, borderRadius: 4,
                border: isSnakeHead ? `1px solid ${C.red}` : isLadderBottom ? `1px solid ${C.green}` : 'none'
              }}>
                <span style={{ position: 'absolute', top: 2, left: 2, fontSize: 8 }}>{cell}</span>
                {isSnakeHead && <span style={{ fontSize: 18, zIndex: 1, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}>🐍</span>}
                {isLadderBottom && <span style={{ fontSize: 18, zIndex: 1, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}>🚀</span>}
                
                <div style={{ display: 'flex', gap: 2, zIndex: 10, position: 'absolute', bottom: 2, right: 2 }}>
                  {hasP1 && <span style={{ fontSize: 16, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>😊</span>}
                  {hasP2 && !hasP1 && <span style={{ fontSize: 16, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{mode === 'ai' ? '🤖' : '😎'}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {!gameOver ? (
          <button 
            onClick={handleMove} disabled={!canRoll}
            style={{
              width: '100%', padding: 16, borderRadius: 16, border: 'none',
              background: canRoll ? `linear-gradient(135deg, ${C.cyan}, ${C.purple})` : C.card2,
              color: canRoll ? '#fff' : C.muted, fontSize: 18, fontWeight: 800, 
              cursor: canRoll ? 'pointer' : 'not-allowed',
              boxShadow: canRoll ? `0 6px 20px ${C.purple}44` : 'none', transition: 'all 0.2s'
            }}
          >
            {canRoll ? '🎲 ROLL DICE' : (isRolling ? 'Rolling... 🎲' : (mode === 'ai' ? '🤖 Arya is Thinking...' : '⏳ Wait for your turn'))}
          </button>
        ) : (
          <div style={{ textAlign: 'center', background: (gameOver === role || (mode === 'ai' && gameOver === 'p1')) ? C.green+'22' : C.red+'22', border: `2px solid ${(gameOver === role || (mode === 'ai' && gameOver === 'p1')) ? C.green : C.red}`, padding: 20, borderRadius: 16 }}>
            <h2 style={{ color: (gameOver === role || (mode === 'ai' && gameOver === 'p1')) ? C.green : C.red, margin: '0 0 10px 0' }}>
              {(gameOver === role || (mode === 'ai' && gameOver === 'p1')) ? '🏆 YOU WON!' : (mode === 'ai' ? '🤖 ARYA WON!' : '😎 FRIEND WON!')}
            </h2>
            <button onClick={resetGame} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: '10px 20px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>
              Play Again 🔄
            </button>
          </div>
        )}

        <div style={{ marginTop: 20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 8, textTransform: 'uppercase' }}>Game Logs</div>
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
