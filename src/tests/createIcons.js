const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG icon with the specified size
function createSVGIcon(size, outputPath) {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#000"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size / 10}" fill="#fff" text-anchor="middle" dominant-baseline="middle">Mr. Timely</text>
  <text x="50%" y="65%" font-family="Arial" font-size="${size / 15}" fill="#fff" text-anchor="middle" dominant-baseline="middle">${size}x${size}</text>
</svg>`;
  
  fs.writeFileSync(outputPath, svg);
}

// Create the required icons
createSVGIcon(192, path.join(iconsDir, 'icon-192x192.png'));
createSVGIcon(512, path.join(iconsDir, 'icon-512x512.png'));
createSVGIcon(180, path.join(iconsDir, 'apple-touch-icon.png'));

console.log('Icons created successfully!');
