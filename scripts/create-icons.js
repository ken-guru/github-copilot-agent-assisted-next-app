const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('Created icons directory');
}

// Simple SVG template for creating icons
function createSvgIcon(size, text, outputPath) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size/10}" fill="white" text-anchor="middle" dominant-baseline="middle">Mr. Timely</text>
  <text x="50%" y="65%" font-family="Arial" font-size="${size/15}" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;

  fs.writeFileSync(outputPath, svg);
  console.log(`Created icon: ${outputPath}`);
}

// Create required icons
createSvgIcon(192, '192×192', path.join(iconsDir, 'icon-192x192.svg'));
createSvgIcon(512, '512×512', path.join(iconsDir, 'icon-512x512.svg'));
createSvgIcon(180, 'Apple', path.join(iconsDir, 'apple-touch-icon.svg'));

// Create PNG versions (in a real project you'd use proper image conversion)
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

console.log('All icons created successfully');
