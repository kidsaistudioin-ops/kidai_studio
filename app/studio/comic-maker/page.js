'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { playCorrectSound, playStreakChime, playMovePieceSound } from '@/lib/audio/sound-engine';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

const SCENES = [
  { id: 'city', name: 'Cyber City', bg: 'linear-gradient(to bottom, #1e3a8a, #0f172a)', icon: '🏙️' },
  { id: 'space', name: 'Space Galaxy', bg: 'linear-gradient(to bottom, #2e1065, #000000)', icon: '🚀' },
  { id: 'forest', name: 'Magic Forest', bg: 'linear-gradient(to bottom, #14532d, #064e3b)', icon: '🌲' },
  { id: 'castle', name: 'Royal Kingdom', bg: 'linear-gradient(to bottom, #831843, #4c0519)', icon: '🏰' },
  { id: 'beach', name: 'Sunny Beach', bg: 'linear-gradient(to bottom, #0284c7, #0369a1)', icon: '🏖️' },
  { id: 'sunset', name: 'Sunset Valley', bg: 'linear-gradient(to bottom, #9a3412, #431407)', icon: '🌅' },
  { id: 'snow', name: 'Snowy Arctic', bg: 'linear-gradient(to bottom, #475569, #1e293b)', icon: '❄️' },
  { id: 'classroom', name: 'AI Classroom', bg: 'linear-gradient(to bottom, #3b82f6, #1d4ed8)', icon: '🏫' }
];

const HUMAN_CHARACTERS = ['👦', '👧', '🦸‍♂️', '🦹', '👨‍🏫', '👩‍⚕️', '👮', '👨‍🍳', '🥷', '🧙‍♂️', '👸', '👑', '👨‍🚀', '🕵️', '🧕', '🧑‍🎓', '🧛', '🧜‍♀️'];
const FANTASY_ANIMALS = ['🤖', '🦁', '🐲', '🦖', '🦄', '🐼', '🦊', '🐶', '🐱', '👽', '🐯', '🐘', '🦋', '🐙', '👾', '🚀'];
const PROPS = ['🌳', '🌲', '🍄', '🌈', '⭐', '🔥', '💎', '🎁', '📦', '🚗', '🛸', '🚀', '🏰', '🍕', '🍦', '⚽', '📱', '💻', '🧪', '🏆'];
const SFX = ['💥 POW!', '⚡ ZAP!', '🔥 BOOM!', '✨ BAM!', '💫 WHOOSH!', '💨 ZOOM!', '💢 CRASH!', '🌟 WOW!', '😱 AAAA!', '🎉 YAY!'];

