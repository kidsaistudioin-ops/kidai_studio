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
        </div>
      </body>
    </html>
  )
}