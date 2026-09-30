import './globals.css'
import PwaInstallPrompt from '@/components/pwa/PwaInstallPrompt'

// Global Libs linking
import '@/lib/cache';
import '@/lib/language';

export const metadata = {
  title: 'KidAI Studio — Bachon Ka AI Super App',
  description: 'Indian bacchon ke liye AI-powered learning platform. Homework games, visual learning, creator studio, and AI tutor.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KidAI Studio',
  },
  icons: {
    icon: '/icons/icon.svg',
    shortcut: '/icons/icon-192.svg',
    apple: '/icons/apple-touch-icon.svg',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ff6b35',
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#ff6b35" />
      </head>
      <body style={{ 
        background: '#07090f', 
        color: '#f1f5f9', 
        margin: 0, 
        padding: 0,
        width: '100%',
        minHeight: '100vh',
        fontFamily: "'Nunito', sans-serif"
      }}>
        <div style={{
          width: '100%',
          minHeight: '100vh',
          background: '#07090f',
          position: 'relative'
        }}>
          {children}
          <PwaInstallPrompt />
        </div>
      </body>
    </html>
  )
}