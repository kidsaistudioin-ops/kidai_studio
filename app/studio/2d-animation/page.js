'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { playCorrectSound, playStreakChime, playMovePieceSound } from '@/lib/audio/sound-engine';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

const CHARACTERS = ['🤖', '👧', '👦', '🦁', '🦸‍♂️', '🐶', '🐱', '👽', '🦊', '🐼', '🦄', '🦖', '🐲', '🧙‍♂️', '🚀', '🏎️'];

const STAGE_BACKGROUNDS = [
  { id: 'galaxy', name: 'Galaxy Space', bg: 'radial-gradient(circle at center, #1e1b4b, #000000)', icon: '🌌' },
  { id: 'forest', name: 'Magic Forest', bg: 'linear-gradient(to bottom, #14532d, #052e16)', icon: '🌲' },
  { id: 'city', name: 'Cyber City', bg: 'linear-gradient(to bottom, #1e3a8a, #0f172a)', icon: '🏙️' },
  { id: 'desert', name: 'Sun Valley', bg: 'linear-gradient(to bottom, #9a3412, #431407)', icon: '🏜️' },
  { id: 'ocean', name: 'Deep Ocean', bg: 'linear-gradient(to bottom, #0284c7, #082f49)', icon: '🌊' },
  { id: 'stadium', name: 'Game Arena', bg: 'linear-gradient(to bottom, #475569, #0f172a)', icon: '🏟️' }
];

