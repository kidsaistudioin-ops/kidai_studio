'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

const SCENES = [
  { id: 'city', name: 'City', bg: 'linear-gradient(to bottom, #1e3a8a, #0f172a)', emoji: '🏙️' },
  { id: 'forest', name: 'Forest', bg: 'linear-gradient(to bottom, #14532d, #064e3b)', emoji: '🌲' },
  { id: 'space', name: 'Space', bg: 'linear-gradient(to bottom, #2e1065, #000000)', emoji: '🚀' },
  { id: 'beach', name: 'Beach', bg: 'linear-gradient(to bottom, #0ea5e9, #0284c7)', emoji: '🏖️' },
  { id: 'desert', name: 'Desert', bg: 'linear-gradient(to bottom, #78350f, #451a03)', emoji: '🏜️' },
  { id: 'snow', name: 'Snow', bg: 'linear-gradient(to bottom, #64748b, #334155)', emoji: '❄️' },
  { id: 'sunset', name: 'Sunset', bg: 'linear-gradient(to bottom, #7c2d12, #451a03)', emoji: '🌅' },
  { id: 'night', name: 'Night', bg: 'linear-gradient(to bottom, #0f172a, #000000)', emoji: '🌙' }
];

const CHARS = ['🤖', '🦁', '👧', '🦸‍♂️', '🐶', '👽', '🐱', '🦊', '🐼', '🐨', '🦄', '🐸', '🦋', '🐝', '🦖', '🐲'];
const PROPS = ['🌳', '🌲', '🌺', '🌻', '🍄', '🌈', '☁️', '⭐', '🌙', '🔥', '💎', '🎁', '📦', '🚗', '🛸', '🏰'];
const EFFECTS = ['💥', '💫', '✨', '💢', '💕', '💦', '🌊', '⚡', '🌩️', '❄️'];

export default function ComicMakerPage() {
  const router = useRouter();
  const [scene, setScene] = useState(SCENES[0]);
  const [elements, setElements] = useState([]); // {id, type, content, x, y}
  const [selectedId, setSelectedId] = useState(null);

  const addChar = (emoji) => {
    setElements([...elements, { id: Date.now(), type: 'char', content: emoji, x: 50, y: 100 }]);
  };

  const addProp = (emoji) => {
    setElements([...elements, { id: Date.now(), type: 'prop', content: emoji, x: 30, y: 150 }]);
  };

  const addEffect = (emoji) => {
    setElements([...elements, { id: Date.now(), type: 'effect', content: emoji, x: 60, y: 80 }]);
  };

  const addBubble = () => {
    const text = prompt("Bubble me kya likhna hai?");
    if (text) {
      setElements([...elements, { id: Date.now(), type: 'bubble', content: text, x: 100, y: 50 }]);
    }
  };

  const moveElement = (dx, dy) => {
    if (!selectedId) return;
    setElements(elements.map(e => e.id === selectedId ? { ...e, x: e.x + dx, y: e.y + dy } : e));
  };

  const deleteElement = () => {
    setElements(elements.filter(e => e.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Comic Maker 💬</span>
        <button onClick={() => alert("Comic Saved to Library!")} style={{ marginLeft: 'auto', background: C.purple, color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>💾 Save</button>
      </div>

      <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
        
        {/* The Comic Canvas */}
        <div style={{ 
          width: '100%', height: 350, background: scene.bg, borderRadius: 16, border: `2px solid ${C.border}`,
          position: 'relative', overflow: 'hidden', marginBottom: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          {elements.map(el => (
            <div 
              key={el.id}
              onClick={() => setSelectedId(el.id)}
              style={{
                position: 'absolute', left: el.x, top: el.y, cursor: 'pointer',
                border: selectedId === el.id ? `2px dashed ${C.cyan}` : '2px solid transparent',
                padding: 4, borderRadius: 8, transition: 'border 0.2s'
              }}
            >
              {el.type === 'char' ? (
                <div style={{ fontSize: 64, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>{el.content}</div>
              ) : el.type === 'prop' ? (
                <div style={{ fontSize: 48, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>{el.content}</div>
              ) : el.type === 'effect' ? (
                <div style={{ fontSize: 36, animation: 'pulse 0.5s infinite' }}>{el.content}</div>
              ) : (
                <div style={{ background: '#fff', color: '#000', padding: '8px 12px', borderRadius: 16, fontWeight: 800, fontSize: 14, position: 'relative' }}>
                  {el.content}
                  <div style={{ position: 'absolute', bottom: -8, left: 10, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid #fff' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 800, marginBottom: 10, color: C.cyan }}>1. Scene & Items</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {SCENES.map(s => (
                <button key={s.id} onClick={() => setScene(s)} style={{ flex: 1, padding: 8, background: C.card2, color: C.text, border: `1px solid ${scene.id === s.id ? C.cyan : C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>{s.name}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {CHARS.map(c => (
                <button key={c} onClick={() => addChar(c)} style={{ fontSize: 24, background: C.card2, border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}>{c}</button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Props:</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {PROPS.map(p => (
                <button key={p} onClick={() => addProp(p)} style={{ fontSize: 20, background: C.card2, border: 'none', borderRadius: 6, padding: '2px 6px', cursor: 'pointer' }}>{p}</button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Effects:</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {EFFECTS.map(e => (
                <button key={e} onClick={() => addEffect(e)} style={{ fontSize: 18, background: C.card2, border: 'none', borderRadius: 6, padding: '2px 6px', cursor: 'pointer' }}>{e}</button>
              ))}
            </div>
            <button onClick={addBubble} style={{ width: '100%', padding: 10, background: C.purple, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>+ Add Chat Bubble 💬</button>
          </div>

          <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 800, marginBottom: 10, color: C.orange }}>2. Move Selected Item</div>
            {!selectedId ? (
              <div style={{ color: C.muted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Canvas se kisi item ko select karo move karne ke liye.</div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                  <div />
                  <button onClick={() => moveElement(0, -20)} style={btnStyle(C.card2)}>⬆️</button>
                  <div />
                  <button onClick={() => moveElement(-20, 0)} style={btnStyle(C.card2)}>⬅️</button>
                  <button onClick={() => moveElement(0, 20)} style={btnStyle(C.card2)}>⬇️</button>
                  <button onClick={() => moveElement(20, 0)} style={btnStyle(C.card2)}>➡️</button>
                </div>
                <button onClick={deleteElement} style={{ width: '100%', padding: 10, background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>🗑️ Delete Item</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const btnStyle = (bg) => ({
  width: 40, height: 40, background: bg, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'
});