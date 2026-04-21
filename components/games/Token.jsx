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
        cursor: isMovable ? 'pointer' : 'default',
        zIndex: isMovable ? 20 : (token.state === 'home' ? 5 : 10),
        transition: 'all 0.4s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
    >
      <img
        src="/characters/player.svg"
        alt="player token"
        style={{
          width: '160%',
          height: '160%',
          objectFit: 'contain',
          transform: isMovable ? 'translateY(-25%) scale(1.15)' : 'translateY(-15%) scale(1)',
          filter: `drop-shadow(0 5px 8px rgba(0,0,0,0.5)) ${
            token.color === 'red' ? 'hue-rotate(320deg) saturate(1.5)' :
            token.color === 'green' ? 'hue-rotate(80deg) saturate(1.5)' :
            token.color === 'yellow' ? 'hue-rotate(30deg) saturate(2)' :
            token.color === 'blue' ? 'hue-rotate(180deg) saturate(2)' : ''
          }`
        }}
      />
    </div>
  );
};

export default memo(Token);
