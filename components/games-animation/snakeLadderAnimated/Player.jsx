export default function Player({ emotion }) {
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

  return (
    <div style={{ width: 36, height: 36, animation: getAnimation(), filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))', zIndex: 50 }}>
      <style>{`
        @keyframes mario-walk { 0% { transform: translateY(0); } 100% { transform: translateY(-4px) scale(1.05); } }
        @keyframes mario-fast { 0% { transform: translateY(0) scale(1) rotate(5deg); } 100% { transform: translateY(-8px) scale(1.1) rotate(-5deg); } }
        @keyframes mario-climb { 0% { transform: translateY(0) scale(1.1); } 100% { transform: translateY(-4px) scale(1.1); } }
        @keyframes mario-fall { 0% { transform: rotate(0) scale(1); opacity: 1; } 100% { transform: rotate(1080deg) scale(0.4); opacity: 0; } }
        @keyframes mario-win { 0% { transform: scale(1) rotate(0); } 50% { transform: scale(1.4) rotate(15deg); } 100% { transform: scale(1) rotate(0); } }
      `}</style>
      
      {/* Aapka banaya hua SVG Character */}
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {/* Head */}
        <circle cx="50" cy="30" r="15" fill="#FFD166"/>
        
        {/* Eyes */}
        <circle cx="45" cy="28" r="2" fill="#000"/>
        <circle cx="55" cy="28" r="2" fill="#000"/>
        
        {/* Smile - (Emotion ke hisaab se smile change hogi) */}
        {emotion === 'snake' ? (
          <path d="M45 37 Q50 32 55 37" stroke="#000" fill="transparent"/>
        ) : (
          <path d="M45 35 Q50 40 55 35" stroke="#000" fill="transparent"/>
        )}

        {/* Body */}
        <rect x="40" y="45" width="20" height="30" fill="#06D6A0"/>

        {/* Legs */}
        <rect x="40" y="75" width="8" height="15" fill="#118AB2"/>
        <rect x="52" y="75" width="8" height="15" fill="#118AB2"/>
      </svg>
    </div>
  );
}