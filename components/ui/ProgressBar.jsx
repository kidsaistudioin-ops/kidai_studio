'use client'
import { useState, useEffect } from 'react'

export default function ProgressBar({ pct, color = '#ff6b35', height = 8, animated = true }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div style={{ height, background: '#1e2d45', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${animated ? width : pct}%`,
        background: `linear-gradient(90deg, ${color}, ${color}bb)`,
        borderRadius: 99,
        transition: 'width 1.2s ease',
      }} />
    </div>
  )
}