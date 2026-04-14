'use client'
import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/ui/Header'
import CharacterBuilder from '@/components/creator/CharacterBuilder'
import GameBuilder from '@/components/creator/GameBuilder'
import GameStore from '@/components/creator/GameStore'
import StoryEngine from '@/components/creator/StoryEngine'

const C = { card:'#0f1520', border:'#1e2d45', purple: '#7c3aed', text:'#f1f5f9', muted:'#64748b' }

export default function CreatePage() {
  const [tab, setTab] = useState('char')

  return (
    <div style={{ background: '#07090f', minHeight: '100vh', color: C.text }}>
      <Header title="Creator Studio 🎨" />
      
      <div style={{ padding: '16px 16px 80px', animation: 'slideUp .3s ease' }}>
        {/* Link to the new Code Magic Page */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Link href="/code-magic" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', padding: '10px 16px', borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)' }}>
              ✨ Try Code Magic (Live CSS)
            </div>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
          {[ { id: 'char', n: 'Character' }, { id: 'game', n: 'Game' }, { id: 'story', n: 'Story' }, { id: 'store', n: 'Store' } ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 16px', borderRadius: 12, background: tab === t.id ? C.purple : C.card, color: tab === t.id ? '#fff' : C.muted, border: `1px solid ${tab === t.id ? C.purple : C.border}`, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>{t.n}</button>
          ))}
        </div>

        {tab === 'char' && <CharacterBuilder />}
        {tab === 'game' && <GameBuilder />}
        {tab === 'story' && <StoryEngine />}
        {tab === 'store' && <GameStore />}
      </div>
    </div>
  )
}