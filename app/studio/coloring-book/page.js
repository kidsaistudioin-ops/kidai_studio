'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981', pink: '#ec4899',
  text: '#f1f5f9', muted: '#64748b'
};

const PAGES = [
  { id: 1, icon: '🦁', name: 'Lion King' },
  { id: 2, icon: '🚗', name: 'Super Car' },
  { id: 3, icon: '🏡', name: 'My House' },
  { id: 4, icon: '🚀', name: 'Spaceship' }
];

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'];

export default function ColoringBookPage() {
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState(null);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [fillColor, setFillColor] = useState('transparent');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <button onClick={() => { if(selectedPage) setSelectedPage(null); else router.push('/studio'); }} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Coloring Book 🎨</span>
      </div>

      <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
        {!selectedPage ? (
          <>
            <p style={{ color: C.muted, marginBottom: 20, textAlign: 'center' }}>Koi bhi drawing chuno, usme color bharo ya print nikalkar crayons se color karo!</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {PAGES.map(p => (
                <div key={p.id} onClick={() => { setSelectedPage(p); setFillColor('transparent'); }} style={{ background: '#fff', borderRadius: 16, padding: 20, textAlign: 'center', cursor: 'pointer', border: `4px solid ${C.border}` }}>
                  {/* CSS Trick to make emoji look like a coloring line-art */}
                  <div style={{ fontSize: 64, color: 'transparent', WebkitTextStroke: '2px #000', marginBottom: 10 }}>
                    {p.icon}
                  </div>
                  <div style={{ fontWeight: 900, color: '#000' }}>{p.name}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
              <button onClick={handlePrint} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: '8px 16px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>🖨️ Print Page</button>
            </div>

            {/* Coloring Canvas */}
            <div 
              onClick={() => setFillColor(activeColor)}
              style={{ 
                background: '#fff', width: 300, height: 300, margin: '0 auto', borderRadius: 20, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden'
              }}
            >
              {/* Filled Color Background */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: fillColor, opacity: 0.5, transition: 'background 0.3s' }} />
              
              <div style={{ fontSize: 150, color: 'transparent', WebkitTextStroke: '3px #000', position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
                {selectedPage.icon}
              </div>
            </div>

            {/* Color Palette */}
            <div style={{ marginTop: 30, background: C.card, padding: 20, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, marginBottom: 16, color: C.cyan }}>Color Palette</div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <div 
                    key={c} onClick={() => setActiveColor(c)}
                    style={{ width: 40, height: 40, borderRadius: '50%', background: c, cursor: 'pointer', border: activeColor === c ? '4px solid #fff' : '2px solid #000', boxShadow: activeColor === c ? `0 0 15px ${c}` : 'none', transform: activeColor === c ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s' }}
                  />
                ))}
              </div>
              <p style={{ color: C.muted, fontSize: 12, marginTop: 16 }}>Tip: Color select karo aur drawing par tap karo!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}