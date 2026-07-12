// scripts/process-images.mjs
// Resizes all rug images to max 1200px wide and copies them to public/images/rugs/
// Then updates data/rugs.json with local image paths.
//
// Run: node scripts/process-images.mjs

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Source folders
const SOURCE_DIRS = [
  'C:/ShaiaRugs/1_ScatterRugs',
  'C:/ShaiaRugs/2_RoomSizeRugs',
  'C:/ShaiaRugs/3_Runners',
  'C:/ShaiaRugs/4_OversizeRugs',
  'C:/ShaiaRugs/5_TribalRugs',
  'C:/ShaiaRugs/6_EuropeanAndTextiles',
];

// Output folder inside the Next.js project
const OUTPUT_DIR = path.join(projectRoot, 'public', 'images', 'rugs');

// Rug data files
const MAP_PATH   = 'C:/ShaiaRugs/rug_image_map.json';
const RUGS_PATH  = path.join(projectRoot, 'data', 'rugs.json');

// ── Setup ──────────────────────────────────────────────────────────────────
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Build filename → SKU mapping from rug_image_map.json
const imageMap = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
const filenameToSku = {};
for (const [sku, url] of Object.entries(imageMap)) {
  const m = url.match(/\/media\/([^?/]+)/);
  if (m) filenameToSku[m[1]] = sku;
}
console.log(`Known filename→SKU mappings: ${Object.keys(filenameToSku).length}`);

// ── Resize & copy all images ──────────────────────────────────────────────
const localPathBySku = {};  // SKU → /images/rugs/filename.jpg
let processed = 0;
let skipped = 0;

for (const dir of SOURCE_DIRS) {
  if (!fs.existsSync(dir)) { console.log(`Skip (not found): ${dir}`); continue; }

  const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  console.log(`\n${path.basename(dir)}: ${files.length} files`);

  for (const file of files) {
    const srcPath = path.join(dir, file);
    const outName = file.replace(/\.(jpeg|png|webp)$/i, '.jpg'); // normalize to .jpg
    const outPath = path.join(OUTPUT_DIR, outName);

    // Skip if already processed
    if (fs.existsSync(outPath)) {
      skipped++;
    } else {
      try {
        await sharp(srcPath)
          .resize({ width: 1200, withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true })
          .toFile(outPath);
        processed++;
      } catch (err) {
        console.error(`  ERROR ${file}: ${err.message}`);
        continue;
      }
    }

    // Map SKU → local path
    const sku = filenameToSku[file];
    if (sku) {
      localPathBySku[sku] = `/images/rugs/${outName}`;
      process.stdout.write(`  ✓ SKU ${sku}\r`);
    }
  }
}

console.log(`\n\nProcessed: ${processed} new | Skipped (already done): ${skipped}`);
console.log(`Mapped to SKU: ${Object.keys(localPathBySku).length} rugs`);

// ── Update rugs.json ───────────────────────────────────────────────────────
let rugsRaw = fs.readFileSync(RUGS_PATH, 'utf8');
if (rugsRaw.charCodeAt(0) === 0xFEFF) rugsRaw = rugsRaw.slice(1);

const rugs = JSON.parse(rugsRaw);
let updated = 0;
let stillMissing = 0;

for (const rug of rugs) {
  const sku = String(rug.sku);
  if (localPathBySku[sku]) {
    rug.image_url = localPathBySku[sku];
    updated++;
  } else if (!rug.image_url) {
    stillMissing++;
    console.log(`  No image: SKU ${sku} (${rug.category} — ${rug.rug_type || 'unknown type'})`);
  }
}

fs.writeFileSync(RUGS_PATH, JSON.stringify(rugs, null, 2));
console.log(`\nrugs.json updated: ${updated} have local image_url`);
if (stillMissing > 0) console.log(`Still missing: ${stillMissing} rugs (use the visual matcher for these)`);

// Check output size
const outputFiles = fs.readdirSync(OUTPUT_DIR);
const totalBytes = outputFiles.reduce((sum, f) => {
  return sum + fs.statSync(path.join(OUTPUT_DIR, f)).size;
}, 0);
console.log(`\npublic/images/rugs/: ${outputFiles.length} files, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total`);
console.log('\nDone! Run: git add -A && git commit -m "Add resized rug images" && git push');
