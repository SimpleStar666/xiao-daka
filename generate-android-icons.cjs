const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

const MIPMAP_SIZES = {
  'mipmap-mdpi':    { launcher: 48,  foreground: 108, round: 48  },
  'mipmap-hdpi':    { launcher: 72,  foreground: 162, round: 72  },
  'mipmap-xhdpi':   { launcher: 96,  foreground: 216, round: 96  },
  'mipmap-xxhdpi':  { launcher: 144, foreground: 324, round: 144 },
  'mipmap-xxxhdpi': { launcher: 192, foreground: 432, round: 192 },
};

function makeLauncherSvg(size) {
  const s = size;
  const rx = Math.round(s * 0.2);
  const checkStroke = Math.round(s * 0.085);
  const heartSize = s * 0.14;
  const heartCx = s * 0.78;
  const heartCy = s * 0.2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFB5C2"/>
      <stop offset="100%" stop-color="#FF8FA3"/>
    </linearGradient>
  </defs>
  <rect width="${s}" height="${s}" rx="${rx}" fill="url(#bg)"/>
  <polyline points="${s*0.3},${s*0.52} ${s*0.44},${s*0.66} ${s*0.7},${s*0.36}"
    fill="none" stroke="white" stroke-width="${checkStroke}"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M${heartCx},${heartCy + heartSize*0.3}
    C${heartCx - heartSize*0.5},${heartCy - heartSize*0.3}
     ${heartCx - heartSize*0.9},${heartCy + heartSize*0.1}
     ${heartCx},${heartCy + heartSize*0.8}
    C${heartCx + heartSize*0.9},${heartCy + heartSize*0.1}
     ${heartCx + heartSize*0.5},${heartCy - heartSize*0.3}
     ${heartCx},${heartCy + heartSize*0.3}Z"
    fill="white" opacity="0.9"/>
</svg>`;
}

function makeForegroundSvg(size) {
  const s = size;
  const safeRatio = 72 / 108;
  const safeSize = s * safeRatio;
  const offset = (s - safeSize) / 2;

  const cx = s / 2;
  const cy = s / 2;
  const checkStroke = Math.round(safeSize * 0.085);
  const heartSize = safeSize * 0.14;
  const heartCx = offset + safeSize * 0.82;
  const heartCy = offset + safeSize * 0.18;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <polyline points="${cx - safeSize*0.2},${cy + safeSize*0.02} ${cx - safeSize*0.06},${cy + safeSize*0.16} ${cx + safeSize*0.2},${cy - safeSize*0.14}"
    fill="none" stroke="white" stroke-width="${checkStroke}"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M${heartCx},${heartCy + heartSize*0.3}
    C${heartCx - heartSize*0.5},${heartCy - heartSize*0.3}
     ${heartCx - heartSize*0.9},${heartCy + heartSize*0.1}
     ${heartCx},${heartCy + heartSize*0.8}
    C${heartCx + heartSize*0.9},${heartCy + heartSize*0.1}
     ${heartCx + heartSize*0.5},${heartCy - heartSize*0.3}
     ${heartCx},${heartCy + heartSize*0.3}Z"
    fill="white" opacity="0.9"/>
</svg>`;
}

function makeRoundSvg(size) {
  const s = size;
  const r = s / 2;
  const checkStroke = Math.round(s * 0.085);
  const heartSize = s * 0.14;
  const heartCx = s * 0.78;
  const heartCy = s * 0.2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFB5C2"/>
      <stop offset="100%" stop-color="#FF8FA3"/>
    </linearGradient>
  </defs>
  <circle cx="${r}" cy="${r}" r="${r}" fill="url(#bg)"/>
  <polyline points="${s*0.3},${s*0.52} ${s*0.44},${s*0.66} ${s*0.7},${s*0.36}"
    fill="none" stroke="white" stroke-width="${checkStroke}"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M${heartCx},${heartCy + heartSize*0.3}
    C${heartCx - heartSize*0.5},${heartCy - heartSize*0.3}
     ${heartCx - heartSize*0.9},${heartCy + heartSize*0.1}
     ${heartCx},${heartCy + heartSize*0.8}
    C${heartCx + heartSize*0.9},${heartCy + heartSize*0.1}
     ${heartCx + heartSize*0.5},${heartCy - heartSize*0.3}
     ${heartCx},${heartCy + heartSize*0.3}Z"
    fill="white" opacity="0.9"/>
</svg>`;
}

async function generateIcons() {
  const tasks = [];

  for (const [dir, sizes] of Object.entries(MIPMAP_SIZES)) {
    const dirPath = path.join(BASE_DIR, dir);
    fs.mkdirSync(dirPath, { recursive: true });

    tasks.push(
      sharp(Buffer.from(makeLauncherSvg(sizes.launcher)))
        .resize(sizes.launcher, sizes.launcher)
        .png()
        .toFile(path.join(dirPath, 'ic_launcher.png'))
        .then(() => console.log(`  ✓ ${dir}/ic_launcher.png (${sizes.launcher}x${sizes.launcher})`))
    );

    tasks.push(
      sharp(Buffer.from(makeForegroundSvg(sizes.foreground)))
        .resize(sizes.foreground, sizes.foreground)
        .png()
        .toFile(path.join(dirPath, 'ic_launcher_foreground.png'))
        .then(() => console.log(`  ✓ ${dir}/ic_launcher_foreground.png (${sizes.foreground}x${sizes.foreground})`))
    );

    tasks.push(
      sharp(Buffer.from(makeRoundSvg(sizes.round)))
        .resize(sizes.round, sizes.round)
        .png()
        .toFile(path.join(dirPath, 'ic_launcher_round.png'))
        .then(() => console.log(`  ✓ ${dir}/ic_launcher_round.png (${sizes.round}x${sizes.round})`))
    );
  }

  await Promise.all(tasks);
  console.log('\nAll Android mipmap icons generated!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
