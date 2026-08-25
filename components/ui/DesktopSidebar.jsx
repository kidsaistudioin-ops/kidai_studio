'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/home', icon: '🏠', label: 'Home Dashboard', color: '#06b6d4' },
  { href: '/seekho', icon: '📖', label: 'Seekho (Lessons)', color: '#3b82f6' },
  { href: '/scanner', icon: '📸', label: 'Smart Scanner', color: '#ff6b35' },
  { href: '/studio', icon: '🎨', label: 'Creator Studio', color: '#ec4899' },
  { href: '/play', icon: '🎮', label: 'Game Arcade', color: '#10b981' },
  { href: '/library', icon: '🎒', label: 'My Library', color: '#8b5cf6' },
  { href: '/profile', icon: '👤', label: 'My Profile', color: '#f59e0b' },
];

export default function DesktopSidebar({ isCollapsed, onToggleCollapse }) {
  const pathname = usePathname();
  const router = useRouter();

  const [studentName, setStudentName] = useState('Hero');
  const [studentClass, setStudentClass] = useState('5');
  const [studentBoard, setStudentBoard] = useState('CBSE');
  const [xp, setXp] = useState(150);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('kidai_student_name');
      const cls = localStorage.getItem('kidai_student_class');
      const board = localStorage.getItem('kidai_student_board');
      const curXp = localStorage.getItem('kidai_xp');
      if (name) setStudentName(name);
      if (cls) setStudentClass(cls);
      if (board) setStudentBoard(board);
      if (curXp) setXp(parseInt(curXp));
    }
  }, []);

  return (
    <aside className={`kidai-desktop-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{
      width: isCollapsed ? '72px' : '260px',
      minWidth: isCollapsed ? '72px' : '260px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: '#0a0e17',
      borderRight: '1px solid #1e2d45',
      display: 'flex',
      flexDirection: 'column',
      padding: isCollapsed ? '20px 8px' : '24px 16px',
      zIndex: 50,
      fontFamily: "'Nunito', sans-serif",
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease'
    }}>
      {/* Brand Header & Toggle Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', marginBottom: 28, padding: isCollapsed ? '0' : '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 40, height: 40, borderRadius: 12, 
            background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 4px 15px rgba(6,182,212,0.4)', flexShrink: 0
          }}>
            🚀
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
                KidAI <span style={{ color: '#ff6b35' }}>Studio</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
                Class {studentClass}th • {studentBoard}
              </div>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button */}
        <button 
          onClick={onToggleCollapse}
          title={isCollapsed ? "Sidebar Expand Karein" : "Sidebar Collapse Karein (Full Screen)"}
          style={{
            background: '#161e30',
            border: '1px solid #1e2d45',
            color: '#94a3b8',
            width: 28, height: 28, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 12,
            transition: 'all 0.2s ease',
            marginLeft: isCollapsed ? 0 : 6
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#06b6d4'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#1e2d45'; }}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href));
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              title={isCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: 14,
                padding: isCollapsed ? '12px 0' : '12px 16px',
                borderRadius: 14,
                border: active ? `1px solid ${item.color}44` : '1px solid transparent',
                background: active ? `${item.color}18` : 'transparent',
                color: active ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: active ? 800 : 600,
                fontSize: 14,
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#161e30';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
              {active && !isCollapsed && (
                <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: item.color }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Student Badge & XP Card */}
      {!isCollapsed ? (
        <div style={{
          background: 'linear-gradient(135deg, #161e30, #0f1520)',
          border: '1px solid #1e2d45',
          borderRadius: 16,
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0
          }}>
            👦
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {studentName}
            </div>
            <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>
              ⚡ {xp} Total XP
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }} title={`${studentName} • ${xp} XP`}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18
          }}>
            👦
          </div>
        </div>
      )}

      {/* Switch to Parent Dashboard Link */}
      <button
        onClick={() => router.push('/dashboard')}
        title="Parent & Teacher Hub"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: 'transparent', border: '1px dashed #334155', color: '#64748b',
          padding: isCollapsed ? '10px 0' : '10px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#06b6d4'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#334155'; }}
      >
        {isCollapsed ? '👨‍👩‍👧' : '👨‍👩‍👧 Parent Hub'}
      </button>
    </aside>
  );
}
