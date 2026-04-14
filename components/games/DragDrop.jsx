"use client";
import { useState } from "react";

const C = {
  card: "#0f1520", card2: "#161e30", border: "#1e2d45",
  pink: "#ec4899", green: "#10b981", red: "#ef4444",
  text: "#f1f5f9", muted: "#64748b",
};

const PAIRS = [
  { id: 'in', item: '🇮🇳 India', target: 'Delhi' },
  { id: 'us', item: '🇺🇸 USA', target: 'Washington D.C.' },
  { id: 'jp', item: '🇯🇵 Japan', target: 'Tokyo' },
  { id: 'fr', item: '🇫🇷 France', target: 'Paris' },
];

export default function DragDropGame() {
  const [items, setItems] = useState(PAIRS.map(p => p.item).sort(() => Math.random() - 0.5));
  const [targets, setTargets] = useState(PAIRS.map(p => ({ name: p.target, droppedItem: null })));
  const [draggedItem, setDraggedItem] = useState(null);
  const [feedback, setFeedback] = useState({});

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDrop = (targetName) => {
    if (!draggedItem) return;

    const correctPair = PAIRS.find(p => p.item === draggedItem);
    const isCorrect = correctPair && correctPair.target === targetName;

    setFeedback(f => ({ ...f, [targetName]: isCorrect ? 'correct' : 'wrong' }));

    if (isCorrect) {
      setTargets(ts => ts.map(t => t.name === targetName ? { ...t, droppedItem: draggedItem } : t));
      setItems(is => is.filter(i => i !== draggedItem));
    }
    
    setDraggedItem(null);
  };

  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 16, color: C.pink, marginBottom: 4 }}>🌍 Drag & Drop Match</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Country ko uski Capital se match karo!</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        {/* Draggable Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <div
              key={item}
              draggable
              onDragStart={() => handleDragStart(item)}
              style={{ padding: '10px 14px', background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'grab', fontWeight: 700 }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Drop Targets */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 180 }}>
          {targets.map(target => (
            <div
              key={target.name}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(target.name)}
              style={{ padding: '10px 14px', background: C.card2, border: `2px dashed ${feedback[target.name] === 'correct' ? C.green : feedback[target.name] === 'wrong' ? C.red : C.border}`, borderRadius: 10, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color .2s' }}
            >
              <span style={{ color: C.muted }}>{target.name}</span>
              {target.droppedItem && <span style={{ fontWeight: 700 }}>{target.droppedItem}</span>}
            </div>
          ))}
        </div>
      </div>
      
      {items.length === 0 && (
        <div style={{ marginTop: 20, textAlign: 'center', color: C.green, fontWeight: 800, fontSize: 16 }}>🎉 Well Done! All Matched!</div>
      )}
    </div>
  );
}
