'use client';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/home',   icon: '🏠', label: 'Home' },
  { href: '/seekho', icon: '📖', label: 'Seekho' },
  { href: '/studio', icon: '🎨', label: 'Studio' },
  { href: '/play',   icon: '🎮', label: 'Play' },
  { href: '/chat',   icon: '🤖', label: 'Arya AI' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 12,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 24px)',
      maxWidth: 440,
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1.5px solid rgba(255, 255, 255, 0.12)',
      borderRadius: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '8px 6px',
      zIndex: 999,
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(124, 58, 237, 0.15)'
    }}>
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href));
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '6px 4px',
              borderRadius: 16,
              border: 'none',
              background: active ? 'linear-gradient(135deg, rgba(255,107,53,0.25), rgba(236,72,153,0.25))' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative'
            }}
          >
            {active && (
              <div style={{
                position: 'absolute',
                top: -8,
                width: 16,
                height: 3,
                borderRadius: 99,
                background: '#ff6b35',
                boxShadow: '0 0 8px #ff6b35'
              }} />
            )}
            <span style={{
              fontSize: 22,
              display: 'block',
              transform: active ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.2s',
              filter: active ? 'drop-shadow(0 0 6px rgba(255,107,53,0.6))' : 'none'
            }}>
              {item.icon}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 900,
              color: active ? '#ffedd5' : '#64748b',
              letterSpacing: '0.2px'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}