'use client';
import Link from 'next/link';

// Aapke project se consistent color palette
const C = {
  bg: '#07090f',
  card: '#0f1520',
  border: '#1e2d45',
  orange: '#ff6b35',
  purple: '#7c3aed',
  cyan: '#06b6d4',
  green: '#10b981',
  text: '#f1f5f9',
  muted: '#64748b'
};

export default function MainHeader() {
  const handleInstallClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trigger-pwa-install'));
    }
  };

  return (
    <header style={{
      background: C.bg,
      borderBottom: `1px solid ${C.border}`,
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)'
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 24 }}>🚀</span>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: C.text }}>
          KID<span style={{ color: C.orange }}>AI</span> <span style={{ fontSize: 16, color: C.purple, fontWeight: 800 }}>STUDIO</span>
        </h1>
      </Link>

      {/* Navigation & Action Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* PWA Direct Install Button */}
        <button
          onClick={handleInstallClick}
          style={{
            background: 'linear-gradient(135deg, #ff6b35, #ec4899)',
            border: 'none',
            color: '#fff',
            padding: '9px 16px',
            borderRadius: '12px',
            fontWeight: 900,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 15px rgba(255,107,53,0.4)',
            transition: 'transform 0.15s'
          }}
          title="Phone ya PC par app install karein"
        >
          <span>📲</span>
          <span>Install App</span>
        </button>

        <Link href="/dashboard" style={{ textDecoration: 'none', color: C.muted, fontWeight: 700, fontSize: 14, padding: '8px 12px' }}>
          For Parents
        </Link>
        <Link href="/login" style={{ textDecoration: 'none', background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`, color: '#fff', padding: '9px 18px', borderRadius: '12px', fontWeight: 800, fontSize: 14, boxShadow: `0 4px 15px ${C.purple}44` }}>
          Login / Sign Up
        </Link>
      </nav>
    </header>
  );
}