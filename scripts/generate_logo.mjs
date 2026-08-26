import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const size = 1024;
const center = size / 2; // 512

const generateSvg = () => {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Outer Dark Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0a1525" />
      <stop offset="65%" stop-color="#050a12" />
      <stop offset="100%" stop-color="#020408" />
    </radialGradient>

    <!-- Outer Ring Gradient: Electric Blue (left) to Vibrant Green (right) -->
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00b4d8" />
      <stop offset="25%" stop-color="#0077b6" />
      <stop offset="50%" stop-color="#0096c7" />
      <stop offset="75%" stop-color="#52b788" />
      <stop offset="100%" stop-color="#70e000" />
    </linearGradient>

    <linearGradient id="ringInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#023e8a" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#001220" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#1b4332" stop-opacity="0.9" />
    </linearGradient>

    <!-- 3D Letter L Gradient & Bevel -->
    <linearGradient id="lGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#90e0ef" />
      <stop offset="30%" stop-color="#0096c7" />
      <stop offset="70%" stop-color="#0077b6" />
      <stop offset="100%" stop-color="#023e8a" />
    </linearGradient>

    <linearGradient id="lBevelTop" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#caf0f8" />
      <stop offset="100%" stop-color="#0077b6" />
    </linearGradient>

    <!-- 3D Letter A Gradient & Bevel -->
    <linearGradient id="aGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d8f3dc" />
      <stop offset="30%" stop-color="#74c69d" />
      <stop offset="70%" stop-color="#52b788" />
      <stop offset="100%" stop-color="#2d6a4f" />
    </linearGradient>

    <!-- Mountain Gradient -->
    <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4a5568" />
      <stop offset="40%" stop-color="#2d3748" />
      <stop offset="100%" stop-color="#1a202c" />
    </linearGradient>

    <!-- Snow Cap Gradient -->
    <linearGradient id="snowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>

    <!-- Shield Gradient -->
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <!-- Shield Border & Pulse Gradient -->
    <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f5d4" />
      <stop offset="50%" stop-color="#00bbf9" />
      <stop offset="100%" stop-color="#00f5d4" />
    </linearGradient>

    <!-- Blue Wave Gradient -->
    <linearGradient id="blueWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00b4d8" />
      <stop offset="50%" stop-color="#0077b6" />
      <stop offset="100%" stop-color="#03045e" />
    </linearGradient>

    <!-- Green Wave Gradient -->
    <linearGradient id="greenWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38b000" />
      <stop offset="50%" stop-color="#70e000" />
      <stop offset="100%" stop-color="#007200" />
    </linearGradient>

    <!-- Green Leaf Gradient -->
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9ef01a" />
      <stop offset="50%" stop-color="#70e000" />
      <stop offset="100%" stop-color="#38b000" />
    </linearGradient>

    <!-- Drop Shadows & Lighting Filters -->
    <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="6" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.8" />
      <feDropShadow dx="-2" dy="-2" stdDeviation="4" flood-color="#ffffff" flood-opacity="0.15" />
    </filter>

    <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="glowGreen" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Base Dark Disc Container with Texture -->
  <circle cx="512" cy="512" r="500" fill="url(#bgGlow)" />
  <circle cx="512" cy="512" r="496" fill="#040810" stroke="#0f1f33" stroke-width="2" />

  <!-- Outer Iconic Gradient Ring -->
  <circle cx="512" cy="512" r="420" fill="none" stroke="url(#ringGrad)" stroke-width="26" filter="url(#shadow3d)" />
  <circle cx="512" cy="512" r="407" fill="none" stroke="#000000" stroke-width="2" opacity="0.6" />
  <circle cx="512" cy="512" r="433" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.4" />

  <!-- Inner Dark Disc Plate -->
  <circle cx="512" cy="512" r="400" fill="url(#ringInnerGrad)" />

  <!-- LEFT SIDE: Circuit Board Lines & Nodes (Electric Blue) -->
  <g stroke="#00b4d8" stroke-width="3.5" fill="none" opacity="0.85">
    <!-- Trace 1 -->
    <path d="M 195 440 L 195 480 L 170 510 L 170 560" />
    <circle cx="195" cy="440" r="6" fill="#00b4d8" stroke="#caf0f8" stroke-width="1.5" />
    <circle cx="170" cy="560" r="5" fill="#00b4d8" />

    <!-- Trace 2 -->
    <path d="M 225 380 L 225 430 L 195 470" />
    <circle cx="225" cy="380" r="7" fill="#00b4d8" stroke="#caf0f8" stroke-width="2" />

    <!-- Trace 3 -->
    <path d="M 210 340 L 210 360 L 245 400 L 245 440" />
    <circle cx="210" cy="340" r="6" fill="#00b4d8" stroke="#caf0f8" stroke-width="1.5" />
    <circle cx="245" cy="440" r="5" fill="#00b4d8" />

    <!-- Trace 4 -->
    <path d="M 175 490 L 150 520 L 150 570" />
    <circle cx="175" cy="490" r="5" fill="#00b4d8" />
    <circle cx="150" cy="570" r="6" fill="#00b4d8" />

    <!-- Trace 5 -->
    <path d="M 240 470 L 220 500 L 220 540" />
    <circle cx="240" cy="470" r="5.5" fill="#00b4d8" />
    <circle cx="220" cy="540" r="5" fill="#00b4d8" />
  </g>

  <!-- TOP RIGHT: Satellite and Orbital Radio Telemetry Path -->
  <g>
    <!-- Orbit Dot Sequence -->
    <path d="M 700 290 A 350 350 0 0 1 820 480" fill="none" stroke="#70e000" stroke-width="3" stroke-dasharray="4,10" opacity="0.85" />

    <!-- Radio Waves Emitting from Satellite -->
    <path d="M 685 270 A 25 25 0 0 0 665 290" fill="none" stroke="#70e000" stroke-width="2.5" opacity="0.8" />
    <path d="M 678 263 A 35 35 0 0 0 650 292" fill="none" stroke="#70e000" stroke-width="2" opacity="0.6" />

    <!-- Satellite Body (Tilted ~45 deg) -->
    <g transform="translate(710, 250) rotate(-40)">
      <!-- Main Core Body -->
      <rect x="-14" y="-14" width="28" height="28" rx="4" fill="#38b000" stroke="#d8f3dc" stroke-width="2.5" />
      <circle cx="0" cy="0" r="5" fill="#ffffff" />
      
      <!-- Solar Array Panels Left & Right -->
      <!-- Left Panel -->
      <line x1="-14" y1="0" x2="-24" y2="0" stroke="#70e000" stroke-width="3" />
      <rect x="-44" y="-12" width="20" height="24" rx="2" fill="#1b4332" stroke="#70e000" stroke-width="2" />
      <line x1="-34" y1="-12" x2="-34" y2="12" stroke="#70e000" stroke-width="1.5" />
      <line x1="-44" y1="0" x2="-24" y2="0" stroke="#70e000" stroke-width="1.5" />

      <!-- Right Panel -->
      <line x1="14" y1="0" x2="24" y2="0" stroke="#70e000" stroke-width="3" />
      <rect x="24" y="-12" width="20" height="24" rx="2" fill="#1b4332" stroke="#70e000" stroke-width="2" />
      <line x1="34" y1="-12" x2="34" y2="12" stroke="#70e000" stroke-width="1.5" />
      <line x1="24" y1="0" x2="44" y2="0" stroke="#70e000" stroke-width="1.5" />

      <!-- Antenna Dish / Boom -->
      <line x1="0" y1="14" x2="0" y2="24" stroke="#ffffff" stroke-width="2" />
      <circle cx="0" cy="24" r="3" fill="#ffffff" />
    </g>
  </g>

  <!-- LETTER "L" (Left Side, 3D Sculpted Metallic Cyan/Blue) -->
  <g filter="url(#shadow3d)">
    <!-- 3D Extrusion Dark Underlay -->
    <path d="M 270 215 L 390 215 L 390 245 L 350 250 L 350 510 L 470 510 Q 520 480 550 450 L 550 480 Q 510 540 450 570 L 260 570 L 260 520 L 290 510 L 290 250 L 250 245 Z" fill="#001830" transform="translate(8, 12)" />

    <!-- Front Face Letter L -->
    <!-- Top Serif, Vertical Stem, Bottom Horizontal Serif and Swooping Tip -->
    <path d="
      M 255 220 
      C 270 218, 385 218, 395 220
      L 395 242
      C 375 244, 355 248, 350 262
      L 350 510
      C 350 525, 360 535, 380 535
      L 450 535
      C 475 535, 505 520, 535 480
      L 540 490
      C 505 540, 465 570, 395 570
      L 255 570
      C 245 570, 240 560, 245 545
      L 252 535
      C 270 530, 285 520, 285 500
      L 285 262
      C 285 248, 265 244, 245 242
      Z" 
      fill="url(#lGrad)" 
      stroke="#003566" 
      stroke-width="3" 
    />

    <!-- Bevel Highlights on Letter L -->
    <!-- Top Serif Ridge -->
    <path d="M 258 223 L 392 223 L 375 235 L 275 235 Z" fill="url(#lBevelTop)" opacity="0.9" />
    <!-- Left Vertical Ridge Highlight -->
    <path d="M 285 262 L 315 262 L 315 500 L 285 500 Z" fill="#90e0ef" opacity="0.35" />
    <!-- Sharp Bevel Edge on Stem -->
    <line x1="318" y1="262" x2="318" y2="505" stroke="#ffffff" stroke-width="2" opacity="0.6" />
    <!-- Bottom Swoop Highlight -->
    <path d="M 285 535 L 395 535 C 460 535, 500 505, 535 482" fill="none" stroke="#caf0f8" stroke-width="2.5" opacity="0.75" />
  </g>

  <!-- LETTER "A" (Right Side, 3D Sculpted Metallic Vibrant Green) -->
  <g filter="url(#shadow3d)">
    <!-- 3D Extrusion Dark Underlay -->
    <path d="M 610 250 L 670 250 L 800 560 L 730 560 L 690 470 L 570 470 L 550 510 L 515 510 Z" fill="#0d2818" transform="translate(8, 12)" />

    <!-- Front Face Letter A with Peak and Crossbar -->
    <path d="
      M 605 250
      C 615 235, 635 235, 645 250
      L 795 550
      C 805 570, 785 575, 765 575
      L 725 575
      C 710 575, 700 565, 695 550
      L 670 495
      L 580 495
      L 555 550
      C 550 565, 540 575, 525 575
      L 485 575
      C 465 575, 450 565, 460 545
      Z
      M 625 350
      L 595 440
      L 655 440
      Z"
      fill="url(#aGrad)"
      stroke="#1b4332"
      stroke-width="3"
    />

    <!-- Bevel Facets & Highlights on Letter A -->
    <!-- Left Slope Facet (Lighter) -->
    <path d="M 625 250 L 625 350 L 595 440 L 580 495 L 500 550 L 485 575 L 530 575 L 555 550 L 580 495 L 625 350 Z" fill="#d8f3dc" opacity="0.3" />
    <!-- Right Slope Facet (Deep Green) -->
    <path d="M 625 250 L 625 350 L 655 440 L 670 495 L 755 550 L 765 575 L 725 575 L 695 550 L 670 495 L 655 440 Z" fill="#2d6a4f" opacity="0.35" />
    <!-- Peak Highlight -->
    <line x1="625" y1="245" x2="625" y2="350" stroke="#ffffff" stroke-width="2.5" opacity="0.8" />
    <line x1="625" y1="245" x2="780" y2="555" stroke="#d8f3dc" stroke-width="2" opacity="0.7" />
    <line x1="625" y1="245" x2="475" y2="555" stroke="#ffffff" stroke-width="2" opacity="0.7" />
  </g>

  <!-- RIGHT SIDE: Lush Green Botanical Leaves (Growing out from right of A) -->
  <g filter="url(#shadow3d)">
    <!-- Primary Large Leaf -->
    <path d="
      M 760 560
      C 770 510, 810 440, 850 435
      C 860 480, 840 550, 775 580
      Z"
      fill="url(#leafGrad)"
      stroke="#2d6a4f"
      stroke-width="2.5"
    />
    <!-- Large Leaf Midrib Vein -->
    <path d="M 765 565 Q 810 500 848 438" fill="none" stroke="#d8f3dc" stroke-width="2" opacity="0.8" />
    <path d="M 790 525 Q 815 520 830 535" fill="none" stroke="#d8f3dc" stroke-width="1.2" opacity="0.6" />
    <path d="M 805 490 Q 825 480 840 490" fill="none" stroke="#d8f3dc" stroke-width="1.2" opacity="0.6" />

    <!-- Secondary Small Leaf (Bottom) -->
    <path d="
      M 780 575
      C 810 570, 845 565, 850 590
      C 830 615, 790 610, 775 585
      Z"
      fill="url(#leafGrad)"
      stroke="#2d6a4f"
      stroke-width="2"
    />
    <path d="M 780 580 Q 815 585 848 590" fill="none" stroke="#d8f3dc" stroke-width="1.5" opacity="0.7" />
  </g>

  <!-- BOTTOM CENTER: Mountain Range & Snow Peaks -->
  <g filter="url(#shadow3d)">
    <!-- Base Mountain Shadow Mass -->
    <polygon points="320,680 512,520 704,680" fill="url(#mountainGrad)" stroke="#1a202c" stroke-width="2" />
    <polygon points="260,690 380,590 510,690" fill="#2d3748" />
    <polygon points="510,690 640,580 750,690" fill="#1a202c" />

    <!-- Central Majestic Snow Caps (Detailed multi-faceted ice) -->
    <!-- Main Center Peak Snow -->
    <polygon points="512,520 480,570 495,580 470,610 512,620 545,595 530,575 560,565" fill="url(#snowGrad)" />
    <!-- Snow Shading Left (White/Bright) -->
    <polygon points="512,520 480,570 495,580 470,610 512,600" fill="#ffffff" opacity="0.95" />
    <!-- Snow Shading Right (Ice Blue/Slate) -->
    <polygon points="512,520 560,565 530,575 545,595 512,620" fill="#cbd5e1" opacity="0.9" />

    <!-- Left Peak Snow -->
    <polygon points="380,590 360,625 375,630 355,650 395,645 405,620" fill="#ffffff" opacity="0.9" />
    <!-- Right Peak Snow -->
    <polygon points="640,580 620,620 635,630 655,615 670,640 680,630" fill="#cbd5e1" opacity="0.9" />

    <!-- Mountain Ridge Lines -->
    <line x1="512" y1="520" x2="512" y2="630" stroke="#0f172a" stroke-width="3" />
    <line x1="380" y1="590" x2="410" y2="670" stroke="#0f172a" stroke-width="2" />
    <line x1="640" y1="580" x2="620" y2="670" stroke="#0f172a" stroke-width="2" />
  </g>

  <!-- AERODYNAMIC BASE WAVES (Blue on Left, Green on Right) -->
  <g filter="url(#shadow3d)">
    <!-- Lower Blue Streamlines (Left) -->
    <path d="
      M 160 620
      C 220 660, 310 710, 420 730
      C 350 745, 250 735, 180 680
      Z"
      fill="url(#blueWaveGrad)"
      stroke="#0077b6"
      stroke-width="2"
    />
    <path d="
      M 200 680
      C 280 730, 380 770, 500 780
      C 420 800, 300 790, 220 735
      Z"
      fill="url(#blueWaveGrad)"
      stroke="#00b4d8"
      stroke-width="2"
    />

    <!-- Lower Green Streamlines (Right) -->
    <path d="
      M 860 660
      C 800 700, 710 735, 580 740
      C 670 760, 770 745, 840 695
      Z"
      fill="url(#greenWaveGrad)"
      stroke="#52b788"
      stroke-width="2"
    />
    <path d="
      M 820 715
      C 740 760, 640 785, 510 785
      C 600 805, 720 795, 800 745
      Z"
      fill="url(#greenWaveGrad)"
      stroke="#70e000"
      stroke-width="2"
    />
  </g>

  <!-- CENTER FOREGROUND: Geotechnical Safety Shield & Seismic Pulse Wave -->
  <g filter="url(#shadow3d)">
    <!-- Shield 3D Shadow -->
    <path d="
      M 512 625
      L 580 655
      L 580 725
      C 580 785, 512 825, 512 825
      C 512 825, 444 785, 444 725
      L 444 655
      Z"
      fill="#000000"
      opacity="0.8"
      transform="translate(4, 6)"
    />

    <!-- Shield Outer Frame (Cyan/Emerald Glow Gradient) -->
    <path d="
      M 512 625
      L 580 655
      L 580 725
      C 580 785, 512 825, 512 825
      C 512 825, 444 785, 444 725
      L 444 655
      Z"
      fill="url(#shieldGrad)"
      stroke="url(#pulseGrad)"
      stroke-width="6"
    />

    <!-- Shield Inner Bevel Rim -->
    <path d="
      M 512 635
      L 570 662
      L 570 722
      C 570 772, 512 810, 512 810
      C 512 810, 454 772, 454 722
      L 454 662
      Z"
      fill="#081424"
      stroke="#00f5d4"
      stroke-width="2"
      opacity="0.7"
    />

    <!-- Glowing Heartbeat / Seismic Pulse EKG Line inside Shield -->
    <path d="
      M 460 725
      L 485 725
      L 495 700
      L 505 755
      L 518 680
      L 530 745
      L 540 710
      L 548 725
      L 564 725"
      fill="none"
      stroke="#00f5d4"
      stroke-width="5"
      stroke-linecap="round"
      stroke-linejoin="round"
      filter="url(#glowCyan)"
    />
    <path d="
      M 460 725
      L 485 725
      L 495 700
      L 505 755
      L 518 680
      L 530 745
      L 540 710
      L 548 725
      L 564 725"
      fill="none"
      stroke="#ffffff"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>

  <!-- BOTTOM ARC: Circular Telemetry Pearl Dots (Cyan to Green Gradient) -->
  <g>
    <!-- Dot Loop on Bottom Perimeter -->
    <!-- Arc from ~140 deg to ~40 deg bottom (angles in SVG) -->
    ${(() => {
      const dots = [];
      const totalDots = 28;
      for (let i = 0; i <= totalDots; i++) {
        const t = i / totalDots;
        // Angle from 135 deg (bottom left) to 45 deg (bottom right) through 90 deg (bottom center)
        const angleDeg = 145 - t * 110; 
        const angleRad = (angleDeg * Math.PI) / 180;
        const r = 370;
        const x = 512 - r * Math.cos(angleRad);
        const y = 512 + r * Math.sin(angleRad);
        const isCyan = t < 0.5;
        const color = isCyan ? '#00b4d8' : '#70e000';
        const dotR = (i % 3 === 0) ? 4.5 : 3;
        dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dotR}" fill="${color}" opacity="0.85" />`);
      }
      return dots.join('\n    ');
    })()}
  </g>
