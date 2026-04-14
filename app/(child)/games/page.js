'use client'
import { useState } from 'react'
import Header from '@/components/ui/Header'
import DragDropGame from '@/components/games/DragDrop'
import SpaceQuiz from '@/components/games/SpaceQuiz'
import TableBattle from '@/components/games/TableBattle'
import WordHunt from '@/components/games/WordHunt'
import MemoryGame from '@/components/games/MemoryGame'
import SnakeLadderGame from '@/components/games-animation/snakeLadderAnimated/GameBoard'

const C = { card:'#0f1520', card2:'#161e30', border:'#1e2d45', orange:'#ff6b35', cyan:'#06b6d4', purple:'#7c3aed', green:'#10b981', pink:'#ec4899', text:'#f1f5f9', muted:'#64748b' }

const GAMES = [
  { id: 'math', name: 'Table Battle', emoji: '⚔️', color: C.cyan, desc: 'Math tables practice karo!' },
  { id: 'science', name: 'Space Quiz', emoji: '🚀', color: C.purple, desc: 'Solar system aur planets ki duniya' },
  { id: 'english', name: 'Word Hunt', emoji: '🔤', color: C.green, desc: 'Naye English words seekho' },
  { id: 'geo', name: 'Drag & Drop', emoji: '🌍', color: C.orange, desc: 'Countries aur Capitals match karo' },
  { id: 'memory', name: 'Memory Match', emoji: '🧠', color: C.pink, desc: 'Apni memory aur dimaag test karo!' }
]

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null)

  return (
    <div style={{ background: '#07090f', minHeight: '100vh', color: C.text }}>
      <Header title={activeGame ? "Playing Game" : "Games 🎮"} showBack={!!activeGame} onBack={() => setActiveGame(null)} />
      
      <div style={{ padding: '16px 16px 80px', animation: 'slideUp .3s ease' }}>
        {activeGame === 'math' && <TableBattle onGameEnd={() => setActiveGame(null)} />}
        {activeGame === 'science' && <SpaceQuiz onGameEnd={() => setActiveGame(null)} />}
        {activeGame === 'english' && <WordHunt onGameEnd={() => setActiveGame(null)} />}
        {activeGame === 'geo' && <DragDropGame onGameEnd={() => setActiveGame(null)} />}
        {activeGame === 'memory' && <MemoryGame onGameEnd={() => setActiveGame(null)} />}
        {activeGame === 'snake_ladder' && <SnakeLadderGame onGameEnd={() => setActiveGame(null)} />}
        
        {!activeGame && (
          <>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>🎮 Apna Game Chuno!</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {GAMES.map(g => (
                <div key={g.id} onClick={() => setActiveGame(g.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: `linear-gradient(135deg, ${g.color}15, ${C.card})`, border: `1px solid ${g.color}33`, borderRadius: 16, padding: 16, cursor: 'pointer' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: g.color+'22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{g.emoji}</div>
                  <div><div style={{ fontWeight: 800, fontSize: 16 }}>{g.name}</div><div style={{ fontSize: 13, color: C.muted }}>{g.desc}</div></div>
                  <div style={{ marginLeft: 'auto', fontSize: 20, color: g.color }}>▶</div>
                </div>
              ))}
            </div>

            <div style={{ fontWeight: 800, fontSize: 18, marginTop: 32, marginBottom: 16, color: '#f59e0b' }}>🌟 Premium Animated Games</div>
            <div onClick={() => setActiveGame('snake_ladder')} style={{ display: 'flex', alignItems: 'center', gap: 14, background: `linear-gradient(135deg, ${C.green}15, ${C.cyan}15)`, border: `1px solid ${C.green}55`, borderRadius: 16, padding: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 12, right: -20, background: C.orange, color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 24px', transform: 'rotate(45deg)' }}>NEW</div>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: C.green+'22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🐍</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: C.green }}>Snake & Ladder 3D</div>
                <div style={{ fontSize: 13, color: C.muted }}>Naya animated 3D snake & ladder khelo!</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 20, color: C.green }}>▶</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}