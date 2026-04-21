import Link from 'next/link';

// Aapke project se consistent color palette
const C = {
  bg: '#07090f',
  card: '#0f1520',
  border: '#1e2d45',
  text: '#f1f5f9',
  muted: '#64748b'
};

export default function MainFooter() {
  return (
    <footer style={{
      background: C.card,
      borderTop: `1px solid ${C.border}`,
      padding: '40px 24px',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Moved Links */}
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/about" style={{ textDecoration: 'none', color: C.muted, fontWeight: 600, fontSize: 14 }}>
            About Us
          </Link>
          <Link href="/pricing" style={{ textDecoration: 'none', color: C.muted, fontWeight: 600, fontSize: 14 }}>
            Pricing
          </Link>
          <Link href="/faq" style={{ textDecoration: 'none', color: C.muted, fontWeight: 600, fontSize: 14 }}>
            FAQ
          </Link>
          <Link href="/contact" style={{ textDecoration: 'none', color: C.muted, fontWeight: 600, fontSize: 14 }}>
            Contact
          </Link>
        </div>
        
        {/* Copyright */}
        <p style={{ color: C.muted, fontSize: 13, margin: 0, marginTop: '16px' }}>
          © {new Date().getFullYear()} KidAI Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}