export default function Animation2DPage() {
  const router = useRouter();
  const playbackIntervalRef = useRef(null);
  const stageRef = useRef(null);
  const draggingActorRef = useRef(null);

  const [animTitle, setAnimTitle] = useState('My Super Animation');
  const [selectedBg, setSelectedBg] = useState(STAGE_BACKGROUNDS[0]);
  const [onionSkin, setOnionSkin] = useState(true);
  const [fps, setFps] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);

  const [frames, setFrames] = useState([
    {
      id: 1,
      actors: [
        { id: 'a1', char: '🤖', x: 25, y: 55, scale: 1.2, rotation: 0, flip: false },
        { id: 'a2', char: '🚀', x: 75, y: 30, scale: 1.1, rotation: -20, flip: false }
      ]
    },
    {
      id: 2,
      actors: [
        { id: 'a1', char: '🤖', x: 40, y: 48, scale: 1.2, rotation: 12, flip: false },
        { id: 'a2', char: '🚀', x: 65, y: 40, scale: 1.2, rotation: -10, flip: false }
      ]
    },
    {
      id: 3,
      actors: [
        { id: 'a1', char: '🤖', x: 55, y: 55, scale: 1.2, rotation: -8, flip: false },
        { id: 'a2', char: '🚀', x: 55, y: 52, scale: 1.3, rotation: 0, flip: false }
      ]
    }
  ]);

  const [selectedActorId, setSelectedActorId] = useState('a1');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const currentFrame = frames[currentFrameIdx] || frames[0];
  const prevFrame = currentFrameIdx > 0 ? frames[currentFrameIdx - 1] : frames[frames.length - 1];
  const selectedActor = currentFrame.actors.find(a => a.id === selectedActorId) || currentFrame.actors[0];

  // Playback Loop Engine
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1000 / fps);
      playbackIntervalRef.current = setInterval(() => {
        setCurrentFrameIdx(prev => (prev + 1) % frames.length);
      }, intervalMs);
    } else {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    }
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    };
  }, [isPlaying, fps, frames.length]);

  const togglePlay = () => {
    if (!isPlaying) {
      try { playStreakChime(); } catch(e) {}
    }
    setIsPlaying(!isPlaying);
  };

  const handleAddFrame = () => {
    try { playCorrectSound(); } catch(e) {}
    const newActors = currentFrame.actors.map(a => ({ ...a }));
    const newFrame = { id: Date.now(), actors: newActors };
    const nextFrames = [...frames, newFrame];
    setFrames(nextFrames);
    setCurrentFrameIdx(nextFrames.length - 1);
    showToast(`Frame #${nextFrames.length} Added!`);
  };

  const handleDeleteFrame = (idx) => {
    if (frames.length <= 1) {
      showToast('⚠️ Kam se kam 1 frame hona zaroori hai!');
      return;
    }
    try { playMovePieceSound(); } catch(e) {}
    const nextFrames = frames.filter((_, i) => i !== idx);
    setFrames(nextFrames);
    if (currentFrameIdx >= nextFrames.length) {
      setCurrentFrameIdx(nextFrames.length - 1);
    }
  };

  const handleAddActor = (char) => {
    try { playCorrectSound(); } catch(e) {}
    const newId = 'act_' + Date.now();
    const newActor = {
      id: newId,
      char,
      x: 35 + Math.random() * 30,
      y: 35 + Math.random() * 30,
      scale: 1,
      rotation: 0,
      flip: false
    };

    setFrames(prev => {
      const next = [...prev];
      next[currentFrameIdx] = {
        ...next[currentFrameIdx],
        actors: [...next[currentFrameIdx].actors, newActor]
      };
      return next;
    });
    setSelectedActorId(newId);
    showToast(`Added ${char} to Stage!`);
  };

  // Direct Mouse / Touch Dragging on Stage
  const handleStagePointerDown = (e, actorId) => {
    if (isPlaying) return;
    e.stopPropagation();
    try { playMovePieceSound(); } catch(err) {}
    setSelectedActorId(actorId);
    draggingActorRef.current = actorId;
  };

  const handleStagePointerMove = (e) => {
    if (!draggingActorRef.current || isPlaying || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

    const xPct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(5, Math.min(95, ((clientY - rect.top) / rect.height) * 100));

    setFrames(prev => {
      const next = [...prev];
      const frame = next[currentFrameIdx];
      frame.actors = frame.actors.map(a => a.id === draggingActorRef.current ? { ...a, x: Math.round(xPct), y: Math.round(yPct) } : a);
      return next;
    });
  };

  const handleStagePointerUp = () => {
    draggingActorRef.current = null;
  };

  // Move Actor via D-pad
  const moveActor = (dx, dy) => {
    if (!selectedActorId) return;
    try { playMovePieceSound(); } catch(e) {}
    setFrames(prev => {
      const next = [...prev];
      const frame = next[currentFrameIdx];
      frame.actors = frame.actors.map(a => a.id === selectedActorId ? { ...a, x: Math.max(5, Math.min(95, a.x + dx)), y: Math.max(5, Math.min(95, a.y + dy)) } : a);
      return next;
    });
  };

  const rotateActor = (degDelta) => {
    if (!selectedActorId) return;
    try { playMovePieceSound(); } catch(e) {}
    setFrames(prev => {
      const next = [...prev];
      const frame = next[currentFrameIdx];
      frame.actors = frame.actors.map(a => a.id === selectedActorId ? { ...a, rotation: (a.rotation || 0) + degDelta } : a);
      return next;
    });
  };

  const scaleActor = (delta) => {
    if (!selectedActorId) return;
    try { playMovePieceSound(); } catch(e) {}
    setFrames(prev => {
      const next = [...prev];
      const frame = next[currentFrameIdx];
      frame.actors = frame.actors.map(a => a.id === selectedActorId ? { ...a, scale: Math.max(0.4, Math.min(2.6, Number(((a.scale || 1) + delta).toFixed(2)))) } : a);
      return next;
    });
  };

  const flipActor = () => {
    if (!selectedActorId) return;
    try { playMovePieceSound(); } catch(e) {}
    setFrames(prev => {
      const next = [...prev];
      const frame = next[currentFrameIdx];
      frame.actors = frame.actors.map(a => a.id === selectedActorId ? { ...a, flip: !a.flip } : a);
      return next;
    });
  };

  // Quick Action Preset (Jump, Bounce, Spin)
  const applyPresetAction = (actionType) => {
    if (!selectedActorId) return;
    try { playCorrectSound(); } catch(e) {}
    setFrames(prev => {
      const next = [...prev];
      const frame = next[currentFrameIdx];
      frame.actors = frame.actors.map(a => {
        if (a.id !== selectedActorId) return a;
        if (actionType === 'jump') return { ...a, y: Math.max(10, a.y - 25), rotation: (a.rotation || 0) - 15 };
        if (actionType === 'land') return { ...a, y: Math.min(85, a.y + 25), rotation: 0 };
        if (actionType === 'spin') return { ...a, rotation: ((a.rotation || 0) + 90) % 360 };
        if (actionType === 'grow') return { ...a, scale: Math.min(2.5, (a.scale || 1) * 1.3) };
        return a;
      });
      return next;
    });
  };

  const deleteActor = () => {
    if (!selectedActorId) return;
    try { playMovePieceSound(); } catch(e) {}
    setFrames(prev => {
      const next = [...prev];
      const frame = next[currentFrameIdx];
      frame.actors = frame.actors.filter(a => a.id !== selectedActorId);
      return next;
    });
    setSelectedActorId(null);
  };

  const handleSaveToLibrary = () => {
    try { playStreakChime(); } catch(e) {}
    const existing = JSON.parse(localStorage.getItem('kidai_studio_creations') || '[]');
    const newCreation = {
      id: Date.now().toString(),
      title: animTitle || 'My 2D Animation',
      type: '2D Animation',
      date: new Date().toLocaleDateString('en-IN'),
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%2310b981"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60">🎞️</text></svg>'
    };
    existing.unshift(newCreation);
    localStorage.setItem('kidai_studio_creations', JSON.stringify(existing.slice(0, 20)));

    showToast('🎉 Animation Saved to Studio Library!');
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", paddingBottom: 60 }}>
      
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: C.green, color: '#000', padding: '12px 24px', borderRadius: 14, fontWeight: 900, fontSize: 14, zIndex: 1000, boxShadow: '0 8px 30px rgba(16,185,129,0.5)' }}>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,9,15,.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 22 }}>←</button>
          <span>2D Animation & <span style={{ color: C.green }}>Sprite Studio</span> 🎞️</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/studio/library')} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: '8px 14px', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>
            📁 My Library
          </button>
          <button onClick={handleSaveToLibrary} style={{ background: `linear-gradient(135deg, ${C.green}, #059669)`, color: '#000', border: 'none', padding: '8px 18px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', fontSize: 13, boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
            💾 Save Animation
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1250, margin: '0 auto', padding: '24px 20px' }}>
        
        {/* Title & Playback Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🎬</span>
            <input 
              value={animTitle} 
              onChange={e => setAnimTitle(e.target.value)} 
              placeholder="Animation Title..." 
              style={{ background: C.card, border: `1px solid ${C.border}`, color: '#fff', fontSize: 20, fontWeight: 900, padding: '8px 16px', borderRadius: 12, outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              onClick={() => setOnionSkin(!onionSkin)}
              style={{
                padding: '8px 14px',
                background: onionSkin ? C.purple : C.card2,
                color: '#fff',
                border: `1px solid ${onionSkin ? '#fff' : C.border}`,
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              👻 Ghost Onion Skin: {onionSkin ? 'ON' : 'OFF'}
            </button>

            <button 
              onClick={togglePlay}
              style={{
                padding: '10px 22px',
                background: isPlaying ? C.red : C.green,
                color: isPlaying ? '#fff' : '#000',
                border: 'none',
                borderRadius: 12,
                fontWeight: 900,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: isPlaying ? '0 0 16px rgba(239,68,68,0.5)' : '0 0 16px rgba(16,185,129,0.5)'
              }}
            >
              {isPlaying ? '⏸️ Stop Playback' : '▶️ Play Animation'}
            </button>
          </div>
        </div>

        {/* ── WORKSTATION DUAL-COLUMN GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
          
          {/* LEFT: STAGE & TIMELINE */}
          <div>
            
            {/* Stage Screen with Direct Drag-and-Drop */}
            <div 
              ref={stageRef}
              onMouseMove={handleStagePointerMove}
              onTouchMove={handleStagePointerMove}
              onMouseUp={handleStagePointerUp}
              onTouchEnd={handleStagePointerUp}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/10',
                background: selectedBg.bg,
                borderRadius: 24,
                border: `4px solid ${isPlaying ? C.green : '#1e2d45'}`,
                boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                overflow: 'hidden',
                userSelect: 'none',
                touchAction: 'none'
              }}
            >
              
              {/* Frame Indicator Pill */}
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 900, zIndex: 10 }}>
                Frame {currentFrameIdx + 1} / {frames.length} ({fps} FPS)
              </div>

              {/* Layer 1: Onion Skin Ghosting (Previous Frame) */}
              {!isPlaying && onionSkin && prevFrame && prevFrame !== currentFrame && (
                prevFrame.actors.map(a => (
                  <div
                    key={'ghost_' + a.id}
                    style={{
                      position: 'absolute',
                      left: `${a.x}%`,
                      top: `${a.y}%`,
                      transform: `translate(-50%, -50%) rotate(${a.rotation || 0}deg) scaleX(${a.flip ? -1 : 1})`,
                      fontSize: `${56 * (a.scale || 1)}px`,
                      opacity: 0.22,
                      filter: 'grayscale(100%)',
                      pointerEvents: 'none',
                      zIndex: 2
                    }}
                  >
                    {a.char}
                  </div>
                ))
              )}

              {/* Layer 2: Active Frame Actors with Direct Drag Support */}
              {currentFrame.actors.map(a => {
                const isSelected = selectedActorId === a.id && !isPlaying;
                return (
                  <div
                    key={a.id}
                    onMouseDown={(e) => handleStagePointerDown(e, a.id)}
                    onTouchStart={(e) => handleStagePointerDown(e, a.id)}
                    style={{
                      position: 'absolute',
                      left: `${a.x}%`,
                      top: `${a.y}%`,
                      transform: `translate(-50%, -50%) rotate(${a.rotation || 0}deg) scaleX(${a.flip ? -1 : 1})`,
                      cursor: isPlaying ? 'default' : 'grab',
                      fontSize: `${56 * (a.scale || 1)}px`,
                      border: isSelected ? '3px dashed #06b6d4' : '2px solid transparent',
                      padding: 6,
                      borderRadius: 16,
                      zIndex: isSelected ? 10 : 5,
                      filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.6))',
                      transition: isPlaying ? 'all 0.15s linear' : 'border 0.15s'
                    }}
                  >
                    {a.char}
                    {isSelected && (
                      <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#06b6d4', color: '#000', fontSize: 9, fontWeight: 900, padding: '1px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                        ACTIVE
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 10, color: C.muted, fontSize: 13, textAlign: 'center' }}>
              💡 Tip: Character ko mouse ya ungli se <strong>seedha stage par pakad kar drag karein!</strong>
            </div>

            {/* Frame Timeline Bar */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}`, marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontWeight: 900, fontSize: 13, color: C.cyan }}>📽️ ANIMATION TIMELINE ({frames.length} FRAMES)</div>
                <button 
                  onClick={handleAddFrame}
                  style={{ padding: '6px 14px', background: C.green, color: '#000', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
                >
                  + Add Keyframe
                </button>
              </div>

              {/* Timeline Horizontal Strip */}
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                {frames.map((f, fIdx) => {
                  const isCurrent = currentFrameIdx === fIdx;
                  return (
                    <div
                      key={f.id}
                      onClick={() => { try { playMovePieceSound(); } catch(e) {} setCurrentFrameIdx(fIdx); }}
                      style={{
                        position: 'relative',
                        width: 70,
                        height: 60,
                        background: selectedBg.bg,
                        borderRadius: 12,
                        border: `3px solid ${isCurrent ? C.cyan : C.border}`,
                        boxShadow: isCurrent ? `0 0 16px ${C.cyan}55` : 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24
                      }}
                    >
                      <span>{f.actors[0]?.char || '🎬'}</span>
                      <span style={{ position: 'absolute', bottom: 2, right: 4, fontSize: 10, fontWeight: 900, color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '1px 4px', borderRadius: 4 }}>
                        #{fIdx + 1}
                      </span>
                      {frames.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFrame(fIdx);
                          }}
                          style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: C.red, color: '#fff', border: 'none', fontSize: 10, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Speed Slider */}
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.orange }}>Playback Speed: {fps} FPS</span>
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  value={fps} 
                  onChange={e => setFps(Number(e.target.value))}
                  style={{ flex: 1, cursor: 'pointer', accentColor: C.orange }}
                />
              </div>

            </div>

          </div>

          {/* RIGHT: ACTORS & EDITING CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Active Stage Actors Selector */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.cyan, marginBottom: 10 }}>
                1. STAGE ACTORS (CLICK TO SELECT)
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {currentFrame.actors.map((act, aIdx) => (
                  <button
                    key={act.id}
                    onClick={() => { try { playCorrectSound(); } catch(e) {} setSelectedActorId(act.id); }}
                    style={{
                      padding: '8px 14px',
                      background: selectedActorId === act.id ? C.cyan : C.card2,
                      color: selectedActorId === act.id ? '#000' : '#fff',
                      border: `1px solid ${selectedActorId === act.id ? '#fff' : C.border}`,
                      borderRadius: 12,
                      fontWeight: 900,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{act.char}</span>
                    <span>Actor #{aIdx + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Actor Controls (Move, Rotate, Scale, Presets) */}
            {selectedActor ? (
              <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `2px solid ${C.cyan}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontWeight: 900, fontSize: 14, color: C.cyan, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 24 }}>{selectedActor.char}</span>
                    <span>CONTROLS & ACTIONS</span>
                  </div>
                  <button onClick={deleteActor} style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef4444', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                    🗑️ Remove
                  </button>
                </div>

                {/* Quick Presets */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
                  <button onClick={() => applyPresetAction('jump')} style={{ padding: '6px 4px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                    🦘 Jump
                  </button>
                  <button onClick={() => applyPresetAction('land')} style={{ padding: '6px 4px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                    ⬇️ Land
                  </button>
                  <button onClick={() => applyPresetAction('spin')} style={{ padding: '6px 4px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                    💫 Spin
                  </button>
                  <button onClick={() => applyPresetAction('grow')} style={{ padding: '6px 4px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                    💥 Grow
                  </button>
                </div>

                {/* Move D-Pad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                  <div />
                  <button onClick={() => moveActor(0, -8)} style={{ padding: '10px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'pointer', fontWeight: 900, fontSize: 16 }}>⬆️</button>
                  <div />
                  <button onClick={() => moveActor(-8, 0)} style={{ padding: '10px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'pointer', fontWeight: 900, fontSize: 16 }}>⬅️</button>
                  <button onClick={() => moveActor(0, 8)} style={{ padding: '10px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'pointer', fontWeight: 900, fontSize: 16 }}>⬇️</button>
                  <button onClick={() => moveActor(8, 0)} style={{ padding: '10px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'pointer', fontWeight: 900, fontSize: 16 }}>➡️</button>
                </div>

                {/* Transform Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button onClick={() => rotateActor(-15)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                    🔄 Rotate (-15°)
                  </button>
                  <button onClick={() => rotateActor(15)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                    🔁 Rotate (+15°)
                  </button>
                  <button onClick={() => scaleActor(0.2)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                    🔍 Bigger (+)
                  </button>
                  <button onClick={() => scaleActor(-0.2)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                    🔎 Smaller (-)
                  </button>
                  <button onClick={flipActor} style={{ gridColumn: 'span 2', padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                    ↔️ Flip Direction
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}`, color: C.muted, textAlign: 'center' }}>
                Stage se kisi character par click karein use control karne ke liye.
              </div>
            )}

            {/* Add New Actor / Hero */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.green, marginBottom: 10 }}>
                2. ADD MORE ACTORS / HEROES
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CHARACTERS.map(c => (
                  <button
                    key={c}
                    onClick={() => handleAddActor(c)}
                    style={{ fontSize: 24, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Stage Theme */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.orange, marginBottom: 10 }}>
                3. STAGE ENVIRONMENT
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {STAGE_BACKGROUNDS.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => { try { playMovePieceSound(); } catch(e) {} setSelectedBg(bg); }}
                    style={{
                      padding: '8px 4px',
                      background: selectedBg.id === bg.id ? C.cyan : C.card2,
                      color: selectedBg.id === bg.id ? '#000' : '#fff',
                      border: `1px solid ${selectedBg.id === bg.id ? '#fff' : C.border}`,
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 11,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{bg.icon}</span>
                    <span>{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}