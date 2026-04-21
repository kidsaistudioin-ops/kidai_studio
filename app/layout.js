import './globals.css'

// Global Libs linking
import '@/lib/cache';
import '@/lib/language';

export const metadata = {
  title: 'KidAI Studio — Bacho Ka AI School',
  description: 'Indian bacchon ke liye AI-powered learning platform. Homework games, visual learning, parent dashboard.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#07090f',
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ 
        background: '#000', 
        color: '#f1f5f9', 
        margin: 0, 
        display: 'flex', 
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '480px', /* Mobile UI Enforcer */
          background: '#07090f',
          minHeight: '100vh',
          position: 'relative',
          boxShadow: '0 0 50px rgba(124, 58, 237, 0.1)',
          overflowX: 'hidden'
        }}>
          {children}
        </div>
      </body>
    </html>
  )
}