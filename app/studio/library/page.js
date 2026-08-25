'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { playCorrectSound, playMovePieceSound } from '@/lib/audio/sound-engine';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981', pink: '#ec4899', red: '#ef4444',
  text: '#f1f5f9', muted: '#64748b'
};

const DEFAULT_SAMPLE_ITEMS = [
  { id: 'def_1', type: 'Sticker Asset', title: 'Cyber Robot Sticker', icon: '🤖', date: 'Today', preview: '' },
  { id: 'def_2', type: 'Comic Strip', title: 'Space Odyssey Episode 1', icon: '💬', date: 'Yesterday', preview: '' },
  { id: 'def_3', type: 'Logo & Badge', title: 'Fire Titans Clan Badge', icon: '🛡️', date: '3 days ago', preview: '' },
  { id: 'def_4', type: 'Coloring Sheet', title: 'Mighty Lion King Art', icon: '🦁', date: '5 days ago', preview: '' }
];

export default function LibraryPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedPreview, setSelectedPreview] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('kidai_studio_creations') || '[]');
      if (stored.length > 0) {
        setItems(stored);
      } else {
        setItems(DEFAULT_SAMPLE_ITEMS);
      }
    } catch(e) {
      setItems(DEFAULT_SAMPLE_ITEMS);
    }
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    try { playMovePieceSound(); } catch(err) {}
    const updated = items.filter(it => it.id !== id);
    setItems(updated);
    try {
      localStorage.setItem('kidai_studio_creations', JSON.stringify(updated.filter(it => !it.id.startsWith('def_'))));
    } catch(err) {}
  };

  const handleDownload = (item, e) => {
    e.stopPropagation();
    try { playCorrectSound(); } catch(err) {}
    if (item.preview && item.preview.startsWith('data:')) {
      const link = document.createElement('a');
      link.download = `KidAI-${item.title.replace(/\s+/g, '_')}.png`;
      link.href = item.preview;
      link.click();
    } else {
      alert('Default sample asset. Nayi drawing banakar export karein!');
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(i => (i.type || '').toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", paddingBottom: 60 }}>
      
      {/* Top Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,9,15,.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 22 }}>←</button>
          <span>Creator Studio <span style={{ color: C.orange }}>Library</span> 📁</span>
        </div>

        <button 
          onClick={() => router.push('/studio')}
          style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: '8px 16px', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}
        >
          ✨ New Creation
        </button>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, marginBottom: 8 }}>
            Aapki Saved <span style={{ color: C.orange }}>Creative Artworks & Assets</span> 🎨
          </h1>
          <p style={{ color: C.muted, fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
            Coloring book sheets, transparent scanned stickers, comic strips, aur logos sabhi yahan safe hain!
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, overflowX: 'auto', paddingBottom: 6, justifyContent: 'center' }}>
          {[
            { id: 'all', label: '🌟 All Items' },
            { id: 'coloring', label: '🎨 Coloring Sheets' },
            { id: 'sticker', label: '📸 Scanned Stickers' },
            { id: 'comic', label: '💬 Comic Strips' },
            { id: 'logo', label: '✨ Logos & Badges' },
            { id: 'animation', label: '🎞️ 2D Animations' }
          ].map(f => (
            <button 
              key={f.id} 
              onClick={() => setFilter(f.id)}
              style={{ 
                padding: '8px 18px', 
                borderRadius: 20, 
                border: `1px solid ${filter === f.id ? C.orange : C.border}`, 
                fontWeight: 800, 
                fontSize: 13, 
                cursor: 'pointer', 
                whiteSpace: 'nowrap',
                background: filter === f.id ? C.orange : C.card2, 
                color: filter === f.id ? '#000' : C.text,
                boxShadow: filter === f.id ? `0 0 14px ${C.orange}44` : 'none',
                transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: C.card, borderRadius: 24, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>📁</div>
            <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>Koi item nahi mila</div>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Studio tools se nayi artwork banayein aur save karein!</p>
            <button onClick={() => router.push('/studio')} style={{ padding: '10px 24px', background: C.cyan, color: '#000', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer' }}>
              🎨 Open Creator Studio
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => setSelectedPreview(item)}
                style={{ 
                  background: C.card, 
                  border: `1px solid ${C.border}`, 
                  borderRadius: 20, 
                  padding: 16, 
                  cursor: 'pointer', 
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }} 
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = C.cyan; }} 
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = C.border; }}
              >
                {/* Thumbnail */}
                <div style={{ 
                  background: item.preview && item.preview.startsWith('data:') ? '#fff' : C.card2, 
                  height: 180, 
                  borderRadius: 14, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 54, 
                  marginBottom: 14,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {item.preview && item.preview.startsWith('data:') ? (
                    <img src={item.preview} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span>{item.icon || '🎨'}</span>
                  )}
                  
                  <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(8px)', color: C.cyan, fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase' }}>
                    {item.type || 'Artwork'}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 4, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>
                    📅 {item.date}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                    <button 
                      onClick={(e) => handleDownload(item, e)}
                      style={{ flex: 1, padding: '8px', background: C.card2, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                    >
                      ⬇️ Download
                    </button>
                    <button 
                      onClick={(e) => handleDelete(item.id, e)}
                      style={{ padding: '8px 12px', background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Preview Modal */}
      {selectedPreview && (
        <div 
          onClick={() => setSelectedPreview(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{ background: C.card, borderRadius: 24, padding: 24, maxWidth: 600, width: '100%', border: `2px solid ${C.cyan}`, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>{selectedPreview.title}</h3>
            
            <div style={{ background: '#fff', borderRadius: 16, padding: 16, maxHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden' }}>
              {selectedPreview.preview && selectedPreview.preview.startsWith('data:') ? (
                <img src={selectedPreview.preview} alt={selectedPreview.title} style={{ maxWidth: '100%', maxHeight: 360, objectFit: 'contain' }} />
              ) : (
                <div style={{ fontSize: 90, padding: 40 }}>{selectedPreview.icon || '🎨'}</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={(e) => handleDownload(selectedPreview, e)}
                style={{ flex: 1, padding: '12px', background: C.green, color: '#000', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer' }}
              >
                ⬇️ Download High-Res
              </button>
              <button 
                onClick={() => setSelectedPreview(null)}
                style={{ padding: '12px 24px', background: C.card2, color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}