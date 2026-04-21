'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// Realistic Chess symbols
const SYMBOLS = { R: '♜', N: '♞', B: '♝', Q: '♛', K: '♚', P: '♟' }; 

// 🎨 REAL 3D ANIMATED CHARACTERS ENGINE
// Jab aapke paas asli character images/GIFs aa jayein, toh isko `true` kar dena!
const USE_REAL_IMAGES = true;

const renderPiece = (type, color) => {
  if (USE_REAL_IMAGES) {
    // Ye public/chess-pieces/ folder se aapki real images uthayega
    // Files ke naam aise rakhne honge: white-N.gif, black-K.png, white-P.webp aadi.
    const imgName = `${color}-${type}.gif`; // Agar PNG use karein toh .png kar dena
    return <img src={`/chess-pieces/${imgName}`} alt={`${color} ${type}`} style={{ width: '90%', height: '90%', objectFit: 'contain', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} draggable="false" />;
  }
  // Agar false hai, toh normal emoji dikhayega
  return SYMBOLS[type];
};

// Initial Board Setup Helper
const getInitialPieces = () => {
  const pieces = [];
  const backRow = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  
  // Black Pieces
  backRow.forEach((p, c) => pieces.push({ id: `b_${p}_${c}`, type: p, color: 'black', r: 0, c }));
  for (let c = 0; c < 8; c++) pieces.push({ id: `bp_${c}`, type: 'P', color: 'black', r: 1, c });

  // White Pieces
  for (let c = 0; c < 8; c++) pieces.push({ id: `wp_${c}`, type: 'P', color: 'white', r: 6, c });
  backRow.forEach((p, c) => pieces.push({ id: `w_${p}_${c}`, type: p, color: 'white', r: 7, c }));

  return pieces;
};

export default function ChessBoard() {
  // Lobby & Multiplayer States
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'lobby' | 'playing'
  const [gameMode, setGameMode] = useState('local'); // 'local' | 'online'
  const [roomCode, setRoomCode] = useState(''); 
  const [watchCode, setWatchCode] = useState(''); 
  const [joinInputMatch, setJoinInputMatch] = useState('');
  const [joinInputWatch, setJoinInputWatch] = useState('');
  const [myRole, setMyRole] = useState('local'); // 'white' (host), 'black' (joiner), 'spectator'
  
  // Channels
  const [matchChannel, setMatchChannel] = useState(null);
  const [watchChannel, setWatchChannel] = useState(null);
  const [lobbyChannel, setLobbyChannel] = useState(null);
  
  const [viewers, setViewers] = useState(0); // Spectator count

  // Game States
  const [pieces, setPieces] = useState(getInitialPieces());
  const [turn, setTurn] = useState('white');
  const [selectedId, setSelectedId] = useState(null);
  const [captured, setCaptured] = useState({ white: [], black: [] });
  const [lastMove, setLastMove] = useState(null); // Highlight last move
  const [checkStatus, setCheckStatus] = useState(null); // 'white', 'black', or null
  const [isShaking, setIsShaking] = useState(false);

  // Global Chat & Matchmaking
  const [chats, setChats] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [myUsername] = useState(() => 'Player_' + Math.floor(Math.random() * 10000));
  const [incomingInvite, setIncomingInvite] = useState(null);
  const chatEndRef = useRef(null);
  const [animatingCaptures, setAnimatingCaptures] = useState([]);
  const [isLobbyConnected, setIsLobbyConnected] = useState(false);

  // Store current board state in a ref to send to new players instantly
  const stateRef = useRef({ pieces, turn, captured, lastMove });
  useEffect(() => {
    stateRef.current = { pieces, turn, captured, lastMove };
  }, [pieces, turn, captured, lastMove]);

  // 🌐 GLOBAL LOBBY & CHAT SYSTEM (Only runs in Lobby)
  useEffect(() => {
    let lChan;
    let fallbackTimer;
    if (gameState === 'lobby') {
      setIsLobbyConnected(false);

      lChan = supabase.channel('chess_global_lobby', {
        config: { 
          presence: { key: myUsername },
          broadcast: { self: true } // 🔥 REQUIRED for messages to go to other browsers
        }
      });

      lChan.on('presence', { event: 'sync' }, () => {
        const state = lChan.presenceState();
        setOnlineUsers(Object.keys(state));
        setIsLobbyConnected(true); // Agar presence aaya matlab 100% connect ho gaya
      })
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        // Apna khud ka bheja hua message 2 baar na dikhe isliye filter kiya
        if (payload.user !== myUsername) {
          setChats(prev => [...prev.slice(-49), payload]); // Keep last 50 msgs
        }
      })
      .on('broadcast', { event: 'invite' }, ({ payload }) => {
        if (payload.to === myUsername) {
          setIncomingInvite(payload);
          playSound('select');
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsLobbyConnected(true);
          try { await lChan.track({ username: myUsername }); } catch (e) { console.error(e); }
        }
      });
      
      setLobbyChannel(lChan);

      // Fallback: Agar Supabase slow ho toh 2 second me UI unlock kar do
      fallbackTimer = setTimeout(() => setIsLobbyConnected(true), 2000);
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (lChan) supabase.removeChannel(lChan);
    };
  }, [gameState, myUsername]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  // Game Cleanup on exit
  useEffect(() => {
    if (gameState === 'menu' || gameState === 'lobby') {
      if (matchChannel) { supabase.removeChannel(matchChannel); setMatchChannel(null); }
      if (watchChannel) { supabase.removeChannel(watchChannel); setWatchChannel(null); }
      setPieces(getInitialPieces());
      setTurn('white');
      setCaptured({ white: [], black: [] });
      setLastMove(null);
      setRoomCode('');
      setWatchCode('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // Safely send broadcast
  const safeSend = (chan, event, payload) => {
    if (chan) {
      chan.send({ type: 'broadcast', event, payload }).catch(() => {});
    }
  };

  // 🤖 AI (COMPUTER) PLAYER LOGIC
  useEffect(() => {
    if (gameMode === 'ai' && turn === 'black' && gameState === 'playing') {
      const timer = setTimeout(() => {
        const blackPieces = pieces.filter(p => p.color === 'black' && !p.captured);
        blackPieces.sort(() => Math.random() - 0.5); // Random piece
        
        for (let p of blackPieces) {
           const squares = [];
           for(let r=0; r<8; r++) for(let c=0; c<8; c++) squares.push({r,c});
           squares.sort(() => Math.random() - 0.5); // Random square
           
           for (let sq of squares) {
              const target = pieces.find(tp => tp.r === sq.r && tp.c === sq.c && !tp.captured);
              if (isValidMove(p, p.r, p.c, sq.r, sq.c, target)) {
                 executeMove(p.id, p, sq.r, sq.c, target);
                 return;
              }
           }
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [turn, gameMode, gameState, pieces]);

  // 🧠 CHESS ENGINE: isKingInCheck
  const isKingInCheck = (kingColor, piecesState) => {
    const king = piecesState.find(p => p.type === 'K' && p.color === kingColor && !p.captured);
    if (!king) return false;

    const opponentColor = kingColor === 'white' ? 'black' : 'white';
    const opponentPieces = piecesState.filter(p => p.color === opponentColor && !p.captured);

    for (const attacker of opponentPieces) {
      // Use a temporary target piece for the check, as the king is not actually being captured
      const tempTarget = { ...king, color: kingColor }; 
      if (isValidMove(attacker, attacker.r, attacker.c, king.r, king.c, tempTarget)) {
        return true;
      }
    }
    return false;
  };

  // 🧠 CHESS ENGINE: Path Check (Bich me koi goti toh nahi hai?)
  const isPathClear = (r1, c1, r2, c2) => {
    // Ghode (Knight) ke L-shape move me koi seedha rasta nahi hota, isliye usko check mat karo
    const rowDiff = Math.abs(r2 - r1);
    const colDiff = Math.abs(c2 - c1);
    if (rowDiff !== 0 && colDiff !== 0 && rowDiff !== colDiff) return true;

    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);
    let r = r1 + dr;
    let c = c1 + dc;
    
    // Safety limit (max 8 boxes) jisse browser kabhi hang nahi hoga
    let steps = 0;
    while ((r !== r2 || c !== c2) && steps < 10) {
      if (pieces.find(p => p.r === r && p.c === c && !p.captured)) return false;
      r += dr;
      c += dc;
      steps++;
    }
    return true;
  };

  // 🧠 CHESS ENGINE: Move Validator (Rules)
  const isValidMove = (piece, r1, c1, r2, c2, targetPiece) => {
    if (targetPiece && targetPiece.color === piece.color) return false; // Apni goti nahi maar sakte
    
    const dr = r2 - r1;
    const dc = c2 - c1;
    const isClear = isPathClear(r1, c1, r2, c2);

    switch (piece.type) {
      case 'P': // Pyada (Pawn)
        const dir = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        // Seedha chalna (Forward)
        if (dc === 0 && !targetPiece) {
          if (dr === dir) return true;
          if (r1 === startRow && dr === dir * 2 && isPathClear(r1, c1, r2, c2)) return true;
        }
        // Marna (Diagonal Capture)
        if (Math.abs(dc) === 1 && dr === dir && targetPiece) return true;
        return false;
      case 'R': return (dr === 0 || dc === 0) && isClear; // Hathi (Rook)
      case 'B': return Math.abs(dr) === Math.abs(dc) && isClear; // Oont (Bishop)
      case 'Q': return (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) && isClear; // Wazir (Queen)
      case 'K': return Math.abs(dr) <= 1 && Math.abs(dc) <= 1; // Raja (King)
      case 'N': return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2); // Ghoda (Knight) - Isko path clear nahi chahiye
    }
    return false;
  };

  // 🎯 CORE MOVE EXECUTION LOGIC (Used by Tap, DragDrop, and AI)
  const executeMove = (pId, activePiece, r, c, targetPiece) => {
    const newPieces = pieces.map(p => {
      if (p.id === pId) return { ...p, r: r, c: c };
      if (p.id === targetPiece?.id) return { ...p, r: -1, c: -1, captured: true };
      return p;
    });
    
    const newCaptured = targetPiece 
      ? { ...captured, [activePiece.color]: [...captured[activePiece.color], targetPiece] } 
      : captured;
    const newLastMove = { r1: activePiece.r, c1: activePiece.c, r2: r, c2: c };
    const newTurn = turn === 'white' ? 'black' : 'white';

    // Animate capture
    if (targetPiece) {
      playSound('capture');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      setAnimatingCaptures(prev => [...prev, targetPiece]);
      setTimeout(() => {
        setAnimatingCaptures(prev => prev.filter(p => p.id !== targetPiece.id));
      }, 500);
    }

    // 1. Update Local Board
    setPieces(newPieces);
    setCaptured(newCaptured);
    setSelectedId(null);
    setLastMove(newLastMove);
    setTurn(newTurn);
    if (!targetPiece) playSound('move');

    // 2. Broadcast immediately ONLY when a real move is made
    if (gameMode === 'online') {
      const payload = { pieces: newPieces, turn: newTurn, captured: newCaptured, lastMove: newLastMove };
      if (myRole === 'white' && matchChannel) {
        safeSend(matchChannel, 'SYNC_STATE', payload);
        safeSend(watchChannel, 'SYNC_STATE', payload);
      } else if (myRole === 'black' && matchChannel) {
        safeSend(matchChannel, 'SYNC_STATE', payload);
      }
    }

    // 3. Check for check on the new board state
    if (isKingInCheck(newTurn, newPieces)) {
      setCheckStatus(newTurn);
      playSound('check');
    } else {
      setCheckStatus(null);
    }
  };

  // Handle Tap and Drop on Squares
  const handleSquareClick = (row, col, draggedPieceId = null) => {
    // Online Security: Spectator nahi khel sakta, aur player sirf apni baari me khelega
    if (myRole === 'spectator') return;
    if (myRole === 'white' && turn !== 'white') return;
    if (myRole === 'black' && turn !== 'black') return;
    if (gameMode === 'ai' && turn === 'black') return; // AI turn block

    const clickedPiece = pieces.find(p => p.r === row && p.c === col && !p.captured);
    const activeId = draggedPieceId || selectedId;
    
    // Agar koi piece already selected hai
    if (activeId) {
      const activePiece = pieces.find(p => p.id === activeId);
      
      // Agar apne hi color ki dusri goti par click kiya, toh use select kar lo
      if (clickedPiece && clickedPiece.color === activePiece.color) {
        setSelectedId(clickedPiece.id);
        playSound('select');
        return;
      }

      // Rule Engine Check
      if (!isValidMove(activePiece, activePiece.r, activePiece.c, row, col, clickedPiece)) {
        setSelectedId(null);
        return; // Galat chaal (Invalid move)
      }

      executeMove(activePiece.id, activePiece, row, col, clickedPiece);
      
    } else {
      // Naya piece select karna (Sirf apni turn wala)
      if (clickedPiece && clickedPiece.color === turn) {
        setSelectedId(clickedPiece.id);
        playSound('select');
      }
    }
  };

  // Simple Sound Effects
  const playSound = (type) => {
    // Jab aap public/sounds/ me 'move.mp3', 'capture.mp3', 'check.mp3' daal denge, tab ye chalega.
    // Abhi ke liye sounds mute hain taaki 404 error na aaye.
    return;
    /* eslint-disable no-unreachable */
      try {
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.play().catch(() => {});
      } catch(e) {}
  };

  // 🚀 SEPARATED MULTIPLAYER SETUP
  const startHost = (forcedMatchCode = null) => {
    const mCode = forcedMatchCode || Math.random().toString(36).substring(2, 6).toUpperCase();
    const wCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomCode(mCode);
    setWatchCode(wCode);
    setMyRole('white');
    setGameMode('online');
    setGameState('playing');

    const mChan = supabase.channel(`chess_match_${mCode}`, { config: { broadcast: { self: true } } });
    const wChan = supabase.channel(`chess_watch_${wCode}`, { config: { broadcast: { self: true }, presence: { key: 'host' } } });

    mChan.on('broadcast', { event: 'SYNC_STATE' }, ({ payload }) => {
      setPieces(payload.pieces); setTurn(payload.turn); setCaptured(payload.captured); setLastMove(payload.lastMove);
      // Forward Player 2's move to Spectators
      wChan.send({ type: 'broadcast', event: 'SYNC_STATE', payload }).catch(()=>{});
    })
    .on('broadcast', { event: 'REQUEST_STATE' }, () => {
      // Someone joined match, send them the current board instantly!
      mChan.send({ type: 'broadcast', event: 'SYNC_STATE', payload: stateRef.current }).catch(()=>{});
    }).subscribe();

    wChan.on('presence', { event: 'sync' }, () => {
      const state = wChan.presenceState();
      let count = 0; for(let id in state) count += state[id].length;
      setViewers(Math.max(0, count - 1)); // -1 to exclude host
    }).subscribe(async (status) => {
      if (status === 'SUBSCRIBED') await wChan.track({ role: 'host' });
    });
    
    wChan.on('broadcast', { event: 'REQUEST_STATE' }, () => {
      // Spectator joined, send them the board instantly!
      wChan.send({ type: 'broadcast', event: 'SYNC_STATE', payload: stateRef.current }).catch(()=>{});
    });

    setMatchChannel(mChan);
    setWatchChannel(wChan);
  };

  const joinMatch = (codeToJoin) => {
    const code = typeof codeToJoin === 'string' ? codeToJoin : joinInputMatch;
    if (!code) return;
    setRoomCode(code);
    setMyRole('black');
    setGameMode('online');
    setGameState('playing');

    const mChan = supabase.channel(`chess_match_${code}`, { config: { broadcast: { self: true } } });
    mChan.on('broadcast', { event: 'SYNC_STATE' }, ({ payload }) => {
      setPieces(payload.pieces); setTurn(payload.turn); setCaptured(payload.captured); setLastMove(payload.lastMove);
    }).subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        mChan.send({ type: 'broadcast', event: 'REQUEST_STATE' }).catch(()=>{});
      }
    });
    
    setMatchChannel(mChan);
  };

  const joinWatch = (codeToJoin) => {
    const code = typeof codeToJoin === 'string' ? codeToJoin : joinInputWatch;
    if (!code) return;
    setWatchCode(code);
    setMyRole('spectator');
    setGameMode('online');
    setGameState('playing');

    const wChan = supabase.channel(`chess_watch_${code}`, { config: { broadcast: { self: true }, presence: { key: 'spectator' } } });
    wChan.on('broadcast', { event: 'SYNC_STATE' }, ({ payload }) => {
      setPieces(payload.pieces); setTurn(payload.turn); setCaptured(payload.captured); setLastMove(payload.lastMove);
      if (payload.lastMove) playSound('move');
    }).on('presence', { event: 'sync' }, () => {
      const state = wChan.presenceState();
      let count = 0; for(let id in state) count += state[id].length;
      setViewers(Math.max(0, count));
    }).subscribe(async (status) => {
      if (status === 'SUBSCRIBED') await wChan.track({ role: 'spectator' });
    });
    setWatchChannel(wChan);
  };

  const sendChat = () => {
    if (!chatInput.trim() || !lobbyChannel) return;
    const payload = { user: myUsername, text: chatInput };
    setChats(prev => [...prev, payload]);
    setChatInput('');
    safeSend(lobbyChannel, 'chat', payload);
  };

  const sendInvite = (targetUser) => {
    const mCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    safeSend(lobbyChannel, 'invite', { from: myUsername, to: targetUser, matchCode: mCode });
    startHost(mCode); // Automatically start hosting
  };

  const startLocal = () => {
    setMyRole('local');
    setGameMode('local');
    setGameState('playing');
  };

  const startAI = () => {
    setMyRole('white');
    setGameMode('ai');
    setGameState('playing');
  };

  const btnStyle = (color) => ({ width: '100%', padding: 16, borderRadius: 12, border: `2px solid ${color}`, background: `${color}22`, color: color, fontSize: 16, fontWeight: 800, cursor: 'pointer', marginBottom: 12, transition: 'all 0.2s' });

  // ==========================================
  // 1. MAIN MENU SCREEN
  // ==========================================
  if (gameState === 'menu') {
    return (
      <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center', background: '#1e2d45', padding: '40px 24px', borderRadius: 16, border: '2px solid #334155' }}>
        <div style={{ fontSize: 64, marginBottom: 16, animation: 'piece-bounce 2s infinite' }}>♟️</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32, color: '#38bdf8' }}>KidAI Chess</h2>
        <button onClick={startAI} style={btnStyle('#f59e0b')}>🤖 Play vs Computer</button>
        <button onClick={startLocal} style={btnStyle('#10b981')}>👥 Pass & Play (Offline)</button>
        <button onClick={() => setGameState('lobby')} style={{ ...btnStyle('#3b82f6'), background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff' }}>🌐 Enter Online Arena</button>
      </div>
    );
  }

  // ==========================================
  // 2. ONLINE LOBBY & ARENA SCREEN
  // ==========================================
  if (gameState === 'lobby') {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        
        {/* LEFT PANEL: Global Chat & Auto Matchmaking */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', background: '#1e2d45', borderRadius: 16, border: '2px solid #334155', overflow: 'hidden', height: 550 }}>
          <div style={{ padding: '16px', background: '#0f172a', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: '#10b981', fontSize: 18 }}>💬 Global Arena Chat</h3>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Click 'Challenge' to play automatically!</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: (isLobbyConnected || onlineUsers.length > 0) ? '#10b981' : '#f59e0b', background: (isLobbyConnected || onlineUsers.length > 0) ? '#10b98122' : '#f59e0b22', padding: '4px 10px', borderRadius: 12 }}>
              {(isLobbyConnected || onlineUsers.length > 0) ? `🟢 ${onlineUsers.length > 0 ? onlineUsers.length : 1} Online` : '⏳ Connecting...'}
            </span>
          </div>
          
          {/* Active Online Players List */}
          <div style={{ padding: '10px 16px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', gap: 8, overflowX: 'auto', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 'bold', whiteSpace: 'nowrap' }}>PLAYERS:</span>
            {onlineUsers.filter(u => u !== myUsername).length === 0 && <span style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>Waiting for others...</span>}
            {onlineUsers.filter(u => u !== myUsername).map(u => (
              <div key={u} style={{ background: '#0f172a', padding: '4px 8px', borderRadius: 8, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #334155', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 800 }}>{u}</span>
                <button onClick={() => sendInvite(u)} style={{ background: '#ec4899', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 10, cursor: 'pointer', fontWeight: 'bold' }}>Challenge</button>
              </div>
            ))}
          </div>

          {incomingInvite && (
            <div style={{ background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>⚔️ {incomingInvite.from} challenged you!</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { joinMatch(incomingInvite.matchCode); setIncomingInvite(null); }} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 800 }}>Accept</button>
                <button onClick={() => setIncomingInvite(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 800 }}>Decline</button>
              </div>
            </div>
          )}

          <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {chats.map((chat, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ background: '#334155', color: '#fff', padding: '8px 14px', borderRadius: 14, borderTopLeftRadius: 0, fontSize: 14, maxWidth: '80%' }}>
                  <strong style={{ color: chat.user === myUsername ? '#38bdf8' : '#eab308', display: 'block', fontSize: 11, marginBottom: 4 }}>{chat.user}</strong>
                  {chat.text}
                </div>
                {chat.user !== myUsername && (
                  <button onClick={() => sendInvite(chat.user)} style={{ background: '#ec4899', color: '#fff', border: 'none', borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer', marginTop: 4 }}>⚔️ Challenge</button>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: 16, background: '#0f172a', display: 'flex', gap: 10 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Type message..." style={{ flex: 1, padding: '12px 16px', borderRadius: 20, border: 'none', background: '#1e2d45', color: '#fff', outline: 'none', fontSize: 15 }} />
            <button onClick={sendChat} style={{ background: '#38bdf8', color: '#fff', border: 'none', borderRadius: '50%', width: 44, height: 44, fontSize: 18, cursor: 'pointer', transition: 'all 0.2s' }}>➤</button>
          </div>
        </div>

        {/* RIGHT PANEL: Private Room Options */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#1e2d45', padding: 24, borderRadius: 16, border: '2px solid #334155' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#38bdf8', fontSize: 18 }}>🔒 Private Room</h3>
            <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>WhatsApp wale doston ke sath khelne ke liye room banayein. Codes andar milenge!</div>
            <button onClick={() => startHost()} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', marginBottom: 24, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>🏠 Create Private Room</button>
            
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input value={joinInputMatch} onChange={e => setJoinInputMatch(e.target.value.toUpperCase())} placeholder="Play Code" style={{ flex: 1, padding: 12, borderRadius: 10, border: '2px solid #10b981', background: '#0f172a', color: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 'bold', outline: 'none' }} maxLength={4} />
              <button onClick={joinMatch} style={{ padding: '12px 20px', background: '#10b981', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Play</button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={joinInputWatch} onChange={e => setJoinInputWatch(e.target.value.toUpperCase())} placeholder="Watch Code" style={{ flex: 1, padding: 12, borderRadius: 10, border: '2px solid #f59e0b', background: '#0f172a', color: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 'bold', outline: 'none' }} maxLength={4} />
              <button onClick={joinWatch} style={{ padding: '12px 20px', background: '#f59e0b', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Watch</button>
            </div>
          </div>
          
          <button onClick={() => setGameState('menu')} style={{ padding: 16, background: '#ef444422', border: '2px solid #ef4444', borderRadius: 16, color: '#ef4444', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>⬅ Back to Menu</button>
        </div>

      </div>
    );
  }

  // ==========================================
  // 3. PLAYING SCREEN (GAME BOARD)
  // ==========================================
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center', fontFamily: "'Nunito', sans-serif", animation: isShaking ? 'screen-shake 0.3s ease-in-out' : 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#38bdf8' }}>♟️ Animated Chess</h2>
        <button onClick={() => setGameState('menu')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}>✖ Exit Match</button>
      </div>

      {/* Top Bar for Host to share Codes */}
      {gameMode === 'online' && myRole === 'white' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, background: '#0f172a', padding: 12, borderRadius: 12, border: '1px solid #334155' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 800 }}>GIVE THIS TO PLAY:</div>
            <div style={{ background: '#10b98122', border: '1px solid #10b981', padding: '4px 10px', borderRadius: 6, color: '#10b981', fontWeight: 900, letterSpacing: 2 }}>{roomCode}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 800 }}>GIVE THIS TO WATCH:</div>
            <div style={{ background: '#f59e0b22', border: '1px solid #f59e0b', padding: '4px 10px', borderRadius: 6, color: '#f59e0b', fontWeight: 900, letterSpacing: 2 }}>{watchCode}</div>
          </div>
        </div>
      )}

      {/* Turn Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e2d45', padding: '12px 20px', borderRadius: 12, marginBottom: 12, border: '2px solid #334155' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: turn === 'white' ? '#fff' : '#64748b', opacity: turn === 'white' ? 1 : 0.5 }}>
          ⚪ White {turn === 'white' && (myRole === 'white' ? '(You)' : 'ki Baari')}
        </div>
        {viewers > 0 && <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 800, animation: 'pulse 2s infinite' }}>🔴 {viewers} Watching Live</div>}
        <div style={{ fontSize: 15, fontWeight: 800, color: turn === 'black' ? '#f59e0b' : '#64748b', opacity: turn === 'black' ? 1 : 0.5 }}>
          ⚫ Black {turn === 'black' && (myRole === 'black' ? '(You)' : 'ki Baari')}
        </div>
      </div>

      {myRole === 'spectator' && (
        <div style={{ background: '#f59e0b22', border: '1px dashed #f59e0b', color: '#f59e0b', padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 800, marginBottom: 12 }}>
          👁️ You are spectating. You cannot move pieces.
        </div>
      )}

      {/* Black Captured Pieces */}
      <div style={{ minHeight: 30, display: 'flex', gap: 4, marginBottom: 8, padding: '0 8px' }}>
        {captured.white.map((p, i) => <span key={i} style={{ display: 'inline-block', width: 24, height: 24, fontSize: 20, color: '#000', filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' }}>{renderPiece(p.type, p.color)}</span>)}
      </div>

      {/* THE CHESS BOARD */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: '#e2e8f0', borderRadius: 8, border: '6px solid #1e293b', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
        
        {/* Background Grid (64 Squares) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', width: '100%', height: '100%', position: 'absolute' }}>
          {Array.from({ length: 64 }).map((_, i) => {
            const r = Math.floor(i / 8);
            const c = i % 8;
            const isDark = (r + c) % 2 === 1;
            const isLastMove = lastMove && ((lastMove.r1 === r && lastMove.c1 === c) || (lastMove.r2 === r && lastMove.c2 === c));
            
            let bg = isDark ? '#64748b' : '#cbd5e1';
            if (isLastMove) bg = isDark ? '#a3b18a' : '#d1fae5'; // Highlight last move

            return (
              <div 
                key={i} 
                onClick={() => handleSquareClick(r, c)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const pId = e.dataTransfer.getData('text/plain');
                  if(pId) handleSquareClick(r, c, pId);
                }}
                style={{ 
                  background: bg, 
                  width: '100%', height: '100%',
                  boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)'
                }} 
              />
            );
          })}
        </div>

        {/* Animated Pieces Overlay */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          <style>{`
            @keyframes piece-bounce {
              0%, 100% { transform: scale(1.15) translateY(-4px); }
              50% { transform: scale(1.2) translateY(-8px); }
            }
            @keyframes screen-shake {
              0%, 100% { transform: translateX(0); }
              20%, 60% { transform: translateX(-3px); }
              40%, 80% { transform: translateX(3px); }
            }
            @keyframes king-in-check {
              0%, 100% { filter: drop-shadow(0 0 5px #ef4444) drop-shadow(0 0 10px #ef4444); }
              50% { filter: drop-shadow(0 0 10px #ef4444) drop-shadow(0 0 20px #ef4444); }
            }
            @keyframes piece-capture {
              to { transform: scale(0.5) rotate(180deg); opacity: 0; }
            }
            .chess-piece {
              position: absolute;
              width: 12.5%; /* 100% / 8 columns */
              height: 12.5%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: clamp(28px, 9vw, 42px);
              /* Normal gliding transition */
              transition: left 0.4s ease-in-out, top 0.4s ease-in-out, transform 0.2s;
              pointer-events: auto;
              cursor: pointer;
            }
            /* 🐎 GHODE (KNIGHT) KA JUMP ANIMATION */
            .chess-piece.knight-jump {
               /* Y-axis pe uchalne ke liye cubic-bezier use kiya hai */
               transition: left 0.4s linear, top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
               z-index: 20 !important;
            }
          `}</style>
          
          {pieces.map(p => {
            if (p.captured) return null; // Agar capture ho gaya toh hide karo
            
            const isSelected = p.id === selectedId;
            const isKingInCheck = p.type === 'K' && p.color === checkStatus;
            const isKnight = p.type === 'N';
            
            return (
              <div
                key={p.id}
                className={`chess-piece ${isKnight ? 'knight-jump' : ''}`}
                onClick={() => handleSquareClick(p.r, p.c)}
                draggable={isSelected || (p.color === turn && (myRole === 'local' || myRole === p.color))}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', p.id);
                  setSelectedId(p.id);
                }}
                style={{
                  left: `${p.c * 12.5}%`,
                  top: `${p.r * 12.5}%`,
                  color: p.color === 'white' ? '#fff' : '#0f172a',
                  /* 3D Realistic Shadow Effect */
                  filter: p.color === 'white' 
                    ? 'drop-shadow(1px 3px 2px rgba(0,0,0,0.6)) drop-shadow(-1px -1px 0px rgba(255,255,255,0.4))' 
                    : 'drop-shadow(1px 3px 2px rgba(0,0,0,0.6)) drop-shadow(-1px -1px 0px rgba(0,0,0,0.8))',
                  animation: isKingInCheck ? 'king-in-check 1.2s infinite ease-in-out' : (isSelected ? 'piece-bounce 0.6s infinite ease-in-out' : 'none'),
                  background: isSelected ? 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 70%)' : 'none',
                  zIndex: isSelected ? 10 : 1
                }}
              >
                {renderPiece(p.type, p.color)}
              </div>
            );
          })}

          {/* Render capturing pieces for animation */}
          {animatingCaptures.map(p => (
            <div
              key={`anim-${p.id}`}
              className="chess-piece"
              style={{
                left: `${p.c * 12.5}%`,
                top: `${p.r * 12.5}%`,
                color: p.color === 'white' ? '#fff' : '#0f172a',
                zIndex: 50,
                animation: 'piece-capture 0.5s forwards ease-out'
              }}
            >
              {renderPiece(p.type, p.color)}
            </div>
          ))}
        </div>
      </div>

      {/* White Captured Pieces */}
      <div style={{ minHeight: 30, display: 'flex', gap: 4, marginTop: 8, padding: '0 8px' }}>
        {captured.black.map((p, i) => <span key={i} style={{ display: 'inline-block', width: 24, height: 24, fontSize: 20, color: '#fff', filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))' }}>{renderPiece(p.type, p.color)}</span>)}
      </div>

      <div style={{ marginTop: 20, padding: 16, background: '#1e293b', borderRadius: 12, border: '1px solid #334155', color: '#cbd5e1', fontSize: 13, textAlign: 'left', lineHeight: 1.6 }}>
        <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: 6 }}>💡 Smart Chess Engine Active:</div>
        Game mein original chess ke saare basic rules lage hue hain. Ghoda (Knight) uchal ke chalega! Apni baari par goti tap karein aur sahi jagah par chal kar dushman ko harayein.
      </div>
    </div>
  );
}