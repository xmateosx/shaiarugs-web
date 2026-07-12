// scripts/reconcile-live.mjs
// Reconciles data/rugs.json against the live Wix site (ground truth).
//
// Each Wix category page embeds a Pro Gallery JSON blob ("_galleryData")
// whose items carry: title (SKU), description (caption), name (image hash).
// This script fetches all six pages, pairs every live image with its
// description, and rewrites rugs.json to match:
//   - existing records (matched by SKU, else fuzzy description match) get
//     the correct image_url / id / category
//   - live items with no existing record become new records (confidence: low)
//   - missing image files are sourced from C:/ShaiaRugs/<folder> or
//     downloaded from static.wixstatic.com, then resized like process-images.mjs
//
// Run: node scripts/reconcile-live.mjs [--dry-run]

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(projectRoot, 'public', 'images', 'rugs');
const RUGS_PATH = path.join(projectRoot, 'data', 'rugs.json');
const RAW_DIRS = [
  'C:/ShaiaRugs/1_ScatterRugs',
  'C:/ShaiaRugs/2_RoomSizeRugs',
  'C:/ShaiaRugs/3_Runners',
  'C:/ShaiaRugs/4_OversizeRugs',
  'C:/ShaiaRugs/5_TribalRugs',
  'C:/ShaiaRugs/6_EuropeanAndTextiles',
];
const NO_SKU_PATH = 'C:/ShaiaRugs/rugs_no_sku.json';

const PAGES = {
  'Scatter Rugs': 'scatter-rugs',
  'Room Size Rugs': 'room-size-rugs',
  'Runners': 'runners',
  'Oversize Rugs': 'oversizerugs',
  'Tribal Rugs': 'copy-2-of-runners',
  'European & Textiles': 'europeanandtextiles',
};

const DRY_RUN = process.argv.includes('--dry-run');

// ── Helpers ────────────────────────────────────────────────────────────────

// Extract a balanced JSON object starting at the first "{" at/after `start`.
function extractJson(html, start) {
  const open = html.indexOf('{', start);
  let depth = 0, inStr = false, esc = false;
  for (let i = open; i < html.length; i++) {
    const c = html[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return JSON.parse(html.slice(open, i + 1)); }
  }
  throw new Error('Unbalanced JSON');
}

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
}

function similarity(a, b) {
  const ta = new Set(normalize(a)), tb = new Set(normalize(b));
  if (!ta.size || !tb.size) return 0;
  let shared = 0;
  for (const w of ta) if (tb.has(w)) shared++;
  return shared / Math.min(ta.size, tb.size);
}

function parseDimensions(text) {
  const m = (text || '').match(/(\d{1,2})(?:-(\d{1,2}))?\s*x\s*(\d{1,2})(?:-(\d{1,2}))?/i);
  if (!m) return null;
  const wf = +m[1], wi = +(m[2] || 0), lf = +m[3], li = +(m[4] || 0);
  const wd = +(wf + wi / 12).toFixed(2), ld = +(lf + li / 12).toFixed(2);
  return {
    raw: m[0].replace(/\s+/g, ''),
    width_ft: wf, width_in: wi, length_ft: lf, length_in: li,
    width_decimal: wd, length_decimal: ld,
    area_sq_ft: +(wd * ld).toFixed(1),
  };
}

function parseCirca(text) {
  const m = (text || '').match(/(?:circa|ca\.?)\s*(\d{4})/i) || (text || '').match(/\b(1[6-9]\d{2})\b/);
  return m ? +m[1] : null;
}

function eraFromYear(y) {
  if (!y) return null;
  if (y < 1930) return 'antique';
  if (y < 1980) return 'vintage';
  return 'modern';
}

async function ensureImage(wixName, base) {
  const outPath = path.join(OUTPUT_DIR, `${base}.jpg`);
  if (fs.existsSync(outPath)) return 'exists';
  // 1) look in raw scrape folders
  for (const dir of RAW_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const hit = fs.readdirSync(dir).find(f => f.startsWith(base));
    if (hit) {
      if (!DRY_RUN) {
        await sharp(path.join(dir, hit))
          .resize({ width: 1200, withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true })
          .toFile(outPath);
      }
      return 'processed-from-raw';
    }
  }
  // 2) download from Wix CDN
  const url = `https://static.wixstatic.com/media/${wixName}`;
  const res = await fetch(url);
  if (!res.ok) return `DOWNLOAD FAILED (${res.status})`;
  const buf = Buffer.from(await res.arrayBuffer());
  if (!DRY_RUN) {
    await sharp(buf)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(outPath);
  }
  return 'downloaded';
}

