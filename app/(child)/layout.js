'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BottomNav from '@/components/ui/BottomNav';
import DesktopSidebar from '@/components/ui/DesktopSidebar';
import AcademicPromotionModal from '@/components/AcademicPromotionModal';

export default function ChildLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem('kidai_student_id');
    if (!studentId) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isAuthorized) return null;

  return (
    <div style={{ background: '#07090f', minHeight: '100vh', display: 'flex', width: '100%', overflowX: 'hidden' }}>
      <style>{`
        /* Desktop & Tablet Sidebar vs Mobile Nav */
        @media (max-width: 767px) {
          .kidai-desktop-sidebar {
            display: none !important;
          }
          .kidai-desktop-topbar {
            display: none !important;
          }
          .kidai-main-content {
            padding-bottom: 84px !important;
            width: 100% !important;
          }
          .kidai-bottom-nav {
            display: flex !important;
          }
        }
        @media (min-width: 768px) {
          .kidai-bottom-nav {
            display: none !important;
          }
          .kidai-desktop-topbar {
            display: flex !important;
          }
          .kidai-main-content {
            flex: 1 !important;
            min-width: 0 !important;
            padding-bottom: 30px !important;
          }
        }
      `}</style>

      <AcademicPromotionModal />

      {/* Desktop & Tablet Left Sidebar */}
      {!isSidebarHidden && (
        <DesktopSidebar 
          isCollapsed={false} 
          onToggleCollapse={() => setIsSidebarHidden(true)} 
        />
      )}

      {/* Main Expansive Content Area */}
      <main className="kidai-main-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        
        {/* 💻 TOP DESKTOP UTILITY BAR (Fullscreen & Sidebar Controls) */}
        <header className="kidai-desktop-topbar" style={{
          background: 'rgba(10,14,23,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1e2d45',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setIsSidebarHidden(prev => !prev)}
              style={{
                background: isSidebarHidden ? '#10b981' : '#1e2d45',
                color: isSidebarHidden ? '#000' : '#fff',
                border: '1px solid #334155',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: isSidebarHidden ? '0 0 12px rgba(16,185,129,0.4)' : 'none'
              }}
            >
              {isSidebarHidden ? '▶ Sidebar Kholein' : '◀ Full Screen (Hide Sidebar)'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={toggleFullscreen}
              style={{
                background: '#161e30',
                border: '1px solid #1e2d45',
                color: '#cbd5e1',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#06b6d4'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.borderColor = '#1e2d45'; }}
            >
              {isFullscreen ? '🗗 Exit Fullscreen' : '⛶ Badi Screen (Fullscreen)'}
            </button>
          </div>
        </header>

        {/* Expansive Inner Container */}
        <div style={{ flex: 1, padding: '16px 24px', width: '100%', maxWidth: isSidebarHidden ? '1600px' : '1300px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="kidai-bottom-nav">
        <BottomNav currentPath={pathname} />
      </div>
    </div>
  );
}
