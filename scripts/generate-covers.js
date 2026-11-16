const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { genres, categories, albums } = require('../src/seed-data');

const outDir = path.join(__dirname, '..', 'public', 'img', 'covers');
const albumDir = path.join(__dirname, '..', 'public', 'img', 'albums');

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed) {
  let s = seed || 1;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  if (amount >= 0) {
    r += Math.round((255 - r) * amount);
    g += Math.round((255 - g) * amount);
    b += Math.round((255 - b) * amount);
  } else {
    r = Math.round(r * (1 + amount));
    g = Math.round(g * (1 + amount));
    b = Math.round(b * (1 + amount));
  }
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function textBlock(title, artist) {
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (test.length > 13 && line) { lines.push(line); line = w; } else { line = test; }
  }
  if (line) lines.push(line);
  const maxLen = Math.max(...lines.map(l => l.length));
  const fs = Math.min(52, 420 / maxLen);
  const step = fs * 1.02;
  let y = 300 - ((lines.length - 1) * step) / 2;
  const parts = [];
  for (const l of lines) {
    parts.push(`<text x="300" y="${y.toFixed(1)}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${fs.toFixed(1)}" fill="#f5efe4" letter-spacing="1">${esc(l.toUpperCase())}</text>`);
    y += step;
  }
  const lastY = y - step;
  const artistY = (lastY + fs * 0.85).toFixed(1);
  return `${parts.join('\n      ')}
      <text x="300" y="${artistY}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="22" fill="#f5efe4" opacity="0.85" letter-spacing="4">${esc(artist.toUpperCase())}</text>`;
}

function pattern(kind, rand, c1, c2, accent) {
  switch (kind) {
    case 'sun': {
      const cy = 210 + rand() * 60;
      const r = 120 + rand() * 60;
      let rays = '';
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const x1 = 300 + Math.cos(a) * (r + 8), y1 = cy + Math.sin(a) * (r + 8);
        const x2 = 300 + Math.cos(a) * (r + 46 + rand() * 30), y2 = cy + Math.sin(a) * (r + 46 + rand() * 30);
        rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${accent}" stroke-width="${(rand() * 5 + 2).toFixed(1)}" opacity="0.7"/>`;
      }
      return `<circle cx="300" cy="${cy}" r="${r}" fill="${accent}"/>${rays}`;
    }
    case 'stripes': {
      const rot = 20 + rand() * 50;
      let bars = '';
      for (let i = -6; i < 14; i++) {
        bars += `<rect x="${i * 70 - 100}" y="-200" width="${18 + rand() * 26}" height="1000" fill="${accent}" opacity="${(0.25 + rand() * 0.55).toFixed(2)}" transform="rotate(${rot} 300 300)"/>`;
      }
      return `<g>${bars}</g><circle cx="${150 + rand() * 300}" cy="${160 + rand() * 120}" r="${60 + rand() * 40}" fill="${c2}" opacity="0.9"/>`;
    }
    case 'waves': {
      let paths = '';
      for (let i = 0; i < 9; i++) {
        const y = 90 + i * 52;
        const amp = 20 + rand() * 30;
        const phase = rand() * 6;
        let d = `M -50 ${y}`;
        for (let x = 0; x <= 650; x += 25) {
          d += ` L ${x} ${(y + Math.sin((x / 650) * Math.PI * 2 * (1 + rand() * 0.3) + phase) * amp).toFixed(1)}`;
        }
        paths += `<path d="${d}" fill="none" stroke="${i % 2 ? accent : c2}" stroke-width="${(5 + rand() * 9).toFixed(1)}" opacity="${(0.5 + rand() * 0.4).toFixed(2)}"/>`;
      }
      return `<g>${paths}</g>`;
    }
    case 'grid': {
      let cells = '';
      const step = 46;
      for (let gx = 0; gx < 14; gx++) {
        for (let gy = 0; gy < 14; gy++) {
          const r = rand();
          if (r > 0.72) {
            cells += `<circle cx="${gx * step + step / 2}" cy="${gy * step + step / 2}" r="${(3 + rand() * 7).toFixed(1)}" fill="${r > 0.93 ? accent : c2}" opacity="${(0.5 + rand() * 0.5).toFixed(2)}"/>`;
          }
        }
      }
      return `<g>${cells}</g>`;
    }
    case 'arcs': {
      let arcs = '';
      for (let i = 0; i < 8; i++) {
        const r = 60 + i * 42;
        const sweep = 60 + rand() * 200;
        const start = rand() * 360;
        const x1 = 300 + Math.cos((start * Math.PI) / 180) * r;
        const y1 = 300 + Math.sin((start * Math.PI) / 180) * r;
        const x2 = 300 + Math.cos(((start + sweep) * Math.PI) / 180) * r;
        const y2 = 300 + Math.sin(((start + sweep) * Math.PI) / 180) * r;
        arcs += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${i % 3 === 0 ? accent : c2}" stroke-width="${(8 + rand() * 14).toFixed(1)}" opacity="${(0.55 + rand() * 0.4).toFixed(2)}" stroke-linecap="round"/>`;
      }
      return `<g>${arcs}</g>`;
    }
    case 'split': {
      const angle = Math.floor(rand() * 4) * 90;
      const inset = 40 + rand() * 60;
      return `<g transform="rotate(${angle} 300 300)">
        <rect x="${inset}" y="${inset}" width="${600 - inset * 2}" height="${600 - inset * 2}" fill="none" stroke="${accent}" stroke-width="4"/>
        <rect x="${inset + 30}" y="${inset + 30}" width="${600 - (inset + 30) * 2}" height="${600 - (inset + 30) * 2}" fill="${accent}" opacity="0.85"/>
      </g>
      <circle cx="${120 + rand() * 360}" cy="${120 + rand() * 360}" r="${34 + rand() * 26}" fill="${c2}"/>`;
    }
    default: {
      return `<circle cx="300" cy="240" r="150" fill="${accent}"/><circle cx="300" cy="240" r="90" fill="${c2}"/>`;
    }
  }
}

