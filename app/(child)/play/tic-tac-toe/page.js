'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

// Jeetne ke patterns
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player = 'X', Computer = 'O'
  const [winner, setWinner] = useState(null); // 'X', 'O', 'Draw', or null
  const [winningLine, setWinningLine] = useState([]);
  const [logs, setLogs] = useState(["Game Start! Aapki (X) baari."]);

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 3));

  // Check Winner Logic
  const checkWinner = (squares) => {
    for (let i = 0; i < WIN_LINES.length; i++) {
      const [a, b, c] = WIN_LINES[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (!squares.includes(null)) return { winner: 'Draw', line: [] };
    return null;
  };

  // 🤖 SMART COMPUTER BOT (0 Cost)
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        let bestMove = -1;
        
        // 1. Try to Win
        bestMove = findWinningMove(board, 'O');
        
        // 2. Try to Block Player
        if (bestMove === -1) {
          bestMove = findWinningMove(board, 'X');
        }
        
        // 3. Take Center if empty
        if (bestMove === -1 && !board[4]) {
          bestMove = 4;
        }
        
        // 4. Take random empty spot
        if (bestMove === -1) {
          const emptySpots = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
          if (emptySpots.length > 0) {
            bestMove = emptySpots[Math.floor(Math.random() * emptySpots.length)];
          }
        }

        if (bestMove !== -1) {
          makeMove(bestMove, 'O');
          addLog("Computer (O) ne apni chaal chali.");
        }
      }, 800); // 0.8s sochne ka natak karega
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner]);

  const findWinningMove = (squares, player) => {
    for (let i = 0; i < WIN_LINES.length; i++) {
      const [a, b, c] = WIN_LINES[i];
      const line = [squares[a], squares[b], squares[c]];
      const playerCount = line.filter(val => val === player).length;
      const emptyCount = line.filter(val => val === null).length;
      
      if (playerCount === 2 && emptyCount === 1) {
        if (squares[a] === null) return a;
        if (squares[b] === null) return b;
        if (squares[c] === null) return c;
      }
    }
    return -1;
  };

  const makeMove = (index, player) => {
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'X') addLog("🎉 WOHOO! Aap jeet gaye!");
      else if (result.winner === 'O') addLog("🤖 Computer jeet gaya!");
      else addLog("🤝 Game Draw ho gaya!");
    } else {
      setIsPlayerTurn(player === 'O'); // Switch turn
    }
  };

  const handlePlayerClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;
    addLog("Aapne (X) chaal chali.");
    makeMove(index, 'X');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningLine([]);
    setLogs(["Naya Game Shuru! Aapki (X) baari."]);
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
        <Link href="/play" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Zero <span style={{ color: C.cyan }}>Kata</span> ❌⭕</h1>
        <button onClick={resetGame} style={{ marginLeft: 'auto', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>🔄 Reset</button>
      </div>

      <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        
        {/* Status Bar */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px', marginBottom: 24 }}>
          {winner ? (
            <div style={{ color: winner === 'X' ? C.green : winner === 'O' ? C.red : C.orange, fontSize: 24, fontWeight: 900 }}>
              {winner === 'X' ? '🏆 YOU WIN!' : winner === 'O' ? '🤖 COMPUTER WINS!' : '🤝 IT\'S A DRAW!'}
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 18, fontWeight: 800 }}>
              <span style={{ color: isPlayerTurn ? C.cyan : C.muted, transition: '0.3s' }}>{isPlayerTurn ? '👉' : ''} You (❌)</span>
              <span style={{ color: C.muted }}>vs</span>
              <span style={{ color: !isPlayerTurn ? C.red : C.muted, transition: '0.3s' }}>Computer (⭕) {!isPlayerTurn ? '👈' : ''}</span>
            </div>
          )}
        </div>

        {/* Game Board 3x3 */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, 
          background: C.border, padding: 10, borderRadius: 20, marginBottom: 24,
          boxShadow: `0 10px 30px rgba(0,0,0,0.5)`
        }}>
          {board.map((cell, index) => {
            const isWinningCell = winningLine.includes(index);
            return (
              <button
                key={index}
                onClick={() => handlePlayerClick(index)}
                disabled={cell !== null || winner !== null || !isPlayerTurn}
                style={{
                  aspectRatio: '1', background: isWinningCell ? (winner === 'X' ? C.green+'44' : C.red+'44') : C.card, 
                  border: isWinningCell ? `2px solid ${winner === 'X' ? C.green : C.red}` : 'none',
                  borderRadius: 12, fontSize: 60, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: cell === 'X' ? C.cyan : C.red, cursor: (cell || winner || !isPlayerTurn) ? 'default' : 'pointer',
                  transition: 'all 0.2s ease', transform: isWinningCell ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {cell === 'X' ? '❌' : cell === 'O' ? '⭕' : ''}
              </button>
            )
          })}
        </div>

        {/* Logs */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 8 }}>MATCH LIVE LOGS</div>
          {logs.map((log, i) => (
            <div key={i} style={{ fontSize: 14, color: i === 0 ? C.text : C.muted, marginBottom: 6, opacity: 1 - (i * 0.2) }}>
              {i === 0 ? '⚡ ' : ''}{log}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}