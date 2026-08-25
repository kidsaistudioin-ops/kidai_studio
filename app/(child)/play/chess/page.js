'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChessPiece3D from '@/components/games-animation/chessAnimated/ChessPiece3D';
import { playMovePieceSound, playWinFanfare, playDefeatSound } from '@/lib/audio/sound-engine';

const C = {
  bg: '#07090f', card: '#0f1520', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', text: '#f1f5f9', muted: '#64748b',
  whiteSquare: '#e2e8f0', blackSquare: '#475569'
};

const SYMBOL_MAP = {
  '♙': { type: 'P', color: 'white' },
  '♖': { type: 'R', color: 'white' },
  '♘': { type: 'N', color: 'white' },
  '♗': { type: 'B', color: 'white' },
  '♕': { type: 'Q', color: 'white' },
  '♔': { type: 'K', color: 'white' },
  '♟': { type: 'P', color: 'black' },
  '♜': { type: 'R', color: 'black' },
  '♞': { type: 'N', color: 'black' },
  '♝': { type: 'B', color: 'black' },
  '♛': { type: 'Q', color: 'black' },
  '♚': { type: 'K', color: 'black' },
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
  const [difficulty, setDifficulty] = useState('medium'); // 'easy' | 'medium' | 'master'
  const [logs, setLogs] = useState(["Game Start! You are White."]);

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 3));

  const handleSquareClick = (r, c) => {
    if (turn !== 'white') return; // AI is thinking

    const targetPiece = board[r][c];

    // Select piece
    if (!selected) {
      if (targetPiece && isWhite(targetPiece)) setSelected({ r, c });
      return;
    }

    // Change selection to another friendly piece
    if (targetPiece && isWhite(targetPiece)) {
      setSelected({ r, c });
      return;
    }

    // Move attempt
    const selectedPiece = board[selected.r][selected.c];
    if (isValidMove(board, selected, { r, c }, selectedPiece)) {
      const newBoard = board.map(row => [...row]);
      
      // Check for White Pawn Promotion
      let finalPiece = selectedPiece;
      if (selectedPiece === '♙' && r === 0) {
        finalPiece = '♕'; // Promoted to Queen!
        addLog("👑 Pawn promoted to Queen!");
      }

      const isCapture = isBlack(targetPiece);
      newBoard[r][c] = finalPiece;
      newBoard[selected.r][selected.c] = '';
      setBoard(newBoard);
      setSelected(null);
      
      if (isCapture) {
        playMovePieceSound();
        if (targetPiece === '♚') {
          playWinFanfare();
          addLog("🏆 Raja Capture! You WON!");
          setTurn('game_over_white');
          return;
        }
      } else {
        playMovePieceSound();
      }

      setTurn('black');
      addLog(`You moved to ${String.fromCharCode(65 + c)}${8 - r}`);
    } else {
      setSelected(null);
    }
  };

  // Smart Tactical Chess AI Engine
  useEffect(() => {
    if (turn === 'black') {
      const timer = setTimeout(() => {
        let allMoves = [];
        
        // Find all possible valid moves for Black pieces
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (isBlack(piece)) {
              for (let tr = 0; tr < 8; tr++) {
                for (let tc = 0; tc < 8; tc++) {
                  if (isValidMove(board, {r, c}, {r: tr, c: tc}, piece)) {
                    const target = board[tr][tc];
                    let score = 0;

                    // 1. Material Capture Value
                    if (target === '♔') score += 10000;
                    else if (target === '♕') score += 900;
                    else if (target === '♖') score += 500;
                    else if (target === '♗' || target === '♘') score += 320;
                    else if (target === '♙') score += 100;

                    // 2. Center Board Control Bonus (e4, d4, e5, d5, c4, f4)
                    if (tr >= 2 && tr <= 5 && tc >= 2 && tc <= 5) score += 25;

                    // 3. Pawn Advancement & Queen Promotion
                    if (piece === '♟') {
                      score += tr * 15;
                      if (tr === 7) score += 800; // Immediate Queen promotion
                    }

                    // 4. Knight & Bishop Active Development
                    if ((piece === '♞' || piece === '♝') && r === 0) {
                      score += 30; // Encourage moving off back rank
                    }

                    // 5. Threat Defense (Master AI Avoids moving into capture unless advantageous)
                    if (difficulty === 'master' || difficulty === 'medium') {
                      let isThreatenedAtTarget = false;
                      for (let wr = 0; wr < 8; wr++) {
                        for (let wc = 0; wc < 8; wc++) {
                          if (isWhite(board[wr][wc]) && isValidMove(board, {r: wr, c: wc}, {r: tr, c: tc}, board[wr][wc])) {
                            isThreatenedAtTarget = true;
                            break;
                          }
                        }
                      }
                      if (isThreatenedAtTarget) {
                        const myValue = piece === '♛' ? 900 : piece === '♜' ? 500 : (piece === '♝'||piece === '♞') ? 320 : 100;
                        if (target === '') score -= (myValue * 0.8); // Don't blunder free pieces!
                      }
                    }

                    // Add random noise for Easy mode
                    if (difficulty === 'easy') {
                      score += (Math.random() * 200 - 100);
                    }

                    allMoves.push({ from: {r, c}, to: {r: tr, c: tc}, piece, score });
                  }
                }
              }
            }
          }
        }

        if (allMoves.length > 0) {
          allMoves.sort((a, b) => b.score - a.score);
          // Pick from top best moves based on difficulty
          const sliceSize = difficulty === 'master' ? 1 : difficulty === 'medium' ? 2 : Math.min(5, allMoves.length);
          const topPool = allMoves.slice(0, sliceSize);
          const move = topPool[Math.floor(Math.random() * topPool.length)];

          const newBoard = board.map(row => [...row]);
          let finalPiece = move.piece;
          // Black Pawn Promotion
          if (move.piece === '♟' && move.to.r === 7) {
            finalPiece = '♛';
          }

          const target = board[move.to.r][move.to.c];
          newBoard[move.to.r][move.to.c] = finalPiece;
          newBoard[move.from.r][move.from.c] = '';
          setBoard(newBoard);

          if (isWhite(target)) {
            playMovePieceSound();
            if (target === '♔') {
              playDefeatSound();
              addLog("💥 Checkmate! Arya won!");
              setTurn('game_over_black');
              return;
            }
          } else {
            playMovePieceSound();
          }

          addLog(`Arya moved to ${String.fromCharCode(65 + move.to.c)}${8 - move.to.r}`);
          setTurn('white');
        } else {
          playWinFanfare();
          addLog(`🏆 CHECKMATE! You won!`);
          setTurn('game_over_white');
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [turn, board, difficulty]);
  
  const renderBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isBlackSquare = (row + col) % 2 !== 0;
        const piece = board[row][col];
        const isSelected = selected?.r === row && selected?.c === col;
        const isPossibleMove = selected ? isValidMove(board, selected, {r: row, c: col}, board[selected.r][selected.c]) : false;
        const pObj = piece && SYMBOL_MAP[piece] ? SYMBOL_MAP[piece] : null;

        squares.push(
          <div key={`${row}-${col}`} onClick={() => handleSquareClick(row, col)} style={{
            aspectRatio: '1',
            background: isSelected ? C.green+'aa' : isPossibleMove ? C.yellow+'55' : (isBlackSquare ? C.blackSquare : C.whiteSquare),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: piece || isPossibleMove ? 'pointer' : 'default',
            boxShadow: isPossibleMove ? `inset 0 0 10px ${C.yellow}` : 'none',
            padding: '2px'
          }}>
            {pObj ? (
              <ChessPiece3D type={pObj.type} color={pObj.color} />
            ) : piece}
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
        
        {/* Arya (AI) Opponent Profile Bar & Difficulty Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.card, padding: '10px 14px', borderRadius: 14, marginBottom: 12, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 28 }}>🤖</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Arya AI Engine</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.green, fontWeight: 700, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, background: C.green, borderRadius: '50%', animation: 'pulse-green 2s infinite' }} />
                Tactical Bot Ready
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'easy', label: '🌱 Easy' },
              { id: 'medium', label: '🤖 Smart' },
              { id: 'master', label: '👑 Master' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                style={{
                  padding: '4px 8px',
                  background: difficulty === d.id ? C.orange : C.card2,
                  color: difficulty === d.id ? '#fff' : C.muted,
                  border: `1px solid ${difficulty === d.id ? '#fff' : C.border}`,
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
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
