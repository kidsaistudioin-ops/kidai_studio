'use client'
import { useEffect, useState } from 'react'

export default function Toast({ message, visible }) {
  if (!visible || !message) return null
  return (
    <div style={{
      position: 'fixed',
      top: 64,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg,#ff6b35,#7c3aed)',
      color: '#fff',
      padding: '8px 20px',
      borderRadius: 99,
      fontWeight: 800,
      fontSize: 13,
      zIndex: 200,
      animation: 'pop .3s ease',
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(255,107,53,.5)',
      pointerEvents: 'none',
    }}>
      {message}
    </div>
  )
}