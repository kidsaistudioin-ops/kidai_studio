'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

const CHARS = ['🤖', '🦁', '👧', '🦸‍♂️', '🐶', '👽', '🐱', '🦊', '🐼', '🐸', '🦄', '🐲'];
const BACKGROUNDS = [
  { id: 'white', color: '#ffffff' },
  { id: 'sky', color: '#87CEEB' },
  { id: 'grass', color: '#90EE90' },
  { id: 'sunset', color: '#FF6B6B' },
  { id: 'night', color: '#1a1a2e' },
  { id: 'space', color: '#000000' }
];

export default function Animation2DPage() {
  const router = useRouter();
  const [frames, setFrames] = useState([
    { id: 1, char: '🤖', bg: '#ffffff', x: 50, y: 50, scale: 1, rotation: 0 }
  ]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [selectedChar, setSelectedChar] = useState(CHARS[0]);
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const addFrame = () => {
    const newFrame = { 
      id: frames.length + 1, 
      char: frames[currentFrame].char, 
      bg: frames[currentFrame].bg,
      x: frames[currentFrame].x,
      y: frames[currentFrame].y,
      scale: frames[currentFrame].scale,
      rotation: frames[currentFrame].rotation
    };
    setFrames([...frames, newFrame]);
    setCurrentFrame(frames.length);
  };

  const updateFrame = (key, value) => {
    const newFrames = [...frames];
    newFrames[currentFrame] = { ...newFrames[currentFrame], [key]: value };
    setFrames(newFrames);
  };

  const deleteFrame = (idx) => {
    if (frames.length === 1) return;
    const newFrames = frames.filter((_, i) => i !== idx);
    setFrames(newFrames);
    if (currentFrame >= newFrames.length) setCurrentFrame(newFrames.length - 1);
  };

  const playAnimation = () => {
    setIsPlaying(true);
    let i = 0;
    const interval = setInterval(() => {
      setCurrentFrame(i);
      i = (i + 1) % frames.length;
      if (i === 0) {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 500);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ fontWeight: 800, fontSize: 18 }}>2D Animation Studio 🎞️</span>
        <button 
          onClick={playAnimation}
          disabled={isPlaying}
          style={{ marginLeft: 'auto', padding: '6px 14px', background: isPlaying ? C.card2 : C.green, color: isPlaying ? C.muted : '#000', border: 'none', borderRadius: 8, fontWeight: 800, cursor: isPlaying ? 'not-allowed' : 'pointer' }}
        >
          {isPlaying ? '▶️ Playing...' : '▶️ Play'}
        </button>
      </div>

      <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
        
        {/* Animation Canvas */}
        <div style={{ 
          background: frames[currentFrame].bg, 
          height: 250, 
          borderRadius: 20, 
          border: `3px solid ${C.border}`,
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 20,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ 
            position: 'absolute', 
            left: frames[currentFrame].x, 
            top: frames[currentFrame].y,
            fontSize: 64 * frames[currentFrame].scale,
            transform: `rotate(${frames[currentFrame].rotation}deg)`,
            transition: 'all 0.3s ease',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}>
            {frames[currentFrame].char}
          </div>
          
          {/* Frame Counter */}
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
            Frame {currentFrame + 1} / {frames.length}
          </div>
        </div>

        {/* Frame Timeline */}
        <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 800, color: C.cyan }}>📽️ Timeline</div>
            <button onClick={addFrame} style={{ padding: '6px 12px', background: C.green, color: '#000', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer', fontSize: 12 }}>
              + Add Frame
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
            {frames.map((f, i) => (
              <div 
                key={f.id}
                onClick={() => setCurrentFrame(i)}
                style={{ 
                  width: 50, height: 50, 
                  background: f.bg, 
                  border: currentFrame === i ? `3px solid ${C.cyan}` : `1px solid ${C.border}`,
                  borderRadius: 8, 
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                  flexShrink: 0,
                  position: 'relative'
                }}
              >
                {f.char}
                {frames.length > 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteFrame(i); }}
                    style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, background: '#ef4444', border: 'none', borderRadius: '50%', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Character Selection */}
          <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 800, marginBottom: 10, color: C.purple }}>Character</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CHARS.map(c => (
                <button 
                  key={c}
                  onClick={() => { setSelectedChar(c); updateFrame('char', c); }}
                  style={{ width: 36, height: 36, fontSize: 20, background: selectedChar === c ? C.purple + '33' : C.card2, border: `1px solid ${selectedChar === c ? C.purple : C.border}`, borderRadius: 8, cursor: 'pointer' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Background Selection */}
          <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 800, marginBottom: 10, color: C.orange }}>Background</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {BACKGROUNDS.map(bg => (
                <button 
                  key={bg.id}
                  onClick={() => { setSelectedBg(bg); updateFrame('bg', bg.color); }}
                  style={{ width: 36, height: 36, background: bg.color, border: selectedBg.id === bg.id ? `3px solid ${C.cyan}` : `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>

          {/* Position Controls */}
          <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 800, marginBottom: 10, color: C.green }}>Position</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: C.muted }}>X: {frames[currentFrame].x}</div>
                <input 
                  type="range" min="0" max="80" 
                  value={frames[currentFrame].x} 
                  onChange={(e) => updateFrame('x', Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.muted }}>Y: {frames[currentFrame].y}</div>
                <input 
                  type="range" min="0" max="80" 
                  value={frames[currentFrame].y} 
                  onChange={(e) => updateFrame('y', Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Transform Controls */}
          <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 800, marginBottom: 10, color: C.cyan }}>Transform</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: C.muted }}>Scale: {frames[currentFrame].scale.toFixed(1)}</div>
                <input 
                  type="range" min="0.5" max="2" step="0.1"
                  value={frames[currentFrame].scale} 
                  onChange={(e) => updateFrame('scale', Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.muted }}>Rotation: {frames[currentFrame].rotation}°</div>
                <input 
                  type="range" min="0" max="360" 
                  value={frames[currentFrame].rotation} 
                  onChange={(e) => updateFrame('rotation', Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export */}
        <button style={{ width: '100%', marginTop: 20, padding: 14, background: C.purple, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
          🎬 Export Animation (GIF)
        </button>

        <p style={{ textAlign: 'center', color: C.muted, marginTop: 16, fontSize: 12 }}>
          🔜 Full video export coming soon!
        </p>
      </div>
    </div>
  );
}