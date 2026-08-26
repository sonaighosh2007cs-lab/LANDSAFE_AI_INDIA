import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const width = 2560;
const height = 1440;

const generateSvg = () => {
  // Generate tech telemetry lines & nodes
  const nodes = [];
  for (let i = 0; i < 40; i++) {
    const x = Math.round(100 + Math.random() * (width - 200));
    const y = Math.round(60 + Math.random() * 800);
    nodes.push({ x, y, r: (Math.random() * 2 + 1.5).toFixed(1) });
  }

  const lines = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 280) {
        const opacity = ((1 - dist / 280) * 0.45).toFixed(2);
        lines.push(`<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="#38bdf8" stroke-width="1" stroke-opacity="${opacity}" stroke-dasharray="${dist > 190 ? '4,4' : 'none'}" />`);
      }
    }
  }

  // Skyline buildings
  const buildings = [];
  const windowRects = [];
  let curX = 0;
  while (curX < width) {
    const bWidth = Math.floor(35 + Math.random() * 60);
    const bHeight = Math.floor(200 + Math.random() * 320);
    const bY = height - bHeight;

    buildings.push(`<rect x="${curX}" y="${bY}" width="${bWidth}" height="${bHeight}" fill="#030814" stroke="#0e233d" stroke-width="1" />`);

    if (bHeight > 360 && Math.random() > 0.4) {
      const spireH = Math.floor(50 + Math.random() * 80);
      buildings.push(`<line x1="${curX + bWidth / 2}" y1="${bY}" x2="${curX + bWidth / 2}" y2="${bY - spireH}" stroke="#38bdf8" stroke-width="2" />`);
      buildings.push(`<circle cx="${curX + bWidth / 2}" cy="${bY - spireH}" r="3" fill="#ef4444" opacity="0.95" />`);
    }

    const cols = Math.floor((bWidth - 10) / 10);
    const rows = Math.floor((bHeight - 30) / 16);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.4) {
          const lx = curX + 6 + c * 10;
          const ly = bY + 20 + r * 15;
          const isAmber = Math.random() > 0.35;
          const color = isAmber ? '#fbbf24' : '#38bdf8';
          const opacity = (0.35 + Math.random() * 0.65).toFixed(2);
          windowRects.push(`<rect x="${lx}" y="${ly}" width="5" height="8" fill="${color}" opacity="${opacity}" rx="1" />`);
        }
      }
    }

    curX += bWidth + Math.floor(Math.random() * 10);
  }

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#020611" />
        <stop offset="35%" stop-color="#071328" />
        <stop offset="65%" stop-color="#0b2242" />
        <stop offset="85%" stop-color="#12345d" />
        <stop offset="100%" stop-color="#07101e" />
      </linearGradient>

      <radialGradient id="stormGlow" cx="28%" cy="30%" r="45%">
        <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.45" />
        <stop offset="40%" stop-color="#0f274a" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#020617" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="lightningAmbient" cx="540" cy="420" r="500" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.4" />
        <stop offset="40%" stop-color="#1e3a8a" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#020617" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="cityGlow" cx="50%" cy="100%" r="55%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.32" />
        <stop offset="40%" stop-color="#d97706" stop-opacity="0.16" />
        <stop offset="100%" stop-color="#020617" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Sky Background -->
    <rect width="${width}" height="${height}" fill="url(#skyGrad)" />

    <!-- Clouds & Lighting ambience -->
    <ellipse cx="650" cy="260" rx="800" ry="320" fill="url(#stormGlow)" />
    <ellipse cx="1900" cy="240" rx="750" ry="300" fill="url(#stormGlow)" />
    <rect width="${width}" height="${height}" fill="url(#lightningAmbient)" />

    <!-- Radar / HUD Matrix Overlays -->
    <g opacity="0.25">
      <circle cx="1280" cy="1440" r="1600" fill="none" stroke="#0ea5e9" stroke-width="1" stroke-dasharray="6,8" />
      <circle cx="1280" cy="1440" r="1200" fill="none" stroke="#38bdf8" stroke-width="0.8" stroke-dasharray="4,6" />
      <circle cx="1280" cy="1440" r="800" fill="none" stroke="#38bdf8" stroke-width="0.8" />
      <line x1="1280" y1="1440" x2="300" y2="120" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="5,8" />
      <line x1="1280" y1="1440" x2="800" y2="80" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="5,8" />
      <line x1="1280" y1="1440" x2="1800" y2="80" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="5,8" />
      <line x1="1280" y1="1440" x2="2280" y2="120" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="5,8" />
    </g>

    <!-- HUD Telemetry Nodes & Lines -->
    <g>
      ${lines.join('\n      ')}
      ${nodes.map(n => `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="#38bdf8" opacity="0.85" /><circle cx="${n.x}" cy="${n.y}" r="${parseFloat(n.r) * 2}" fill="none" stroke="#0284c7" stroke-width="0.5" opacity="0.6" />`).join('\n      ')}
    </g>

    <!-- Geographic HUD Coordinate Markers -->
    <g font-family="monospace" font-size="12" fill="#38bdf8" opacity="0.5" letter-spacing="1.5">
      <text x="120" y="160">LANDSAFE_AI // GEO_TELEMETRY: [27.0360° N, 88.2627° E]</text>
      <text x="120" y="185">RADAR BAND: 07 // HIGH_RES INTEL</text>
      <text x="2020" y="160">ATMOSPHERIC RISK MONITOR: ACTIVE</text>
      <text x="2020" y="185">EARLY_WARNING_SATELLITE // CONNECTED</text>
    </g>

    <!-- DRAMATIC LIGHTNING STRIKE (Left/Center-Left) -->
    <g>
      <!-- Wide Outer Atmospheric Halo -->
      <path d="M 560 40 L 535 160 L 570 270 L 525 390 L 575 520 L 540 680 L 595 820 L 555 980 L 620 1140 L 590 1280" 
            fill="none" stroke="#38bdf8" stroke-width="22" stroke-linecap="round" opacity="0.25" />

      <!-- Mid Blue Halo -->
      <path d="M 560 40 L 535 160 L 570 270 L 525 390 L 575 520 L 540 680 L 595 820 L 555 980 L 620 1140 L 590 1280" 
            fill="none" stroke="#60a5fa" stroke-width="10" stroke-linecap="round" opacity="0.65" />

      <!-- White/Cyan Core Bolt -->
      <path d="M 560 40 L 535 160 L 570 270 L 525 390 L 575 520 L 540 680 L 595 820 L 555 980 L 620 1140 L 590 1280" 
            fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />

      <!-- Branch 1 (Upper left) -->
      <path d="M 535 160 L 460 230 L 420 320 L 380 390" 
            fill="none" stroke="#60a5fa" stroke-width="4" opacity="0.6" />
      <path d="M 535 160 L 460 230 L 420 320 L 380 390" 
            fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.8" />

      <!-- Branch 2 (Mid right) -->
      <path d="M 525 390 L 600 450 L 660 500 L 710 570 L 750 630" 
            fill="none" stroke="#60a5fa" stroke-width="5" opacity="0.6" />
      <path d="M 525 390 L 600 450 L 660 500 L 710 570 L 750 630" 
            fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.85" />

      <!-- Branch 3 (Lower left) -->
      <path d="M 595 820 L 520 890 L 470 970 L 430 1040" 
            fill="none" stroke="#38bdf8" stroke-width="3.5" opacity="0.55" />
      <path d="M 595 820 L 520 890 L 470 970 L 430 1040" 
            fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.8" />

      <!-- Branch 4 (Lower right) -->
      <path d="M 555 980 L 640 1040 L 700 1120 L 730 1190" 
            fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.55" />
      <path d="M 555 980 L 640 1040 L 700 1120 L 730 1190" 
            fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.8" />

      <!-- Distant Right Secondary Strike -->
      <path d="M 1840 80 L 1810 200 L 1850 320 L 1820 460 L 1870 600" 
            fill="none" stroke="#60a5fa" stroke-width="4" opacity="0.5" />
      <path d="M 1840 80 L 1810 200 L 1850 320 L 1820 460 L 1870 600" 
            fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.75" />
    </g>

    <!-- Mountain Terrain Silhouettes -->
    <path d="M 0 1150 Q 300 1070, 680 1130 T 1400 1100 T 2100 1080 T 2560 1120 L 2560 1440 L 0 1440 Z" fill="#040c18" opacity="0.9" />

    <!-- City Amber Glow Field -->
    <rect x="0" y="1020" width="${width}" height="420" fill="url(#cityGlow)" />

    <!-- Modern City Buildings -->
    <g>
      ${buildings.join('\n      ')}
    </g>

    <!-- Illuminated Windows -->
    <g>
      ${windowRects.join('\n      ')}
    </g>

    <!-- Base Reflections on Water / Highway -->
    <rect x="0" y="1420" width="${width}" height="20" fill="#0284c7" opacity="0.15" />

    <!-- Vignette on top for clean contrast -->
    <rect width="${width}" height="220" fill="#020611" opacity="0.55" />
  </svg>
  `;
};

async function buildBackground() {
  const svg = generateSvg();
  
  const targets = [
    path.join(process.cwd(), 'public', 'LandSafe_AI_Login_Background_07_2560x1440.png'),
    path.join(process.cwd(), 'assets', 'LandSafe_AI_Login_Background_07_2560x1440.png'),
    path.join(process.cwd(), 'src', 'assets', 'LandSafe_AI_Login_Background_07_2560x1440.png'),
  ];

  for (const target of targets) {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  console.log('Rendering 2560x1440 background image...');
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .png({ quality: 90 })
    .toFile(targets[0]);

  fs.copyFileSync(targets[0], targets[1]);
  fs.copyFileSync(targets[0], targets[2]);

  console.log('Done!');
}

buildBackground().catch(err => {
  console.error(err);
  process.exit(1);
});
