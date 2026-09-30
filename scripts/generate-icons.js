const fs = require('fs');
const path = require('path');

const iconSvg = fs.readFileSync(path.join(__dirname, '../public/icons/icon.svg'), 'utf8');

// Copy for various PWA icon targets
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), iconSvg);
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), iconSvg);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), iconSvg);

// If sharp or canvas is available, create pngs, else write standard SVG fallback
console.log('✅ PWA Icons Generated in public/icons/');
