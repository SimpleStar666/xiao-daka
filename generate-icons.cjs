const sharp = require('sharp');

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFB5C2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8FA3;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bg)"/>
  <text x="256" y="300" font-family="Arial, sans-serif" font-size="260" text-anchor="middle" fill="white">🌸</text>
  <text x="256" y="430" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="white">打卡</text>
</svg>`;

const appleTouchIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFB5C2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8FA3;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="36" fill="url(#bg)"/>
  <text x="90" y="110" font-family="Arial, sans-serif" font-size="90" text-anchor="middle" fill="white">🌸</text>
</svg>`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <text y="28" font-size="28">🌸</text>
</svg>`;

async function generate() {
  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');

  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');

  await sharp(Buffer.from(appleTouchIcon))
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');

  require('fs').writeFileSync('public/favicon.svg', faviconSvg);

  console.log('Icons generated successfully!');
}

generate().catch(console.error);
