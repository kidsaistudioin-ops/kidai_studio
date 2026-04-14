'use client'

export default function Header({ xp = 0, streak = 0, showBack, onBack, title, rightElement }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7,9,15,.97)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1e2d45',
      padding: '0 16px',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {showBack && (
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20, padding: '4px 8px 4px 0' }}>
            ←
          </button>
        )}
        {title ? (
          <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#ff6b35,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, animation: 'bounce 3s ease infinite' }}>🚀</div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 18 }}>
              Kid<span style={{ color: '#ff6b35' }}>AI</span>
            </div>
          </div>
        )}
      </div>
      {rightElement || (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {streak > 0 && <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>🔥{streak}</span>}
          <div style={{ background: 'linear-gradient(90deg,#f59e0b,#ff6b35)', backgroundSize: '200%', animation: 'shimmer 2s linear infinite', color: '#000', padding: '3px 10px', borderRadius: 99, fontWeight: 800, fontSize: 12 }}>
            ⚡{xp}
          </div>
        </div>
      )}
    </header>
  )
}