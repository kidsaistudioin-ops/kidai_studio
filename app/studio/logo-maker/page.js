'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { playCorrectSound, playStreakChime, playMovePieceSound } from '@/lib/audio/sound-engine';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

const BADGE_SHAPES = [
  { id: 'shield', name: 'Knight Shield', icon: '🛡️', borderRadius: '16px 16px 140px 140px' },
  { id: 'circle', name: 'Royal Crest', icon: '⭕', borderRadius: '50%' },
  { id: 'hexagon', name: 'Cyber Hexagon', icon: '⬡', borderRadius: '28px' },
  { id: 'diamond', name: 'Diamond Gem', icon: '💎', borderRadius: '36px', transform: 'rotate(0deg)' },
  { id: 'square', name: 'Esports Box', icon: '⏹️', borderRadius: '24px' }
];

const THEMES = [
  { id: 'cyber', name: 'Cyber Neon', grad: 'linear-gradient(135deg, #06b6d4, #3b82f6)', border: '#38bdf8', text: '#38bdf8' },
  { id: 'fire', name: 'Fire Ruby', grad: 'linear-gradient(135deg, #ef4444, #f97316)', border: '#fb923c', text: '#fb923c' },
  { id: 'royal', name: 'Royal Gold', grad: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '#fde047', text: '#fde047' },
  { id: 'poison', name: 'Acid Green', grad: 'linear-gradient(135deg, #10b981, #059669)', border: '#4ade80', text: '#4ade80' },
  { id: 'shadow', name: 'Shadow Violet', grad: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', border: '#c084fc', text: '#c084fc' },
  { id: 'dark', name: 'Stealth Black', grad: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '#94a3b8', text: '#ffffff' }
];

const MASCOT_ICONS = [
  '🦁', '🐉', '🐯', '🐺', '🦅', '🦈', '🤖', '👾', '🚀', '⚡', 
  '👑', '⚔️', '🛡️', '💎', '🔥', '🏆', '🎮', '🏎️', '🎯', '🌟'
];

export default function LogoMakerPage() {
  const router = useRouter();
  const logoPreviewRef = useRef(null);

  const [brandTitle, setBrandTitle] = useState('CYBER SQUAD');
  const [tagline, setTagline] = useState('CHAMPIONS OF CODING • EST 2026');
  const [selectedShape, setSelectedShape] = useState(BADGE_SHAPES[0]);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [selectedIcon, setSelectedIcon] = useState(MASCOT_ICONS[0]);
  const [fontStyle, setFontStyle] = useState('sans-serif');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Export Logo PNG
  const handleExportPNG = () => {
    try { playStreakChime(); } catch(e) {}
    
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#07090f';
    ctx.fillRect(0, 0, 800, 800);

    // Draw Badge circle / box
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = selectedTheme.border;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(400, 400, 320, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw Icon
    ctx.font = '160px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedIcon, 400, 330);

    // Draw Title
    ctx.font = `bold 56px ${fontStyle}`;
    ctx.fillStyle = selectedTheme.text;
    ctx.fillText(brandTitle.toUpperCase(), 400, 490);

    // Draw Subtitle
    ctx.font = `bold 22px ${fontStyle}`;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(tagline.toUpperCase(), 400, 560);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/png');

    // Save to Studio Library
    const existing = JSON.parse(localStorage.getItem('kidai_studio_creations') || '[]');
    const newCreation = {
      id: Date.now().toString(),
      title: brandTitle || 'My Squad Logo',
      type: 'Logo & Badge',
      date: new Date().toLocaleDateString('en-IN'),
      preview: dataUrl
    };
    existing.unshift(newCreation);
    localStorage.setItem('kidai_studio_creations', JSON.stringify(existing.slice(0, 20)));

    const link = document.createElement('a');
    link.download = `KidAI-Logo-${brandTitle.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();

    showToast('🎉 Logo Saved to Studio Library & Downloaded!');
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", paddingBottom: 60 }}>
      
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: C.cyan, color: '#000', padding: '12px 24px', borderRadius: 14, fontWeight: 900, fontSize: 14, zIndex: 1000, boxShadow: '0 8px 30px rgba(6,182,212,0.5)' }}>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,9,15,.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 22 }}>←</button>
          <span>Logo Maker & <span style={{ color: C.cyan }}>Badge Studio</span> ✨</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/studio/library')} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: '8px 14px', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>
            📁 My Library
          </button>
          <button onClick={handleExportPNG} style={{ background: `linear-gradient(135deg, ${C.cyan}, #0284c7)`, color: '#000', border: 'none', padding: '8px 18px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', fontSize: 13, boxShadow: '0 4px 15px rgba(6,182,212,0.4)' }}>
            💾 Save & Download
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        
        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, marginBottom: 8 }}>
            Apne Squad Ya Project Ka <span style={{ color: C.cyan }}>Pro Mascot Logo</span> Banao! 🏆
          </h1>
          <p style={{ color: C.muted, fontSize: 15, maxWidth: 580, margin: '0 auto' }}>
            Gaming clan badges, school study clubs, aur YouTube channel avatars ke liye custom 3D logos create karein!
          </p>
        </div>

        {/* ── WORKSTATION DUAL-COLUMN GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'start' }}>
          
          {/* LEFT COLUMN: CUSTOMIZATION CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            
            {/* Text Inputs */}
            <div style={{ background: C.card, padding: 20, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.cyan, marginBottom: 12 }}>1. BRAND & SQUAD NAME</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, marginBottom: 4 }}>MAIN TITLE:</div>
                <input 
                  value={brandTitle}
                  onChange={e => setBrandTitle(e.target.value)}
                  placeholder="e.g. ROBO WARRIORS"
                  maxLength={25}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, color: '#fff', fontSize: 16, fontWeight: 900, outline: 'none' }}
                />
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, marginBottom: 4 }}>SUBTITLE / SLOGAN:</div>
                <input 
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="e.g. LEVEL 100 • EST. 2026"
                  maxLength={35}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, color: '#fff', fontSize: 13, fontWeight: 700, outline: 'none' }}
                />
              </div>
            </div>

            {/* Badge Shape Selector */}
            <div style={{ background: C.card, padding: 20, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.purple, marginBottom: 12 }}>2. BADGE SHAPE & EMBLEM</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {BADGE_SHAPES.map(shape => (
                  <button
                    key={shape.id}
                    onClick={() => { try { playMovePieceSound(); } catch(e) {} setSelectedShape(shape); }}
                    style={{
                      padding: '10px 6px',
                      background: selectedShape.id === shape.id ? C.purple : C.card2,
                      color: '#fff',
                      border: `1px solid ${selectedShape.id === shape.id ? '#fff' : C.border}`,
                      borderRadius: 12,
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{shape.icon}</span>
                    <span>{shape.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mascot Icon Arsenal */}
            <div style={{ background: C.card, padding: 20, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.green, marginBottom: 12 }}>3. MASCOT & EMBLEM ICON</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {MASCOT_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => { try { playCorrectSound(); } catch(e) {} setSelectedIcon(icon); }}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      background: selectedIcon === icon ? `${selectedTheme.border}33` : C.card2,
                      border: `2px solid ${selectedIcon === icon ? selectedTheme.border : C.border}`,
                      borderRadius: 12,
                      fontSize: 26,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: selectedIcon === icon ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color & Metallic Theme */}
            <div style={{ background: C.card, padding: 20, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.orange, marginBottom: 12 }}>4. COLOR & THEME STYLE</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => { try { playMovePieceSound(); } catch(e) {} setSelectedTheme(theme); }}
                    style={{
                      padding: '10px 8px',
                      background: theme.grad,
                      color: '#fff',
                      border: `2px solid ${selectedTheme.id === theme.id ? '#fff' : 'transparent'}`,
                      borderRadius: 12,
                      fontWeight: 900,
                      fontSize: 12,
                      cursor: 'pointer',
                      boxShadow: selectedTheme.id === theme.id ? `0 0 16px ${theme.border}` : 'none'
                    }}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: HIGH-RES 3D LOGO BADGE PREVIEW */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ background: C.card, padding: 30, borderRadius: 24, border: `1px solid ${C.border}`, width: '100%', maxWidth: '540px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
              
              <div style={{ fontWeight: 800, fontSize: 12, color: C.muted, textTransform: 'uppercase', marginBottom: 20, letterSpacing: 2 }}>
                LIVE 3D BADGE PREVIEW
              </div>

              {/* The Actual Badge */}
              <div 
                ref={logoPreviewRef}
                style={{
                  width: '320px',
                  height: '320px',
                  margin: '0 auto',
                  background: 'linear-gradient(180deg, #1e293b, #0f172a)',
                  border: `6px solid ${selectedTheme.border}`,
                  borderRadius: selectedShape.borderRadius,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                  boxShadow: `0 15px 40px ${selectedTheme.border}44, inset 0 0 30px rgba(0,0,0,0.8)`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Glow Backdrop */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: `radial-gradient(ellipse at top, ${selectedTheme.border}33, transparent)`, pointerEvents: 'none' }} />

                {/* Mascot Icon */}
                <div style={{ fontSize: 90, marginBottom: 12, filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.6))` }}>
                  {selectedIcon}
                </div>

                {/* Brand Name */}
                <div style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: selectedTheme.text,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  fontFamily: fontStyle,
                  filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.8))`,
                  lineHeight: 1.2
                }}>
                  {brandTitle || 'YOUR TITLE'}
                </div>

                {/* Subtitle / Slogan */}
                <div style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#94a3b8',
                  marginTop: 6,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase'
                }}>
                  {tagline}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
                <button 
                  onClick={handleExportPNG}
                  style={{ flex: 1, padding: '14px', background: `linear-gradient(135deg, ${C.cyan}, #0284c7)`, color: '#000', border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 15px rgba(6,182,212,0.4)' }}
                >
                  ⬇️ Download HD PNG (800x800)
                </button>
              </div>

              <div style={{ marginTop: 14, fontSize: 12, color: C.muted }}>
                📁 Auto-saved to your personal Studio Library
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}