function heroVinylSVG() {
  let grooves = '';
  for (let r = 150; r <= 430; r += 6) {
    const w = r % 24 === 0 ? 0.06 : 0.02;
    grooves += `<circle cx="450" cy="450" r="${r}" fill="none" stroke="rgba(255,255,255,${w})" stroke-width="2"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
    <defs>
      <radialGradient id="disc" cx="0.35" cy="0.3" r="1">
        <stop offset="0" stop-color="#2b2b2b"/>
        <stop offset="0.55" stop-color="#111111"/>
        <stop offset="1" stop-color="#050505"/>
      </radialGradient>
      <linearGradient id="label" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f7efdd"/>
        <stop offset="1" stop-color="#e6d5b6"/>
      </linearGradient>
    </defs>
    <circle cx="450" cy="450" r="450" fill="url(#disc)"/>
    ${grooves}
    <path d="M 80 320 A 420 420 0 0 1 380 60" stroke="rgba(255,255,255,0.10)" stroke-width="46" fill="none" stroke-linecap="round"/>
    <circle cx="450" cy="450" r="152" fill="url(#label)"/>
    <circle cx="450" cy="450" r="152" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="5"/>
    <circle cx="450" cy="450" r="17" fill="#16130f"/>
    <text x="450" y="396" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="bold" letter-spacing="7" fill="#16130f">RECHORDS</text>
    <text x="450" y="490" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" letter-spacing="3" fill="rgba(22,19,15,0.6)">33⅓ RPM · STEREO</text>
  </svg>`;
}

function coverSVG(title, artist, c1, c2, seedStr) {
  const rand = rng(hash(seedStr));
  const kind = ['sun', 'stripes', 'waves', 'grid', 'arcs', 'split'][Math.floor(rand() * 6)];
  const bg = shade(c1, -0.35);
  const accent = c2;
  const grad = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${shade(c1, 0.15)}"/>
      <stop offset="1" stop-color="${bg}"/>
    </linearGradient></defs>`;
  const text = seedStr.startsWith('cat-') ? '' : textBlock(title, artist);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
    ${grad}
    <rect width="600" height="600" fill="url(#g)"/>
    ${pattern(kind, rand, c1, c2, accent)}
    <rect x="0" y="0" width="600" height="600" fill="none" stroke="rgba(245,239,228,0.25)" stroke-width="3"/>
    ${text}
  </svg>`;
}

fs.mkdirSync(outDir, { recursive: true });

for (const g of genres) {
  fs.writeFileSync(path.join(outDir, `genre-${g.slug}.svg`), coverSVG(g.name, 'Collection', g.palette[0], g.palette[1], 'genre-' + g.slug));
}

for (const c of categories) {
  const palette = [['#ff5c2e', '#ffd166'], ['#06d6a0', '#073b4c'], ['#9b5de5', '#f15bb5'], ['#ef476f', '#ffd166']][categories.indexOf(c) % 4];
  fs.writeFileSync(path.join(outDir, `cat-${c.slug}.svg`), coverSVG(c.name, c.tagline, palette[0], palette[1], 'cat-' + c.slug));
}

async function buildPlaceholders() {
  fs.mkdirSync(albumDir, { recursive: true });
  const manifest = [];
  for (let i = 0; i < albums.length; i++) {
    const a = albums[i];
    const g = genres.find(x => x.slug === a.genre) || genres[0];
    const svg = coverSVG(a.title, a.artist, g.palette[0], g.palette[1], a.slug);
    fs.writeFileSync(path.join(outDir, `${a.slug}.svg`), svg);
    const id = i + 1;
    await sharp(Buffer.from(svg))
      .resize(600, 600)
      .flatten()
      .jpeg({ quality: 88 })
      .toFile(path.join(albumDir, `${id}.jpg`));
    manifest.push({ id, file: `/img/albums/${id}.jpg`, slug: a.slug, title: a.title, artist: a.artist });
  }
  fs.writeFileSync(path.join(albumDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return manifest.length;
}

async function buildHero() {
  await sharp(Buffer.from(heroVinylSVG())).resize(900, 900).png().toFile(path.join(__dirname, '..', 'public', 'plastinka.png'));
}

Promise.all([buildPlaceholders(), buildHero()]).then(([n]) => {
  console.log(`Covers generated: ${genres.length + categories.length + albums.length} svg, ${n} jpg placeholders`);
});
