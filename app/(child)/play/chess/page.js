'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = {
  bg: '#07090f', card: '#0f1520', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', text: '#f1f5f9', muted: '#64748b',
  whiteSquare: '#e2e8f0', blackSquare: '#475569'
};

const INITIAL_BOARD = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

const isWhite = (p) => ['♙','♖','♘','♗','♕','♔'].includes(p);
const isBlack = (p) => ['♟','♜','♞','♝','♛','♚'].includes(p);

const isPathClear = (board, from, to) => {
  const rStep = to.r > from.r ? 1 : to.r < from.r ? -1 : 0;
  const cStep = to.c > from.c ? 1 : to.c < from.c ? -1 : 0;
  let r = from.r + rStep;
  let c = from.c + cStep;
  while (r !== to.r || c !== to.c) {
    if (board[r][c] !== '') return false;
    r += rStep;
    c += cStep;
  }
  return true;
};

const isValidMove = (board, from, to, piece) => {
  const dr = to.r - from.r;
  const dc = to.c - from.c;
  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);
  const target = board[to.r][to.c];

  // Cant capture own pieces
  if (isWhite(piece) && isWhite(target)) return false;
  if (isBlack(piece) && isBlack(target)) return false;

  switch (piece) {
    case '♙': // White Pawn
      if (dc === 0 && dr === -1 && target === '') return true; // move 1
      if (dc === 0 && dr === -2 && from.r === 6 && target === '' && board[5][to.c] === '') return true; // move 2
      if (absDc === 1 && dr === -1 && isBlack(target)) return true; // capture
      return false;
    case '♟': // Black Pawn
      if (dc === 0 && dr === 1 && target === '') return true;
      if (dc === 0 && dr === 2 && from.r === 1 && target === '' && board[2][to.c] === '') return true;
      if (absDc === 1 && dr === 1 && isWhite(target)) return true;
      return false;
    case '♖': case '♜': // Rook
      if (dr !== 0 && dc !== 0) return false;
      return isPathClear(board, from, to);
    case '♗': case '♝': // Bishop
      if (absDr !== absDc) return false;
      return isPathClear(board, from, to);
    case '♕': case '♛': // Queen
      if (dr !== 0 && dc !== 0 && absDr !== absDc) return false;
      return isPathClear(board, from, to);
    case '♔': case '♚': // King
      return absDr <= 1 && absDc <= 1;
    case '♘': case '♞': // Knight
      return (absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2);
    default:
      return false;
  }
};

export default function ChessGame() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState('white');
  const [logs, setLogs] = useState(["Game Start! You are White."]);

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 3));

  const handleSquareClick = (r, c) => {
    if (turn !== 'white') return; // AI is thinking

    const piece = board[r][c];

    // Select piece
    if (!selected) {
      if (piece && isWhite(piece)) setSelected({ r, c });
      return;
    }

    // Change selection
    if (piece && isWhite(piece)) {
      setSelected({ r, c });
      return;
    }

    // Move attempt
    const selectedPiece = board[selected.r][selected.c];
    if (isValidMove(board, selected, { r, c }, selectedPiece)) {
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = selectedPiece;
      newBoard[selected.r][selected.c] = '';
      setBoard(newBoard);
      setSelected(null);
      setTurn('black');
      addLog(`You moved ${selectedPiece}`);
    } else {
      setSelected(null);
    }
  };

  // Arya (AI) Random Valid Move Logic
  useEffect(() => {
    if (turn === 'black') {
      const timer = setTimeout(() => {
        let moves = [];
        // Find all possible valid moves for AI
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (isBlack(board[r][c])) {
              for (let tr = 0; tr < 8; tr++) {
                for (let tc = 0; tc < 8; tc++) {
                  if (isValidMove(board, {r, c}, {r: tr, c: tc}, board[r][c])) {
                    moves.push({ from: {r, c}, to: {r: tr, c: tc} });
                  }
                }
              }
            }
          }
        }

        if (moves.length > 0) {
          // Pick random move
          const move = moves[Math.floor(Math.random() * moves.length)];
          const newBoard = board.map(row => [...row]);
          newBoard[move.to.r][move.to.c] = board[move.from.r][move.from.c];
          newBoard[move.from.r][move.from.c] = '';
          setBoard(newBoard);
          addLog(`Arya moved ${board[move.from.r][move.from.c]}`);
        } else {
          addLog(`🏆 CHECKMATE! You won!`);
        }
        setTurn('white');
      }, 1000); // Arya thinks for 1 second
      return () => clearTimeout(timer);
    }
  }, [turn, board]);
  
  const renderBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isBlack = (row + col) % 2 !== 0;
        const piece = board[row][col];
        const isSelected = selected?.r === row && selected?.c === col;
        const isPossibleMove = selected ? isValidMove(board, selected, {r: row, c: col}, board[selected.r][selected.c]) : false;

        squares.push(
          <div key={`${row}-${col}`} onClick={() => handleSquareClick(row, col)} style={{
            aspectRatio: '1',
            background: isSelected ? C.green+'aa' : isPossibleMove ? C.yellow+'55' : (isBlack ? C.blackSquare : C.whiteSquare),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: '#111', textShadow: '0 2px 4px rgba(255,255,255,0.4)', cursor: piece || isPossibleMove ? 'pointer' : 'default',
            boxShadow: isPossibleMove ? `inset 0 0 10px ${C.yellow}` : 'none'
          }}>
            {piece}
          </div>
        );
      }
    }
    return squares;
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', padding: 16 }}>
      <style>{`
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/play" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Chess <span style={{ color: C.orange }}>(Chase)</span> ♟️</h1>
      </div>

      <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        
        {/* Arya (AI) Opponent Profile Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.card, padding: '10px 14px', borderRadius: 12, marginBottom: 16, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 28 }}>🤖</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Arya AI</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.green, fontWeight: 700, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, background: C.green, borderRadius: '50%', animation: 'pulse-green 2s infinite' }} />
                Online & Playing
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 800, background: C.card2, padding: '4px 8px', borderRadius: 8 }}>Grandmaster</div>
        </div>

        <div style={{ marginBottom: 12, color: turn === 'white' ? C.cyan : C.orange, fontSize: 16, fontWeight: 800 }}>
          {turn === 'white' ? '😊 Your Turn' : '🤖 Arya is thinking...'}
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
          (Pehle apni piece (White) par Tap karo, fir jahan chalna hai wahan Tap karo)
        </div>

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', 
          border: `4px solid ${C.border}`, borderRadius: 4, overflow: 'hidden'
        }}>
          {renderBoard()}
        </div>

        <div style={{ marginTop: 20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 8, textTransform: 'uppercase' }}>Game Logs</div>
          {logs.map((log, i) => (
            <div key={i} style={{ fontSize: 13, color: i === 0 ? C.text : C.muted, marginBottom: 4, opacity: 1 - (i * 0.3) }}>
              {i === 0 ? '▶ ' : ''}{log}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
