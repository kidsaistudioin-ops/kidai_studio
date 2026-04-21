'use client';
import React from 'react';

export default function Player({ position = 1, color = 'red', imageSrc = '/characters/player.svg' }) {
  // 🧠 ZIG-ZAG MATH LOGIC FOR 10x10 BOARD
  // Position 1 is Bottom-Left. Position 100 is Top-Left.
  const getCoordinates = (pos) => {
    if (pos < 1) pos = 1;
    if (pos > 100) pos = 100;
    
    const zeroBased = pos - 1;
    const row = Math.floor(zeroBased / 10); // 0 se 9 (0 sabse niche wali line hai)
    const col = zeroBased % 10; // 0 se 9
    
    // Zig-Zag Logic: Agar row even hai toh left-to-right, odd hai toh right-to-left
    const x = row % 2 === 0 ? col : 9 - col;
    const y = 9 - row; // 9 bottom hai, 0 top hai
    
    return { x, y };
  };

  const { x, y } = getCoordinates(position);

  return (
    <div style={{
      position: 'absolute',
      left: `${x * 10}%`,
      top: `${y * 10}%`,
      width: '10%',
      height: '10%',
      transition: 'all 0.4s ease-in-out', // Yeh har step aur snake/ladder jump ko smooth banayega
      display: 'flex',
      alignItems: 'flex-end', // Goti ko dabbe ke bottom par khada karega
      justifyContent: 'center',
      zIndex: 10,
      pointerEvents: 'none'
    }}>
      <img 
        src={imageSrc} 
        alt="player"
        style={{
          width: '140%', // Image ko thoda bada kiya
          height: '160%', // Height badhayi taaki character khada (standing) dikhe, kata hua nahi
          objectFit: 'contain', // "cover" ki jagah "contain" lagaya taaki legs na katein
          transform: 'translateY(-15%)', // Thoda hawa me uthaya taaki base par sahi se fit ho
          filter: `drop-shadow(0 5px 8px rgba(0,0,0,0.5))` // 3D Shadow effect
        }}
      />
    </div>
  );
}