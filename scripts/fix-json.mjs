// scripts/fix-json.mjs
// The ShaiaImageMapper stored nested objects/arrays as JSON strings instead of
// real JSON values. This script parses them back into proper structure.
// Run: node scripts/fix-json.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rugsPath = path.join(__dirname, '..', 'data', 'rugs.json');

let raw = fs.readFileSync(rugsPath, 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);

const rugs = JSON.parse(raw);

// Fields that should be objects or arrays but got stringified
const SHOULD_BE_JSON = ['origin', 'dimensions', 'colors', 'design', 'flags', 'style_notes', 'data_quality'];

let fixed = 0;
for (const rug of rugs) {
  for (const field of SHOULD_BE_JSON) {
    if (typeof rug[field] === 'string') {
      try {
        rug[field] = JSON.parse(rug[field]);
        fixed++;
      } catch {
        console.warn(`  Could not parse ${field} for SKU ${rug.sku}: ${rug[field].substring(0, 40)}`);
      }
    }
  }
}

fs.writeFileSync(rugsPath, JSON.stringify(rugs, null, 2));
console.log(`Fixed ${fixed} stringified fields across ${rugs.length} rugs.`);

// Verify
const sample = rugs.find(r => r.image_url);
if (sample) {
  console.log(`\nSample SKU ${sample.sku}:`);
  console.log(`  origin.label : ${sample.origin?.label}`);
  console.log(`  colors       : ${JSON.stringify(sample.colors)}`);
  console.log(`  image_url    : ${sample.image_url}`);
  console.log(`  data_quality : confidence=${sample.data_quality?.confidence}`);
}
