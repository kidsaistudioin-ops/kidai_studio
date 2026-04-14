"use client";
import { useState } from "react";

export default function Dice({ onRoll, disabled }) {
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (disabled || rolling) return;
    setRolling(true);
    
    // 🔊 Dice Sound
    try {
      const audio = new Audio('/sounds/dice.mp3');
      audio.play().catch(e => console.log("Audio error", e));
    } catch(e) {}

    let counter = 0;
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setValue(finalValue);
        setRolling(false);
        onRoll(finalValue);
      }
    }, 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button 
        onClick={rollDice} 
        disabled={disabled || rolling}
        style={{ 
          width: 60, height: 60, 
          background: disabled || rolling ? '#334155' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
          border: 'none', borderRadius: 16, 
          color: '#fff', fontSize: 32, fontWeight: 900, 
          cursor: disabled || rolling ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: disabled || rolling ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.4)',
          transform: rolling ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.2s'
        }}
      >
        {value}
      </button>
      <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>
        {rolling ? "Rolling..." : "Tap to Roll 🎲"}
      </div>
    </div>
  );
}