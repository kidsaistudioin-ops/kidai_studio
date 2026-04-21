'use client';
import { memo } from 'react';
import { PLAYERS } from '@/lib/games/ludoEngine';

const Token = ({ token, style, onClick, isMovable }) => {
  const baseColor = PLAYERS[token.color].color;
  
  return (
    <div 
      onClick={onClick} 
      style={{
        ...style,
        position: 'relative',
        background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${baseColor} 50%, #000000 150%)`,
        borderRadius: '50%',
        border: `2px solid ${baseColor}`,
        boxShadow: isMovable ? `0 0 15px 4px ${baseColor}, 0 8px 12px rgba(0,0,0,0.5)` : '0 4px 8px rgba(0,0,0,0.6)',
        cursor: isMovable ? 'pointer' : 'default',
        transform: isMovable ? 'scale(1.15)' : 'scale(0.9)',
        zIndex: isMovable ? 20 : 5,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }} 
    >
      <div style={{ position: 'absolute', top: '15%', left: '15%', width: '25%', height: '25%', background: 'rgba(255,255,255,0.6)', borderRadius: '50%' }} />
    </div>
  );
};

export default memo(Token);