// ── Fetch live gallery data ────────────────────────────────────────────────

async function fetchLiveItems() {
  const live = []; // { category, sku, title, caption, wixName, base }
  const shortfalls = [];
  for (const [category, slug] of Object.entries(PAGES)) {
    const html = await (await fetch(`https://www.shaiarugs.com/${slug}`)).text();
    const gi = html.indexOf('_galleryData"');
    if (gi === -1) throw new Error(`No galleryData on /${slug}`);
    const gallery = extractJson(html, gi);
    const totalM = html.match(/totalItemsCount":(\d+)/);
    const total = totalM ? +totalM[1] : gallery.items.length;
    if (total > gallery.items.length) {
      shortfalls.push(`${category}: page reports ${total} items, only ${gallery.items.length} in embedded data`);
    }
    for (const item of gallery.items) {
      const md = item.metaData || {};
      const title = (md.title || '').trim();
      const desc = (md.description || '').replace(/<br\s*\/?>/gi, '\n').trim();
      const caption = [title, desc].filter(Boolean).join(' — ');
      const skuM = (title.match(/\b\d{3,6}\b/) || desc.match(/^\s*(\d{3,6})\b/) || [])[0];
      const wixName = md.name || '';
      const base = wixName.split('~')[0].replace(/\.(jpe?g|png|webp)$/i, '');
      if (!base) continue;
      live.push({ category, sku: skuM ? String(skuM).trim() : null, title, desc, caption, wixName, base });
    }
    console.log(`  /${slug}: ${gallery.items.length} live items (page total: ${total})`);
  }
  return { live, shortfalls };
}

// ── Main ───────────────────────────────────────────────────────────────────

console.log(`Reconciling against live site${DRY_RUN ? ' (DRY RUN)' : ''}...\n`);

const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
const rugs = readJson(RUGS_PATH);
const noSku = fs.existsSync(NO_SKU_PATH) ? readJson(NO_SKU_PATH) : [];

const { live, shortfalls } = await fetchLiveItems();
console.log(`\nTotal live items: ${live.length}\n`);

const claimed = new Set(); // rug object refs already matched to a live item
const report = { updated: [], created: [], categoryChanged: [], imageChanged: [], conflicts: [], unseen: [], images: {} };

for (const item of live) {
  // 1) match by SKU
  let rug = item.sku ? rugs.find(r => String(r.sku) === item.sku && !claimed.has(r)) : null;
  let matchedBy = rug ? 'sku' : null;

  // If SKU matches a rug that's already claimed, that's a cross-page duplicate.
  if (!rug && item.sku && rugs.some(r => String(r.sku) === item.sku)) {
    report.conflicts.push(`SKU ${item.sku} appears on multiple live pages (also "${item.category}") — kept first match`);
    continue;
  }

  // 2) fuzzy match caption against unclaimed records' descriptions
  if (!rug) {
    let best = null, bestScore = 0;
    for (const r of rugs) {
      if (claimed.has(r)) continue;
      const score = Math.max(similarity(item.caption, r.description_raw), similarity(item.caption, r.description_clean));
      if (score > bestScore) { bestScore = score; best = r; }
    }
    if (best && bestScore >= 0.6) { rug = best; matchedBy = `fuzzy(${bestScore.toFixed(2)})`; }
  }

  const imageUrl = `/images/rugs/${item.base}.jpg`;

  if (rug) {
    claimed.add(rug);
    const changes = [];
    if (rug.image_url !== imageUrl) { changes.push(`image ${rug.image_url ?? 'null'} -> ${imageUrl}`); report.imageChanged.push(rug.sku); }
    if (rug.category !== item.category) { changes.push(`category ${rug.category} -> ${item.category}`); report.categoryChanged.push(`${rug.sku}: ${rug.category} -> ${item.category}`); }
    rug.image_url = imageUrl;
    rug.id = item.base;
    rug.category = item.category;
    if (changes.length) report.updated.push(`${rug.sku} [${matchedBy}] ${changes.join('; ')}`);
  } else {
    // 3) create a new record; prefer a parsed record from rugs_no_sku.json if the description matches
    const donor = noSku
      .map(r => ({ r, s: Math.max(similarity(item.desc, r.description_raw), similarity(item.desc, r.description_clean)) }))
      .sort((a, b) => b.s - a.s)[0];
    const useDonor = donor && donor.s >= 0.75 ? donor.r : null;
    const circa = useDonor?.circa_year ?? parseCirca(item.caption);
    const newRug = {
      sku: item.sku,
      category: item.category,
      origin: useDonor?.origin?.country || useDonor?.origin?.label ? useDonor.origin : {},
      rug_type: useDonor?.rug_type ?? null,
      weave_type: useDonor?.weave_type ?? null,
      dimensions: useDonor?.dimensions ?? parseDimensions(item.caption),
      circa_year: circa,
      circa_decade: circa ? `${Math.floor(circa / 10) * 10}s` : null,
      era: useDonor?.era ?? eraFromYear(circa),
      colors: useDonor?.colors ?? [],
      design: useDonor?.design ?? { motifs: [] },
      description_clean: item.desc || item.title,
      description_raw: item.caption,
      flags: ['Imported from live site — review in admin'],
      style_notes: useDonor?.style_notes ?? [],
      data_quality: {
        has_sku: !!item.sku,
        has_dimensions: !!(useDonor?.dimensions ?? parseDimensions(item.caption)),
        has_circa: !!circa,
        has_origin: !!(useDonor?.origin?.country),
        has_type: !!useDonor?.rug_type,
        confidence: 'low',
      },
      image_url: imageUrl,
      id: item.base,
    };
    rugs.push(newRug);
    claimed.add(newRug);
    report.created.push(`${item.sku ?? '(no sku)'} [${item.category}]${useDonor ? ` +donor(${donor.s.toFixed(2)})` : ''} "${item.caption.slice(0, 70)}"`);
  }

  // ensure the image file exists locally
  const status = await ensureImage(item.wixName, item.base);
  if (status !== 'exists') report.images[item.base] = status;
}

// records never seen on any live page: keep them, but repair stale ~mv2
// paths (the on-disk files were renamed to the stripped hash) and backfill id
for (const r of rugs) {
  if (claimed.has(r)) continue;
  const m = (r.image_url || '').match(/^\/images\/rugs\/(e32dd1_[a-f0-9]+)~/);
  if (m && fs.existsSync(path.join(OUTPUT_DIR, `${m[1]}.jpg`))) {
    r.image_url = `/images/rugs/${m[1]}.jpg`;
    report.updated.push(`${r.sku} [mv2-strip] image -> ${r.image_url}`);
  }
  const idM = (r.image_url || '').match(/\/images\/rugs\/(e32dd1_[a-f0-9]+)\.jpg$/);
  if (!r.id && idM) r.id = idM[1];
  report.unseen.push(`${r.sku} [${r.category}] ${(r.description_clean || '').slice(0, 60)}`);
}

if (!DRY_RUN) fs.writeFileSync(RUGS_PATH, JSON.stringify(rugs, null, 2));

// ── Report ─────────────────────────────────────────────────────────────────
console.log('════════ RECONCILE REPORT ════════');
const counts = {};
for (const r of rugs) counts[r.category] = (counts[r.category] || 0) + 1;
const liveCounts = {};
for (const i of live) liveCounts[i.category] = (liveCounts[i.category] || 0) + 1;
console.log('\nPer-category (data / live):');
for (const c of Object.keys(PAGES)) console.log(`  ${c}: ${counts[c] || 0} / ${liveCounts[c] || 0}`);

const section = (title, arr) => { console.log(`\n${title} (${arr.length}):`); arr.forEach(x => console.log('  - ' + x)); };
section('Updated', report.updated);
section('Created', report.created);
section('Category changed', report.categoryChanged);
section('Conflicts', report.conflicts);
section('Not seen on live site (left as-is)', report.unseen);
if (shortfalls.length) section('Live pages with lazy-loaded items not in embedded data', shortfalls);
console.log('\nImage files:', Object.keys(report.images).length ? '' : 'all already present');
for (const [base, status] of Object.entries(report.images)) console.log(`  ${base}: ${status}`);

// validation: every image_url resolves to a file
const broken = rugs.filter(r => r.image_url && r.image_url.startsWith('/images/') && !fs.existsSync(path.join(projectRoot, 'public', r.image_url)));
const noImage = rugs.filter(r => !r.image_url);
const noId = rugs.filter(r => !r.id);
console.log(`\nValidation: ${rugs.length} records | broken image paths: ${broken.length} | null image: ${noImage.length} | missing id: ${noId.length}`);
broken.forEach(r => console.log(`  BROKEN: ${r.sku} ${r.image_url}`));
noImage.forEach(r => console.log(`  NULL IMAGE: ${r.sku} [${r.category}]`));
console.log(DRY_RUN ? '\nDRY RUN — no files written.' : '\nrugs.json written.');
