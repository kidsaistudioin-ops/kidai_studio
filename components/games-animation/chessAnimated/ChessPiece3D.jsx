'use client';
import React from 'react';

/**
 * 👑 3D REAL KINGDOM CHARACTER CHESS PIECES
 * Renders living kingdom characters:
 * - P (Piddi/Sainik): Armored Royal Soldier with Shield & Spear
 * - R (Hathi/Rook): Royal War Elephant with Castle Howdah & Golden Tusks
 * - N (Ghoda/Knight): Armored Royal War Steed
 * - B (Oont/Mantri/Bishop): Royal Vizier Sage with Staff & Robes
 * - Q (Rani/Queen): Elegant Empress with Gemstone Tiara & Sceptre
 * - K (Raja/King): Imperial Maharaja with Crown & Royal Sword
 */
export default function ChessPiece3D({ type = 'P', color = 'white' }) {
  const isWhite = color === 'white';
  const p = type ? type.toUpperCase() : 'P';

  // Theme palettes: White (Sun Kingdom) vs Black (Shadow Dragon Kingdom)
  const T = isWhite ? {
    primary: '#ffffff',
    secondary: '#e2e8f0',
    dark: '#94a3b8',
    deep: '#475569',
    gold: '#f59e0b',
    goldLight: '#fef08a',
    accent: '#06b6d4',
    cloth: '#3b82f6',
    skin: '#ffdfba',
    shadow: 'rgba(0,0,0,0.5)'
  } : {
    primary: '#1e293b',
    secondary: '#0f172a',
    dark: '#020617',
    deep: '#000000',
    gold: '#ec4899', // Ruby gold
    goldLight: '#fbcfe8',
    accent: '#ef4444',
    cloth: '#7c3aed',
    skin: '#fcd34d',
    shadow: 'rgba(0,0,0,0.7)'
  };

  return (
    <svg 
      viewBox="0 0 100 120" 
      style={{ 
        width: '94%', height: '94%', 
        filter: `drop-shadow(0 6px 10px ${T.shadow})`,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer'
      }}
    >
      <defs>
        {/* Shading Gradients */}
        <radialGradient id={`charHeadGrad_${color}_${p}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#475569'} />
          <stop offset="60%" stopColor={T.primary} />
          <stop offset="100%" stopColor={T.dark} />
        </radialGradient>
        <linearGradient id={`armorGrad_${color}_${p}`} x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#475569'} />
          <stop offset="40%" stopColor={T.primary} />
          <stop offset="85%" stopColor={T.dark} />
          <stop offset="100%" stopColor={T.deep} />
        </linearGradient>
        <linearGradient id={`goldGrad_${color}_${p}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={T.goldLight} />
          <stop offset="60%" stopColor={T.gold} />
          <stop offset="100%" stopColor={isWhite ? '#b45309' : '#9d174d'} />
        </linearGradient>
      </defs>

      {/* 3D Contact Shadow on Board */}
      <ellipse cx="50" cy="114" rx="36" ry="6" fill={T.shadow} />

      {/* 3D Circular Pedestal Ground Base */}
      <ellipse cx="50" cy="108" rx="34" ry="8" fill={`url(#armorGrad_${color}_${p})`} stroke={T.deep} strokeWidth="1" />
      <ellipse cx="50" cy="104" rx="30" ry="6" fill={`url(#armorGrad_${color}_${p})`} />
      <ellipse cx="50" cy="100" rx="26" ry="4" fill={`url(#goldGrad_${color}_${p})`} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 🛡️ PAWN (PIDDI / SAINIK - ROYAL FOOT SOLDIER) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {p === 'P' && (
        <g>
          {/* Soldier Legs & Boots */}
          <rect x="38" y="85" width="8" height="16" rx="3" fill={T.deep} />
          <rect x="54" y="85" width="8" height="16" rx="3" fill={T.deep} />

          {/* Armored Torso / Breastplate */}
          <path d="M 32 60 C 32 50, 68 50, 68 60 L 64 88 C 64 90, 36 90, 36 88 Z" fill={`url(#armorGrad_${color}_${p})`} stroke={T.deep} strokeWidth="1" />
          <path d="M 40 62 L 50 78 L 60 62" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Left Hand: Round Shield with Emblem */}
          <circle cx="24" cy="68" r="14" fill={`url(#armorGrad_${color}_${p})`} stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="2" />
          <circle cx="24" cy="68" r="7" fill={`url(#goldGrad_${color}_${p})`} />
          <text x="24" y="71" fontSize="7" fontWeight="bold" textAnchor="middle" fill={isWhite ? "#000" : "#fff"}>⚔️</text>

          {/* Right Hand: Golden Spear */}
          <line x1="76" y1="18" x2="76" y2="102" stroke="#94a3b8" strokeWidth="2.5" />
          <polygon points="76,10 72,22 80,22" fill={`url(#goldGrad_${color}_${p})`} />

          {/* Knight Visor Helmet Head */}
          <circle cx="50" cy="36" r="16" fill={`url(#charHeadGrad_${color}_${p})`} stroke={T.deep} strokeWidth="1" />
          {/* Helmet Visor Slit */}
          <rect x="40" y="34" width="20" height="5" rx="2" fill={T.deep} />
          <rect x="42" y="35" width="16" height="2" fill={T.goldLight} />
          {/* Plume Crest on Top */}
          <path d="M 50 20 C 44 10, 56 10, 50 5 C 40 10, 42 20, 50 20 Z" fill={`url(#goldGrad_${color}_${p})`} />
        </g>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 🐘 ROOK (HATHI - ROYAL WAR ELEPHANT WITH CASTLE HOWDAH) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {p === 'R' && (
        <g>
          {/* Elephant Body */}
          <ellipse cx="50" cy="74" rx="24" ry="18" fill={`url(#armorGrad_${color}_${p})`} stroke={T.deep} strokeWidth="1" />
          {/* Strong Pillar Legs */}
          <rect x="34" y="80" width="9" height="22" rx="4" fill={T.deep} />
          <rect x="57" y="80" width="9" height="22" rx="4" fill={T.deep} />

          {/* Elephant Head & Large Ears */}
          <ellipse cx="28" cy="58" rx="8" ry="12" fill={T.dark} /> {/* Left Ear */}
          <ellipse cx="72" cy="58" rx="8" ry="12" fill={T.dark} /> {/* Right Ear */}
          <circle cx="50" cy="58" r="16" fill={`url(#charHeadGrad_${color}_${p})`} stroke={T.deep} strokeWidth="1" />

          {/* Curled Trunk Upwards */}
          <path d="M 50 64 C 50 78, 44 86, 38 84 C 34 82, 36 74, 42 74" fill="none" stroke={T.primary} strokeWidth="6" strokeLinecap="round" />

          {/* Golden Tusks */}
          <path d="M 40 66 Q 32 68 30 60" fill="none" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="3" strokeLinecap="round" />
          <path d="M 60 66 Q 68 68 70 60" fill="none" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="3" strokeLinecap="round" />

          {/* Eyes & Headcloth */}
          <circle cx="43" cy="54" r="2.5" fill="#0f172a" />
          <circle cx="57" cy="54" r="2.5" fill="#0f172a" />
          <polygon points="50,42 42,52 58,52" fill={`url(#goldGrad_${color}_${p})`} />

          {/* Castle Howdah Turret on Back */}
          <path d="M 32 40 L 32 20 L 38 20 L 38 26 L 46 26 L 46 20 L 54 20 L 54 26 L 62 26 L 62 20 L 68 20 L 68 40 Z" fill={`url(#armorGrad_${color}_${p})`} stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="1.5" />
        </g>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 🐎 KNIGHT (GHODA - ARMORED ROYAL WAR STEED) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {p === 'N' && (
        <g>
          {/* Horse Neck & Body */}
          <path d="M 32 98 C 34 80, 36 68, 40 58 L 60 58 C 64 68, 66 80, 68 98 Z" fill={`url(#armorGrad_${color}_${p})`} />

          {/* Sculpted Horse Head Arch */}
          <path d="M 40 58 C 28 46, 22 30, 32 20 C 36 14, 44 10, 52 8 C 55 2, 60 2, 62 6 C 66 6, 74 12, 78 26 C 82 42, 72 54, 62 58 Z" fill={`url(#charHeadGrad_${color}_${p})`} stroke={T.deep} strokeWidth="1.2" />

          {/* Horse Muzzle & Nostril */}
          <path d="M 26 28 C 18 34, 20 45, 30 46 L 36 42 Z" fill={`url(#armorGrad_${color}_${p})`} />
          <circle cx="25" cy="36" r="1.5" fill={T.deep} />

          {/* Fierce Eye */}
          <circle cx="42" cy="24" r="3" fill={isWhite ? "#0f172a" : T.gold} />
          <circle cx="41" cy="23" r="1" fill="#fff" />

          {/* Armored Mane Spikes & Bridle */}
          <path d="M 54 8 L 52 18 M 62 12 L 60 22 M 70 20 L 66 32 M 74 30 L 70 42" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="3" strokeLinecap="round" />
          <path d="M 32 30 L 46 22 M 42 22 L 52 38" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="1.8" fill="none" />
        </g>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 🧙‍♂️ BISHOP (OONT / MANTRI / VIZIER - ROYAL CHANCELLOR) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {p === 'B' && (
        <g>
          {/* Flowing Royal Robes */}
          <path d="M 30 98 C 32 70, 36 50, 42 45 L 58 45 C 64 50, 68 70, 70 98 Z" fill={`url(#armorGrad_${color}_${p})`} stroke={T.deep} strokeWidth="1" />
          <path d="M 50 45 L 50 98" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="2" />

          {/* Left Hand: Glowing Crystal Staff */}
          <line x1="22" y1="20" x2="22" y2="102" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="2.5" />
          <circle cx="22" cy="16" r="6" fill={T.accent} stroke="#fff" strokeWidth="1" />

          {/* Sage Head & Mitre Hood */}
          <circle cx="50" cy="34" r="14" fill={`url(#charHeadGrad_${color}_${p})`} />
          {/* Wise Beard */}
          <path d="M 42 38 C 42 54, 58 54, 58 38 Z" fill={isWhite ? "#ffffff" : "#475569"} stroke={T.deep} strokeWidth="0.8" />

          {/* Bishop High Mitre Cap */}
          <path d="M 34 32 C 32 16, 42 6, 50 4 C 58 6, 68 16, 66 32 Z" fill={`url(#armorGrad_${color}_${p})`} stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="1.2" />
          {/* Mitre Slash Cut Cross */}
          <path d="M 44 14 L 56 22" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="3" r="3.5" fill={`url(#goldGrad_${color}_${p})`} />
        </g>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 👑 QUEEN (RANI / MAHARANI - ROYAL EMPRESS) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {p === 'Q' && (
        <g>
          {/* Flowing Regal Gown with Waistline */}
          <path d="M 28 98 C 30 70, 38 52, 42 44 L 58 44 C 62 52, 70 70, 72 98 Z" fill={`url(#armorGrad_${color}_${p})`} stroke={T.deep} strokeWidth="1" />
          <ellipse cx="50" cy="44" rx="14" ry="4" fill={`url(#goldGrad_${color}_${p})`} />

          {/* Royal Sceptre in Hand */}
          <line x1="76" y1="26" x2="76" y2="98" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="2" />
          <polygon points="76,18 72,26 80,26" fill={T.accent} />

          {/* Queen Beautiful Face & Hair */}
          <circle cx="50" cy="30" r="14" fill={`url(#charHeadGrad_${color}_${p})`} />
          {/* Hair Waves */}
          <path d="M 34 26 C 30 38, 32 46, 36 50 M 66 26 C 70 38, 68 46, 64 50" stroke={T.gold} strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* 7-Point Flared Empress Crown */}
          <path d="M 32 25 L 26 6 L 36 16 L 50 3 L 64 16 L 74 6 L 68 25 Z" fill={`url(#goldGrad_${color}_${p})`} stroke={T.deep} strokeWidth="0.8" />
          {/* Crown Jewels */}
          <circle cx="26" cy="5" r="2.5" fill={T.accent} />
          <circle cx="50" cy="2" r="3.5" fill={T.accent} />
          <circle cx="74" cy="5" r="2.5" fill={T.accent} />
        </g>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 🤴 KING (RAJA / MAHARAJA - IMPERIAL EMPEROR) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {p === 'K' && (
        <g>
          {/* Imperial Cape & Armor */}
          <path d="M 26 98 C 28 65, 36 46, 42 40 L 58 40 C 64 46, 72 65, 74 98 Z" fill={`url(#armorGrad_${color}_${p})`} stroke={T.deep} strokeWidth="1.2" />
          {/* Golden Royal Collar Mantle */}
          <path d="M 32 42 Q 50 56 68 42 L 64 54 Q 50 66 36 54 Z" fill={`url(#goldGrad_${color}_${p})`} />

          {/* Right Hand: Imperial Sword of Power */}
          <line x1="78" y1="28" x2="78" y2="102" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="72" y1="40" x2="84" y2="40" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="3" strokeLinecap="round" />
          <circle cx="78" cy="26" r="3" fill={`url(#goldGrad_${color}_${p})`} />

          {/* Emperor Face with Royal Moustache */}
          <circle cx="50" cy="28" r="15" fill={`url(#charHeadGrad_${color}_${p})`} />
          {/* Royal Moustache */}
          <path d="M 44 33 Q 50 36 56 33" stroke={T.deep} strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Majestic Royal Crown */}
          <path d="M 30 24 C 28 10, 40 4, 50 3 C 60 4, 72 10, 70 24 Z" fill={`url(#goldGrad_${color}_${p})`} stroke={T.deep} strokeWidth="1" />
          <rect x="36" y="16" width="28" height="4" rx="2" fill={T.accent} />
          {/* Supreme Royal Cross on Top */}
          <path d="M 50 0 L 50 8 M 46 3 L 54 3" stroke={`url(#goldGrad_${color}_${p})`} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

    </svg>
  );
}
