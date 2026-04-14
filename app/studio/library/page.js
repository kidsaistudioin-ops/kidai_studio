'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981', pink: '#ec4899',
  text: '#f1f5f9', muted: '#64748b'
};

// Mock saved items
const MOCK_LIBRARY = [
  { id: 1, type: 'scan', title: 'My Pet Dog', icon: '🐶', date: '22 Jan 2025' },
  { id: 2, type: 'comic', title: 'Space Adventure', icon: '🚀', date: '20 Jan 2025' },
  { id: 3, type: 'scan', title: 'Red Car', icon: '🚗', date: '18 Jan 2025' },
  { id: 4, type: 'logo', title: 'My Brand Logo', icon: '✨', date: '15 Jan 2025' },
];

export default function LibraryPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const filteredItems = filter === 'all' ? MOCK_LIBRARY : MOCK_LIBRARY.filter(i => i.type === filter);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ fontWeight: 800, fontSize: 18 }}>My Library 📁</span>
      </div>

      <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 5 }}>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'scan', label: '📸 Scans' },
            { id: 'comic', label: '💬 Comics' },
            { id: 'logo', label: '✨ Logos' }
          ].map(f => (
            <button 
              key={f.id} onClick={() => setFilter(f.id)}
              style={{ 
                padding: '8px 16px', borderRadius: 20, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                background: filter === f.id ? C.orange : C.card2, color: filter === f.id ? '#fff' : C.muted
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>No items found in this category.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
            {filteredItems.map(item => (
              <div key={item.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{ background: C.card2, height: 100, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, marginBottom: 12 }}>
                  {item.icon}
                </div>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{item.date}</div>
                <div style={{ marginTop: 8, fontSize: 10, background: `${C.cyan}22`, color: C.cyan, display: 'inline-block', padding: '2px 8px', borderRadius: 8, textTransform: 'uppercase', fontWeight: 900 }}>
                  {item.type}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}