export default function Player({ emotion, type = 'boy' }) {
  // CSS class selector based on emotion
  const getAnimation = () => {
    switch (emotion) {
      case "walk_normal":
        return "mario-walk 0.4s infinite alternate ease-in-out";
      case "walk_fast":
        return "mario-fast 0.2s infinite alternate ease-in-out";
      case "ladder":
        return "mario-climb 0.3s infinite alternate";
      case "snake":
        return "mario-fall 1.5s forwards ease-in";
      case "win":
        return "mario-win 1s infinite";
      default:
        return "none";
    }
  };

  const playerClass = `player-${emotion.replace('_', '-')}`;

  return (
    <div className={playerClass} style={{ width: 36, height: 36, animation: getAnimation(), filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))', zIndex: 50 }}>
      <style>{`
        @keyframes mario-walk { 0% { transform: translateY(0); } 100% { transform: translateY(-4px) scale(1.05); } }
        @keyframes mario-fast { 0% { transform: translateY(0) scale(1) rotate(5deg); } 100% { transform: translateY(-8px) scale(1.1) rotate(-5deg); } }
        @keyframes mario-climb { 0% { transform: translateY(0) scale(1.1); } 100% { transform: translateY(-4px) scale(1.1); } }
        @keyframes mario-fall { 0% { transform: rotate(0) scale(1); opacity: 1; } 100% { transform: rotate(1080deg) scale(0.4); opacity: 0; } }
        @keyframes mario-win { 0% { transform: scale(1) rotate(0); } 50% { transform: scale(1.4) rotate(15deg); } 100% { transform: scale(1) rotate(0); } }

        @keyframes swing-leg-left { 0% { transform: translateY(0) rotate(20deg); } 100% { transform: translateY(-2px) rotate(-20deg); } }
        @keyframes swing-leg-right { 0% { transform: translateY(-2px) rotate(-20deg); } 100% { transform: translateY(0) rotate(20deg); } }
        @keyframes swing-hand-front { 0% { transform: rotate(-25deg); } 100% { transform: rotate(25deg); } }
        @keyframes swing-hand-back { 0% { transform: rotate(25deg); } 100% { transform: rotate(-25deg); } }
        
        .leg-left, .leg-right, .hand-front, .hand-back { transform-box: fill-box; transform-origin: top center; }
        
        .player-walk-normal .leg-left { animation: swing-leg-left 0.25s infinite alternate ease-in-out; }
        .player-walk-normal .leg-right { animation: swing-leg-right 0.25s infinite alternate ease-in-out; }
        .player-walk-normal .hand-front { animation: swing-hand-front 0.25s infinite alternate ease-in-out; }
        .player-walk-normal .hand-back { animation: swing-hand-back 0.25s infinite alternate ease-in-out; }
        
        .player-walk-fast .leg-left { animation: swing-leg-left 0.12s infinite alternate ease-in-out; }
        .player-walk-fast .leg-right { animation: swing-leg-right 0.12s infinite alternate ease-in-out; }
        .player-walk-fast .hand-front { animation: swing-hand-front 0.12s infinite alternate ease-in-out; }
        .player-walk-fast .hand-back { animation: swing-hand-back 0.12s infinite alternate ease-in-out; }
        
        .player-ladder .leg-left { animation: swing-leg-left 0.4s infinite alternate ease-in-out; }
        .player-ladder .leg-right { animation: swing-leg-right 0.4s infinite alternate ease-in-out; }
        .player-ladder .hand-front { animation: swing-hand-front 0.4s infinite alternate ease-in-out; }
        .player-ladder .hand-back { animation: swing-hand-back 0.4s infinite alternate ease-in-out; }
      `}</style>
      
      {/* 4 Alag Alag Characters */}
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {type === 'boy' && (
          <g>
            <rect className="hand-back" x="30" y="45" width="10" height="22" fill="#eab308" rx="5" />
            <rect className="leg-left" x="38" y="72" width="10" height="18" fill="#118AB2" rx="4"/>
            <rect className="leg-right" x="52" y="72" width="10" height="18" fill="#118AB2" rx="4"/>
            <rect className="body" x="35" y="45" width="30" height="30" fill="#06D6A0" rx="8"/>
            <circle cx="50" cy="30" r="16" fill="#FFD166"/>
            <circle cx="44" cy="27" r="2.5" fill="#000"/>
            <circle cx="56" cy="27" r="2.5" fill="#000"/>
            {emotion === 'snake' ? <path d="M44 36 Q50 30 56 36" stroke="#000" strokeWidth="2" fill="transparent"/> : <path d="M44 34 Q50 40 56 34" stroke="#000" strokeWidth="2" fill="transparent"/>}
            <rect className="hand-front" x="60" y="45" width="10" height="22" fill="#f59e0b" rx="5" />
          </g>
        )}
        {type === 'girl' && (
          <g>
            <rect className="hand-back" x="30" y="45" width="10" height="22" fill="#f472b6" rx="5" />
            <rect className="leg-left" x="38" y="72" width="10" height="18" fill="#a855f7" rx="4"/>
            <rect className="leg-right" x="52" y="72" width="10" height="18" fill="#a855f7" rx="4"/>
            <path className="body" d="M35 45 L65 45 L70 75 L30 75 Z" fill="#ec4899"/>
            <circle cx="50" cy="30" r="16" fill="#fde047"/>
            <path d="M34 30 Q50 10 66 30 L68 45 L64 45 L64 30 Q50 18 36 30 L36 45 L32 45 Z" fill="#78350f"/>
            <circle cx="44" cy="27" r="2.5" fill="#000"/>
            <circle cx="56" cy="27" r="2.5" fill="#000"/>
            {emotion === 'snake' ? <path d="M44 36 Q50 30 56 36" stroke="#000" strokeWidth="2" fill="transparent"/> : <path d="M44 34 Q50 40 56 34" stroke="#000" strokeWidth="2" fill="transparent"/>}
            <rect className="hand-front" x="60" y="45" width="10" height="22" fill="#db2777" rx="5" />
          </g>
        )}
        {type === 'robot' && (
          <g>
            <rect className="hand-back" x="30" y="45" width="10" height="22" fill="#94a3b8" rx="2" />
            <rect className="leg-left" x="38" y="72" width="10" height="18" fill="#64748b" rx="2"/>
            <rect className="leg-right" x="52" y="72" width="10" height="18" fill="#64748b" rx="2"/>
            <rect className="body" x="35" y="45" width="30" height="30" fill="#cbd5e1" rx="4"/>
            <rect x="34" y="14" width="32" height="32" fill="#94a3b8" rx="4"/>
            <line x1="50" y1="14" x2="50" y2="6" stroke="#64748b" strokeWidth="3"/>
            <circle cx="50" cy="4" r="4" fill="#ef4444"/>
            {emotion === 'snake' ? (
              <g><line x1="40" y1="22" x2="48" y2="28" stroke="#ef4444" strokeWidth="3"/><line x1="52" y1="28" x2="60" y2="22" stroke="#ef4444" strokeWidth="3"/></g>
            ) : (
              <g><rect x="40" y="22" width="8" height="8" fill="#ef4444" rx="2"/><rect x="52" y="22" width="8" height="8" fill="#ef4444" rx="2"/></g>
            )}
            {emotion === 'snake' ? <path d="M42 36 Q50 30 58 36" stroke="#1e293b" strokeWidth="3" fill="transparent"/> : <line x1="42" y1="36" x2="58" y2="36" stroke="#1e293b" strokeWidth="3"/>}
            <rect className="hand-front" x="60" y="45" width="10" height="22" fill="#64748b" rx="2" />
          </g>
        )}
        {type === 'ninja' && (
          <g>
            <rect className="hand-back" x="30" y="45" width="10" height="22" fill="#334155" rx="5" />
            <rect className="leg-left" x="38" y="72" width="10" height="18" fill="#1e293b" rx="4"/>
            <rect className="leg-right" x="52" y="72" width="10" height="18" fill="#1e293b" rx="4"/>
            <rect className="body" x="35" y="45" width="30" height="30" fill="#0f172a" rx="8"/>
            <rect x="35" y="65" width="30" height="4" fill="#ef4444"/>
            <circle cx="50" cy="30" r="16" fill="#0f172a"/>
            <rect x="36" y="22" width="28" height="10" fill="#fde047" rx="4"/>
            {emotion === 'snake' ? (
              <g><circle cx="44" cy="27" r="3" fill="#ef4444"/><circle cx="56" cy="27" r="3" fill="#ef4444"/></g>
            ) : (
              <g><circle cx="44" cy="27" r="2.5" fill="#000"/><circle cx="56" cy="27" r="2.5" fill="#000"/></g>
            )}
            <rect className="hand-front" x="60" y="45" width="10" height="22" fill="#1e293b" rx="5" />
          </g>
        )}
      </svg>
    </div>
  );
}