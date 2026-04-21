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
  text: '#f1f5f9',
  muted: '#64748b'
};

export default function MainHeader() {
  return (
    <header style={{
      background: C.bg,
      borderBottom: `1px solid ${C.border}`,
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, color: C.text }}>
          KID<span style={{ color: C.orange }}>AI</span>
        </h1>
      </Link>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link href="/parent/dashboard" style={{ textDecoration: 'none', color: C.muted, fontWeight: 700, fontSize: 15, transition: 'color 0.2s', padding: '10px 0' }}>
          For Parents
        </Link>
        <Link href="/login" style={{ textDecoration: 'none', background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`, color: '#fff', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: 15, boxShadow: `0 4px 15px ${C.purple}44` }}>
          Login / Sign Up
        </Link>
      </nav>
    </header>
  );
}