const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('Created icons directory');
}

// Clock-themed SVG icon template for Mr. Timely app
function createClockIcon(size, outputPath) {
  const center = size / 2;
  const radius = size * 0.35;
  const clockFaceRadius = size * 0.3;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Background circle with gradient -->
  <defs>
    <radialGradient id="grad${size}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3730a3;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- Main background circle -->
  <circle cx="${center}" cy="${center}" r="${radius}" fill="url(#grad${size})" stroke="#1e1b4b" stroke-width="${size * 0.02}"/>
  
  <!-- Clock face -->
  <circle cx="${center}" cy="${center}" r="${clockFaceRadius}" fill="#ffffff" stroke="#374151" stroke-width="${size * 0.01}"/>
  
  <!-- Hour markers -->
  ${Array.from({length: 12}, (_, i) => {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const x1 = center + Math.cos(angle) * clockFaceRadius * 0.85;
    const y1 = center + Math.sin(angle) * clockFaceRadius * 0.85;
    const x2 = center + Math.cos(angle) * clockFaceRadius * 0.75;
    const y2 = center + Math.sin(angle) * clockFaceRadius * 0.75;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#374151" stroke-width="${size * 0.008}" stroke-linecap="round"/>`;
  }).join('\n  ')}
  
  <!-- Clock hands pointing to 3:00 (representing time management) -->
  <!-- Hour hand -->
  <line x1="${center}" y1="${center}" x2="${center + clockFaceRadius * 0.5}" y2="${center}" stroke="#dc2626" stroke-width="${size * 0.015}" stroke-linecap="round"/>
  <!-- Minute hand -->
  <line x1="${center}" y1="${center}" x2="${center}" y2="${center - clockFaceRadius * 0.7}" stroke="#dc2626" stroke-width="${size * 0.01}" stroke-linecap="round"/>
  
  <!-- Center dot -->
  <circle cx="${center}" cy="${center}" r="${size * 0.02}" fill="#dc2626"/>
</svg>`;

  fs.writeFileSync(outputPath, svg);
  console.log(`Created clock icon: ${outputPath}`);
}

// Create all required icon sizes
createClockIcon(192, path.join(iconsDir, 'icon-192x192.svg'));
createClockIcon(512, path.join(iconsDir, 'icon-512x512.svg'));
createClockIcon(180, path.join(iconsDir, 'apple-touch-icon.svg'));

// For demonstration, copy SVG as PNG (in production you'd convert properly)
// The SVG versions will work fine for web app icons
fs.copyFileSync(
  path.join(iconsDir, 'icon-192x192.svg'),
  path.join(iconsDir, 'icon-192x192.png')
);
fs.copyFileSync(
  path.join(iconsDir, 'icon-512x512.svg'),
  path.join(iconsDir, 'icon-512x512.png')
);
fs.copyFileSync(
  path.join(iconsDir, 'apple-touch-icon.svg'),
  path.join(iconsDir, 'apple-touch-icon.png')
);

// Create favicon.ico equivalent as SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <radialGradient id="faviconGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3730a3;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <circle cx="16" cy="16" r="14" fill="url(#faviconGrad)" stroke="#1e1b4b" stroke-width="1"/>
  <circle cx="16" cy="16" r="10" fill="#ffffff" stroke="#374151" stroke-width="0.5"/>
  
  <!-- Clock hands at 3:00 -->
  <line x1="16" y1="16" x2="22" y2="16" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="16" y1="16" x2="16" y2="9" stroke="#dc2626" stroke-width="1" stroke-linecap="round"/>
  <circle cx="16" cy="16" r="1" fill="#dc2626"/>
</svg>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.svg'), faviconSvg);

console.log('All clock-themed icons created successfully for Mr. Timely app');
