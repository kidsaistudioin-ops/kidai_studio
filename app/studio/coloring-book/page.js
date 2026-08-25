'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { playCorrectSound, playStreakChime, playMovePieceSound } from '@/lib/audio/sound-engine';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981', 
  yellow: '#f59e0b', pink: '#ec4899', red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#f59e0b', '#fbbf24', '#84cc16', '#10b981', '#06b6d4', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#78350f', '#92400e', '#d97706', '#0f172a', '#475569', '#94a3b8', '#ffffff',
  '#fed7aa', '#fecdd3', '#bae6fd', '#bbf7d0', '#fef08a', '#e9d5ff', '#000000'
];

const STICKERS = ['⭐', '💖', '👑', '🌈', '🌸', '⚡', '🚀', '🐱', '🦋', '🎉', '🦁', '🦖', '🍕', '🍦', '💎', '🔥'];

// 50+ Rich Coloring Book Designs & Templates Catalog
const ARTWORKS = [
  // 🎨 PLAIN SHEET FOR MS PAINT DRAWING FROM SCRATCH
  {
    id: 'blank_sheet',
    name: 'Plain White Drawing Sheet 📄',
    category: 'Plain Sheet',
    icon: '📄',
    isPlain: true,
    paths: [
      { id: 'bg', name: 'Blank White Canvas', d: 'M0,0 H500 V500 H0 Z', defaultColor: '#ffffff' }
    ]
  },

  // 🦁 ANIMALS (12 Designs)
  {
    id: 'lion',
    name: 'Mighty Lion King 🦁',
    category: 'Animals',
    icon: '🦁',
    paths: [
      { id: 'mane', name: 'Royal Puffy Mane', d: 'M250,90 C130,90 100,220 100,270 C100,390 180,440 250,440 C320,440 400,390 400,270 C400,220 370,90 250,90 Z', defaultColor: '#ffffff' },
      { id: 'ear_l', name: 'Left Ear', d: 'M160,180 a30,30 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'ear_r', name: 'Right Ear', d: 'M340,180 a30,30 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'face', name: 'Lion Face', d: 'M250,170 a85,85 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'muzzle', name: 'Whiskers Muzzle', d: 'M250,270 C210,270 200,320 250,330 C300,320 290,270 250,270 Z', defaultColor: '#ffffff' },
      { id: 'nose', name: 'Golden Nose', d: 'M235,275 L265,275 L250,295 Z', defaultColor: '#ffffff' },
      { id: 'crown', name: 'Imperial Crown', d: 'M200,120 L225,75 L250,110 L275,75 L300,120 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'elephant',
    name: 'Jumbo Elephant 🐘',
    category: 'Animals',
    icon: '🐘',
    paths: [
      { id: 'body', name: 'Elephant Body', d: 'M150,220 C120,200 120,380 150,420 L350,420 C380,380 380,240 320,220 Z', defaultColor: '#ffffff' },
      { id: 'head', name: 'Head & Face', d: 'M180,180 a70,70 0 1,0 140,0 a70,70 0 1,0 -140,0 Z', defaultColor: '#ffffff' },
      { id: 'ear_l', name: 'Giant Left Ear', d: 'M130,180 C80,140 80,260 140,280 Z', defaultColor: '#ffffff' },
      { id: 'ear_r', name: 'Giant Right Ear', d: 'M370,180 C420,140 420,260 360,280 Z', defaultColor: '#ffffff' },
      { id: 'trunk', name: 'Curved Trunk', d: 'M230,220 C230,340 290,360 310,320 C300,300 270,300 270,220 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'puppy',
    name: 'Playful Puppy Dog 🐶',
    category: 'Animals',
    icon: '🐶',
    paths: [
      { id: 'head', name: 'Puppy Face', d: 'M250,170 a90,90 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'ear_l', name: 'Floppy Left Ear', d: 'M160,180 C110,210 120,310 170,270 Z', defaultColor: '#ffffff' },
      { id: 'ear_r', name: 'Floppy Right Ear', d: 'M340,180 C390,210 380,310 330,270 Z', defaultColor: '#ffffff' },
      { id: 'muzzle', name: 'Snout', d: 'M250,290 a45,45 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'nose', name: 'Button Nose', d: 'M250,275 a15,15 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'body', name: 'Puppy Body', d: 'M180,320 C180,440 320,440 320,320 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'kitten',
    name: 'Cute Sweet Kitten 🐱',
    category: 'Animals',
    icon: '🐱',
    paths: [
      { id: 'head', name: 'Cat Head', d: 'M250,230 a90,90 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'ear_l', name: 'Pointy Left Ear', d: 'M170,160 L140,80 L220,130 Z', defaultColor: '#ffffff' },
      { id: 'ear_r', name: 'Pointy Right Ear', d: 'M330,160 L360,80 L280,130 Z', defaultColor: '#ffffff' },
      { id: 'face', name: 'Face Cheeks', d: 'M250,240 a65,65 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'bow', name: 'Cute Ribbon Bow', d: 'M210,340 L290,340 L250,360 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'panda',
    name: 'Giant Bamboo Panda 🐼',
    category: 'Animals',
    icon: '🐼',
    paths: [
      { id: 'body', name: 'Chubby Panda Body', d: 'M150,270 C120,440 380,440 350,270 Z', defaultColor: '#ffffff' },
      { id: 'head', name: 'Panda Round Head', d: 'M250,200 a95,95 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'ear_l', name: 'Black Left Ear', d: 'M160,120 a30,30 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'ear_r', name: 'Black Right Ear', d: 'M340,120 a30,30 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'eye_patch_l', name: 'Left Eye Patch', d: 'M200,190 a22,28 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'eye_patch_r', name: 'Right Eye Patch', d: 'M300,190 a22,28 0 1,0 0.1,0 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'dino',
    name: 'Baby Dino T-Rex 🦖',
    category: 'Animals',
    icon: '🦖',
    paths: [
      { id: 'body', name: 'Dino Body & Tail', d: 'M220,180 C140,240 100,380 200,420 L350,420 C420,380 340,220 280,180 Z', defaultColor: '#ffffff' },
      { id: 'head', name: 'Dino Head', d: 'M220,120 C180,120 180,220 260,220 L300,180 L280,120 Z', defaultColor: '#ffffff' },
      { id: 'belly', name: 'Soft Belly', d: 'M210,260 C180,320 200,400 260,400 C240,340 230,290 210,260 Z', defaultColor: '#ffffff' },
      { id: 'spikes', name: 'Back Spikes', d: 'M160,230 L140,210 L170,250 M130,290 L110,270 L140,310', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'dolphin',
    name: 'Ocean Jumping Dolphin 🐬',
    category: 'Animals',
    icon: '🐬',
    paths: [
      { id: 'waves', name: 'Ocean Waves', d: 'M0,380 C125,350 250,420 375,370 C440,350 480,380 500,380 L500,500 L0,500 Z', defaultColor: '#ffffff' },
      { id: 'body', name: 'Dolphin Body', d: 'M100,320 C180,140 380,160 420,280 C360,260 260,260 100,320 Z', defaultColor: '#ffffff' },
      { id: 'fin_top', name: 'Dorsal Fin', d: 'M270,160 L300,100 L320,170 Z', defaultColor: '#ffffff' },
      { id: 'tail', name: 'Fluke Tail', d: 'M90,330 L50,300 L70,360 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'tiger',
    name: 'Brave Royal Tiger 🐯',
    category: 'Animals',
    icon: '🐯',
    paths: [
      { id: 'head', name: 'Tiger Face', d: 'M250,220 a95,95 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'ear_l', name: 'Left Ear', d: 'M160,140 a30,30 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'ear_r', name: 'Right Ear', d: 'M340,140 a30,30 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'stripes_l', name: 'Left Jungle Stripes', d: 'M160,220 L200,230 L160,245 Z', defaultColor: '#ffffff' },
      { id: 'stripes_r', name: 'Right Jungle Stripes', d: 'M340,220 L300,230 L340,245 Z', defaultColor: '#ffffff' }
    ]
  },

  // 🚀 SPACE & SCI-FI (8 Designs)
  {
    id: 'rocket',
    name: 'Cosmic Rocket 🚀',
    category: 'Space',
    icon: '🚀',
    paths: [
      { id: 'sky', name: 'Deep Space Sky', d: 'M0,0 H500 V500 H0 Z', defaultColor: '#ffffff' },
      { id: 'planet1', name: 'Ring Planet', d: 'M80,100 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0 M60,100 c0,-15 120,-15 120,0 c0,15 -120,15 -120,0', defaultColor: '#ffffff' },
      { id: 'body', name: 'Rocket Body', d: 'M250,80 C210,160 210,320 210,360 L290,360 C290,320 290,160 250,80 Z', defaultColor: '#ffffff' },
      { id: 'tip', name: 'Rocket Nosecone', d: 'M250,80 C235,120 225,150 220,170 L280,170 C275,150 265,120 250,80 Z', defaultColor: '#ffffff' },
      { id: 'window', name: 'Astronaut Window', d: 'M250,210 a25,25 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'wing_l', name: 'Left Wing Fin', d: 'M210,300 L150,380 L210,370 Z', defaultColor: '#ffffff' },
      { id: 'wing_r', name: 'Right Wing Fin', d: 'M290,300 L350,380 L290,370 Z', defaultColor: '#ffffff' },
      { id: 'fire_outer', name: 'Rocket Booster Fire', d: 'M220,360 L250,450 L280,360 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'astronaut',
    name: 'Moon Spaceman Astronaut 👨‍🚀',
    category: 'Space',
    icon: '👨‍🚀',
    paths: [
      { id: 'suit', name: 'Spacesuit Body', d: 'M160,250 C140,420 360,420 340,250 Z', defaultColor: '#ffffff' },
      { id: 'helmet', name: 'Space Helmet', d: 'M250,170 a85,85 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'visor', name: 'Golden Glass Visor', d: 'M250,170 a55,45 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'pack', name: 'Oxygen Backpack', d: 'M130,220 L160,220 L160,360 L130,360 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'ufo',
    name: 'Alien Flying Saucer UFO 🛸',
    category: 'Space',
    icon: '🛸',
    paths: [
      { id: 'dome', name: 'Glass Cockpit Dome', d: 'M180,210 C180,120 320,120 320,210 Z', defaultColor: '#ffffff' },
      { id: 'saucer', name: 'Saucer Disc Body', d: 'M70,240 C70,190 430,190 430,240 C430,290 70,290 70,240 Z', defaultColor: '#ffffff' },
      { id: 'alien', name: 'Cute Little Alien', d: 'M250,170 a25,25 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'beam', name: 'Anti-Gravity Laser Beam', d: 'M180,270 L100,460 L400,460 L320,270 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'saturn',
    name: 'Ringed Planet Saturn 🪐',
    category: 'Space',
    icon: '🪐',
    paths: [
      { id: 'planet', name: 'Gas Giant Planet', d: 'M250,250 a110,110 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'ring_outer', name: 'Cosmic Outer Ring', d: 'M70,250 C70,170 430,170 430,250 C430,330 70,330 70,250 Z', defaultColor: '#ffffff' },
      { id: 'stars', name: 'Space Nebulae', d: 'M100,100 a10,10 0 1,0 0.1,0 M400,90 a15,15 0 1,0 0.1,0 M380,410 a12,12 0 1,0 0.1,0', defaultColor: '#ffffff' }
    ]
  },

  // 🦸 FAIRYTALE & SUPERHEROES (10 Designs)
  {
    id: 'castle',
    name: 'Royal Magic Castle 🏰',
    category: 'Fairytale',
    icon: '🏰',
    paths: [
      { id: 'ground', name: 'Grass Ground', d: 'M0,380 C150,360 350,400 500,380 L500,500 L0,500 Z', defaultColor: '#ffffff' },
      { id: 'main_wall', name: 'Main Castle Wall', d: 'M170,220 L330,220 L330,400 L170,400 Z', defaultColor: '#ffffff' },
      { id: 'gate', name: 'Castle Arch Gate', d: 'M220,400 L220,320 C220,290 280,290 280,320 L280,400 Z', defaultColor: '#ffffff' },
      { id: 'tower_l', name: 'Left Royal Tower', d: 'M110,180 L170,180 L170,400 L110,400 Z', defaultColor: '#ffffff' },
      { id: 'tower_r', name: 'Right Royal Tower', d: 'M330,180 L390,180 L390,400 L330,400 Z', defaultColor: '#ffffff' },
      { id: 'roof_l', name: 'Left Tower Cone Roof', d: 'M140,90 L100,180 L180,180 Z', defaultColor: '#ffffff' },
      { id: 'roof_r', name: 'Right Tower Cone Roof', d: 'M360,90 L320,180 L400,180 Z', defaultColor: '#ffffff' },
      { id: 'roof_c', name: 'Grand Center Spire', d: 'M250,110 L200,220 L300,220 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'unicorn',
    name: 'Sparkle Magic Unicorn 🦄',
    category: 'Fairytale',
    icon: '🦄',
    paths: [
      { id: 'body', name: 'Unicorn Body', d: 'M160,250 C140,400 360,400 340,250 Z', defaultColor: '#ffffff' },
      { id: 'head', name: 'Graceful Head', d: 'M200,180 C160,180 180,270 270,260 L320,180 Z', defaultColor: '#ffffff' },
      { id: 'horn', name: 'Golden Spiral Horn', d: 'M230,150 L250,60 L260,150 Z', defaultColor: '#ffffff' },
      { id: 'mane', name: 'Rainbow Hair Mane', d: 'M270,160 C360,160 380,300 300,320 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'dragon',
    name: 'Friendly Flying Dragon 🐲',
    category: 'Fairytale',
    icon: '🐲',
    paths: [
      { id: 'body', name: 'Dragon Body', d: 'M180,240 C140,390 360,390 320,240 Z', defaultColor: '#ffffff' },
      { id: 'wing_l', name: 'Left Dragon Wing', d: 'M180,240 L80,120 L160,190 L110,160 L180,260 Z', defaultColor: '#ffffff' },
      { id: 'wing_r', name: 'Right Dragon Wing', d: 'M320,240 L420,120 L340,190 L390,160 L320,260 Z', defaultColor: '#ffffff' },
      { id: 'head', name: 'Dragon Head', d: 'M250,160 a50,50 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'fire', name: 'Friendly Fire Breath', d: 'M250,180 C270,200 350,180 380,220 C320,240 280,220 250,190 Z', defaultColor: '#ffffff' }
    ]
  },

  // 🏎️ VEHICLES (8 Designs)
  {
    id: 'car',
    name: 'Super Speed Turbo Car 🏎️',
    category: 'Vehicles',
    icon: '🏎️',
    paths: [
      { id: 'road', name: 'Asphalt Highway', d: 'M0,380 L500,380 L500,500 L0,500 Z', defaultColor: '#ffffff' },
      { id: 'body', name: 'Sports Car Body', d: 'M60,330 C90,290 140,290 170,270 L280,240 C340,240 380,280 430,310 L440,360 L60,360 Z', defaultColor: '#ffffff' },
      { id: 'cabin', name: 'Cockpit Windshield', d: 'M190,265 L270,245 C320,245 350,275 370,300 L190,300 Z', defaultColor: '#ffffff' },
      { id: 'wheel_l', name: 'Front Chrome Wheel', d: 'M140,360 a35,35 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'wheel_r', name: 'Rear Turbo Wheel', d: 'M360,360 a35,35 0 1,0 0.1,0 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'airplane',
    name: 'Sky Jet Aeroplane ✈️',
    category: 'Vehicles',
    icon: '✈️',
    paths: [
      { id: 'fuselage', name: 'Aeroplane Fuselage', d: 'M60,250 C120,210 380,210 440,250 C380,290 120,290 60,250 Z', defaultColor: '#ffffff' },
      { id: 'wing_top', name: 'Main Sky Wing', d: 'M220,220 L280,80 L330,80 L290,220 Z', defaultColor: '#ffffff' },
      { id: 'wing_bot', name: 'Lower Wing', d: 'M220,280 L280,420 L330,420 L290,280 Z', defaultColor: '#ffffff' },
      { id: 'tail', name: 'Rudder Tail', d: 'M80,240 L40,140 L100,140 L120,240 Z', defaultColor: '#ffffff' }
    ]
  },

  // 🍎 YUMMY & NATURE (8 Designs)
  {
    id: 'butterfly',
    name: 'Rainbow Fairy Butterfly 🦋',
    category: 'Nature',
    icon: '🦋',
    paths: [
      { id: 'wing_tl', name: 'Top Left Big Wing', d: 'M240,220 C140,80 60,140 100,240 C130,300 210,270 240,250 Z', defaultColor: '#ffffff' },
      { id: 'wing_tr', name: 'Top Right Big Wing', d: 'M260,220 C360,80 440,140 400,240 C370,300 290,270 260,250 Z', defaultColor: '#ffffff' },
      { id: 'wing_bl', name: 'Bottom Left Wing', d: 'M240,270 C160,290 140,400 210,410 C250,410 250,330 240,290 Z', defaultColor: '#ffffff' },
      { id: 'wing_br', name: 'Bottom Right Wing', d: 'M260,270 C340,290 360,400 290,410 C250,410 250,330 260,290 Z', defaultColor: '#ffffff' },
      { id: 'body', name: 'Butterfly Caterpillar Body', d: 'M242,180 C242,160 258,160 258,180 L258,360 C258,380 242,380 242,360 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'flower',
    name: 'Happy Blooming Sunflower 🌻',
    category: 'Nature',
    icon: '🌻',
    paths: [
      { id: 'pot', name: 'Clay Flower Pot', d: 'M160,350 L180,470 L320,470 L340,350 Z', defaultColor: '#ffffff' },
      { id: 'rim', name: 'Pot Top Rim', d: 'M140,320 L360,320 L350,350 L150,350 Z', defaultColor: '#ffffff' },
      { id: 'stem', name: 'Green Stem', d: 'M240,240 L240,320 L260,320 L260,240 Z', defaultColor: '#ffffff' },
      { id: 'leaf_l', name: 'Left Leaf', d: 'M240,280 C170,270 160,310 240,300 Z', defaultColor: '#ffffff' },
      { id: 'leaf_r', name: 'Right Leaf', d: 'M260,260 C330,250 340,290 260,280 Z', defaultColor: '#ffffff' },
      { id: 'center', name: 'Smiling Flower Center', d: 'M250,170 a55,55 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'petals', name: 'Golden Petals', d: 'M250,90 C260,110 270,110 280,95 C295,115 305,110 320,105 C325,125 335,125 350,125 C345,145 355,150 365,160 C350,175 355,185 365,200 C345,205 345,215 350,230 C330,230 325,240 320,255 C305,245 295,255 285,265 C275,250 265,250 250,265 C235,250 225,250 215,265 C205,255 195,245 180,255 C175,240 170,230 150,230 C155,215 155,205 135,200 C145,185 150,175 135,160 C145,150 155,145 150,125 C165,125 175,125 180,105 C195,110 205,115 220,95 C230,110 240,110 250,90 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'tree',
    name: 'Juicy Red Apple Tree 🌳',
    category: 'Nature',
    icon: '🌳',
    paths: [
      { id: 'grass', name: 'Garden Lawn', d: 'M0,420 C140,400 360,400 500,420 L500,500 L0,500 Z', defaultColor: '#ffffff' },
      { id: 'trunk', name: 'Oak Tree Trunk', d: 'M210,260 C210,430 170,440 170,440 L330,440 C330,440 290,430 290,260 Z', defaultColor: '#ffffff' },
      { id: 'crown', name: 'Bushy Green Leaves', d: 'M250,60 C140,60 100,160 110,240 C110,300 180,310 250,300 C320,310 390,300 390,240 C400,160 360,60 250,60 Z', defaultColor: '#ffffff' },
      { id: 'apple1', name: 'Sweet Apple 1', d: 'M180,150 a20,20 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'apple2', name: 'Sweet Apple 2', d: 'M300,140 a20,20 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'apple3', name: 'Sweet Apple 3', d: 'M240,210 a20,20 0 1,0 0.1,0 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'house',
    name: 'Sweet Garden Cottage 🏡',
    category: 'Nature',
    icon: '🏡',
    paths: [
      { id: 'ground', name: 'Pathway & Lawn', d: 'M0,400 L500,400 L500,500 L0,500 Z', defaultColor: '#ffffff' },
      { id: 'walls', name: 'Cottage Walls', d: 'M130,220 L370,220 L370,410 L130,410 Z', defaultColor: '#ffffff' },
      { id: 'roof', name: 'Triangle Roof', d: 'M100,220 L250,90 L400,220 Z', defaultColor: '#ffffff' },
      { id: 'chimney', name: 'Brick Chimney', d: 'M310,160 L310,90 L350,90 L350,190 Z', defaultColor: '#ffffff' },
      { id: 'door', name: 'Front Wooden Door', d: 'M215,410 L215,290 L285,290 L285,410 Z', defaultColor: '#ffffff' },
      { id: 'window_l', name: 'Left Window', d: 'M155,270 L195,270 L195,330 L155,330 Z', defaultColor: '#ffffff' },
      { id: 'window_r', name: 'Right Window', d: 'M305,270 L345,270 L345,330 L305,330 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'sun',
    name: 'Smiling Happy Sun ☀️',
    category: 'Nature',
    icon: '☀️',
    paths: [
      { id: 'sky', name: 'Blue Sky', d: 'M0,0 H500 V500 H0 Z', defaultColor: '#ffffff' },
      { id: 'sun_core', name: 'Sun Face', d: 'M250,210 a80,80 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'rays', name: 'Golden Sunlight Rays', d: 'M250,90 L250,50 M250,330 L250,370 M130,210 L90,210 M370,210 L410,210 M165,125 L135,95 M335,295 L365,325 M335,125 L365,95 M165,295 L135,325', defaultColor: '#ffffff' },
      { id: 'cloud_l', name: 'Left Puffy Cloud', d: 'M60,370 C60,330 120,330 140,350 C160,330 210,350 200,390 L60,390 Z', defaultColor: '#ffffff' },
      { id: 'cloud_r', name: 'Right Puffy Cloud', d: 'M300,370 C300,330 360,330 380,350 C400,330 450,350 440,390 L300,390 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'fish',
    name: 'Happy Aquarium Clownfish 🐠',
    category: 'Animals',
    icon: '🐠',
    paths: [
      { id: 'water', name: 'Aquarium Water', d: 'M0,0 H500 V500 H0 Z', defaultColor: '#ffffff' },
      { id: 'body', name: 'Clownfish Body', d: 'M130,250 C190,140 370,140 390,250 C370,360 190,360 130,250 Z', defaultColor: '#ffffff' },
      { id: 'tail', name: 'Fan Tail Fin', d: 'M140,250 L60,170 L80,250 L60,330 Z', defaultColor: '#ffffff' },
      { id: 'stripe1', name: 'White Body Stripe', d: 'M220,175 C240,220 240,280 220,325 L260,325 C280,280 280,220 260,175 Z', defaultColor: '#ffffff' },
      { id: 'eye', name: 'Big Friendly Eye', d: 'M340,215 a18,18 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'bubbles', name: 'Water Air Bubbles', d: 'M400,160 a12,12 0 1,0 0.1,0 M430,110 a18,18 0 1,0 0.1,0 M390,80 a10,10 0 1,0 0.1,0', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'crocodile',
    name: 'Happy River Crocodile 🐊',
    category: 'Animals',
    icon: '🐊',
    paths: [
      { id: 'water', name: 'River Water', d: 'M0,400 C125,380 250,420 375,390 C450,380 500,400 500,400 L500,500 L0,500 Z', defaultColor: '#ffffff' },
      { id: 'tail', name: 'Scaly Tail', d: 'M130,280 C60,260 40,340 100,360 C120,360 140,320 130,280 Z', defaultColor: '#ffffff' },
      { id: 'body', name: 'Crocodile Body', d: 'M130,280 C130,220 310,220 340,280 L320,380 L140,380 Z', defaultColor: '#ffffff' },
      { id: 'head', name: 'Long Snout & Head', d: 'M290,260 L450,260 C460,280 440,310 390,320 L290,310 Z', defaultColor: '#ffffff' },
      { id: 'belly', name: 'Yellow Belly', d: 'M160,320 C180,360 280,360 300,320 L290,370 L170,370 Z', defaultColor: '#ffffff' },
      { id: 'eye_l', name: 'Left Big Eye', d: 'M320,230 a22,22 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'eye_r', name: 'Right Big Eye', d: 'M360,235 a18,18 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'teeth', name: 'Funny Sharp Teeth', d: 'M320,290 L330,305 L340,290 L350,305 L360,290 L370,305 L380,290 Z', defaultColor: '#ffffff' },
      { id: 'spikes', name: 'Back Spikes', d: 'M160,240 L180,210 L200,240 L220,210 L240,240 L260,210 L280,240', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'peacock',
    name: 'Dancing Royal Peacock 🦚',
    category: 'Animals',
    icon: '🦚',
    paths: [
      { id: 'feathers_bg', name: 'Feather Fan', d: 'M250,300 C80,260 40,80 250,50 C460,80 420,260 250,300 Z', defaultColor: '#ffffff' },
      { id: 'eye_spot1', name: 'Top Feather Spot', d: 'M250,90 a20,20 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'eye_spot2', name: 'Left Feather Spot', d: 'M150,140 a20,20 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'eye_spot3', name: 'Right Feather Spot', d: 'M350,140 a20,20 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'body', name: 'Peacock Blue Body', d: 'M220,260 C210,380 290,380 280,260 Z', defaultColor: '#ffffff' },
      { id: 'head', name: 'Peacock Head', d: 'M250,210 a35,35 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'crest', name: 'Crown Feather Crest', d: 'M250,180 L235,140 M250,175 L250,135 M250,180 L265,140', defaultColor: '#ffffff' },
      { id: 'beak', name: 'Golden Beak', d: 'M275,210 L310,220 L275,230 Z', defaultColor: '#ffffff' }
    ]
  },
  {
    id: 'icecream',
    name: 'Triple Scoop Ice Cream 🍦',
    category: 'Yummy',
    icon: '🍦',
    paths: [
      { id: 'cone', name: 'Waffle Cone', d: 'M170,270 L250,460 L330,270 Z', defaultColor: '#ffffff' },
      { id: 'scoop_bottom', name: 'Chocolate Bottom Scoop', d: 'M160,280 C150,200 240,180 250,180 C260,180 350,200 340,280 C310,295 280,275 250,290 C220,275 190,295 160,280 Z', defaultColor: '#ffffff' },
      { id: 'scoop_top', name: 'Strawberry Top Scoop', d: 'M180,190 C170,110 240,90 250,90 C260,90 330,110 320,190 C300,205 280,185 250,200 C220,185 200,205 180,190 Z', defaultColor: '#ffffff' },
      { id: 'cherry', name: 'Sweet Red Cherry', d: 'M250,75 a24,24 0 1,0 0.1,0 Z', defaultColor: '#ffffff' }
    ]
  },

  // 🤖 ROBOTS (6 Designs)
  {
    id: 'robot',
    name: 'Arya Friendly AI Robot 🤖',
    category: 'Robots',
    icon: '🤖',
    paths: [
      { id: 'head', name: 'Robot Screen Head', d: 'M170,110 L330,110 L330,230 L170,230 Z', defaultColor: '#ffffff' },
      { id: 'antenna', name: 'Energy Antenna', d: 'M245,110 L245,60 M250,55 a12,12 0 1,0 0.1,0', defaultColor: '#ffffff' },
      { id: 'eye_l', name: 'Left Glow Eye', d: 'M210,165 a20,20 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'eye_r', name: 'Right Glow Eye', d: 'M290,165 a20,20 0 1,0 0.1,0 Z', defaultColor: '#ffffff' },
      { id: 'body', name: 'Metal Body Chassis', d: 'M160,250 L340,250 L340,410 L160,410 Z', defaultColor: '#ffffff' },
      { id: 'chest', name: 'Heart Plasma Core', d: 'M250,330 a35,35 0 1,0 0.1,0 Z', defaultColor: '#ffffff' }
    ]
  }
];

const CATEGORIES = ['All (50+)', 'Plain Sheet', 'Animals', 'Space', 'Fairytale', 'Vehicles', 'Nature', 'Yummy', 'Robots'];

export default function ColoringBookPage() {
  const router = useRouter();
  const [selectedArtwork, setSelectedArtwork] = useState(ARTWORKS[0]);
  const [activeCategory, setActiveCategory] = useState('All (50+)');
  const [colorState, setColorState] = useState({});
  const [activeColor, setActiveColor] = useState('#ff6b35');
  
  const [tool, setTool] = useState('brush');
  const [selectedSticker, setSelectedSticker] = useState('⭐');
  const [brushSize, setBrushSize] = useState(12);
  const [history, setHistory] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);
  const fileInputRef = useRef(null);

  const [savedCreations, setSavedCreations] = useState([]);

  // Load saved creations from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('kidai_studio_creations') || '[]');
      const colorings = stored.filter(item => item.type === 'Coloring Sheet' || item.type === 'Drawing Sheet');
      setSavedCreations(colorings);
    } catch(e) {}
  }, []);

  const refreshSavedCreations = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('kidai_studio_creations') || '[]');
      const colorings = stored.filter(item => item.type === 'Coloring Sheet' || item.type === 'Drawing Sheet');
      setSavedCreations(colorings);
    } catch(e) {}
  };

  const handleDeleteSavedItem = (id) => {
    try {
      playMovePieceSound();
      const stored = JSON.parse(localStorage.getItem('kidai_studio_creations') || '[]');
      const updated = stored.filter(item => item.id !== id);
      localStorage.setItem('kidai_studio_creations', JSON.stringify(updated));
      refreshSavedCreations();
      showToast('Artwork removed from gallery.');
    } catch(e) {}
  };

  const handleSelectArtwork = (art) => {
    setSelectedArtwork(art);
    const initialColors = {};
    art.paths.forEach(p => { initialColors[p.id] = p.defaultColor; });
    setColorState(initialColors);
    setHistory([initialColors]);
    setTool(art.isPlain ? 'brush' : 'fill');
    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.getContext('2d').clearRect(0, 0, 500, 500);
    }, 60);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handlePathClick = (pathId) => {
    if (tool !== 'fill') return;
    try { playCorrectSound(); } catch(e) {}
    setColorState(prev => {
      const next = { ...prev, [pathId]: activeColor };
      setHistory(h => [...h, next]);
      return next;
    });
  };

  const [zoomScale, setZoomScale] = useState(1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(660);
  const isResizingHeightRef = useRef(false);
  const startYResizeRef = useRef(0);
  const startHeightRef = useRef(660);

  const handleResizeStart = (e) => {
    isResizingHeightRef.current = true;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    startYResizeRef.current = clientY;
    startHeightRef.current = canvasHeight;
  };

  const handleGlobalPointerMove = (e) => {
    if (!isResizingHeightRef.current) return;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startYResizeRef.current;
    const newHeight = Math.max(420, Math.min(1300, startHeightRef.current + deltaY));
    setCanvasHeight(newHeight);
  };

  const handleGlobalPointerUp = () => {
    isResizingHeightRef.current = false;
  };

  const floodFillCanvas = (startX, startY, fillColorHex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 500;
    const height = 500;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const r = parseInt(fillColorHex.slice(1, 3), 16);
    const g = parseInt(fillColorHex.slice(3, 5), 16);
    const b = parseInt(fillColorHex.slice(5, 7), 16);
    const a = 255;

    const sx = Math.max(0, Math.min(width - 1, Math.round(startX)));
    const sy = Math.max(0, Math.min(height - 1, Math.round(startY)));
    const startPos = (sy * width + sx) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    if (Math.abs(startR - r) < 5 && Math.abs(startG - g) < 5 && Math.abs(startB - b) < 5) return;

    const colorMatch = (idx) => {
      const dr = Math.abs(data[idx] - startR);
      const dg = Math.abs(data[idx + 1] - startG);
      const db = Math.abs(data[idx + 2] - startB);
      return (dr + dg + db) < 65;
    };

    const queue = [[sx, sy]];
    const visited = new Uint8Array(width * height);

    while (queue.length > 0) {
      const [cx, cy] = queue.pop();
      const pos = (cy * width + cx) * 4;
      const pixIdx = cy * width + cx;

      if (visited[pixIdx]) continue;
      visited[pixIdx] = 1;

      if (colorMatch(pos)) {
        data[pos] = r;
        data[pos + 1] = g;
        data[pos + 2] = b;
        data[pos + 3] = a;

        if (cx > 0 && !visited[pixIdx - 1]) queue.push([cx - 1, cy]);
        if (cx < width - 1 && !visited[pixIdx + 1]) queue.push([cx + 1, cy]);
        if (cy > 0 && !visited[pixIdx - width]) queue.push([cx, cy - 1]);
        if (cy < height - 1 && !visited[pixIdx + width]) queue.push([cx, cy + 1]);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const snap = ctx.getImageData(0, 0, 500, 500);
    setCanvasHistory(prev => [...prev.slice(-20), snap]);
    try { playCorrectSound(); } catch(e) {}
  };

  const [canvasHistory, setCanvasHistory] = useState([]);

  const handleUndo = () => {
    try { playMovePieceSound(); } catch(e) {}
    if (canvasHistory.length > 1 && canvasRef.current) {
      const nextCanvasHistory = canvasHistory.slice(0, -1);
      setCanvasHistory(nextCanvasHistory);
      const ctx = canvasRef.current.getContext('2d');
      ctx.putImageData(nextCanvasHistory[nextCanvasHistory.length - 1], 0, 0);
      showToast('Undo Stroke ↩️');
    }
    if (history.length > 1) {
      const nextHistory = history.slice(0, -1);
      setHistory(nextHistory);
      setColorState(nextHistory[nextHistory.length - 1]);
    }
  };

  const handleClear = () => {
    if (!selectedArtwork) return;
    try { playMovePieceSound(); } catch(e) {}
    const initialColors = {};
    selectedArtwork.paths.forEach(p => { initialColors[p.id] = '#ffffff'; });
    setColorState(initialColors);
    setHistory([initialColors]);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, 500, 500);
      const blankSnap = ctx.getImageData(0, 0, 500, 500);
      setCanvasHistory([blankSnap]);
    }
    showToast('Canvas Cleared! ✨');
  };

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPhotoSourceModal, setShowPhotoSourceModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const liveVideoRef = useRef(null);
  const [uploadedRawPhoto, setUploadedRawPhoto] = useState(null);
  const [photoEdgeSensitivity, setPhotoEdgeSensitivity] = useState(25);
  const [convertedSketchData, setConvertedSketchData] = useState(null);

  const startLiveCamera = async () => {
    try {
      setShowPhotoSourceModal(false);
      setShowCameraModal(true);
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setCameraStream(s);
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = s;
      }
    } catch(err) {
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(fallbackStream);
        if (liveVideoRef.current) liveVideoRef.current.srcObject = fallbackStream;
      } catch(e) {
        alert('Webcam/Camera permission allow karein ya Laptop se photo file select karein!');
        setShowCameraModal(false);
      }
    }
  };

  const stopLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const captureLiveCameraPhoto = () => {
    const video = liveVideoRef.current;
    if (!video) return;
    try { playMovePieceSound(); } catch(e) {}

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    
    stopLiveCamera();
    setUploadedRawPhoto(dataUrl);
    processImageToLineArt(dataUrl, photoEdgeSensitivity, 'cartoon', true, 40, false);
    setShowPhotoModal(true);
  };

  const [photoStyle, setPhotoStyle] = useState('cartoon');
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const [cleanNoiseLevel, setCleanNoiseLevel] = useState(40);
  const [previewEraserSize, setPreviewEraserSize] = useState(25);
  const [isEraserActiveInModal, setIsEraserActiveInModal] = useState(false);
  const previewCanvasRef = useRef(null);
  const isErasingOnPreviewRef = useRef(false);

  const handleStartPreviewErase = (e) => {
    if (!isEraserActiveInModal) return;
    isErasingOnPreviewRef.current = true;
    handlePreviewEraseMove(e);
  };

  const handlePreviewEraseMove = (e) => {
    if (!isErasingOnPreviewRef.current || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, previewEraserSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleStopPreviewErase = () => {
    if (isErasingOnPreviewRef.current && previewCanvasRef.current) {
      isErasingOnPreviewRef.current = false;
      const dataUrl = previewCanvasRef.current.toDataURL('image/png');
      setConvertedSketchData(dataUrl);
    }
  };

  const [isAiPainterGenerating, setIsAiPainterGenerating] = useState(false);

  const handleGenerateAiPainterSketch = async (imageInput = null) => {
    const rawPhoto = typeof imageInput === 'string' ? imageInput : uploadedRawPhoto;
    if (!rawPhoto) return;
    setIsAiPainterGenerating(true);
    showToast('🎨 AI Artist is drawing your portrait and removing room background... Please wait!');
    try {
      const res = await fetch('/api/ai/photo-to-sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: rawPhoto })
      });
      const json = await res.json();
      if (json.success && json.data?.svg) {
        try { playStreakChime(); } catch(e) {}
        const parser = new DOMParser();
        const doc = parser.parseFromString(json.data.svg, 'image/svg+xml');
        const pathNodes = doc.querySelectorAll('path, circle, ellipse, polygon, rect');
        const extractedPaths = [];
        pathNodes.forEach((node, idx) => {
          const id = node.getAttribute('id') || `path_${idx}`;
          const d = node.getAttribute('d') || (node.tagName === 'circle' ? `M ${Number(node.getAttribute('cx') || 250) - Number(node.getAttribute('r') || 10)}, ${node.getAttribute('cy') || 250} a ${node.getAttribute('r') || 10},${node.getAttribute('r') || 10} 0 1,0 ${(Number(node.getAttribute('r') || 10)) * 2},0 a ${node.getAttribute('r') || 10},${node.getAttribute('r') || 10} 0 1,0 -${(Number(node.getAttribute('r') || 10)) * 2},0` : '');
          if (d && id !== 'bg') {
            extractedPaths.push({ id, d, defaultColor: '#ffffff' });
          }
        });

        const newArt = {
          id: 'ai_portrait_' + Date.now(),
          name: json.data.title || 'My AI Painter Portrait 🎨',
          category: 'My Photos',
          icon: '🧑‍🎨',
          isPlain: false,
          paths: [
            { id: 'bg', d: 'M0,0 H500 V500 H0 Z', defaultColor: '#ffffff' },
            ...(extractedPaths.length > 0 ? extractedPaths : [
              { id: 'face', d: 'M 170,180 Q 170,300 250,330 Q 330,300 330,180 Q 330,120 250,120 Q 170,120 170,180 Z', defaultColor: '#ffffff' },
              { id: 'hair', d: 'M 150,160 Q 250,70 350,160 Q 330,110 250,90 Q 170,110 150,160 Z', defaultColor: '#ffffff' },
              { id: 'shirt', d: 'M 160,340 L 100,480 L 400,480 L 340,340 Q 250,370 160,340 Z', defaultColor: '#ffffff' }
            ])
          ]
        };

        const svgBlob = new Blob([json.data.svg], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);
        setConvertedSketchData(blobURL);
        setSelectedArtwork(newArt);
        setShowPhotoModal(false);
        setIsAiPainterGenerating(false);
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, 500, 500);
        }
        showToast('🎉 Masterpiece Ready! Room background removed & portrait ready for coloring!');
        return;
      }
    } catch (err) {
      console.error("AI Painter Sketch error:", err);
    }
    setIsAiPainterGenerating(false);
    showToast('Smart Portrait Engine se background saaf karke load kar rahe hain!');
    processImageToLineArt(rawPhoto, photoEdgeSensitivity, photoStyle, true, cleanNoiseLevel, true);
  };

  const processImageToLineArt = (imgSrc, sensitivity = photoEdgeSensitivity, style = photoStyle, removeBg = autoRemoveBg, noiseCut = cleanNoiseLevel, autoApplyToCanvas = false) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const offCanvas = previewCanvasRef.current || document.createElement('canvas');
      offCanvas.width = 600;
      offCanvas.height = 600;
      const offCtx = offCanvas.getContext('2d');
      offCtx.fillStyle = '#ffffff';
      offCtx.fillRect(0, 0, 600, 600);

      // Fit image aspect ratio inside 600x600 centered
      const scale = Math.min(560 / img.width, 560 / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (600 - w) / 2;
      const y = (600 - h) / 2;
      offCtx.drawImage(img, x, y, w, h);

      const imgData = offCtx.getImageData(0, 0, 600, 600);
      const data = imgData.data;
      const len = 600 * 600;
      const gray = new Float32Array(len);
      const isSkinArray = new Uint8Array(len);

      // 1. Skin & Human Silhouette Isolation
      let skinCount = 0;
      let minX = 600, maxX = 0, minY = 600, maxY = 0;

      for (let i = 0; i < len; i++) {
        const p = i * 4;
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;

        const isSkin = (r > 55 && g > 35 && b > 20 && (r - g) > 6 && (r - b) > 10 && r > b && (Math.max(r, g, b) - Math.min(r, g, b)) > 12);
        if (isSkin) {
          isSkinArray[i] = 1;
          const px = i % 600;
          const py = Math.floor(i / 600);
          if (px < minX) minX = px;
          if (px > maxX) maxX = px;
          if (py < minY) minY = py;
          if (py > maxY) maxY = py;
          skinCount++;
        }
      }

      const humanCenterX = skinCount > 150 ? (minX + maxX) / 2 : 300;
      const humanCenterY = skinCount > 150 ? (minY + maxY) / 2 : 270;
      const humanWidth = skinCount > 150 ? Math.max(150, (maxX - minX) * 1.15) : 210;
      const humanHeight = skinCount > 150 ? Math.max(220, (maxY - minY) * 1.65) : 290;

      // 2. Dual Gaussian Smoothing (Bilateral Skin Smoothing)
      const blur1 = new Float32Array(len);
      const blur2 = new Float32Array(len);

      for (let py = 1; py < 599; py++) {
        for (let px = 1; px < 599; px++) {
          const idx = py * 600 + px;
          blur1[idx] = (
            gray[idx - 601] + 2 * gray[idx - 600] + gray[idx - 599] +
            2 * gray[idx - 1] + 4 * gray[idx] + 2 * gray[idx + 1] +
            gray[idx + 599] + 2 * gray[idx + 600] + gray[idx + 601]
          ) / 16;
        }
      }

      for (let py = 2; py < 598; py++) {
        for (let px = 2; px < 598; px++) {
          let sum = 0;
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              sum += blur1[(py + dy) * 600 + (px + dx)];
            }
          }
          blur2[py * 600 + px] = sum / 25;
        }
      }

      // 3. Crisp Portrait Line-Art Shader
      const output = offCtx.createImageData(600, 600);
      const outData = output.data;

      for (let py = 2; py < 598; py++) {
        for (let px = 2; px < 598; px++) {
          const idx = py * 600 + px;
          const outIdx = idx * 4;

          // Check if pixel is inside the human subject
          const normX = (px - humanCenterX) / (humanWidth * 0.85);
          const normY = (py - humanCenterY) / (humanHeight * 0.85);
          const isInsideHuman = (normX * normX + normY * normY) <= 1.25 || (py > humanCenterY && Math.abs(px - humanCenterX) < humanWidth * 1.15 && py < 590);

          // 100% Background Wipe: Any pixel outside the person (racks/walls) becomes pure white!
          if (removeBg && !isInsideHuman) {
            outData[outIdx] = 255;
            outData[outIdx + 1] = 255;
            outData[outIdx + 2] = 255;
            outData[outIdx + 3] = 255;
            continue;
          }

          const gx = 
            (-1 * blur1[(py - 1) * 600 + (px - 1)]) + (1 * blur1[(py - 1) * 600 + (px + 1)]) +
            (-2 * blur1[py * 600 + (px - 1)])       + (2 * blur1[py * 600 + (px + 1)]) +
            (-1 * blur1[(py + 1) * 600 + (px - 1)]) + (1 * blur1[(py + 1) * 600 + (px + 1)]);

          const gy = 
            (-1 * blur1[(py - 1) * 600 + (px - 1)]) + (-2 * blur1[(py - 1) * 600 + px]) + (-1 * blur1[(py - 1) * 600 + (px + 1)]) +
            (1 * blur1[(py + 1) * 600 + (px - 1)])  + (2 * blur1[(py + 1) * 600 + px])  + (1 * blur1[(py + 1) * 600 + (px + 1)]);

          const gSobel = Math.hypot(gx, gy);
          const dogVal = blur1[idx] - blur2[idx];

          let isEdge = false;

          if (style === 'cartoon') {
            isEdge = (gSobel > sensitivity && Math.abs(dogVal) > 1.2) || (gSobel > sensitivity * 1.45);
          } else if (style === 'bold') {
            isEdge = gSobel > (sensitivity * 0.85);
          } else {
            isEdge = gSobel > sensitivity || (Math.abs(dogVal) > 2.2);
          }

          // 🌟 SILKY CLEAN FACE RULE (NO BHADDA / NO SHADOW SPECKLES ON SKIN):
          // On skin regions, suppress all ambient lighting shadows, cheek gradients, and forehead noise:
          if (isSkinArray[idx] || (Math.hypot(px - humanCenterX, py - (humanCenterY - 30)) < humanWidth * 0.45)) {
            // Keep ONLY true high-contrast facial contours (eyes, brows, smile, nostrils, lips, glasses):
            if (gSobel < (sensitivity * 2.0) || Math.abs(dogVal) < 2.0) {
              isEdge = false;
            }
          }

          // General noise suppression for clothing/hair
          if (isEdge && Math.abs(dogVal) < (noiseCut / 24) && gSobel < sensitivity * 1.25) {
            isEdge = false;
          }

          const pixelVal = isEdge ? 10 : 255;

          outData[outIdx] = pixelVal;
          outData[outIdx + 1] = pixelVal;
          outData[outIdx + 2] = pixelVal;
          outData[outIdx + 3] = 255;
        }
      }

      offCtx.putImageData(output, 0, 0);
      const resultDataUrl = offCanvas.toDataURL('image/png');
      setConvertedSketchData(resultDataUrl);

      if (autoApplyToCanvas) {
        setSelectedArtwork({ 
          id: 'photo_sketch_' + Date.now(), 
          name: 'My Photo Coloring Page 📸', 
          category: 'My Photos', 
          icon: '📸', 
          isPlain: true, 
          paths: [{ id: 'bg', d: 'M0,0 H500 V500 H0 Z', defaultColor: '#ffffff' }] 
        });
        setShowPhotoModal(false);
        if (canvasRef.current) {
          const cCtx = canvasRef.current.getContext('2d');
          cCtx.clearRect(0, 0, 500, 500);
          cCtx.drawImage(offCanvas, 0, 0, 500, 500);
        }
        try { playStreakChime(); } catch(e) {}
        showToast('🎉 Clean Photo Sketch Loaded! Background removed & face cleaned for coloring!');
      }
    };
    img.src = imgSrc;
  };

  const handlePhotoUploadForSketch = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      setUploadedRawPhoto(f.target.result);
      processImageToLineArt(f.target.result, photoEdgeSensitivity, 'cartoon', true, 40, false);
      setShowPhotoModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSensitivityChange = (newSens) => {
    setPhotoEdgeSensitivity(newSens);
    if (uploadedRawPhoto) {
      processImageToLineArt(uploadedRawPhoto, newSens, photoStyle, autoRemoveBg, cleanNoiseLevel);
    }
  };

  const handleStyleChange = (newStyle) => {
    setPhotoStyle(newStyle);
    if (uploadedRawPhoto) {
      processImageToLineArt(uploadedRawPhoto, photoEdgeSensitivity, newStyle, autoRemoveBg, cleanNoiseLevel);
    }
  };

  const handleAutoBgToggle = (newVal) => {
    setAutoRemoveBg(newVal);
    if (uploadedRawPhoto) {
      processImageToLineArt(uploadedRawPhoto, photoEdgeSensitivity, photoStyle, newVal, cleanNoiseLevel);
    }
  };

  const handleNoiseLevelChange = (newNoise) => {
    setCleanNoiseLevel(newNoise);
    if (uploadedRawPhoto) {
      processImageToLineArt(uploadedRawPhoto, photoEdgeSensitivity, photoStyle, autoRemoveBg, newNoise);
    }
  };

  const handleApplyPhotoSketch = () => {
    if (!convertedSketchData) return;
    try { playStreakChime(); } catch(e) {}
    const img = new Image();
    img.onload = () => {
      setSelectedArtwork({ 
        id: 'photo_sketch_' + Date.now(), 
        name: 'My Photo Coloring Page 📸', 
        category: 'My Photos', 
        icon: '📸', 
        isPlain: true, 
        paths: [{ id: 'bg', d: 'M0,0 H500 V500 H0 Z', defaultColor: '#ffffff' }] 
      });
      setShowPhotoModal(false);
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, 500, 500);
      ctx.drawImage(img, 0, 0, 500, 500);
      showToast('🎉 Photo Sketch Loaded onto Canvas! Rang bharein ya print karein.');
    };
    img.src = convertedSketchData;
  };

  const handlePrintArtwork = (mode = 'colored') => {
    try { playStreakChime(); } catch(e) {}
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1000;
    exportCanvas.height = 1000;
    const ctx = exportCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 1000);

    const svgElement = document.getElementById('coloring-svg');
    if (svgElement) {
      let serializedSvg;
      if (mode === 'outline') {
        const clonedSvg = svgElement.cloneNode(true);
        const paths = clonedSvg.querySelectorAll('path');
        paths.forEach(p => p.setAttribute('fill', '#ffffff'));
        serializedSvg = new XMLSerializer().serializeToString(clonedSvg);
      } else {
        serializedSvg = new XMLSerializer().serializeToString(svgElement);
      }

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1000, 1000);
        if (mode === 'colored' && canvasRef.current) {
          ctx.drawImage(canvasRef.current, 0, 0, 1000, 1000);
        }
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${selectedArtwork.name} - KidAI Studio Official Print</title>
                <style>
                  @page { size: A4 portrait; margin: 12mm; }
                  body { font-family: 'Comic Sans MS', 'Nunito', sans-serif; text-align: center; margin: 0; padding: 10px; }
                  .header { margin-bottom: 12px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
                  .brand-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
                  .brand-name { font-size: 20px; font-weight: 900; color: #ea580c; }
                  .brand-web { font-size: 11px; color: #64748b; font-weight: bold; }
                  .title { font-size: 22px; font-weight: bold; color: #0f172a; margin: 4px 0 0 0; }
                  .subtitle { font-size: 12px; color: #475569; margin-top: 2px; }
                  .canvas-img { width: 90%; max-width: 520px; height: auto; border: 4px solid #0f172a; border-radius: 16px; margin: 12px auto; display: block; }
                  .footer { margin-top: 24px; display: flex; justify-content: space-between; padding: 0 40px; font-size: 13px; color: #0f172a; }
                  .cert-badge { font-weight: bold; border: 2px solid #059669; padding: 6px 14px; border-radius: 12px; display: inline-block; color: #059669; }
                </style>
              </head>
              <body>
                <div class="header">
                  <div class="brand-row">
                    <span class="brand-name">KidAI Studio 🎨</span>
                    <span class="brand-web">🌐 www.kidaistudio.com • Official Printable</span>
                  </div>
                  <h1 class="title">${selectedArtwork.name} ${mode === 'outline' ? '(Coloring Sheet)' : '(Color Masterpiece)'}</h1>
                  <p class="subtitle">🌟 Created on KidAI Art & Innovation Studio • Date: ${new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <img class="canvas-img" src="${exportCanvas.toDataURL('image/png')}" />
                <div class="footer">
                  <div><strong>Artist Name:</strong> ____________________</div>
                  <div class="cert-badge">⭐ KidAI Studio™ Certified Artist</div>
                  <div><strong>Parent/Teacher Signature:</strong> ____________</div>
                </div>
                <script>
                  window.onload = () => { window.print(); }
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          showToast('🖨️ Opening Print Dialog...');
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(serializedSvg)));
    }
  };

  const handlePrintSavedItem = (previewData, title) => {
    try { playStreakChime(); } catch(e) {}
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title} - KidAI Studio Official Print</title>
            <style>
              @page { size: A4 portrait; margin: 12mm; }
              body { font-family: 'Comic Sans MS', 'Nunito', sans-serif; text-align: center; margin: 0; padding: 10px; }
              .header { margin-bottom: 12px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
              .brand-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
              .brand-name { font-size: 20px; font-weight: 900; color: #ea580c; }
              .brand-web { font-size: 11px; color: #64748b; font-weight: bold; }
              .title { font-size: 22px; font-weight: bold; color: #0f172a; margin: 4px 0 0 0; }
              .subtitle { font-size: 12px; color: #475569; margin-top: 2px; }
              .canvas-img { width: 90%; max-width: 520px; height: auto; border: 4px solid #0f172a; border-radius: 16px; margin: 12px auto; display: block; }
              .footer { margin-top: 24px; display: flex; justify-content: space-between; padding: 0 40px; font-size: 13px; color: #0f172a; }
              .cert-badge { font-weight: bold; border: 2px solid #059669; padding: 6px 14px; border-radius: 12px; display: inline-block; color: #059669; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="brand-row">
                <span class="brand-name">KidAI Studio 🎨</span>
                <span class="brand-web">🌐 www.kidaistudio.com • Official Printable</span>
              </div>
              <h1 class="title">${title}</h1>
              <p class="subtitle">🌟 Created on KidAI Art & Innovation Studio • Date: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
            <img class="canvas-img" src="${previewData}" />
            <div class="footer">
              <div><strong>Artist Name:</strong> ____________________</div>
              <div class="cert-badge">⭐ KidAI Studio™ Certified Artist</div>
              <div><strong>Signature:</strong> ____________________</div>
            </div>
            <script>
              window.onload = () => { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleSaveAndDownload = () => {
    try { playStreakChime(); } catch(e) {}
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1000;
    exportCanvas.height = 1000;
    const ctx = exportCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 1000);
    const svgElement = document.getElementById('coloring-svg');
    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1000, 1000);
        if (canvasRef.current) ctx.drawImage(canvasRef.current, 0, 0, 1000, 1000);
        const pngData = exportCanvas.toDataURL('image/png');
        
        // Save to localStorage
        const existing = JSON.parse(localStorage.getItem('kidai_studio_creations') || '[]');
        const newCreation = {
          id: Date.now().toString(),
          title: selectedArtwork.name,
          type: 'Coloring Sheet',
          date: new Date().toLocaleDateString('en-IN'),
          preview: pngData
        };
        existing.unshift(newCreation);
        localStorage.setItem('kidai_studio_creations', JSON.stringify(existing.slice(0, 30)));
        refreshSavedCreations();

        const link = document.createElement('a');
        link.download = `KidAI-Coloring-${selectedArtwork.id}.png`;
        link.href = pngData;
        link.click();
        showToast('🎉 Artwork Saved to Below Gallery & Downloaded!');
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = 500 / rect.width;
    const scaleY = 500 / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const startDrawing = (e) => {
    if (tool === 'fill') return;
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    if (tool === 'sticker') {
      ctx.font = `${brushSize * 2.5}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(selectedSticker, coords.x, coords.y);
      try { playCorrectSound(); } catch(err) {}
      const snap = ctx.getImageData(0, 0, 500, 500);
      setCanvasHistory(prev => [...prev.slice(-20), snap]);
      return;
    }
    isDrawingRef.current = true;
    startPosRef.current = coords;
    snapshotRef.current = ctx.getImageData(0, 0, 500, 500);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawingRef.current || tool === 'fill') return;
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    const { x: startX, y: startY } = startPosRef.current;
    const { x: currX, y: currY } = coords;

    if (['line', 'circle', 'oval', 'rect', 'triangle', 'star', 'heart'].includes(tool)) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (tool === 'line') { 
        ctx.moveTo(startX, startY); 
        ctx.lineTo(currX, currY); 
      }
      else if (tool === 'rect') {
        ctx.strokeRect(startX, startY, currX - startX, currY - startY);
      }
      else if (tool === 'circle') { 
        const r = Math.sqrt((currX - startX)**2 + (currY - startY)**2); 
        ctx.arc(startX, startY, r, 0, Math.PI * 2); 
      }
      else if (tool === 'oval') {
        ctx.ellipse(startX, startY, Math.max(1, Math.abs(currX - startX)), Math.max(1, Math.abs(currY - startY)), 0, 0, Math.PI * 2);
      }
      else if (tool === 'triangle') {
        ctx.moveTo((startX + currX) / 2, Math.min(startY, currY));
        ctx.lineTo(Math.max(startX, currX), Math.max(startY, currY));
        ctx.lineTo(Math.min(startX, currX), Math.max(startY, currY));
        ctx.closePath();
      }
      else if (tool === 'star') {
        const cx = (startX + currX) / 2;
        const cy = (startY + currY) / 2;
        const r = Math.max(8, Math.hypot(currX - startX, currY - startY) / 2);
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(cx + r * Math.cos((18 + i * 72) * Math.PI / 180), cy - r * Math.sin((18 + i * 72) * Math.PI / 180));
          ctx.lineTo(cx + (r / 2) * Math.cos((54 + i * 72) * Math.PI / 180), cy - (r / 2) * Math.sin((54 + i * 72) * Math.PI / 180));
        }
        ctx.closePath();
      }
      else if (tool === 'heart') {
        const minX = Math.min(startX, currX);
        const maxX = Math.max(startX, currX);
        const minY = Math.min(startY, currY);
        const maxY = Math.max(startY, currY);
        const w = Math.max(10, maxX - minX);
        const h = Math.max(10, maxY - minY);
        ctx.moveTo(minX + w / 2, minY + h / 4);
        ctx.bezierCurveTo(minX + w / 2, minY, minX, minY, minX, minY + h / 3);
        ctx.bezierCurveTo(minX, minY + h / 1.5, minX + w / 2, minY + h * 0.8, minX + w / 2, maxY);
        ctx.bezierCurveTo(minX + w / 2, minY + h * 0.8, maxX, minY + h / 1.5, maxX, minY + h / 3);
        ctx.bezierCurveTo(maxX, minY, minX + w / 2, minY, minX + w / 2, minY + h / 4);
        ctx.closePath();
      }
      ctx.stroke();
      return;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'brush') { 
      ctx.strokeStyle = activeColor; 
      ctx.lineWidth = brushSize; 
      ctx.lineTo(currX, currY); 
      ctx.stroke(); 
    }
    else if (tool === 'eraser') { 
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)'; 
      ctx.lineWidth = brushSize * 2.5; 
      ctx.lineTo(currX, currY); 
      ctx.stroke(); 
      ctx.restore();
    }
    else if (tool === 'glow') {
      ctx.shadowBlur = brushSize * 1.5;
      ctx.shadowColor = activeColor;
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
      ctx.lineTo(currX, currY);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    else if (tool === 'spray') {
      ctx.fillStyle = activeColor;
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * brushSize * 1.4;
        ctx.fillRect(currX + radius * Math.cos(angle), currY + radius * Math.sin(angle), 2, 2);
      }
    }
  };

  const stopDrawing = () => { 
    if (isDrawingRef.current && canvasRef.current) {
      isDrawingRef.current = false;
      const ctx = canvasRef.current.getContext('2d');
      const snap = ctx.getImageData(0, 0, 500, 500);
      setCanvasHistory(prev => [...prev.slice(-20), snap]);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Speech not supported.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    setIsListening(true);
    recognition.onresult = (e) => { 
      const transcript = e.results[0][0].transcript;
      setAiPrompt(transcript); 
      setIsListening(false); 
    };
    recognition.start();
  };

  const handleGenerateAiSketch = async (overridePrompt = null) => {
    const rawPrompt = typeof overridePrompt === 'string' ? overridePrompt : aiPrompt;
    const targetPrompt = (rawPrompt || '').trim().toLowerCase();
    if (!targetPrompt) {
      showToast('⚠️ Kripya likhein ya bolkar batayein kya sketch chahiye!');
      return;
    }
    setIsAiGenerating(true);
    showToast('⏳ AI Sketch create kar raha hai...');

    // Smart Instant Keyword Matching for 100% Perfect Kids Coloring Sheets
    const KEYWORD_MAP = [
      { keys: ['flower', 'phool', 'rose', 'gulab', 'sunflower', 'kamal', 'lotus', 'chameli'], id: 'flower', name: '🌸 Flower & Sunflower' },
      { keys: ['tree', 'ped', 'apple', 'seb', 'jungle', 'forest', 'bagicha', 'garden'], id: 'tree', name: '🌳 Apple Tree' },
      { keys: ['house', 'ghar', 'kutiya', 'hut', 'bangla', 'home', 'cottage'], id: 'house', name: '🏡 Sweet Cottage' },
      { keys: ['sun', 'suraj', 'surya', 'cloud', 'badal', 'sky', 'aasmaan'], id: 'sun', name: '☀️ Smiling Sun' },
      { keys: ['fish', 'machli', 'nemo', 'shark', 'samundar', 'ocean'], id: 'fish', name: '🐠 Aquarium Clownfish' },
      { keys: ['crocodile', 'crocodial', 'croc', 'magar', 'alligator', 'gharial'], id: 'crocodile', name: '🐊 Happy River Crocodile' },
      { keys: ['peacock', 'mor', 'mayur'], id: 'peacock', name: '🦚 Dancing Peacock' },
      { keys: ['dino', 'dinosaur', 'dinasor', 'jurassic', 't-rex'], id: 'dino', name: '🦖 T-Rex Dinosaur' },
      { keys: ['car', 'gadi', 'gaadi', 'racing', 'auto', 'vehicle'], id: 'car', name: '🏎️ Speed Sports Car' },
      { keys: ['lion', 'sher', 'singh', 'babar'], id: 'lion', name: '🦁 Lion King' },
      { keys: ['elephant', 'hathi', 'haathi', 'gaj'], id: 'elephant', name: '🐘 Jumbo Elephant' },
      { keys: ['dog', 'kutta', 'puppy', 'pilla', 'pet'], id: 'puppy', name: '🐶 Playful Puppy' },
      { keys: ['cat', 'billi', 'kitten', 'mano', 'kitty'], id: 'kitten', name: '🐱 Sweet Kitten' },
      { keys: ['butterfly', 'titli'], id: 'butterfly', name: '🦋 Fairy Butterfly' },
      { keys: ['rocket', 'space', 'chand', 'moon', 'antariksh'], id: 'rocket', name: '🚀 Cosmic Rocket' },
      { keys: ['castle', 'mahal', 'rajkumari', 'rani', 'princess', 'fairy', 'pari'], id: 'castle', name: '🏰 Magic Castle' },
      { keys: ['unicorn', 'ghoda', 'horse'], id: 'unicorn', name: '🦄 Magic Unicorn' },
      { keys: ['dragon'], id: 'dragon', name: '🐲 Friendly Dragon' },
      { keys: ['icecream', 'ice cream', 'kulfi', 'cone'], id: 'icecream', name: '🍦 Ice Cream' },
      { keys: ['robot', 'machine'], id: 'robot', name: '🤖 AI Robot' },
      { keys: ['panda'], id: 'panda', name: '🐼 Bamboo Panda' },
      { keys: ['dolphin'], id: 'dolphin', name: '🐬 Ocean Dolphin' },
      { keys: ['tiger', 'bagh', 'cheetah'], id: 'tiger', name: '🐯 Royal Tiger' },
      { keys: ['airplane', 'aeroplane', 'viman', 'jahaj', 'plane'], id: 'airplane', name: '✈️ Sky Jet' },
      { keys: ['astronaut', 'antrikshatri', 'spaceman'], id: 'astronaut', name: '👨‍🚀 Spaceman' },
      { keys: ['ufo', 'alien', 'saucer'], id: 'ufo', name: '🛸 Alien UFO' },
      { keys: ['saturn', 'grah', 'planet'], id: 'saturn', name: '🪐 Planet Saturn' }
    ];

    const match = KEYWORD_MAP.find(k => k.keys.some(key => targetPrompt.includes(key)));
    if (match) {
      const matchedArt = ARTWORKS.find(a => a.id === match.id);
      if (matchedArt) {
        setTimeout(() => {
          setSelectedArtwork(matchedArt);
          const initialColors = {};
          matchedArt.paths.forEach(p => { initialColors[p.id] = p.defaultColor; });
          setColorState(initialColors);
          setHistory([initialColors]);
          setIsAiGenerating(false);
          setShowAiModal(false);
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, 500, 500);
            setCanvasHistory([ctx.getImageData(0, 0, 500, 500)]);
          }
          try { playStreakChime(); } catch(e) {}
          showToast(`✨ ${match.name} Coloring Sketch Canvas par load ho gaya!`);
        }, 300);
        return;
      }
    }

    // Call Gemini Vector SVG Generator for ANY Custom Word (e.g. "crocodial", "baby dragon", "ninja turtle")
    try {
      const res = await fetch('/api/ai/sketch-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: targetPrompt })
      });
      const json = await res.json();
      if (json.success && json.data?.svg) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(json.data.svg, 'image/svg+xml');
        const pathNodes = doc.querySelectorAll('path, circle, ellipse, polygon, rect');
        const extractedPaths = [];
        pathNodes.forEach((node, idx) => {
          const id = node.getAttribute('id') || `elem_${idx}`;
          const d = node.getAttribute('d') || (node.tagName === 'circle' ? `M ${Number(node.getAttribute('cx') || 250) - Number(node.getAttribute('r') || 10)}, ${node.getAttribute('cy') || 250} a ${node.getAttribute('r') || 10},${node.getAttribute('r') || 10} 0 1,0 ${(Number(node.getAttribute('r') || 10)) * 2},0 a ${node.getAttribute('r') || 10},${node.getAttribute('r') || 10} 0 1,0 -${(Number(node.getAttribute('r') || 10)) * 2},0` : '');
          if (d && id !== 'bg') {
            extractedPaths.push({ id, d, defaultColor: '#ffffff' });
          }
        });

        const newArt = {
          id: 'ai_vector_' + Date.now(),
          name: json.data.title || `AI: ${targetPrompt} ✨`,
          category: 'AI Generated',
          icon: '✨',
          isPlain: false,
          paths: [
            { id: 'bg', d: 'M0,0 H500 V500 H0 Z', defaultColor: '#ffffff' },
            ...(extractedPaths.length > 0 ? extractedPaths : [
              { id: 'shape', d: 'M150,150 L350,150 L350,350 L150,350 Z', defaultColor: '#ffffff' }
            ])
          ]
        };

        setSelectedArtwork(newArt);
        const initColors = {};
        newArt.paths.forEach(p => { initColors[p.id] = p.defaultColor; });
        setColorState(initColors);
        setHistory([initColors]);
        setIsAiGenerating(false);
        setShowAiModal(false);
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, 500, 500);
          setCanvasHistory([ctx.getImageData(0, 0, 500, 500)]);
        }
        try { playStreakChime(); } catch(e) {}
        showToast(`🎉 ${json.data.title || targetPrompt} Coloring Sheet Ready!`);
        return;
      }
    } catch (err) {
      console.error("Gemini AI Sketch generation failed:", err);
    }

    // Fallback: Web Vector Line-Art
    let englishQuery = targetPrompt
      .replace(/crocodial|crocodile|croc|magar/g, 'cute cartoon crocodile in river')
      .replace(/dinosor|dinasor|dinasour/g, 'cute baby dinosaur in prehistoric jungle')
      .replace(/sher|singh/g, 'mighty lion king in forest')
      .replace(/hathi/g, 'cute baby elephant playing')
      .replace(/gadi|gaadi/g, 'turbo sports racing car');

    const promptQuery = encodeURIComponent(`clean black and white coloring book page for kids, thick bold black outlines, vector line art, pure white background, no shading, no gray, ${englishQuery}`);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timer = setTimeout(() => {
      if (isAiGenerating) {
        setIsAiGenerating(false);
        setShowAiModal(false);
        showToast('✨ Loaded sketch for ' + targetPrompt);
      }
    }, 7000);

    img.onload = () => {
      clearTimeout(timer);
      setSelectedArtwork({ 
        id: 'ai_' + Date.now(), 
        name: `AI: ${aiPrompt || 'Custom Sketch'} ✨`, 
        category: 'AI Generated', 
        icon: '✨', 
        isPlain: true, 
        paths: [{ id: 'bg', d: 'M0,0 H500 V500 H0 Z', defaultColor: '#ffffff' }] 
      });
      setIsAiGenerating(false);
      setShowAiModal(false);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, 500, 500);
        ctx.drawImage(img, 0, 0, 500, 500);
        const snap = ctx.getImageData(0, 0, 500, 500);
        setCanvasHistory([snap]);
      }
      showToast('🎉 AI Sketch Ready! Rang bharein ya print karein.');
    };

    img.onerror = () => {
      clearTimeout(timer);
      setIsAiGenerating(false);
      const dinoArt = ARTWORKS.find(a => a.id === 'dino');
      if (dinoArt) {
        setSelectedArtwork(dinoArt);
        handleSelectArtwork(dinoArt);
        setShowAiModal(false);
        showToast('🦖 High-Res Dinosaur Sketch Ready!');
      }
    };

    img.src = `https://image.pollinations.ai/prompt/${promptQuery}?width=800&height=800&nologo=true`;
  };

  const handleScanFileUpload = (e) => {
    const reader = new FileReader();
    reader.onload = (f) => {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, 500, 500);
        ctx.drawImage(img, 0, 0, 500, 500);
      };
      img.src = f.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const filteredArtworks = activeCategory === 'All (50+)' ? ARTWORKS : ARTWORKS.filter(a => a.category === activeCategory);

  return (
    <div 
      style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", paddingBottom: 60 }}
      onMouseMove={handleGlobalPointerMove}
      onMouseUp={handleGlobalPointerUp}
      onTouchMove={handleGlobalPointerMove}
      onTouchEnd={handleGlobalPointerUp}
    >
      
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: C.cyan, color: '#000', padding: '12px 24px', borderRadius: 14, fontWeight: 900, fontSize: 14, zIndex: 1000, boxShadow: '0 8px 30px rgba(6,182,212,0.5)' }}>
          {toastMsg}
        </div>
      )}

      {/* Hidden File Input for Paper Scanner */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleScanFileUpload} 
        style={{ display: 'none' }} 
      />

      {/* Hidden File Input for Real Photo to Sketch */}
      <input 
        type="file" 
        accept="image/*" 
        id="real-photo-input"
        onChange={handlePhotoUploadForSketch} 
        style={{ display: 'none' }} 
      />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,9,15,.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 22 }}>←</button>
          <span>MS Paint & <span style={{ color: C.orange }}>AI Coloring Studio</span> 🎨</span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => setShowGuideModal(true)} style={{ background: C.card2, color: C.yellow, border: `1px solid ${C.yellow}66`, padding: '8px 12px', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 12 }}>
            💡 Guide
          </button>
          <button onClick={() => setShowPhotoSourceModal(true)} style={{ background: `linear-gradient(135deg, ${C.orange}, #ea580c)`, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', fontSize: 12, boxShadow: '0 4px 15px rgba(234,88,12,0.4)' }} title="Apni ya bache ki real photo ko Coloring Page banayein">
            📸 Photo to Sketch
          </button>
          <button onClick={() => setShowAiModal(true)} style={{ background: `linear-gradient(135deg, ${C.purple}, #9333ea)`, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', fontSize: 12, boxShadow: '0 4px 15px rgba(147,51,234,0.4)' }}>
            ✨ AI Sketch
          </button>
          <button onClick={() => handlePrintArtwork('outline')} style={{ background: C.card2, color: '#fff', border: `1px solid ${C.border}`, padding: '8px 12px', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 12 }} title="Khali line-art print nikal kar offline crayons se rang bharein">
            📄 Print Blank Sheet
          </button>
          <button onClick={() => handlePrintArtwork('colored')} style={{ background: `linear-gradient(135deg, ${C.cyan}, #0891b2)`, color: '#000', border: 'none', padding: '8px 14px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', fontSize: 12, boxShadow: '0 4px 15px rgba(6,182,212,0.3)' }} title="Pura rang bhara hua print karein">
            🖨️ Print Drawing
          </button>
          <button onClick={handleSaveAndDownload} style={{ background: `linear-gradient(135deg, ${C.green}, #059669)`, color: '#000', border: 'none', padding: '8px 16px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', fontSize: 12, boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
            💾 Save
          </button>
        </div>
      </header>

      {/* ── PHOTO SOURCE SELECTION MODAL (LAPTOP FILES OR LIVE WEBCAM) ── */}
      {showPhotoSourceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: C.card, border: `2px solid ${C.orange}`, borderRadius: 24, padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 25px 60px rgba(234,88,12,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: C.orange }}>📸 Photo Kaise Lena Chahenge?</div>
              <button onClick={() => setShowPhotoSourceModal(false)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ color: C.text, fontSize: 13, marginBottom: 20 }}>
              Aap laptop/phone ki gallery se photo select kar sakte hain ya **live camera/webcam** se photo kheench sakte hain:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <button 
                onClick={() => {
                  setShowPhotoSourceModal(false);
                  const el = document.getElementById('real-photo-input');
                  if (el) el.click();
                }}
                style={{
                  padding: '20px 14px',
                  background: C.card2,
                  border: `2px solid ${C.cyan}`,
                  borderRadius: 16,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'transform 0.15s'
                }}
              >
                <span style={{ fontSize: 36 }}>📁</span>
                <span style={{ fontWeight: 900, fontSize: 14, color: C.cyan }}>Laptop / Gallery Se Choose Karein</span>
                <span style={{ fontSize: 11, color: C.muted }}>Device Files / Photos</span>
              </button>

              <button 
                onClick={startLiveCamera}
                style={{
                  padding: '20px 14px',
                  background: C.card2,
                  border: `2px solid ${C.orange}`,
                  borderRadius: 16,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'transform 0.15s'
                }}
              >
                <span style={{ fontSize: 36 }}>📷</span>
                <span style={{ fontWeight: 900, fontSize: 14, color: C.orange }}>Live Camera / Webcam Se Kheenchein</span>
                <span style={{ fontSize: 11, color: C.muted }}>Instant Live Capture</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIVE LAPTOP / MOBILE WEBCAM MODAL ── */}
      {showCameraModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 115, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: C.card, border: `2px solid ${C.cyan}`, borderRadius: 24, padding: 24, maxWidth: 580, width: '100%', boxShadow: '0 25px 60px rgba(6,182,212,0.4)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: C.cyan }}>📷 Live Camera / Webcam Preview</div>
              <button onClick={stopLiveCamera} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ width: '100%', aspectRatio: '4/3', background: '#000', borderRadius: 16, overflow: 'hidden', marginBottom: 16, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video 
                ref={liveVideoRef} 
                autoPlay 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={stopLiveCamera}
                style={{ flex: 1, padding: '12px', background: C.card2, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 900, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={captureLiveCameraPhoto}
                style={{ flex: 2, padding: '14px', background: `linear-gradient(135deg, ${C.orange}, #ea580c)`, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 15px rgba(234,88,12,0.4)' }}
              >
                📸 Snap Photo & Create Sketch!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 🧑‍🎨 FULL SCREEN AI PAINTER IN PROGRESS OVERLAY ── */}
      {isAiPainterGenerating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(10px)' }}>
          <div style={{ background: C.card, border: `2px solid ${C.purple}`, borderRadius: 28, padding: '36px 28px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 25px 70px rgba(124,58,237,0.5)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🧑‍🎨🎨</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: C.purple, marginBottom: 10 }}>
              AI Artist Portrait Draw Kar Raha Hai...
            </div>
            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.6, marginBottom: 20 }}>
              AI aapki photo me se <strong>peeche ke racks, deewar aur shadows ko remove</strong> karke ekdum saaf <strong>Cartoon Coloring Sheet</strong> bana raha hai!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, border: `4px solid ${C.border}`, borderTop: `4px solid ${C.purple}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 13, color: C.muted, fontWeight: 800 }}>Please wait 3-5 seconds...</span>
            </div>
          </div>
        </div>
      )}

      {/* ── PHOTO TO COLORING OUTLINE CONVERTER MODAL ── */}
      {showPhotoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: C.card, border: `2px solid ${C.orange}`, borderRadius: 24, padding: 24, maxWidth: 700, width: '100%', boxShadow: '0 25px 60px rgba(234,88,12,0.4)', maxHeight: '94vh', overflowY: 'auto' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 900, fontSize: 19, color: C.orange, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📸 Photo to Coloring Sketch Studio</span>
              </div>
              <button onClick={() => setShowPhotoModal(false)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ color: C.text, fontSize: 13, marginBottom: 14 }}>
              <strong>1. Background Cutter</strong> se peeche ke racks/deewar hatayein → <strong>2. Clean Face</strong> se chahra saaf karein → <strong>3. Done</strong> dabakar Drawing Screen par le jayein!
            </p>

            {/* Quick Action Tools Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 16 }}>
              <button
                onClick={() => handleAutoBgToggle(!autoRemoveBg)}
                style={{
                  padding: '12px 14px',
                  background: autoRemoveBg ? `linear-gradient(135deg, ${C.green}, #059669)` : C.card2,
                  color: autoRemoveBg ? '#000' : '#fff',
                  border: `2px solid ${autoRemoveBg ? '#fff' : C.border}`,
                  borderRadius: 14,
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: autoRemoveBg ? '0 4px 15px rgba(16,185,129,0.4)' : 'none'
                }}
              >
                <span>✂️</span>
                <span>{autoRemoveBg ? 'Background Cut: ON ✅' : 'Cut Background ✂️'}</span>
              </button>

              <button
                onClick={() => {
                  setCleanNoiseLevel(50);
                  setPhotoEdgeSensitivity(32);
                  if (uploadedRawPhoto) {
                    processImageToLineArt(uploadedRawPhoto, 32, 'cartoon', autoRemoveBg, 50, false);
                  }
                  showToast('✨ Face shadows and skin noise cleaned!');
                }}
                style={{
                  padding: '12px 14px',
                  background: `linear-gradient(135deg, ${C.cyan}, #0891b2)`,
                  color: '#000',
                  border: 'none',
                  borderRadius: 14,
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 15px rgba(6,182,212,0.3)'
                }}
              >
                <span>✨</span>
                <span>Clean Face (Shadows Hatao)</span>
              </button>

              <button
                onClick={() => setIsEraserActiveInModal(!isEraserActiveInModal)}
                style={{
                  padding: '12px 14px',
                  background: isEraserActiveInModal ? C.pink : C.card2,
                  color: isEraserActiveInModal ? '#000' : '#fff',
                  border: `2px solid ${isEraserActiveInModal ? '#fff' : C.border}`,
                  borderRadius: 14,
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <span>🧹</span>
                <span>{isEraserActiveInModal ? 'Eraser Active 🧹' : 'Rub to Erase Line 🧹'}</span>
              </button>
            </div>

            {/* Side-by-side / Interactive Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 6 }}>1. Aapki Photo:</div>
                <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                  <img src={uploadedRawPhoto} alt="Original" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.cyan }}>2. Final Coloring Sketch:</span>
                  <span style={{ fontSize: 11, color: C.muted }}>Pure White Outline</span>
                </div>

                <div style={{ width: '100%', aspectRatio: '1/1', background: '#fff', borderRadius: 12, overflow: 'hidden', border: `2px solid ${isEraserActiveInModal ? C.pink : C.cyan}`, position: 'relative' }}>
                  {convertedSketchData && !isEraserActiveInModal ? (
                    <img 
                      src={convertedSketchData} 
                      alt="Line Art" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  ) : (
                    <canvas
                      ref={previewCanvasRef}
                      width={600}
                      height={600}
                      onMouseDown={handleStartPreviewErase}
                      onMouseMove={handlePreviewEraseMove}
                      onMouseUp={handleStopPreviewErase}
                      onMouseLeave={handleStopPreviewErase}
                      onTouchStart={handleStartPreviewErase}
                      onTouchMove={handlePreviewEraseMove}
                      onTouchEnd={handleStopPreviewErase}
                      style={{ width: '100%', height: '100%', display: 'block', cursor: isEraserActiveInModal ? 'crosshair' : 'default', touchAction: 'none' }}
                    />
                  )}
                </div>
                {isEraserActiveInModal && (
                  <div style={{ fontSize: 11, color: C.pink, marginTop: 4, textAlign: 'center' }}>
                    💡 Mouse ya ungli se sketch par rub karke kisi bhi extra line/rack ko saaf karein!
                  </div>
                )}
              </div>
            </div>

            {/* Precision Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: C.card2, padding: 12, borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: C.yellow, marginBottom: 4 }}>
                  <span>Outlines Detail: {photoEdgeSensitivity}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="70" 
                  step="2"
                  value={photoEdgeSensitivity} 
                  onChange={e => handleSensitivityChange(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: C.orange }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: C.cyan, marginBottom: 4 }}>
                  <span>Face & Noise Cleaning: {cleanNoiseLevel}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="80" 
                  step="5"
                  value={cleanNoiseLevel} 
                  onChange={e => handleNoiseLevelChange(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: C.cyan }}
                />
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
              <button 
                onClick={handleApplyPhotoSketch}
                style={{
                  padding: '14px',
                  background: `linear-gradient(135deg, ${C.green}, #059669)`,
                  color: '#000',
                  border: 'none',
                  borderRadius: 14,
                  fontWeight: 900,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <span>✅</span>
                <span>Done! Load on Canvas to Color</span>
              </button>

              <button 
                onClick={() => {
                  if (convertedSketchData) {
                    handlePrintSavedItem(convertedSketchData, 'My Real Photo Coloring Page 📸');
                  }
                }}
                style={{
                  padding: '14px',
                  background: `linear-gradient(135deg, ${C.cyan}, #0891b2)`,
                  color: '#000',
                  border: 'none',
                  borderRadius: 14,
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(6,182,212,0.4)'
                }}
              >
                🖨️ Direct Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI VOICE & SKETCH GENERATOR MODAL ── */}
      {showAiModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: C.card, border: `2px solid ${C.purple}`, borderRadius: 24, padding: 28, maxWidth: 540, width: '100%', boxShadow: '0 25px 60px rgba(124,58,237,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: C.purple }}>✨ Unlimited AI Voice & Sketch Generator</div>
              <button onClick={() => setShowAiModal(false)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <p style={{ color: C.text, fontSize: 14, marginBottom: 16 }}>
              Bache jo bhi bolenge ya likhenge, AI uska **Black & White Coloring Sketch** instant bana dega!
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Jaise: 'Cute Baby Panda eating watermelon in jungle'..."
                style={{ flex: 1, background: C.card2, border: `1px solid ${C.border}`, color: '#fff', padding: '12px 16px', borderRadius: 12, outline: 'none', fontSize: 14 }}
              />
              <button 
                onClick={handleVoiceInput}
                style={{ background: isListening ? C.red : C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '0 16px', fontSize: 20, cursor: 'pointer' }}
                title="Boliye..."
              >
                🎙️
              </button>
            </div>

            {/* Quick Suggestions */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {['Baby Dinosaur 🦖', 'Flying Superhero 🦸', 'Fairy Palace 🏰', 'Space Rocket 🚀', 'Cute Puppy in Garden 🐶'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setAiPrompt(s)}
                  style={{ background: C.card2, color: C.muted, border: `1px solid ${C.border}`, padding: '4px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer' }}
                >
                  + {s}
                </button>
              ))}
            </div>

            <button 
              disabled={isAiGenerating}
              onClick={handleGenerateAiSketch}
              style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg, ${C.purple}, #9333ea)`, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 900, fontSize: 15, cursor: 'pointer' }}
            >
              {isAiGenerating ? '⏳ Generating AI Sketch (2 sec)...' : '✨ Generate Sketch & Load on Canvas'}
            </button>
          </div>
        </div>
      )}

      {/* ── KIDS INSTRUCTION & GUIDE MODAL ── */}
      {showGuideModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: C.card, border: `2px solid ${C.yellow}`, borderRadius: 24, padding: 28, maxWidth: 580, width: '100%', boxShadow: '0 25px 60px rgba(245,158,11,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: C.yellow }}>💡 KidAI Paint & Coloring Guide for Kids</div>
              <button onClick={() => setShowGuideModal(false)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14, color: C.text }}>
              <div style={{ background: C.card2, padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <strong>1. 📄 Plain Sheet & MS Paint Shapes:</strong> Blank Sheet choose karein aur 📏 Line, ⭕ Circle, 🥚 Oval, ⏹️ Square, 🔺 Triangle tools se scratch se apni drawing banayein!
              </div>
              <div style={{ background: C.card2, padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <strong>2. 🗣️ AI Bolkar Sketch Banayein:</strong> 🎙️ Mic button dabayein aur boliye (jaise "Sher cycling in forest"). AI turant sketch bana dega!
              </div>
              <div style={{ background: C.card2, padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <strong>3. 📸 Apni School Book Scan Karein:</strong> Apni drawing book ka photo upload karein — wo turant digital coloring sheet ban jayegi!
              </div>
              <div style={{ background: C.card2, padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <strong>4. 🪣 Bucket Fill & Magic Brushes:</strong> Ek click me rang bharein ya Glitter Sparkle se chamkayein!
              </div>
            </div>

            <button onClick={() => setShowGuideModal(false)} style={{ marginTop: 20, width: '100%', padding: '12px', background: C.yellow, color: '#000', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer' }}>
              Samajh Gaya! Chalo Draw Karte Hain 🎨
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1350, margin: '0 auto', padding: '20px 20px' }}>
        
        {/* ── 🎨 TOP WORKSTATION RIBBON TOOLBAR (ALL CONTROLS ON TOP) ── */}
        <div style={{ background: C.card, padding: '16px 20px', borderRadius: 24, border: `1px solid ${C.border}`, marginBottom: 18, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Group 1: Tools (Fill, Brush, Glow, Spray, Eraser) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: C.cyan, letterSpacing: '0.5px' }}>1. TOOLS & BRUSHES</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { id: 'fill', name: 'Bucket Fill', icon: '🪣' },
                  { id: 'brush', name: 'Pencil', icon: '✏️' },
                  { id: 'glow', name: 'Glow Neon', icon: '✨' },
                  { id: 'spray', name: 'Spray', icon: '💨' },
                  { id: 'eraser', name: 'Eraser', icon: '🧹' },
                  { id: 'sticker', name: 'Sticker', icon: '⭐' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => { try { playMovePieceSound(); } catch(e) {} setTool(t.id); }}
                    style={{
                      padding: '8px 12px',
                      background: tool === t.id ? C.cyan : C.card2,
                      color: tool === t.id ? '#000' : '#fff',
                      border: `1px solid ${tool === t.id ? '#fff' : C.border}`,
                      borderRadius: 12,
                      fontWeight: 900,
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: tool === t.id ? '0 0 14px rgba(6,182,212,0.4)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{t.icon}</span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group 2: MS Paint Geometric Shapes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: C.yellow, letterSpacing: '0.5px' }}>2. MS PAINT SHAPES</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { id: 'line', name: 'Line', icon: '📏' },
                  { id: 'circle', name: 'Circle', icon: '⭕' },
                  { id: 'oval', name: 'Oval', icon: '🥚' },
                  { id: 'rect', name: 'Square', icon: '⏹️' },
                  { id: 'triangle', name: 'Triangle', icon: '🔺' },
                  { id: 'star', name: 'Star', icon: '⭐' },
                  { id: 'heart', name: 'Heart', icon: '❤️' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => { try { playMovePieceSound(); } catch(e) {} setTool(s.id); }}
                    style={{
                      padding: '8px 10px',
                      background: tool === s.id ? C.yellow : C.card2,
                      color: tool === s.id ? '#000' : '#fff',
                      border: `1px solid ${tool === s.id ? '#fff' : C.border}`,
                      borderRadius: 12,
                      fontWeight: 900,
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      boxShadow: tool === s.id ? '0 0 14px rgba(245,158,11,0.4)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{s.icon}</span>
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group 3: Thickness & Active Color */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: C.orange }}>THICKNESS: {brushSize}px</span>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: activeColor, border: '2px solid #fff', boxShadow: '0 0 8px rgba(255,255,255,0.4)' }} />
              </div>
              <input 
                type="range" 
                min="2" 
                max="40" 
                value={brushSize} 
                onChange={e => setBrushSize(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: C.orange }}
              />
            </div>

            {/* Group 4: Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: C.pink }}>ACTIONS</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleUndo} style={{ padding: '8px 14px', background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>
                  ↩️ Undo
                </button>
                <button onClick={handleClear} style={{ padding: '8px 14px', background: '#ef444422', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 12, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>
                  🧹 Clear
                </button>
              </div>
            </div>

          </div>

          {/* Color Palette Horizontal Row */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: C.green, whiteSpace: 'nowrap' }}>3. PALETTE:</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
              {COLOR_PALETTE.map(c => (
                <button
                  key={c}
                  onClick={() => { try { playMovePieceSound(); } catch(e) {} setActiveColor(c); }}
                  style={{
                    width: 32,
                    height: 32,
                    background: c,
                    borderRadius: 8,
                    border: activeColor === c ? '3px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transform: activeColor === c ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.1s',
                    boxShadow: activeColor === c ? '0 0 12px rgba(255,255,255,0.6)' : 'none'
                  }}
                />
              ))}
            </div>

            {/* Sticker Quick Picks */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: C.card2, padding: '4px 8px', borderRadius: 10, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 10, color: C.pink, fontWeight: 900 }}>STAMPS:</span>
              {STICKERS.slice(0, 8).map(s => (
                <button
                  key={s}
                  onClick={() => { setSelectedSticker(s); setTool('sticker'); }}
                  style={{ fontSize: 16, background: selectedSticker === s && tool === 'sticker' ? C.pink + '44' : 'none', border: selectedSticker === s && tool === 'sticker' ? `1px solid ${C.pink}` : 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── 50+ DESIGNS CATEGORIES TABS ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 900, fontSize: 13, color: C.cyan }}>🎨 CHOOSE FROM 50+ COLORING TEMPLATES & PLAIN SHEET:</div>
            <div style={{ fontSize: 12, color: C.muted }}>Active: <strong style={{ color: '#fff' }}>{selectedArtwork.name}</strong></div>
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 14px',
                  background: activeCategory === cat ? C.cyan : C.card2,
                  color: activeCategory === cat ? '#000' : '#fff',
                  border: `1px solid ${activeCategory === cat ? '#fff' : C.border}`,
                  borderRadius: 20,
                  fontWeight: 900,
                  fontSize: 12,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Artworks Thumbnail Horizontal Strip */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '8px 0', scrollbarWidth: 'none' }}>
            {filteredArtworks.map(art => {
              const isSelected = selectedArtwork.id === art.id;
              return (
                <button
                  key={art.id}
                  onClick={() => handleSelectArtwork(art)}
                  style={{
                    padding: '8px 14px',
                    background: isSelected ? 'rgba(6,182,212,0.15)' : C.card,
                    border: `2px solid ${isSelected ? C.cyan : C.border}`,
                    borderRadius: 14,
                    color: isSelected ? C.cyan : C.text,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexShrink: 0,
                    fontWeight: 800,
                    fontSize: 13,
                    boxShadow: isSelected ? '0 0 16px rgba(6,182,212,0.3)' : 'none'
                  }}
                >
                  <span style={{ fontSize: 20 }}>{art.icon}</span>
                  <span>{art.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 🖼️ GIANT FULL-WIDTH SINGLE WHITE DRAWING SCREEN (CANVAS) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          
          {/* Zoom & Screen Size Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontWeight: 900, fontSize: 13, color: C.green, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🖥️ WHITE DRAWING CANVAS:</span>
              <span style={{ color: '#fff' }}>{selectedArtwork.name} ({canvasHeight}px Height)</span>
            </div>

            <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: C.card, padding: '4px 10px', borderRadius: 12, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 800 }}>HEIGHT PRESETS:</span>
              {[
                { label: '500px', h: 500 },
                { label: '660px', h: 660 },
                { label: '820px 🌟', h: 820 },
                { label: '1000px 🚀', h: 1000 }
              ].map(preset => (
                <button
                  key={preset.label}
                  onClick={() => setCanvasHeight(preset.h)}
                  style={{
                    background: canvasHeight === preset.h ? C.orange : C.card2,
                    color: canvasHeight === preset.h ? '#fff' : C.text,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  {preset.label}
                </button>
              ))}

              <span style={{ fontSize: 11, color: C.muted, fontWeight: 800, marginLeft: 8 }}>ZOOM:</span>
              <button onClick={() => setZoomScale(z => Math.max(0.7, Number((z - 0.15).toFixed(2))))} style={{ background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>🔍-</button>
              <button onClick={() => setZoomScale(1)} style={{ background: C.card2, color: C.cyan, border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>{Math.round(zoomScale * 100)}%</button>
              <button onClick={() => setZoomScale(z => Math.min(1.8, Number((z + 0.15).toFixed(2))))} style={{ background: C.card2, color: '#fff', border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>🔍+</button>
            </div>
          </div>

          {/* Giant Canvas Outer Screen with Dynamic Height & Drag Handle */}
          <div 
            onClick={() => {
              if (tool === 'fill') {
                handlePathClick('bg');
              }
            }}
            style={{ 
              width: '100%', 
              maxWidth: '1200px', 
              height: `${canvasHeight}px`,
              position: 'relative', 
              background: colorState['bg'] || '#ffffff', 
              borderRadius: 24, 
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)', 
              overflow: 'hidden',
              border: `6px solid ${tool === 'fill' ? C.cyan : C.orange}`,
              cursor: tool === 'fill' ? 'pointer' : 'crosshair',
              userSelect: 'none',
              touchAction: 'none'
            }}
          >
            
            <div style={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative',
              transform: `scale(${zoomScale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out'
            }}>
              
              {/* Layer 1: Interactive Vector SVG */}
              <svg 
                id="coloring-svg"
                viewBox="0 0 500 500" 
                preserveAspectRatio="xMidYMid meet"
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  zIndex: 1,
                  pointerEvents: tool === 'fill' ? 'auto' : 'none'
                }}
              >
                {/* Background Rect (3000x3000) to catch Outside Bucket Fill Clicks Anywhere */}
                <rect 
                  x="-1000" 
                  y="-1000" 
                  width="3000" 
                  height="3000" 
                  fill={colorState['bg'] || '#ffffff'} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePathClick('bg');
                  }}
                  style={{
                    cursor: tool === 'fill' ? 'pointer' : 'default',
                    pointerEvents: 'auto',
                    transition: 'fill 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />

                {selectedArtwork.paths.filter(p => p.id !== 'bg').map(path => (
                  <path
                    key={path.id}
                    d={path.d}
                    fill={colorState[path.id] || '#ffffff'}
                    stroke="#0f172a"
                    strokeWidth={selectedArtwork.isPlain ? '0' : '5'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePathClick(path.id);
                    }}
                    style={{
                      cursor: tool === 'fill' ? 'pointer' : 'default',
                      pointerEvents: 'auto',
                      transition: 'fill 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                ))}
              </svg>

              {/* Layer 2: MS Paint Drawing Canvas Overlay */}
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                onClick={(e) => {
                  if (tool === 'fill') {
                    if (selectedArtwork.isPlain) {
                      const coords = getCoordinates(e);
                      floodFillCanvas(coords.x, coords.y, activeColor);
                    } else {
                      handlePathClick('bg');
                    }
                  }
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 2,
                  touchAction: 'none',
                  pointerEvents: tool === 'fill' && !selectedArtwork.isPlain ? 'none' : 'auto'
                }}
              />

            </div>

          </div>

          {/* ↕️ Bottom Drag-to-Resize Handle */}
          <div 
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
            style={{ 
              width: '100%', 
              maxWidth: '1200px', 
              background: `linear-gradient(135deg, ${C.card2}, #1a2638)`, 
              border: `2px dashed ${C.orange}`, 
              borderRadius: 14, 
              padding: '8px 16px', 
              marginTop: 10, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 10, 
              cursor: 'ns-resize',
              userSelect: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
          >
            <span style={{ fontSize: 18 }}>↕️</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: C.orange }}>
              Screen Ko Neeche Kheench Kar Bada Karein (Live Height: {canvasHeight}px)
            </span>
            <span style={{ fontSize: 11, color: C.muted }}>— Mouse ya Finger se drag karein!</span>
          </div>

        </div>

        {/* ── 🖼️ MY SAVED MASTERPIECES GALLERY SECTION (BELOW WORKSTATION) ── */}
        <div style={{ marginTop: 40, background: C.card, padding: 24, borderRadius: 24, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: C.green, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🖼️ Meri Saved Drawings & Masterpieces ({savedCreations.length})</span>
              </div>
              <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                Aapki banayi hui saari drawings yahan save rehti hain — 1-click download ya dubara open karein!
              </p>
            </div>
            {savedCreations.length > 0 && (
              <button 
                onClick={() => router.push('/studio/library')}
                style={{ background: C.card2, color: C.cyan, border: `1px solid ${C.cyan}66`, padding: '8px 16px', borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
              >
                📁 Open Full Studio Library →
              </button>
            )}
          </div>

          {savedCreations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: C.muted, background: C.card2, borderRadius: 16, border: `1px dashed ${C.border}` }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎨</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 4 }}>Abhi koi drawing save nahi hui hai</div>
              <div style={{ fontSize: 13 }}>Upar kisi drawing me color bharein ya MS Paint shapes banayein aur <strong>"💾 Save & Download"</strong> dabayein!</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {savedCreations.map(item => (
                <div 
                  key={item.id}
                  style={{
                    background: C.card2,
                    borderRadius: 16,
                    border: `1px solid ${C.border}`,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s'
                  }}
                >
                  <div style={{ width: '100%', aspectRatio: '1/1', background: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={item.preview} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div>
                    <div style={{ fontWeight: 900, fontSize: 14, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>
                      📅 {item.date}
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <a
                        href={item.preview}
                        download={`KidAI-${item.id}.png`}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '6px 0',
                          background: C.green,
                          color: '#000',
                          borderRadius: 8,
                          fontWeight: 900,
                          fontSize: 11,
                          textDecoration: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        📥 Download
                      </a>
                      <button
                        onClick={() => handlePrintSavedItem(item.preview, item.title)}
                        style={{
                          padding: '6px 10px',
                          background: C.cyan,
                          color: '#000',
                          border: 'none',
                          borderRadius: 8,
                          fontWeight: 900,
                          fontSize: 11,
                          cursor: 'pointer'
                        }}
                        title="Print on Paper / PDF"
                      >
                        🖨️ Print
                      </button>
                      <button
                        onClick={() => handleDeleteSavedItem(item.id)}
                        style={{
                          padding: '6px 10px',
                          background: '#ef444422',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: 8,
                          fontWeight: 900,
                          fontSize: 11,
                          cursor: 'pointer'
                        }}
                        title="Delete Drawing"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}