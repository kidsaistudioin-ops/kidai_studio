'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

const LOGO_STYLES = [
  { id: 'modern', name: 'Modern', icon: '🔷' },
  { id: 'classic', name: 'Classic', icon: '🏛️' },
  { id: 'playful', name: 'Playful', icon: '🎈' },
  { id: 'minimal', name: 'Minimal', icon: '⚪' },
  { id: 'tech', name: 'Tech', icon: '💻' },
  { id: 'nature', name: 'Nature', icon: '🌿' }
];

const ICONS = ['🚀', '💡', '🎯', '⭐', '🔥', '💎', '🌟', '⚡', '🎨', '✨', '🏆', '🎮', '📱', '🌈', '🦋', '🌸'];

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#000000', '#ffffff'];

export default function LogoMakerPage() {
  const router = useRouter();
  const [brandName, setBrandName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(LOGO_STYLES[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [generated, setGenerated] = useState(false);

  const generateLogo = () => {
    if (!brandName) {
      alert('Please enter a brand name!');
      return;
    }
    setGenerated(true);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Logo Maker ✨</span>
      </div>

      <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
        {!generated ? (
          <>
            {/* Brand Name Input */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 800, marginBottom: 8, color: C.cyan }}>Brand Name</div>
              <input 
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter your brand name..."
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 16, fontWeight: 700, outline: 'none' }}
              />
            </div>

            {/* Style Selection */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 800, marginBottom: 12, color: C.purple }}>Logo Style</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {LOGO_STYLES.map(style => (
                  <button 
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    style={{ padding: 16, background: selectedStyle.id === style.id ? selectedColor + '22' : C.card2, border: `2px solid ${selectedStyle.id === style.id ? selectedColor : C.border}`, borderRadius: 12, cursor: 'pointer', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{style.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 12, color: C.text }}>{style.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Selection */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 800, marginBottom: 12, color: C.orange }}>Choose Icon</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ICONS.map(icon => (
                  <button 
                    key={icon}
                    onClick={() => setSelectedIcon(icon)}
                    style={{ width: 48, height: 48, background: selectedIcon === icon ? selectedColor + '22' : C.card2, border: `2px solid ${selectedIcon === icon ? selectedColor : C.border}`, borderRadius: 12, cursor: 'pointer', fontSize: 24 }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 800, marginBottom: 12, color: C.green }}>Brand Color</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {COLORS.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{ width: 36, height: 36, background: color, border: selectedColor === color ? `3px solid ${C.text}` : `2px solid ${C.border}`, borderRadius: '50%', cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button 
              onClick={generateLogo}
              style={{ width: '100%', padding: 16, background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}cc)`, color: '#fff', border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 18, cursor: 'pointer', boxShadow: `0 8px 20px ${selectedColor}44` }}
            >
              ✨ Generate Logo
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', animation: 'pop 0.3s' }}>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 20, color: C.cyan }}>Your Logo is Ready! 🎉</div>
            
            {/* Logo Preview */}
            <div style={{ 
              background: '#fff', 
              padding: 40, 
              borderRadius: 24, 
              marginBottom: 24,
              boxShadow: `0 20px 40px ${selectedColor}33`
            }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>{selectedIcon}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: selectedColor, fontFamily: 'serif' }}>{brandName}</div>
            </div>

            {/* Download Options */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button style={{ flex: 1, padding: 14, background: C.card2, color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
                ⬇️ PNG
              </button>
              <button style={{ flex: 1, padding: 14, background: C.card2, color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
                ⬇️ SVG
              </button>
            </div>

            <button 
              onClick={() => setGenerated(false)}
              style={{ width: '100%', padding: 14, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}
            >
              ✏️ Edit Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}