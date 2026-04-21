'use client';
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/home',    icon: '🏠', label: 'Home' },
  { href: '/seekho',  icon: '📖', label: 'Seekho' },
  { href: '/learn',   icon: '📚', label: 'Learn' },
  { href: '/library', icon: '🕹️', label: 'Games' },
  { href: '/create',  icon: '🎨', label: 'Creator' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 500,
      background: 'rgba(7,9,15,.98)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid #1e2d45',
      display: 'flex',
      padding: '8px 4px 16px',
      zIndex: 100,
    }}>
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '6px 2px',
              borderRadius: 12,
              border: 'none',
              background: active ? 'rgba(255,107,53,.15)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <span style={{
              fontSize: 22,
              display: 'block',
              transform: active ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform .2s',
            }}>{item.icon}</span>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: active ? '#ff6b35' : '#64748b',
            }}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}