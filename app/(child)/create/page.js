'use client'
import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/ui/Header'
import CharacterBuilder from '@/components/creator/CharacterBuilder'
import GameBuilder from '@/components/creator/GameBuilder'
import GameStore from '@/components/creator/GameStore'
import StoryEngine from '@/components/creator/StoryEngine'

const C = { 
  card: '#0f1520', card2: '#161e30', border: '#1e2d45', 
  purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981', orange: '#ff6b35',
  pink: '#ec4899', yellow: '#f59e0b', text: '#f1f5f9', muted: '#64748b' 
}

// All Creator Tools - Integrated into one page!
const CREATOR_TABS = [
  // Original Tools
  { id: 'char', name: 'Character', icon: '🎭', color: C.purple },
  { id: 'game', name: 'Game', icon: '🎮', color: C.cyan },
  { id: 'story', name: 'Story', icon: '📖', color: C.green },
  { id: 'store', name: 'Store', icon: '🏪', color: C.orange },
  // New Creator Tools
  { id: 'scanner', name: 'Scanner', icon: '📸', color: C.green },
  { id: 'comic', name: 'Comic', icon: '💬', color: C.purple },
  { id: 'coloring', name: 'Coloring', icon: '🎨', color: C.pink },
  { id: 'logo', name: 'Logo', icon: '✨', color: C.cyan },
  // Video Pipeline (Beta)
  { id: 'story-video', name: 'Story Video', icon: '🎬', color: C.orange, beta: true },
  { id: 'brand-promo', name: 'Brand Promo', icon: '📢', color: C.yellow, beta: true },
  { id: '2d-anim', name: '2D Anim', icon: '🎞️', color: C.green, beta: true },
]

