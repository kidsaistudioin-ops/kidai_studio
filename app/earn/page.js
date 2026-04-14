'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

export default function EarnPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const inviteCode = "ARJUN50"; // Later will come from Supabase DB / local storage

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <Header title="Earn Free Premium 💎" onBack={() => router.back()} showBack />

      <div style={{ padding: '20px 20px 100px', maxWidth: 600, margin: '0 auto', animation: 'fadeIn .4s ease' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 72, animation: 'bounce 2s infinite' }}>🎁</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: '10px 0 5px' }}>Premium Banao Free!</h1>
          <p style={{ color: C.muted, fontSize: 14 }}>Doston ko bulao aur unlimited XP & Premium days pao!</p>
        </div>

        {/* Invite Code Box */}
        <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.card2})`, border: `1px solid ${C.purple}55`, borderRadius: 24, padding: 24, textAlign: 'center', marginBottom: 24, boxShadow: `0 10px 30px ${C.purple}15` }}>
          <div style={{ fontSize: 12, color: C.cyan, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Mera Invite Code</div>
          <div style={{ background: '#000', border: `1px dashed ${C.cyan}`, padding: '12px', borderRadius: 16, fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: 4, marginBottom: 20 }}>{inviteCode}</div>
          <button onClick={handleCopy} style={{ background: copied ? C.green : C.purple, color: '#fff', border: 'none', padding: '14px 24px', borderRadius: 14, fontSize: 16, fontWeight: 900, cursor: 'pointer', width: '100%', transition: 'all 0.2s', boxShadow: `0 6px 20px ${copied ? C.green : C.purple}44` }}>
            {copied ? '✅ Link Copied!' : '🔗 Copy Invite Link'}
          </button>
        </div>

        {/* Live Wallet Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 30 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20 }}>
             <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
             <div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>XP WALLET</div>
             <div style={{ fontSize: 24, fontWeight: 900, color: C.cyan }}>150 XP</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20 }}>
             <div style={{ fontSize: 28, marginBottom: 8 }}>👑</div>
             <div style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>PREMIUM DAYS</div>
             <div style={{ fontSize: 24, fontWeight: 900, color: C.yellow }}>15 Days</div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 900 }}>Kaise kaam karta hai? 🧐</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><div style={{ background: C.card2, width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>1</div><div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.4 }}>Tumhara dost is link se account banayega.</div></div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><div style={{ background: C.card2, width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>2</div><div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.4 }}>Dono ko <strong style={{ color: C.cyan }}>50-50 XP</strong> milenge turant.</div></div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><div style={{ background: C.card2, width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>3</div><div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.4 }}><strong style={{ color: C.yellow }}>10 XP = 1 Premium Day</strong> (Yaani 50 XP se seedhe 5 din ka premium unlock!)</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}