export default function ComicMakerPage() {
  const router = useRouter();
  const comicContainerRef = useRef(null);
  const customCharInputRef = useRef(null);

  const [comicTitle, setComicTitle] = useState('My Super AI Comic');
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [activePanelIdx, setActivePanelIdx] = useState(0);
  const [characterTab, setCharacterTab] = useState('humans'); // 'humans', 'animals', 'custom'

  // Multi-Page Comic Book Data Structure
  const [pages, setPages] = useState([
    {
      id: 1,
      panelLayout: 2, // 1, 2, or 4 panels
      panels: [
        { 
          scene: SCENES[0], 
          elements: [
            { id: 'el_1', type: 'char', content: '🤖', x: 30, y: 65, scale: 1.3, rotation: 0, flip: false },
            { id: 'el_2', type: 'bubble', content: 'Namaste! Main Arya Robot hoon.', x: 50, y: 25, scale: 1, rotation: 0, bType: 'speech' }
          ] 
        },
        { 
          scene: SCENES[1], 
          elements: [
            { id: 'el_3', type: 'char', content: '🦸‍♂️', x: 70, y: 65, scale: 1.3, rotation: 0, flip: true },
            { id: 'el_4', type: 'bubble', content: 'Chalo Space Mission par chalein!', x: 50, y: 25, scale: 1, rotation: 0, bType: 'shout' }
          ] 
        },
        { scene: SCENES[2], elements: [] },
        { scene: SCENES[3], elements: [] }
      ]
    }
  ]);

  const [customCharacters, setCustomCharacters] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState('el_1');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const currentPage = pages[currentPageIdx] || pages[0];
  const currentPanel = currentPage.panels[activePanelIdx] || currentPage.panels[0];
  const selectedElement = currentPanel.elements.find(el => el.id === selectedElementId);

  // Set Panel Layout for Current Page (1, 2, or 4 Panels)
  const handleSetLayout = (count) => {
    setPages(prev => {
      const next = [...prev];
      next[currentPageIdx] = { ...next[currentPageIdx], panelLayout: count };
      return next;
    });
    if (activePanelIdx >= count) {
      setActivePanelIdx(0);
    }
  };

  // Add New Comic Page
  const handleAddPage = () => {
    try { playStreakChime(); } catch(e) {}
    const newPage = {
      id: Date.now(),
      panelLayout: 2,
      panels: [
        { scene: SCENES[2], elements: [{ id: 'el_' + Date.now(), type: 'char', content: '👦', x: 35, y: 65, scale: 1.3, rotation: 0, flip: false }, { id: 'el_b_' + Date.now(), type: 'bubble', content: `Page #${pages.length + 1} ki kahani!`, x: 50, y: 25, scale: 1, rotation: 0, bType: 'speech' }] },
        { scene: SCENES[3], elements: [] },
        { scene: SCENES[4], elements: [] },
        { scene: SCENES[5], elements: [] }
      ]
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPageIdx(pages.length);
    setActivePanelIdx(0);
    showToast(`🎉 Page #${pages.length + 1} Added to Comic Book!`);
  };

  // Delete Current Page
  const handleDeletePage = (pIdx) => {
    if (pages.length <= 1) {
      showToast('⚠️ Kam se kam 1 page hona zaroori hai!');
      return;
    }
    try { playMovePieceSound(); } catch(e) {}
    const nextPages = pages.filter((_, idx) => idx !== pIdx);
    setPages(nextPages);
    if (currentPageIdx >= nextPages.length) {
      setCurrentPageIdx(nextPages.length - 1);
    }
    setActivePanelIdx(0);
    showToast('Page removed.');
  };

  // Set Scene Background
  const handleSetScene = (sc) => {
    try { playMovePieceSound(); } catch(e) {}
    setPages(prev => {
      const next = [...prev];
      const page = next[currentPageIdx];
      page.panels[activePanelIdx] = { ...page.panels[activePanelIdx], scene: sc };
      return next;
    });
  };

  // Add Element to Active Panel
  const addElement = (type, content, extra = {}) => {
    try { playCorrectSound(); } catch(e) {}
    const newId = 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newEl = {
      id: newId,
      type,
      content,
      x: 35 + Math.random() * 30,
      y: 40 + Math.random() * 30,
      scale: 1.2,
      rotation: 0,
      flip: false,
      ...extra
    };

    setPages(prev => {
      const next = [...prev];
      const page = next[currentPageIdx];
      page.panels[activePanelIdx] = {
        ...page.panels[activePanelIdx],
        elements: [...page.panels[activePanelIdx].elements, newEl]
      };
      return next;
    });
    setSelectedElementId(newId);
    showToast('Item Added to Panel!');
  };

  // Add Speech / Thought / Shout Bubble
  const handleAddBubble = (bType = 'speech') => {
    const defaultText = bType === 'thought' ? 'Hmm, kya plan hai...' : bType === 'shout' ? 'Bachao! Run!' : 'Apna dialogue likhein!';
    const userText = prompt('Bubble mein kya dialogue likhna hai?', defaultText);
    if (userText && userText.trim()) {
      addElement('bubble', userText.trim(), { bType, scale: 1 });
    }
  };

  // Upload Custom Photo / Character Image
  const handleUploadCustomCharacter = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (fEvent) => {
      const imgData = fEvent.target.result;
      setCustomCharacters(prev => [imgData, ...prev]);
      addElement('custom_img', imgData, { scale: 1.2 });
      showToast('Custom Photo added as Character!');
    };
    reader.readAsDataURL(file);
  };

  // Move Element via D-Pad
  const moveElement = (dx, dy) => {
    if (!selectedElementId) return;
    try { playMovePieceSound(); } catch(e) {}
    setPages(prev => {
      const next = [...prev];
      const page = next[currentPageIdx];
      const panel = page.panels[activePanelIdx];
      panel.elements = panel.elements.map(el => el.id === selectedElementId ? { ...el, x: Math.max(8, Math.min(92, el.x + dx)), y: Math.max(10, Math.min(90, el.y + dy)) } : el);
      return next;
    });
  };

  // Scale Element
  const scaleElement = (delta) => {
    if (!selectedElementId) return;
    try { playMovePieceSound(); } catch(e) {}
    setPages(prev => {
      const next = [...prev];
      const page = next[currentPageIdx];
      const panel = page.panels[activePanelIdx];
      panel.elements = panel.elements.map(el => el.id === selectedElementId ? { ...el, scale: Math.max(0.4, Math.min(3.0, Number(((el.scale || 1) + delta).toFixed(2)))) } : el);
      return next;
    });
  };

  // Rotate Element
  const rotateElement = (degDelta) => {
    if (!selectedElementId) return;
    try { playMovePieceSound(); } catch(e) {}
    setPages(prev => {
      const next = [...prev];
      const page = next[currentPageIdx];
      const panel = page.panels[activePanelIdx];
      panel.elements = panel.elements.map(el => el.id === selectedElementId ? { ...el, rotation: (el.rotation || 0) + degDelta } : el);
      return next;
    });
  };

  // Flip Element
  const flipElement = () => {
    if (!selectedElementId) return;
    try { playMovePieceSound(); } catch(e) {}
    setPages(prev => {
      const next = [...prev];
      const page = next[currentPageIdx];
      const panel = page.panels[activePanelIdx];
      panel.elements = panel.elements.map(el => el.id === selectedElementId ? { ...el, flip: !el.flip } : el);
      return next;
    });
  };

  // Delete Selected Element
  const deleteElement = (elIdToDelete = null) => {
    const targetId = elIdToDelete || selectedElementId;
    if (!targetId) return;
    try { playMovePieceSound(); } catch(e) {}
    setPages(prev => {
      const next = [...prev];
      const page = next[currentPageIdx];
      const panel = page.panels[activePanelIdx];
      panel.elements = panel.elements.filter(el => el.id !== targetId);
      return next;
    });
    if (selectedElementId === targetId) {
      setSelectedElementId(null);
    }
    showToast('Item Deleted!');
  };

  // Direct Mouse / Touch Dragging on Panel
  const draggingElRef = useRef(null);

  const handlePointerDown = (e, pIdx, elId) => {
    e.stopPropagation();
    try { playMovePieceSound(); } catch (err) {}
    setActivePanelIdx(pIdx);
    setSelectedElementId(elId);
    draggingElRef.current = { pIdx, elId };
  };

  const handlePanelPointerMove = (e, pIdx) => {
    if (!draggingElRef.current || draggingElRef.current.pIdx !== pIdx) return;
    const panelEl = e.currentTarget;
    const rect = panelEl.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

    const xPct = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(10, Math.min(90, ((clientY - rect.top) / rect.height) * 100));

    setPages(prev => {
      const next = [...prev];
      const page = next[currentPageIdx];
      const panel = page.panels[pIdx];
      panel.elements = panel.elements.map(el => el.id === draggingElRef.current.elId ? { ...el, x: Math.round(xPct), y: Math.round(yPct) } : el);
      return next;
    });
  };

  const handlePointerUp = () => {
    draggingElRef.current = null;
  };

  // Save to Library & Print
  const handleSaveAndExport = async () => {
    try { playStreakChime(); } catch(e) {}
    const existing = JSON.parse(localStorage.getItem('kidai_studio_creations') || '[]');
    const newCreation = {
      id: Date.now().toString(),
      title: `${comicTitle} (${pages.length} Pages)`,
      type: 'Comic Strip',
      date: new Date().toLocaleDateString('en-IN'),
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%237c3aed"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60">💬</text></svg>'
    };
    existing.unshift(newCreation);
    localStorage.setItem('kidai_studio_creations', JSON.stringify(existing.slice(0, 20)));

    window.print();
    showToast('🎉 Multi-Page Comic Saved to Studio Library!');
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", paddingBottom: 60 }} onMouseUp={handlePointerUp} onTouchEnd={handlePointerUp}>
      
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: C.cyan, color: '#000', padding: '12px 24px', borderRadius: 14, fontWeight: 900, fontSize: 14, zIndex: 1000, boxShadow: '0 8px 30px rgba(6,182,212,0.5)' }}>
          {toastMsg}
        </div>
      )}

      {/* Hidden File Input for Custom Character Upload */}
      <input 
        type="file" 
        accept="image/*" 
        ref={customCharInputRef} 
        onChange={handleUploadCustomCharacter} 
        style={{ display: 'none' }} 
      />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,9,15,.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 22 }}>←</button>
          <span>Multi-Page Comic & <span style={{ color: C.cyan }}>Story Studio</span> 💬</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/studio/library')} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: '8px 14px', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>
            📁 My Library
          </button>
          <button onClick={handleSaveAndExport} style={{ background: `linear-gradient(135deg, ${C.cyan}, #0891b2)`, color: '#000', border: 'none', padding: '8px 18px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', fontSize: 13, boxShadow: '0 4px 15px rgba(6,182,212,0.3)' }}>
            💾 Save & Print Book
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '24px 20px' }}>
        
        {/* Title Bar, Page Navigator & Layout Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>📖</span>
            <input 
              value={comicTitle} 
              onChange={e => setComicTitle(e.target.value)} 
              placeholder="Comic Book Title..." 
              style={{ background: C.card, border: `1px solid ${C.border}`, color: '#fff', fontSize: 20, fontWeight: 900, padding: '8px 16px', borderRadius: 12, outline: 'none' }}
            />
          </div>

          {/* Multi-Page Manager Strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.card, padding: '6px 12px', borderRadius: 14, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: C.cyan }}>PAGES:</span>
            {pages.map((pg, idx) => (
              <button
                key={pg.id}
                onClick={() => { try { playMovePieceSound(); } catch(e) {} setCurrentPageIdx(idx); setActivePanelIdx(0); }}
                style={{
                  padding: '6px 12px',
                  background: currentPageIdx === idx ? C.cyan : C.card2,
                  color: currentPageIdx === idx ? '#000' : '#fff',
                  border: `1px solid ${currentPageIdx === idx ? '#fff' : C.border}`,
                  borderRadius: 8,
                  fontWeight: 900,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Page {idx + 1}
              </button>
            ))}
            <button
              onClick={handleAddPage}
              style={{ padding: '6px 12px', background: C.green, color: '#000', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
            >
              + Add Page
            </button>
            {pages.length > 1 && (
              <button
                onClick={() => handleDeletePage(currentPageIdx)}
                style={{ padding: '6px 8px', background: '#ef444422', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 8, fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
                title="Delete Current Page"
              >
                🗑️
              </button>
            )}
          </div>

          {/* Current Page Layout Selector (1, 2, or 4 Panels) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 800 }}>PANELS:</span>
            {[
              { count: 1, label: '1 Panel' },
              { count: 2, label: '2 Panels (Split)' },
              { count: 4, label: '4 Panels (2x2 Grid)' }
            ].map(l => (
              <button
                key={l.count}
                onClick={() => handleSetLayout(l.count)}
                style={{
                  padding: '8px 12px',
                  background: currentPage.panelLayout === l.count ? C.cyan : C.card2,
                  color: currentPage.panelLayout === l.count ? '#000' : '#fff',
                  border: `1px solid ${currentPage.panelLayout === l.count ? '#fff' : C.border}`,
                  borderRadius: 10,
                  fontWeight: 900,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── WORKSTATION DUAL-COLUMN GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, alignItems: 'start' }}>
          
          {/* LEFT: NON-OVERLAPPING CLEAN COMIC STRIP CANVAS */}
          <div>
            <div 
              ref={comicContainerRef}
              style={{
                display: 'grid',
                gridTemplateColumns: currentPage.panelLayout === 1 ? '1fr' : '1fr 1fr',
                gap: 18,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                padding: 20,
                borderRadius: 24,
                border: '4px solid #475569',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)'
              }}
            >
              {currentPage.panels.slice(0, currentPage.panelLayout).map((p, pIdx) => {
                const isActive = activePanelIdx === pIdx;
                return (
                  <div
                    key={pIdx}
                    onClick={() => setActivePanelIdx(pIdx)}
                    onMouseMove={(e) => handlePanelPointerMove(e, pIdx)}
                    onTouchMove={(e) => handlePanelPointerMove(e, pIdx)}
                    style={{
                      position: 'relative',
                      aspectRatio: currentPage.panelLayout === 1 ? '16/9' : '4/3',
                      minHeight: 240,
                      background: p.scene.bg,
                      borderRadius: 16,
                      border: `3px solid ${isActive ? C.cyan : '#334155'}`,
                      boxShadow: isActive ? `0 0 20px ${C.cyan}44` : 'none',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      userSelect: 'none',
                      touchAction: 'none',
                      transition: 'border 0.2s'
                    }}
                  >
                    {/* Panel Badge */}
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 900, zIndex: 10 }}>
                      Page {currentPageIdx + 1} • Panel #{pIdx + 1} {isActive ? '✏️ (Active)' : ''}
                    </div>

                    {/* Panel Elements */}
                    {p.elements.map(el => {
                      const isSelected = selectedElementId === el.id && isActive;
                      return (
                        <div
                          key={el.id}
                          onMouseDown={(e) => handlePointerDown(e, pIdx, el.id)}
                          onTouchStart={(e) => handlePointerDown(e, pIdx, el.id)}
                          style={{
                            position: 'absolute',
                            left: `${el.x}%`,
                            top: `${el.y}%`,
                            transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg) scaleX(${el.flip ? -1 : 1})`,
                            cursor: 'grab',
                            border: isSelected ? '3px dashed #06b6d4' : '2px solid transparent',
                            padding: 4,
                            borderRadius: 14,
                            zIndex: isSelected ? 30 : el.type === 'bubble' ? 20 : 10,
                            userSelect: 'none',
                            lineHeight: 1,
                            transition: 'border 0.15s'
                          }}
                        >
                          {/* Quick Floating Delete Button on Selected Item */}
                          {isSelected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteElement(el.id);
                              }}
                              style={{
                                position: 'absolute',
                                top: -12,
                                right: -12,
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: C.red,
                                color: '#fff',
                                border: '2px solid #fff',
                                fontSize: 11,
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 50,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                              }}
                              title="Delete Item"
                            >
                              ✕
                            </button>
                          )}

                          {el.type === 'char' ? (
                            <div style={{ fontSize: `${58 * (el.scale || 1)}px`, lineHeight: 1, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {el.content}
                            </div>
                          ) : el.type === 'custom_img' ? (
                            <img 
                              src={el.content} 
                              alt="Custom character" 
                              style={{ width: `${80 * (el.scale || 1)}px`, height: 'auto', borderRadius: 8, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.6))' }}
                            />
                          ) : el.type === 'prop' ? (
                            <div style={{ fontSize: `${46 * (el.scale || 1)}px`, lineHeight: 1, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {el.content}
                            </div>
                          ) : el.type === 'sfx' ? (
                            <div style={{ 
                              fontSize: `${22 * (el.scale || 1)}px`, 
                              fontWeight: 900, 
                              color: '#fef08a', 
                              background: '#dc2626', 
                              padding: '5px 12px', 
                              borderRadius: 10, 
                              boxShadow: '0 4px 12px rgba(220,38,38,0.7)', 
                              transform: 'rotate(-6deg)',
                              textShadow: '2px 2px 0px #000',
                              whiteSpace: 'nowrap'
                            }}>
                              {el.content}
                            </div>
                          ) : (
                            /* Speech Bubble */
                            <div style={{
                              background: el.bType === 'shout' ? '#fef08a' : '#ffffff',
                              color: '#000',
                              padding: '8px 14px',
                              borderRadius: el.bType === 'thought' ? '24px' : '16px',
                              fontWeight: 900,
                              fontSize: `${14 * (el.scale || 1)}px`,
                              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                              position: 'relative',
                              maxWidth: '200px',
                              border: el.bType === 'shout' ? '2px solid #ef4444' : '2px solid #000',
                              lineHeight: 1.3
                            }}>
                              {el.content}
                              <div style={{
                                position: 'absolute',
                                bottom: -9,
                                left: 18,
                                width: 0,
                                height: 0,
                                borderLeft: '7px solid transparent',
                                borderRight: '7px solid transparent',
                                borderTop: `9px solid ${el.bType === 'shout' ? '#fef08a' : '#ffffff'}`
                              }} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 12, color: C.muted, fontSize: 13, textAlign: 'center' }}>
              💡 Tip: Character ya Speech Bubble ko <strong>mouse ya ungli se seedha panel par drag karein!</strong>
            </div>
          </div>

          {/* RIGHT: ASSET ARSENAL & COMPLETE EDITING CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Selected Element Controls (Resize, Rotate, Flip, Move, Delete) */}
            {selectedElement && (
              <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `2px solid ${C.cyan}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontWeight: 900, fontSize: 13, color: C.cyan, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{selectedElement.type === 'custom_img' ? '🖼️' : selectedElement.content}</span>
                    <span>SELECTED ITEM CONTROLS</span>
                  </div>
                  <button onClick={() => deleteElement()} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 10px rgba(239,68,68,0.4)' }}>
                    🗑️ Delete Item
                  </button>
                </div>

                {/* Size Scale Slider */}
                <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.orange }}>Size Scale: {(selectedElement.scale || 1).toFixed(1)}x</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2.5" 
                    step="0.1" 
                    value={selectedElement.scale || 1} 
                    onChange={e => {
                      const newScale = Number(e.target.value);
                      setPages(prev => {
                        const next = [...prev];
                        const page = next[currentPageIdx];
                        const panel = page.panels[activePanelIdx];
                        panel.elements = panel.elements.map(el => el.id === selectedElementId ? { ...el, scale: newScale } : el);
                        return next;
                      });
                    }}
                    style={{ flex: 1, cursor: 'pointer', accentColor: C.orange }}
                  />
                </div>

                {/* Transform Actions Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                  <button onClick={() => scaleElement(0.2)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                    🔍 Bigger (+)
                  </button>
                  <button onClick={() => scaleElement(-0.2)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                    🔎 Smaller (-)
                  </button>
                  <button onClick={flipElement} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                    ↔️ Flip
                  </button>
                  <button onClick={() => rotateElement(-15)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>
                    🔄 Rotate -15°
                  </button>
                  <button onClick={() => rotateElement(15)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>
                    🔁 Rotate +15°
                  </button>
                  <button onClick={() => deleteElement()} style={{ padding: '8px', background: '#ef444422', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 8, fontWeight: 900, fontSize: 11, cursor: 'pointer' }}>
                    🗑️ Remove
                  </button>
                </div>

                {/* Move D-Pad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  <div />
                  <button onClick={() => moveElement(0, -8)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontWeight: 900 }}>⬆️</button>
                  <div />
                  <button onClick={() => moveElement(-8, 0)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontWeight: 900 }}>⬅️</button>
                  <button onClick={() => moveElement(0, 8)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontWeight: 900 }}>⬇️</button>
                  <button onClick={() => moveElement(8, 0)} style={{ padding: '8px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontWeight: 900 }}>➡️</button>
                </div>
              </div>
            )}

            {/* Scene Background Picker */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.cyan, marginBottom: 10 }}>
                1. PANEL #{activePanelIdx + 1} SCENE BACKGROUND
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {SCENES.map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => handleSetScene(sc)}
                    style={{
                      padding: '8px 4px',
                      background: currentPanel.scene.id === sc.id ? C.cyan : C.card2,
                      color: currentPanel.scene.id === sc.id ? '#000' : '#fff',
                      border: `1px solid ${currentPanel.scene.id === sc.id ? '#fff' : C.border}`,
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
                    <span style={{ fontSize: 20 }}>{sc.icon}</span>
                    <span>{sc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Characters Arsenal with Human Characters & Custom Photo Upload */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: C.green }}>2. CHARACTERS & HEROES</div>
                <button 
                  onClick={() => customCharInputRef.current && customCharInputRef.current.click()}
                  style={{ background: C.green, color: '#000', border: 'none', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer' }}
                >
                  📸 Upload My Photo
                </button>
              </div>

              {/* Character Category Switcher */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {[
                  { id: 'humans', label: '🧑 Humans & Heroes' },
                  { id: 'animals', label: '🦁 Animals & Fantasy' },
                  { id: 'custom', label: '📸 My Custom Photos' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setCharacterTab(t.id)}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      background: characterTab === t.id ? C.green : C.card2,
                      color: characterTab === t.id ? '#000' : '#fff',
                      border: `1px solid ${characterTab === t.id ? '#fff' : C.border}`,
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Character Grid */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {characterTab === 'humans' && HUMAN_CHARACTERS.map(c => (
                  <button
                    key={c}
                    onClick={() => addElement('char', c)}
                    style={{ fontSize: 24, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {c}
                  </button>
                ))}

                {characterTab === 'animals' && FANTASY_ANIMALS.map(c => (
                  <button
                    key={c}
                    onClick={() => addElement('char', c)}
                    style={{ fontSize: 24, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {c}
                  </button>
                ))}

                {characterTab === 'custom' && (
                  customCharacters.length === 0 ? (
                    <div style={{ width: '100%', textAlign: 'center', padding: 12, color: C.muted, fontSize: 12 }}>
                      Abhi koi custom photo upload nahi hua hai. <strong>"📸 Upload My Photo"</strong> dabakar apni ya drawing ki photo dalein!
                    </div>
                  ) : (
                    customCharacters.map((imgSrc, idx) => (
                      <button
                        key={idx}
                        onClick={() => addElement('custom_img', imgSrc)}
                        style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, width: 44, height: 44, padding: 2, cursor: 'pointer', overflow: 'hidden' }}
                      >
                        <img src={imgSrc} alt="Custom" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                      </button>
                    ))
                  )
                )}
              </div>
            </div>

            {/* Add Speech Bubbles & Sound FX */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.purple, marginBottom: 10 }}>
                3. DIALOGUE & SPEECH BUBBLES
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                <button onClick={() => handleAddBubble('speech')} style={{ padding: '10px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                  💬 Speech
                </button>
                <button onClick={() => handleAddBubble('thought')} style={{ padding: '10px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                  💭 Thought
                </button>
                <button onClick={() => handleAddBubble('shout')} style={{ padding: '10px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                  💥 Shout
                </button>
              </div>

              <div style={{ fontWeight: 800, fontSize: 12, color: C.orange, marginBottom: 8 }}>ACTION SFX BADGES:</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SFX.map(s => (
                  <button
                    key={s}
                    onClick={() => addElement('sfx', s)}
                    style={{ padding: '4px 8px', background: '#dc2626', color: '#fef08a', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Props & Objects */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.yellow, marginBottom: 8 }}>
                4. PROPS & OBJECTS
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PROPS.map(p => (
                  <button
                    key={p}
                    onClick={() => addElement('prop', p)}
                    style={{ fontSize: 22, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, width: 42, height: 42, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {p}
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