export default function CreatePage() {
  const [tab, setTab] = useState('char')

  return (
    <div style={{ background: '#07090f', minHeight: '100vh', color: C.text }}>
      <Header title="Creator Studio 🎨" />
      
      <div style={{ padding: '16px 16px 80px', animation: 'slideUp .3s ease' }}>
        
        {/* All Creator Tools as Tabs - 2-3 Lines, No Scroll */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {CREATOR_TABS.map(t => (
            <button 
              key={t.id} 
              onClick={() => setTab(t.id)} 
              style={{ 
                padding: '10px 14px', 
                borderRadius: 12, 
                background: tab === t.id ? t.color : C.card, 
                color: tab === t.id ? '#fff' : C.muted, 
                border: `1px solid ${tab === t.id ? t.color : C.border}`, 
                fontWeight: 800, 
                cursor: 'pointer', 
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                flexShrink: 0
              }}
            >
              <span>{t.icon}</span>
              <span>{t.name}</span>
              {t.beta && <span style={{ background: '#fff', color: t.color, fontSize: 9, padding: '2px 5px', borderRadius: 4 }}>BETA</span>}
            </button>
          ))}
        </div>

        {/* Original Tools */}
        {tab === 'char' && <CharacterBuilder />}
        {tab === 'game' && <GameBuilder />}
        {tab === 'story' && <StoryEngine />}
        {tab === 'store' && <GameStore />}

        {/* New Creator Tools - Inline Components */}
        {tab === 'scanner' && <ScannerTool />}
        {tab === 'comic' && <ComicTool />}
        {tab === 'coloring' && <ColoringTool />}
        {tab === 'logo' && <LogoTool />}

        {/* Video Pipeline Tools */}
        {tab === 'story-video' && <StoryVideoTool />}
        {tab === 'brand-promo' && <BrandPromoTool />}
        {tab === '2d-anim' && <Animation2DTool />}
      </div>
    </div>
  )
}

// ============ INLINE TOOL COMPONENTS ============

function ScannerTool() {
  const [step, setStep] = useState('capture')
  
  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>📸</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Magic Scanner</div>
          <div style={{ fontSize: 12, color: C.muted }}>Drawing ko scan karo, background hatao!</div>
        </div>
      </div>
      
      {step === 'capture' ? (
        <div style={{ textAlign: 'center', padding: 30, background: C.card2, borderRadius: 12 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>📷</div>
          <p style={{ color: C.muted, marginBottom: 16 }}>Camera se drawing scan karo</p>
          <button onClick={() => setStep('preview')} style={{ padding: '12px 24px', background: C.green, color: '#000', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>
            📸 Capture Photo
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 20, background: C.card2, borderRadius: 12 }}>
          <div style={{ background: 'repeating-conic-gradient(#80808033 0% 25%, transparent 0% 50%) 50% / 20px 20px', borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 80 }}>🎨</div>
          </div>
          <p style={{ color: C.green, fontWeight: 800, marginBottom: 12 }}>✅ Background Removed!</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep('capture')} style={{ flex: 1, padding: 10, background: C.card, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>🔄 Retry</button>
            <button style={{ flex: 1, padding: 10, background: C.cyan, color: '#000', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>💾 Save</button>
          </div>
        </div>
      )}
    </div>
  )
}

function ComicTool() {
  const [scene, setScene] = useState(0)
  const scenes = ['🏙️ City', '🌲 Forest', '🚀 Space', '🏖️ Beach']
  
  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>💬</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Comic Maker</div>
          <div style={{ fontSize: 12, color: C.muted }}>Characters aur scenes se comic banao!</div>
        </div>
      </div>
      
      {/* Scene Selection */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Background:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {scenes.map((s, i) => (
            <button key={i} onClick={() => setScene(i)} style={{ padding: '8px 12px', background: scene === i ? C.purple + '33' : C.card2, border: `1px solid ${scene === i ? C.purple : C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>{s}</button>
          ))}
        </div>
      </div>
      
      {/* Canvas Preview */}
      <div style={{ height: 180, background: scene === 0 ? 'linear-gradient(to bottom, #1e3a8a, #0f172a)' : scene === 1 ? 'linear-gradient(to bottom, #14532d, #064e3b)' : scene === 2 ? 'linear-gradient(to bottom, #2e1065, #000000)' : 'linear-gradient(to bottom, #0ea5e9, #0284c7)', borderRadius: 16, position: 'relative', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 60 }}>🤖</div>
        <div style={{ position: 'absolute', bottom: 10, right: 10, background: '#fff', color: '#000', padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 800 }}>Hello!</div>
      </div>
      
      {/* Quick Add */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['🦁', '👧', '🐶', '👽', '🌳', '🚗'].map(c => (
          <button key={c} style={{ width: 40, height: 40, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 20 }}>{c}</button>
        ))}
      </div>
    </div>
  )
}

function ColoringTool() {
  const pages = ['🦁', '🚗', '🏡', '🚀', '🦋', '🐉']
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff']
  const [selected, setSelected] = useState(0)
  const [color, setColor] = useState(colors[0])
  
  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>🎨</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Coloring Book</div>
          <div style={{ fontSize: 12, color: C.muted }}>Drawings me color bharo!</div>
        </div>
      </div>
      
      {/* Page Selection */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16 }}>
        {pages.map((p, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ width: 50, height: 50, background: selected === i ? C.pink + '33' : C.card2, border: `2px solid ${selected === i ? C.pink : C.border}`, borderRadius: 10, cursor: 'pointer', flexShrink: 0, fontSize: 24 }}>{p}</button>
        ))}
      </div>
      
      {/* Canvas */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 30, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 80, color: 'transparent', WebkitTextStroke: `2px ${color}` }}>{pages[selected]}</div>
      </div>
      
      {/* Colors */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {colors.map((c, i) => (
          <button key={i} onClick={() => setColor(c)} style={{ width: 32, height: 32, background: c, border: color === c ? `3px solid ${C.cyan}` : `1px solid ${C.border}`, borderRadius: '50%', cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  )
}

function LogoTool() {
  const [name, setName] = useState('')
  const icons = ['🚀', '💡', '🎯', '⭐', '🔥', '💎']
  const [icon, setIcon] = useState(icons[0])
  
  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>✨</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Logo Maker</div>
          <div style={{ fontSize: 12, color: C.muted }}>Apna brand logo banao!</div>
        </div>
      </div>
      
      <input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="Brand Name..." 
        style={{ width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16, outline: 'none' }}
      />
      
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Icon:</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {icons.map((i, idx) => (
          <button key={idx} onClick={() => setIcon(i)} style={{ width: 44, height: 44, background: icon === i ? C.cyan + '33' : C.card2, border: `2px solid ${icon === i ? C.cyan : C.border}`, borderRadius: 10, cursor: 'pointer', fontSize: 24 }}>{i}</button>
        ))}
      </div>
      
      {/* Preview */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 30, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{icon}</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#000' }}>{name || 'Your Brand'}</div>
      </div>
    </div>
  )
}

function StoryVideoTool() {
  const [story, setStory] = useState('')
  const [generated, setGenerated] = useState(false)
  
  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.orange}44`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>🎬</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.orange }}>Story Video <span style={{ background: C.orange, color: '#fff', fontSize: 9, padding: '2px 6px', borderRadius: 4 }}>BETA</span></div>
          <div style={{ fontSize: 12, color: C.muted }}>Story se animated video banao!</div>
        </div>
      </div>
      
      {!generated ? (
        <>
          <textarea 
            value={story} 
            onChange={e => setStory(e.target.value)} 
            placeholder="Apni kahani likho..." 
            rows={3}
            style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, resize: 'none', marginBottom: 12, outline: 'none' }}
          />
          <button onClick={() => story && setGenerated(true)} disabled={!story} style={{ width: '100%', padding: 12, background: story ? C.orange : C.card2, color: story ? '#fff' : C.muted, border: 'none', borderRadius: 10, fontWeight: 800, cursor: story ? 'pointer' : 'not-allowed' }}>
            ✨ Generate Video
          </button>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>5 Scenes Generate!</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
            {['🏡', '👴', '🌲', '✨', '🌟'].map((s, i) => (
              <div key={i} style={{ width: 50, height: 50, background: C.card2, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{s}</div>
            ))}
          </div>
          <button style={{ padding: '10px 20px', background: C.green, color: '#000', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>▶️ Preview</button>
          <p style={{ color: C.muted, fontSize: 11, marginTop: 12 }}>🔜 Full video coming soon!</p>
        </div>
      )}
    </div>
  )
}

function BrandPromoTool() {
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  
  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.yellow}44`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>📢</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.yellow }}>Brand Promo <span style={{ background: C.yellow, color: '#000', fontSize: 9, padding: '2px 6px', borderRadius: 4 }}>BETA</span></div>
          <div style={{ fontSize: 12, color: C.muted }}>Professional promotional video!</div>
        </div>
      </div>
      
      <input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="Brand Name..." 
        style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, marginBottom: 8, outline: 'none' }}
      />
      <input 
        value={tagline} 
        onChange={e => setTagline(e.target.value)} 
        placeholder="Tagline..." 
        style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, marginBottom: 12, outline: 'none' }}
      />
      
      <button disabled={!name || !tagline} style={{ width: '100%', padding: 12, background: name && tagline ? C.yellow : C.card2, color: name && tagline ? '#000' : C.muted, border: 'none', borderRadius: 10, fontWeight: 800, cursor: name && tagline ? 'pointer' : 'not-allowed' }}>
        ✨ Generate Promo
      </button>
    </div>
  )
}

function Animation2DTool() {
  const frames = ['🤖', '🤖➡️', '➡️', '➡️🤖']
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  
  const play = () => {
    setPlaying(true)
    let i = 0
    const interval = setInterval(() => {
      setCurrent(i)
      i = (i + 1) % frames.length
      if (i === 0) { clearInterval(interval); setPlaying(false) }
    }, 500)
  }
  
  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.green}44`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>🎞️</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.green }}>2D Animation <span style={{ background: C.green, color: '#000', fontSize: 9, padding: '2px 6px', borderRadius: 4 }}>BETA</span></div>
          <div style={{ fontSize: 12, color: C.muted }}>Frame-by-frame animation!</div>
        </div>
      </div>
      
      {/* Preview */}
      <div style={{ background: '#fff', borderRadius: 16, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' }}>
        <div style={{ fontSize: 60 }}>{frames[current]}</div>
        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 6, fontSize: 11 }}>{current + 1}/{frames.length}</div>
      </div>
      
      {/* Timeline */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
        {frames.map((f, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{ width: 40, height: 40, background: current === i ? C.green + '33' : C.card2, border: `2px solid ${current === i ? C.green : C.border}`, borderRadius: 8, cursor: 'pointer', flexShrink: 0, fontSize: 16 }}>{f}</button>
        ))}
      </div>
      
      <button onClick={play} disabled={playing} style={{ width: '100%', padding: 12, background: playing ? C.card2 : C.green, color: playing ? C.muted : '#000', border: 'none', borderRadius: 10, fontWeight: 800, cursor: playing ? 'not-allowed' : 'pointer' }}>
        {playing ? '▶️ Playing...' : '▶️ Play Animation'}
      </button>
    </div>
  )
}