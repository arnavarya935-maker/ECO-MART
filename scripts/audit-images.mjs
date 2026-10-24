import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const productsJsonPath = path.join(rootDir, 'src/data/products.json');
const publicDir = path.join(rootDir, 'public');
const outDir = path.join(__dirname, 'out');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));

// Helper: read image dimensions from binary header without external deps
function getImageDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.svg') {
      const str = buffer.toString('utf8', 0, 1000);
      const widthMatch = str.match(/width=["']?(\d+)/i);
      const heightMatch = str.match(/height=["']?(\d+)/i);
      const viewBoxMatch = str.match(/viewBox=["']?\d+\s+\d+\s+(\d+)\s+(\d+)/i);
      if (widthMatch && heightMatch) {
        return { width: parseInt(widthMatch[1], 10), height: parseInt(heightMatch[1], 10) };
      }
      if (viewBoxMatch) {
        return { width: parseInt(viewBoxMatch[1], 10), height: parseInt(viewBoxMatch[2], 10) };
      }
      return { width: 800, height: 600 };
    }

    if (ext === '.png') {
      if (buffer.length > 24) {
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        return { width, height };
      }
    }

    if (ext === '.jpg' || ext === '.jpeg') {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        const len = buffer.readUInt16BE(offset + 2);
        offset += 2 + len;
      }
    }

    return null;
  } catch {
    return null;
  }
}

// 1. Gather audit data
const auditedProducts = [];
const photoIdUsage = new Map(); // photoId -> [ids]
const imageFileUsage = new Map(); // imagePath -> [ids]

for (const p of products) {
  const relImg = p.image || '';
  const diskPath = path.join(publicDir, relImg.replace(/^\//, ''));
  const exists = fs.existsSync(diskPath);
  const ext = path.extname(relImg).toLowerCase();
  const isSvg = ext === '.svg';

  let fileSize = 0;
  let dimensions = null;

  if (exists) {
    const stat = fs.statSync(diskPath);
    fileSize = stat.size;
    dimensions = getImageDimensions(diskPath);
  }

  const pid = p.photoId || '';
  if (pid) {
    if (!photoIdUsage.has(pid)) photoIdUsage.set(pid, []);
    photoIdUsage.get(pid).push(p.id);
  }

  if (relImg) {
    if (!imageFileUsage.has(relImg)) imageFileUsage.set(relImg, []);
    imageFileUsage.get(relImg).push(p.id);
  }

  auditedProducts.push({
    ...p,
    relImg,
    diskPath,
    exists,
    ext,
    isSvg,
    fileSize,
    dimensions,
    altText: p.alt || ''
  });
}

// Detailed visual audit findings from inspecting every image:
const VISUAL_DEFECTS = new Map([
  ['kit-01', 'Wrong subject: Shows medical pill blister packs instead of bamboo cutlery'],
  ['care-01-conv', 'Wrong subject: Shows sunset beach landscape instead of plastic toothbrushes'],
  ['clean-01-conv', 'Wrong subject & identifiable face: Portrait of smiling bearded man with glasses instead of laundry powder'],
  ['clean-01', 'Wrong subject & visible brand logos: Commercial Clorox bleach, Lysol wipes, Walgreens sanitizer instead of soapnuts'],
  ['clean-03', 'Wrong subject: Shows surgical blue latex gloves instead of cleaner tabs'],
  ['care-03', 'Wrong subject & visible brand logo: Electric Philips hair trimmer with PHILIPS logo instead of brass safety razor'],
  ['care-03-conv', 'Wrong subject & text: Olympia typewriter with "News" paper instead of plastic razors'],
  ['care-04-conv', 'Wrong subject & visible brand logo: Volkswagen VW car emblem instead of lip balm tube'],
  ['fash-01', 'Identifiable face & wrong style: Corporate business suit with silk tie instead of artisanal Khadi shirt'],
  ['fash-02-conv', 'Prominent brand logo: Nike sneaker with prominent Nike Swoosh and logo on tongue'],
  ['fash-03', 'Identifiable face & wrong subject: Full-body woman dancing in green dress instead of silk stole'],
  ['fash-03-conv', 'Wrong subject: Latte coffee cup with foam art instead of acrylic scarf'],
  ['fash-04', 'Wrong subject: Novelty red lipstick kiss-print socks on bare legs instead of bamboo socks'],
  ['home-02-conv', 'Wrong subject & identifiable person: Woman wearing Daniel Wellington watch instead of serving tray'],
  ['home-03', 'Wrong subject: Full modern kitchen room interior instead of coir doormat'],
  ['home-03-conv', 'Wrong subject: Living room sofa and dresser instead of rubber entry mat'],
  ['home-04-conv', 'Wrong subject: Potted succulent in ceramic cup instead of plastic plant pots'],
  ['out-01-conv', 'Wrong subject & identifiable faces: Group of 4 students studying with laptops at café instead of flashlight'],
  ['out-02-conv', 'Wrong subject: Ceramic porcelain cappuccino cup and saucer instead of styrofoam cups'],
  ['out-04', 'Wrong subject: Paris street storefront with bicycle instead of camp picnic blanket'],
  ['out-04-conv', 'Wrong subject: Luxury stone bathtub in spa bathroom instead of picnic rug'],
  ['bag-02', 'Wrong subject & brand logo: Black polyester backpack with yellow LEVEL8 logo instead of jute messenger bag'],
  ['bag-02-conv', 'Wrong subject & brand logo: Brown leather backpack with brand logo instead of black nylon laptop bag'],
  ['bag-03', 'Wrong subject & brand logo: VINTA camera backpack instead of cement sack duffel'],
  ['bag-04', 'Wrong subject: Front-loading washing machine under neon party lights instead of mesh grocery bags'],
  ['bag-04-conv', 'Wrong subject & brand text: Beach garbage with Bailey/Naturo bottles instead of plastic produce bag roll'],
  ['stat-01-conv', 'Wrong subject: Open hardback novel in the dark instead of plastic spiral notebook'],
  ['stat-03', 'Wrong subject: Single white pencil tip pointing up instead of teak wood desk organizer'],
  ['stat-03-conv', 'Wrong subject: Crumpled white paper texture instead of acrylic desk organizer'],
  ['stat-04-conv', 'Wrong subject: Wire spiral notebook next to Apple keyboard instead of faux leather diary'],
  ['kit-04', 'Wrong subject: Green powder-coated thermos flask instead of hammered copper bottle']
]);

// 2. Classify issues for each product
for (const item of auditedProducts) {
  const issues = [];
  const pids = photoIdUsage.get(item.photoId) || [];
  const imgFiles = imageFileUsage.get(item.relImg) || [];

  if (!item.exists) {
    issues.push('Missing file on disk');
  } else if (item.isSvg) {
    issues.push('Emoji SVG placeholder (~1KB)');
  }

  if (pids.length > 1) {
    issues.push(`Duplicate photoId (${item.photoId} shared by ${pids.join(', ')})`);
  }

  if (imgFiles.length > 1) {
    issues.push(`Duplicate image file (${item.relImg} shared by ${imgFiles.join(', ')})`);
  }

  if (VISUAL_DEFECTS.has(item.id)) {
    issues.push(VISUAL_DEFECTS.get(item.id));
  }

  if (!item.altText) {
    issues.push('Missing descriptive alt text');
  }

  if (item.dimensions && (item.dimensions.width < 1200 && item.dimensions.height < 1200)) {
    issues.push(`Sub-1200px resolution (${item.dimensions.width}x${item.dimensions.height}px)`);
  }

  item.issues = issues;
  item.needsNewPhoto = item.isSvg || VISUAL_DEFECTS.has(item.id) || pids.length > 1;
}

// 3. Generate Contact Sheet HTML (scripts/out/image-audit.html)
const contactSheetHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EcoMart Product Image Audit Contact Sheet</title>
  <style>
    :root {
      --bg: #FAF8F2;
      --surface: #FFFFFF;
      --surface-raised: #F4F1EA;
      --border: #E5E0D5;
      --text: #1C241E;
      --muted: #627264;
      --danger-bg: #FEF2F2;
      --danger-text: #991B1B;
      --danger-border: #FCA5A5;
      --warn-bg: #FFFBEB;
      --warn-text: #92400E;
      --warn-border: #FCD34D;
      --ok-bg: #ECFDF5;
      --ok-text: #065F46;
      --ok-border: #A7F3D0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 32px;
      line-height: 1.5;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }
    h1 {
      font-size: 28px;
      margin: 0 0 8px;
      color: #143322;
    }
    .stats-bar {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 16px;
    }
    .stat-pill {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
    }
    .stat-pill.danger {
      background: var(--danger-bg);
      color: var(--danger-text);
      border-color: var(--danger-border);
    }
    .stat-pill.warn {
      background: var(--warn-bg);
      color: var(--warn-text);
      border-color: var(--warn-border);
    }
    .stat-pill.ok {
      background: var(--ok-bg);
      color: var(--ok-text);
      border-color: var(--ok-border);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.08);
    }
    .card.needs-replacement {
      border-color: var(--danger-border);
      box-shadow: 0 0 0 1px var(--danger-border);
    }
    .img-wrap {
      width: 100%;
      height: 240px;
      background: #ECE7DE;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .img-wrap svg {
      width: 100%;
      height: 100%;
    }
    .card-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-svg {
      background: rgba(220, 38, 38, 0.9);
      color: #fff;
    }
    .badge-dup {
      background: rgba(217, 119, 6, 0.9);
      color: #fff;
    }
    .badge-ok {
      background: rgba(16, 185, 129, 0.9);
      color: #fff;
    }
    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-meta {
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
    }
    .card-title {
      font-size: 15px;
      font-weight: 700;
      margin: 0 0 8px;
      color: #143322;
      line-height: 1.3;
    }
    .card-mat {
      font-size: 12px;
      color: #4B5563;
      margin-bottom: 12px;
    }
    .issues-list {
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }
    .issue-tag {
      display: inline-block;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      margin: 2px 4px 2px 0;
      background: var(--danger-bg);
      color: var(--danger-text);
      border: 1px solid var(--danger-border);
      font-weight: 600;
    }
    .issue-tag.warn {
      background: var(--warn-bg);
      color: var(--warn-text);
      border-color: var(--warn-border);
    }
    .file-info {
      font-family: monospace;
      font-size: 11px;
      color: #6B7280;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <header>
    <h1>EcoMart Product Image Audit Contact Sheet</h1>
    <p>Comprehensive audit of all 64 products in <code>src/data/products.json</code> against files in <code>public/images/products/</code>.</p>
    <div class="stats-bar">
      <div class="stat-pill">Total Products: ${auditedProducts.length}</div>
      <div class="stat-pill danger">SVG Emoji Placeholders: ${auditedProducts.filter((p) => p.isSvg).length}</div>
      <div class="stat-pill warn">Duplicate photoId Shares: ${[...photoIdUsage.entries()].filter(([, v]) => v.length > 1).length} photoIds</div>
      <div class="stat-pill warn">Known Subject Mismatches: ${VISUAL_DEFECTS.size}</div>
      <div class="stat-pill danger">Total Needing New Photo: ${auditedProducts.filter((p) => p.needsNewPhoto).length}</div>
      <div class="stat-pill warn">Missing Alt Text: ${auditedProducts.filter((p) => !p.altText).length}</div>
    </div>
  </header>

  <div class="grid">
    ${auditedProducts
      .map((p) => {
        const kb = (p.fileSize / 1024).toFixed(1);
        const dims = p.dimensions ? `${p.dimensions.width}x${p.dimensions.height}` : 'unknown';
        const badgeClass = p.isSvg ? 'badge-svg' : p.needsNewPhoto ? 'badge-dup' : 'badge-ok';
        const badgeLabel = p.isSvg ? 'SVG Placeholder' : p.needsNewPhoto ? 'Needs Photo' : 'Verified Photo';
        const cardClass = p.needsNewPhoto ? 'card needs-replacement' : 'card';

        // Local relative link from scripts/out/ to public/
        const srcPath = '../../public' + p.relImg;

        return `
      <div class="${cardClass}" id="${p.id}">
        <div class="img-wrap">
          <img src="${srcPath}" alt="${p.name}" loading="lazy" onerror="this.src='../../public/favicon.svg'" />
          <span class="card-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span><strong>${p.id}</strong> • ${p.category}</span>
            <span>${p.price ? '₹' + p.price : ''}</span>
          </div>
          <h3 class="card-title">${p.name}</h3>
          <div class="card-mat"><strong>Material:</strong> ${p.material || 'N/A'}</div>

          <div class="file-info">
            File: ${p.relImg.replace('/images/products/', '')} (${kb} KB, ${dims})<br/>
            Photo ID: ${p.photoId || 'none'}<br/>
            Photographer: ${p.photographer || 'none'}
          </div>

          ${
            p.issues.length > 0
              ? `
          <div class="issues-list">
            ${p.issues
              .map(
                (issue) =>
                  `<span class="issue-tag ${issue.includes('Duplicate') || issue.includes('alt') ? 'warn' : ''}">${issue}</span>`
              )
              .join('')}
          </div>
          `
              : ''
          }
        </div>
      </div>
      `;
      })
      .join('\n')}
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'image-audit.html'), contactSheetHtml, 'utf8');

// 4. Output Summary & Markdown Table to Console
console.log('='.repeat(80));
console.log(' EcoMart Product Photography Audit Report (Phase 0)');
console.log('='.repeat(80));
console.log(`• Total Products Scanned: ${auditedProducts.length}`);
console.log(`• SVG Emoji Placeholders: ${auditedProducts.filter((p) => p.isSvg).length} (100% of these need real photography)`);
console.log(`• Duplicate photoId Groups: ${[...photoIdUsage.entries()].filter(([, v]) => v.length > 1).length}`);
console.log(`• Known Subject Mismatches: ${VISUAL_DEFECTS.size}`);
console.log(`• Products Missing Alt Text: ${auditedProducts.filter((p) => !p.altText).length}`);
console.log(`• Total Products Requiring New Photography: ${auditedProducts.filter((p) => p.needsNewPhoto).length}`);
console.log(`• Contact Sheet Generated: scripts/out/image-audit.html`);
console.log('='.repeat(80));

const replacementCandidates = auditedProducts.filter((p) => p.needsNewPhoto);
console.log('\n### Products Needing New Photography (Action Items for Phase 1):\n');
console.log('| Product ID | Product Name | Category | Current File | Issues / Mismatch Reason |');
console.log('|---|---|---|---|---|');
for (const p of replacementCandidates) {
  const currentFile = p.relImg.replace('/images/products/', '');
  console.log(`| \`${p.id}\` | ${p.name} | ${p.category} | \`${currentFile}\` | ${p.issues.join('; ')} |`);
}
console.log('\n' + '='.repeat(80));
