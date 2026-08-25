'use client';
import React from 'react';

// ── 3D CHARACTER AVATAR SVG BUILDER ──
const CharacterAvatar3D = ({ type = 'boy', emotion = 'normal' }) => {
  const isSad = emotion === 'sad';
  const isWin = emotion === 'win';
  const isHappy = emotion === 'happy' || isWin;

  // Character Color Schemes & Themes
  const themes = {
    boy: { skin: '#ffdfba', hair: '#78350f', shirt: '#ea580c', shirtLight: '#fb923c', accent: '#fef08a' },
    girl: { skin: '#ffdfba', hair: '#db2777', shirt: '#9333ea', shirtLight: '#c084fc', accent: '#38bdf8' },
    robot: { skin: '#94a3b8', hair: '#0284c7', shirt: '#0f766e', shirtLight: '#2dd4bf', accent: '#e0e7ff' },
    ninja: { skin: '#fcd34d', hair: '#1e293b', shirt: '#4338ca', shirtLight: '#6366f1', accent: '#ef4444' },
  };

  const t = themes[type] || themes.boy;

  return (
    <svg 
      viewBox="0 0 100 120" 
      style={{ 
        width: '100%', height: '100%', 
        filter: isWin ? 'drop-shadow(0 0 10px #f59e0b) drop-shadow(0 6px 8px rgba(0,0,0,0.5))' : 'drop-shadow(0 6px 8px rgba(0,0,0,0.5))',
        transform: isHappy ? 'translateY(-10%) scale(1.08)' : isSad ? 'translateY(5%) scale(0.95)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <defs>
        {/* Shading Gradients */}
        <radialGradient id={`headGrad_${type}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fff2e0" />
          <stop offset="60%" stopColor={t.skin} />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <linearGradient id={`bodyGrad_${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={t.shirtLight} />
          <stop offset="70%" stopColor={t.shirt} />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>

      {/* 3D Drop Shadow */}
      <ellipse cx="50" cy="114" rx="30" ry="6" fill="rgba(0,0,0,0.4)" />

      {/* Legs */}
      <rect x="36" y="88" width="10" height="20" rx="5" fill="#1e293b" />
      <rect x="54" y="88" width="10" height="20" rx="5" fill="#1e293b" />
      {/* 3D Shoes */}
      <ellipse cx="41" cy="108" rx="8" ry="4" fill="#0f172a" />
      <ellipse cx="59" cy="108" rx="8" ry="4" fill="#0f172a" />

      {/* Torso / Clothes */}
      <path d="M 28 56 C 28 50, 72 50, 72 56 L 68 90 C 68 93, 32 93, 32 90 Z" fill={`url(#bodyGrad_${type})`} />

      {/* Emblem / Star Badge on Chest */}
      <circle cx="50" cy="70" r="7" fill={t.accent} />
      <text x="50" y="74" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#000">★</text>

      {/* Arms */}
      <ellipse cx="24" cy="70" rx="5" ry="14" fill={t.shirt} transform={isHappy ? 'rotate(-25 24 70)' : 'rotate(10 24 70)'} />
      <ellipse cx="76" cy="70" rx="5" ry="14" fill={t.shirt} transform={isHappy ? 'rotate(25 76 70)' : 'rotate(-10 76 70)'} />

      {/* Head Sphere */}
      <circle cx="50" cy="35" r="22" fill={`url(#headGrad_${type})`} />

      {/* Hair / Headgear */}
      {type === 'boy' && (
        <path d="M 28 30 C 28 15, 72 15, 72 30 C 65 20, 50 18, 28 30 Z" fill={t.hair} />
      )}
      {type === 'girl' && (
        <>
          <path d="M 26 35 C 26 12, 74 12, 74 35 C 76 50, 80 55, 76 60 C 72 45, 68 30, 68 30 C 50 20, 32 30, 26 35 Z" fill={t.hair} />
          <circle cx="70" cy="22" r="5" fill="#f43f5e" />
        </>
      )}
      {type === 'robot' && (
        <>
          <rect x="47" y="5" width="6" height="10" fill="#0284c7" />
          <circle cx="50" cy="5" r="4" fill="#38bdf8" />
          <rect x="25" y="20" width="50" height="28" rx="6" fill="#475569" />
          <rect x="30" y="24" width="40" height="18" rx="4" fill="#0f172a" />
        </>
      )}
      {type === 'ninja' && (
        <>
          <path d="M 28 20 C 35 15, 65 15, 72 20 L 72 35 L 28 35 Z" fill="#0f172a" />
          <rect x="28" y="26" width="44" height="6" fill="#ef4444" />
        </>
      )}

      {/* Eyes */}
      {isSad ? (
        <>
          <path d="M 38 36 Q 43 32 48 36" stroke="#000" strokeWidth="2.5" fill="none" />
          <path d="M 52 36 Q 57 32 62 36" stroke="#000" strokeWidth="2.5" fill="none" />
          <circle cx="38" cy="44" r="3" fill="#38bdf8" /> {/* Tear */}
        </>
      ) : isHappy ? (
        <>
          <path d="M 38 36 Q 43 40 48 36" stroke="#000" strokeWidth="2.5" fill="none" />
          <path d="M 52 36 Q 57 40 62 36" stroke="#000" strokeWidth="2.5" fill="none" />
        </>
      ) : (
        <>
          <circle cx="42" cy="35" r="3" fill={type === 'robot' ? '#38bdf8' : '#0f172a'} />
          <circle cx="58" cy="35" r="3" fill={type === 'robot' ? '#38bdf8' : '#0f172a'} />
          <circle cx="41" cy="34" r="1" fill="#ffffff" />
          <circle cx="57" cy="34" r="1" fill="#ffffff" />
        </>
      )}

      {/* Mouth */}
      {isSad ? (
        <path d="M 44 48 Q 50 42 56 48" stroke="#000" strokeWidth="2" fill="none" />
      ) : isHappy ? (
        <path d="M 42 44 Q 50 54 58 44 Z" fill="#e11d48" />
      ) : (
        <path d="M 44 45 Q 50 50 56 45" stroke="#000" strokeWidth="2" fill="none" />
      )}
    </svg>
  );
};

export default function Player({ emotion = 'normal', type = 'boy' }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      pointerEvents: 'none'
    }}>
      <CharacterAvatar3D type={type} emotion={emotion} />
    </div>
  );
}