</svg>
`;
};

async function buildLogo() {
  const svg = generateSvg();
  
  const targets = [
    path.join(process.cwd(), 'public', 'landsafe-ai-logo.png'),
    path.join(process.cwd(), 'public', 'LandSafe_AI_Logo_Official.png'),
    path.join(process.cwd(), 'public', 'logo.png'),
    path.join(process.cwd(), 'assets', 'landsafe-ai-logo.png'),
    path.join(process.cwd(), 'src', 'assets', 'landsafe-ai-logo.png'),
    path.join(process.cwd(), 'public', 'favicon.png'),
  ];

  for (const target of targets) {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Also save pure SVG for ultra-sharp crisp rendering
  fs.writeFileSync(path.join(process.cwd(), 'public', 'landsafe-ai-logo.svg'), svg);
  fs.writeFileSync(path.join(process.cwd(), 'src', 'assets', 'landsafe-ai-logo.svg'), svg);

  console.log('Rendering 1024x1024 official logo PNG...');
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png({ quality: 98, compressionLevel: 8 })
    .toFile(targets[0]);

  // Copy to other locations
  for (let i = 1; i < targets.length; i++) {
    fs.copyFileSync(targets[0], targets[i]);
  }

  console.log('Successfully generated official logo at:');
  targets.forEach(t => console.log(' -> ' + t));
}

buildLogo().catch(err => {
  console.error('Failed to generate logo:', err);
  process.exit(1);
});
