'use client'
import Link from 'next/link';

export default function ReportsPage() {
  return (
    <div style={{ padding: 16, background: '#07090f', minHeight: '100vh', color: '#f1f5f9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Link href="/parent/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: 20 }}>←</Link>
        <h1 style={{ fontSize: 20, fontWeight: 800 }}>Detailed <span style={{ color: '#06b6d4' }}>Reports</span> 📊</h1>
      </div>
      
      <div style={{ background: '#0f1520', border: '1px solid #1e2d45', borderRadius: 16, padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📄</div>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Monthly Progress Report</div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Bachhe ki pichle 30 din ki detailed performance yahan aayegi. (Data integration bacha hai)</div>
        
        <button style={{ padding: '10px 20px', borderRadius: 10, background: '#06b6d4', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
          Download PDF
        </button>
      </div>
    </div>
  );
}