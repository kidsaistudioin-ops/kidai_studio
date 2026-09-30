'use client';

import { useState, useEffect } from 'react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('✅ [PWA] Service Worker registered. Scope:', reg.scope))
          .catch((err) => console.warn('⚠️ [PWA] Service Worker registration failed:', err));
      });
    }

    if (typeof window !== 'undefined') {
      const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      setIsStandalone(isRunningStandalone);

      const ua = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(ua);
      const isDesktopDevice = !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
      setIsIos(isIosDevice);
      setIsDesktop(isDesktopDevice);
    }

    // 2. Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('📲 [PWA] beforeinstallprompt ready!');
    };

    // 3. Custom trigger from anywhere in app (e.g. Header button)
    const handleCustomTrigger = () => {
      handleInstallClick();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('trigger-pwa-install', handleCustomTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('trigger-pwa-install', handleCustomTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`📲 [PWA] User choice: ${outcome}`);
        setDeferredPrompt(null);
        if (outcome === 'accepted') return;
      } catch (e) {
        console.warn('Install prompt err', e);
      }
    }
    // If deferredPrompt is null (e.g. iOS, Desktop, or already past event), show guide modal
    setShowModal(true);
  };

  if (isStandalone) {
    return null; // Already running inside installed app!
  }

  return (
    <>
      {/* Floating Bottom Install Banner (Always available if not standalone & not dismissed) */}
      {!dismissed && (
        <div 
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: 'calc(100% - 32px)',
            maxWidth: 480,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.97), rgba(30, 27, 75, 0.97))',
            backdropFilter: 'blur(16px)',
            border: '2px solid #ff6b35',
            borderRadius: 22,
            padding: '12px 18px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.85), 0 0 24px rgba(255, 107, 53, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            animation: 'slideUp 0.35s ease-out'
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { transform: translate(-50%, 60px); opacity: 0; }
              to { transform: translate(-50%, 0); opacity: 1; }
            }
          `}</style>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 14, 
              background: 'linear-gradient(135deg, #ff6b35, #ec4899, #7c3aed)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 22, 
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(255,107,53,0.4)',
              border: '1.5px solid rgba(255,255,255,0.2)'
            }}>
              🚀
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 14, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                KidAI Studio App <span style={{ background: '#ff6b35', color: '#fff', fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 900 }}>PWA</span>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                Phone ya PC par app ki tarah install karein! ⚡
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleInstallClick}
              style={{
                background: 'linear-gradient(135deg, #ff6b35, #f59e0b)',
                color: '#000',
                border: 'none',
                borderRadius: 12,
                padding: '9px 16px',
                fontSize: 13,
                fontWeight: 900,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(255,107,53,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>📲</span> Install
            </button>
            <button
              onClick={() => setDismissed(true)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#94a3b8',
                fontSize: 16,
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: 10
              }}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Step-by-step Install Instructions Modal */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              background: '#0f172a',
              border: '2px solid #ff6b35',
              borderRadius: 24,
              padding: 26,
              maxWidth: 460,
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
              color: '#fff'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 44, marginBottom: 6 }}>📲🚀</div>
              <h3 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 900 }}>
                KidAI Studio App Install Karein
              </h3>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>
                Browser ki jagah full-screen mobile app ki tarah chalayein!
              </p>
            </div>

            {/* Platform specific guides */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              
              {/* Desktop (Chrome / Edge) */}
              {isDesktop && (
                <div style={{ background: '#1e293b', borderRadius: 16, padding: 14, fontSize: 13, lineHeight: 1.6, border: '1px solid #334155' }}>
                  <div style={{ fontWeight: 900, color: '#38bdf8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    💻 Laptop / Desktop (Chrome ya Edge):
                  </div>
                  <div style={{ marginBottom: 4 }}>1. Upar <b>URL Address Bar</b> me dekhein.</div>
                  <div style={{ marginBottom: 4 }}>2. Right side me <b>Install Icon (⬇️ ya ⊕)</b> par click karein.</div>
                  <div>3. <b>"Install KidAI Studio"</b> par click karein — Desktop par icon aa jayega! 🎉</div>
                </div>
              )}

              {/* Android Phone */}
              {!isIos && (
                <div style={{ background: '#1e293b', borderRadius: 16, padding: 14, fontSize: 13, lineHeight: 1.6, border: '1px solid #334155' }}>
                  <div style={{ fontWeight: 900, color: '#10b981', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    🤖 Android Phone (Chrome):
                  </div>
                  <div style={{ marginBottom: 4 }}>1. Chrome me upar right side <b>3 Dots (⋮)</b> dabayein.</div>
                  <div style={{ marginBottom: 4 }}>2. Menu me <b>"Install App"</b> ya <b>"Add to Home screen"</b> chunein.</div>
                  <div>3. <b>"Install"</b> dabayein — Mobile me app icon ban jayega! ⚡</div>
                </div>
              )}

              {/* iOS / iPhone */}
              {isIos && (
                <div style={{ background: '#1e293b', borderRadius: 16, padding: 14, fontSize: 13, lineHeight: 1.6, border: '1px solid #334155' }}>
                  <div style={{ fontWeight: 900, color: '#f59e0b', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    🍎 iPhone / iPad (Safari):
                  </div>
                  <div style={{ marginBottom: 4 }}>1. Safari me neeche <b>Share button (⎋)</b> dabayein.</div>
                  <div style={{ marginBottom: 4 }}>2. Neeche scroll karke <b>"Add to Home Screen" (➕)</b> dabayein.</div>
                  <div>3. Upar <b>"Add"</b> dabayein — App ready! 🌟</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(135deg, #ff6b35, #ec4899)',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                fontWeight: 900,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255,107,53,0.35)'
              }}
            >
              Samajh Gaya! Chalo Install Karte Hain 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
}
