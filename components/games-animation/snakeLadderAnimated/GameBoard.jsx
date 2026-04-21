'use client';
import { useState, useEffect } from 'react';
import Player from './Player';
import Dice from './Dice';
import { supabase } from '@/lib/supabase';

const LADDERS = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };
const SNAKES = { 17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78 };
const SNAKE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];

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
  const [gameState, setGameState] = useState('playing'); // 'menu' | 'online_lobby' | 'playing'
  const [showSetup, setShowSetup] = useState(false);
  const [gameMode, setGameMode] = useState('local'); // 'ai' | 'local' | 'online'
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [channel, setChannel] = useState(null);
  const [myPlayerId, setMyPlayerId] = useState(0); // Online mode me kaunsa player mera hai

  const [isRolling, setIsRolling] = useState(false);
  
  const CHARACTERS = ['boy', 'girl', 'robot', 'ninja'];
  
  // Setup Menu State
  const [setupPlayers, setSetupPlayers] = useState([
    { id: 0, char: 'boy', isAI: false, pos: 1, emotion: 'normal' },
    { id: 1, char: 'girl', isAI: false, pos: 1, emotion: 'normal' }
  ]);

  const [players, setPlayers] = useState([
    { id: 0, char: 'boy', isAI: false, pos: 1, emotion: 'normal' },
    { id: 1, char: 'girl', isAI: false, pos: 1, emotion: 'normal' }
  ]);
  const [turn, setTurn] = useState(0);
  const [message, setMessage] = useState("Game Started! Player 1 ki baari! 🎲");
  const [historyLog, setHistoryLog] = useState([]);

  // Game mode change hone par setup reset karein
  useEffect(() => {
    if (gameMode === 'ai') {
      setSetupPlayers([
        { id: 0, char: 'boy', isAI: false, pos: 1, emotion: 'normal' },
        { id: 1, char: 'robot', isAI: true, pos: 1, emotion: 'normal' }
      ]);
    } else {
      setSetupPlayers([
        { id: 0, char: 'boy', isAI: false, pos: 1, emotion: 'normal' },
        { id: 1, char: 'girl', isAI: false, pos: 1, emotion: 'normal' }
      ]);
    }
  }, [gameMode]);

  // 🤖 AI Player Logic: Agar computer ki baari hai, toh khud dice roll kare
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && players[turn]?.isAI && !isRolling) {
      timer = setTimeout(() => {
        const aiRoll = Math.floor(Math.random() * 6) + 1;
        handleRoll(aiRoll, false);
      }, 1200);
    }
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, isRolling, gameState]);

  // 🌐 Supabase Online Real-Time Channels
  const createOnlineRoom = () => {
    const newCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomCode(newCode);
    setMyPlayerId(0);
    setupSupabaseChannel(newCode, 0);
  };

  const joinOnlineRoom = () => {
    if(!joinCode) return;
    setRoomCode(joinCode);
    setMyPlayerId(1); // Host 0 hai, Joiner 1 hai
    setupSupabaseChannel(joinCode, 1);
  };

  const setupSupabaseChannel = (code, myId) => {
    const chan = supabase.channel(`snake_ladder_${code}`);

    chan.on('broadcast', { event: 'SYNC_SETUP' }, ({ payload }) => setSetupPlayers(payload.setupPlayers))
        .on('broadcast', { event: 'START_GAME' }, ({ payload }) => {
          setPlayers(payload.players);
          setGameState('playing');
          setMessage(`Game Started! Player 1 ki baari! 🎲`);
        })
        .on('broadcast', { event: 'ROLL_DICE' }, ({ payload }) => {
          handleRoll(payload.val, true); // Network se roll aya
        })
        .subscribe();

    setChannel(chan);
    setGameState('online_lobby');
  };

  // Player update helper function
  const updatePlayer = (index, data) => {
    setPlayers(prev => {
      const newP = [...prev];
      newP[index] = { ...newP[index], ...data };
      return newP;
    });
  };

  const handleRoll = (val, fromNetwork = false) => {
    const currentPlayer = players[turn];
    if (!currentPlayer) return;

    // Online & Security checks
    if (gameMode === 'online') {
      if (!fromNetwork && turn !== myPlayerId) return; // Sirf apni baari pe click allow hai
      if (!fromNetwork && channel) {
        channel.send({ type: 'broadcast', event: 'ROLL_DICE', payload: { val } });
      }
    }

    if (isRolling || currentPlayer.pos >= 100) return;
    setIsRolling(true);
    
    let currentStep = currentPlayer.pos;
    let targetPos = currentPlayer.pos + val;
    
    if (targetPos > 100) {
      setMessage(`100 par jane ke liye ${100 - currentPlayer.pos} chahiye!`);
      // Log history even if missed
      setHistoryLog(prev => [{ p: turn + 1, c: currentPlayer.char, v: val, status: 'miss' }, ...prev]);
      
      setTimeout(() => {
        switchTurn();
        setIsRolling(false);
      }, 1500);
      return;
    }

    setMessage(`Player ${turn + 1} ne ${val} roll kiya!`);
    setHistoryLog(prev => [{ p: turn + 1, c: currentPlayer.char, v: val, status: 'ok' }, ...prev]);
    const isFast = val >= 4;
    updatePlayer(turn, { emotion: isFast ? "walk_fast" : "walk_normal" });
    
    const speed = isFast ? 250 : 450;

    const moveInterval = setInterval(() => {
      currentStep++;
      updatePlayer(turn, { pos: currentStep });

      if (currentStep >= targetPos) {
        clearInterval(moveInterval);
        
        setTimeout(() => {
          if (LADDERS[targetPos]) {
            playSound('ladder.mp3'); // 🔊 Ladder Sound
            setMessage(`YAY! Player ${turn + 1} ko Seedhi mil gayi! 🪜`);
            updatePlayer(turn, { emotion: "ladder" });
            setTimeout(() => {
              updatePlayer(turn, { pos: LADDERS[targetPos] });
              finishRoll(LADDERS[targetPos]);
            }, 1000);
          } else if (SNAKES[targetPos]) {
            playSound('snake.mp3'); // 🔊 Snake Sound
            setMessage(`OH NO! Player ${turn + 1} ko Saanp ne kaat liya! 🐍`);
            updatePlayer(turn, { emotion: "snake" });
            setTimeout(() => {
              updatePlayer(turn, { pos: SNAKES[targetPos] });
              finishRoll(SNAKES[targetPos]);
            }, 1500);
          } else {
            updatePlayer(turn, { emotion: "normal" });
            finishRoll(targetPos);
          }
        }, 300);
      }
    }, speed);
  };

  const finishRoll = (finalPos) => {
    setTimeout(() => {
      updatePlayer(turn, { emotion: "normal" });
      if (finalPos === 100) {
        playSound('win.mp3'); // 🔊 Win Sound
        updatePlayer(turn, { emotion: "win" });
        setMessage(`Player ${turn + 1} Jeet Gaya! 🎉🏆`);
        setIsRolling(false);
        if (onGameEnd) {
          setTimeout(() => onGameEnd(), 2500);
        }
      } else {
        switchTurn();
        setIsRolling(false);
      }
    }, 500);
  };

  const switchTurn = () => {
    setTurn(prevTurn => {
      const nextTurn = (prevTurn + 1) % players.length;
      setMessage(`Ab Player ${nextTurn + 1} (${players[nextTurn].char}) ki baari hai! 🎲`);
      return nextTurn;
    });
  };

  // Setup Menu Functions
  const adjustSetupPlayers = (num) => {
    let newSetup = [...setupPlayers];
    if (num > newSetup.length) {
       for (let i = newSetup.length; i < num; i++) {
          newSetup.push({ id: i, char: CHARACTERS[i % 4], isAI: gameMode === 'ai' ? i !== 0 : false, pos: 1, emotion: 'normal' });
       }
    } else {
       newSetup = newSetup.slice(0, num);
    }
    setSetupPlayers(newSetup);
    if (channel) channel.send({ type: 'broadcast', event: 'SYNC_SETUP', payload: { setupPlayers: newSetup } });
  };

  const changePlayerChar = (index, newChar) => {
     const newSetup = [...setupPlayers];
     newSetup[index].char = newChar;
     setSetupPlayers(newSetup);
     if (channel) channel.send({ type: 'broadcast', event: 'SYNC_SETUP', payload: { setupPlayers: newSetup } });
  };

  const startLocalGame = () => {
    setPlayers(setupPlayers);
    setGameState('playing');
    setTurn(0);
    setHistoryLog([]); // Game restart pe history clear
    setMessage(`Game Started! Player 1 (${setupPlayers[0].char}) ki baari! 🎲`);
    setShowSetup(false);
  };

  const startOnlineGame = () => {
     if (channel) channel.send({ type: 'broadcast', event: 'START_GAME', payload: { players: setupPlayers } });
     startLocalGame();
     setShowSetup(false);
  };

  // 100 Cells Zig-Zag Logic
  const cells = [];
  
  // Loop from top row (90-100) down to bottom row (1-10)
  for (let row = 9; row >= 0; row--) {
    let rowCells = [];
    for (let col = 1; col <= 10; col++) {
      let cellNumber = row * 10 + col;
      rowCells.push(cellNumber);
    }
    // Even rows (0, 2...) -> Left to Right. Odd rows (1, 3...) -> Right to Left.
    if (row % 2 !== 0) {
      rowCells.reverse();
    }
    cells.push(...rowCells);
  }

  const isMyTurn = gameMode === 'online' ? turn === myPlayerId : !players[turn]?.isAI;

  const modeBtnStyle = (active) => ({
    flex: 1, padding: '10px', background: active ? '#10b981' : '#1e2d45', color: '#fff', border: '2px solid', borderColor: active ? '#059669' : '#334155', borderRadius: 10, cursor: 'pointer', fontWeight: 800, fontSize: 13
  });

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#10b981' }}>🐍 Snake & Ladder 🪜</h2>
        <button onClick={() => { setGameState('menu'); setShowSetup(true); }} style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}>⚙️ Setup</button>
      </div>

      {/* SETUP MODAL (POPUP) */}
      {showSetup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ maxWidth: 400, width: '100%', background: '#1e2d45', padding: 24, borderRadius: 16, border: '2px solid #334155', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => { setShowSetup(false); setGameState('playing'); }} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>✖</button>
            
            {gameState === 'menu' ? (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: '#10b981' }}>Game Setup ⚙️</h2>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                  <button onClick={() => setGameMode('ai')} style={modeBtnStyle(gameMode === 'ai')}>🤖 Vs AI</button>
                  <button onClick={() => setGameMode('local')} style={modeBtnStyle(gameMode === 'local')}>👥 Local</button>
                  <button onClick={() => setGameMode('online')} style={modeBtnStyle(gameMode === 'online')}>🌐 Online</button>
                </div>
                {gameMode !== 'online' ? (
                  <>
                    <div style={{ marginBottom: 12, color: '#94a3b8', fontWeight: 700, fontSize: 14 }}>Kitne Players Khelenge?</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
                       {[2, 3, 4].map(num => (
                         <button key={num} onClick={() => adjustSetupPlayers(num)} style={{ padding: '8px 16px', background: setupPlayers.length === num ? '#10b981' : '#0f172a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}>{num}</button>
                       ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                      {setupPlayers.map((p, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', padding: '12px 16px', borderRadius: 12 }}>
                          <span style={{ fontWeight: 'bold', color: '#cbd5e1' }}>Player {index + 1} {p.isAI ? '(AI 🤖)' : ''}</span>
                          <select value={p.char} onChange={(e) => changePlayerChar(index, e.target.value)} style={{ background: '#334155', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, outline: 'none', fontWeight: 'bold', textTransform: 'capitalize' }}>
                            {CHARACTERS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                    <button onClick={startLocalGame} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 18, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>🚀 Start Game</button>
                  </>
                ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 10 }}>
                      <button onClick={createOnlineRoom} style={{ padding: 16, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>🏠 Host New Game</button>
                      <div style={{ color: '#64748b', fontWeight: 'bold', margin: '8px 0' }}>OR JOIN FRIEND</div>
                      <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="Enter 4-Digit Code" style={{ padding: 14, borderRadius: 12, border: '2px solid #334155', background: '#0f172a', color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold', outline: 'none', letterSpacing: 4 }} maxLength={4} />
                      <button onClick={joinOnlineRoom} style={{ padding: 16, background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>🔗 Join Game</button>
                   </div>
                )}
                <div style={{ marginTop: 24, padding: 16, background: '#0f172a', borderRadius: 12, textAlign: 'left' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: 14 }}>📖 Kaise Khelein?</h4>
                  <ul style={{ margin: 0, paddingLeft: 16, color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
                    <li><strong style={{color:'#fff'}}>🤖 Vs AI:</strong> Computer (Robot) ke saath khelein.</li>
                    <li><strong style={{color:'#fff'}}>👥 Local (Offline):</strong> Ek hi mobile par doston ke saath baari-baari khelein.</li>
                    <li><strong style={{color:'#fff'}}>🌐 Online:</strong> "Host" karke code banayein aur door baithe doston ko join karwayein!</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ color: '#3b82f6', marginBottom: 8, fontSize: 24 }}>🌐 Room: {roomCode}</h2>
                <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>Apne dost ko ye code do: <strong style={{ color: '#fff', fontSize: 18, letterSpacing: 2, marginLeft: 6 }}>{roomCode}</strong></p>
                <div style={{ marginBottom: 12, color: '#94a3b8', fontWeight: 700, fontSize: 14 }}>Kitne Players? (Host changes)</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
                   {[2, 3, 4].map(num => (
                     <button key={num} onClick={() => myPlayerId === 0 && adjustSetupPlayers(num)} style={{ padding: '8px 16px', background: setupPlayers.length === num ? '#3b82f6' : '#0f172a', color: '#fff', border: 'none', borderRadius: 8, cursor: myPlayerId === 0 ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: 16, opacity: myPlayerId === 0 ? 1 : 0.6 }}>{num}</button>
                   ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                   {setupPlayers.map((p, i) => (
                     <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', padding: '12px 16px', borderRadius: 12 }}>
                        <span style={{ fontWeight: 'bold', color: myPlayerId === i ? '#3b82f6' : '#cbd5e1' }}>Player {i + 1} {myPlayerId === i ? '(You)' : ''}</span>
                        {myPlayerId === i ? (
                          <select value={p.char} onChange={e => changePlayerChar(i, e.target.value)} style={{ background: '#334155', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, outline: 'none', fontWeight: 'bold', textTransform: 'capitalize' }}>
                            {CHARACTERS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : (<span style={{ color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>{p.char}</span>)}
                     </div>
                   ))}
                </div>
                {myPlayerId === 0 ? (
                  <button onClick={startOnlineGame} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 18, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>🚀 Start Game Everyone</button>
                ) : (<div style={{ color: '#f59e0b', fontWeight: 'bold', padding: 16, background: '#f59e0b22', borderRadius: 12 }}>⏳ Waiting for host to start...</div>)}
              </>
            )}
          </div>
        </div>
      )}
      
      <div style={{ marginBottom: 16, background: '#1e2d45', padding: 16, borderRadius: 12, border: `2px solid ${turn === 0 ? '#3b82f6' : turn === 1 ? '#ec4899' : turn === 2 ? '#eab308' : '#10b981'}`, transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          {players.map((p, i) => (
            <div key={p.id} style={{ padding: '4px 8px', borderRadius: 6, background: turn === i ? '#334155' : 'transparent', border: `1px solid ${turn === i ? '#94a3b8' : 'transparent'}`, opacity: turn === i ? 1 : 0.5, fontSize: 12, fontWeight: 'bold' }}>
              P{i + 1} ({p.char})
            </div>
          ))}
        </div>
        <h3 style={{ margin: '0 0 12px 0', color: '#f1f5f9', fontSize: 15 }}>{message}</h3>
        {players.every(p => p.pos < 100) && <Dice onRoll={(val) => handleRoll(val, false)} disabled={isRolling || !isMyTurn} />}
      </div>

      {/* Dice History Log Panel */}
      <div style={{ marginBottom: 16, background: '#1e2d45', padding: '12px 16px', borderRadius: 12, border: '1px solid #334155', maxHeight: 110, overflowY: 'auto', textAlign: 'left' }}>
        <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8, fontWeight: 700 }}>📜 Dice History (Rolls)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {historyLog.length === 0 && <div style={{ color: '#64748b', fontSize: 11 }}>Abhi tak koi roll nahi hua...</div>}
          {historyLog.map((log, i) => (
            <div key={i} style={{ fontSize: 12, color: '#cbd5e1', background: '#0f172a', padding: '6px 10px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: i === 0 ? 1 : 0.7 }}>
              <span><strong style={{ color: log.p === 1 ? '#3b82f6' : log.p === 2 ? '#ec4899' : log.p === 3 ? '#eab308' : '#10b981' }}>P{log.p}</strong> ({log.c})</span>
              <span>{log.status === 'miss' ? '🚫 Missed' : '🎲 Rolled'} <strong style={{ color: '#fff', fontSize: 14 }}>{log.v}</strong></span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', background: '#1e2d45', borderRadius: 12, border: '4px solid #334155', overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
        
        {/* Asli Snakes aur Ladders (SVG Overlay) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
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
                  {/* Seedhi ki do side lines (Thinner) */}
                  <line x1="0" y1="-2" x2={length} y2="-2" stroke="#d97706" strokeWidth="1.5" />
                  <line x1="0" y1="2" x2={length} y2="2" stroke="#d97706" strokeWidth="1.5" />
                  {/* Seedhi ke steps (Paiydan) */}
                  {Array.from({ length: Math.max(3, Math.floor(length / 8)) }).map((_, i, arr) => {
                    const stepX = (length / (arr.length + 1)) * (i + 1);
                    return <line key={i} x1={stepX} y1="-2" x2={stepX} y2="2" stroke="#d97706" strokeWidth="1" />;
                  })}
                </g>
              </g>
            )
          })}
          {Object.entries(SNAKES).map(([s, e], index) => {
            const head = getCoordinates(parseInt(s));
            const tail = getCoordinates(parseInt(e));
            const snakeColor = SNAKE_COLORS[index % SNAKE_COLORS.length]; // Har saanp ka naya rang
            
            const dx = tail.x - head.x;
            const dy = tail.y - head.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            {/* Saanp ke body ke liye wavy curve (Thinner & less wide) */}
            const wave = `M 0 0 Q ${length*0.25} 8, ${length*0.5} 0 T ${length} 0`;
            
            return (
              <g key={`s-${s}`} transform={`translate(${head.x}, ${head.y}) rotate(${angle})`}>
                <g style={{ animation: 'snakeHead 1.5s infinite alternate ease-in-out' }}>
                  {/* Wavy Saanp (Body) */}
                  <path d={wave} stroke={snakeColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  {/* Saanp ka Head & Eyes */}
                  <circle cx="0" cy="0" r="3" fill={snakeColor} />
                  <circle cx="-1" cy="-1" r="0.8" fill="#fff" />
                  <circle cx="-1" cy="1" r="0.8" fill="#fff" />
                  {/* Pupils */}
                  <circle cx="-1.2" cy="-1" r="0.3" fill="#000" />
                  <circle cx="-1.2" cy="1" r="0.3" fill="#000" />
                  {/* Tongue */}
                  <path d="M -2.5 0 L -4 -0.5 M -2.5 0 L -4 0.5" stroke="#ef4444" strokeWidth="0.5" fill="none" />
                </g>
              </g>
            )
          })}
        </svg>

        {/* Grid Cells & Player */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', position: 'relative', zIndex: 1 }}>
          {cells.map((num) => (
        <div key={num} style={{ aspectRatio: '1', background: num % 2 === 0 ? '#0f1520' : '#161e30', border: '1px solid #1e2d45', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, position: 'relative', zIndex: players.some(p => p.pos === num) ? 10 : 1 }}>
              <span style={{ position: 'absolute', top: 2, left: 2, fontSize: 8, opacity: 0.6 }}>{num}</span>
              
              <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {players.map((p) => p.pos === num && (
                  <div key={p.id} style={{ width: players.length > 1 ? '45%' : '80%', height: players.length > 1 ? '45%' : '80%', margin: '1%' }}>
                    <Player emotion={p.emotion} type={p.char} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
    </div>
      </div>
    </div>
  );
}