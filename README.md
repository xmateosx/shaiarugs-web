# Shaia Rugs

**[shaiarugs.com](https://shaiarugs.com)** — Fine antique oriental rugs. Williamsburg, Virginia. Est. 1973.

---

## Stack

| | |
|---|---|
| **Framework** | Next.js 16 App Router (fully static) |
| **Styling** | Tailwind CSS + CSS custom properties |
| **Fonts** | Playfair Display + Lato (Google Fonts) |
| **Data** | `data/rugs.json` — 78 rugs, cleaned from original Wix site |
| **Deployment** | Vercel — auto-deploy on push to `main` |

---

## Project Structure

```
app/
  layout.tsx                 Root layout, nav, footer, fonts, metadata
  page.tsx                   Homepage — hero, featured rugs, categories
  about/page.tsx             About Frank Shaia
  collection/page.tsx        Full collection with filters
  collection/[sku]/page.tsx  Individual rug detail (78 static pages)

components/
  Nav.tsx                    Responsive navigation
  Footer.tsx                 Footer with links and contact
  RugCard.tsx                Rug thumbnail card

data/
  rugs.json                  78 cleaned rug records

lib/
  rugs.ts                    Data access helpers and filters
  types.ts                   TypeScript interfaces
```

---

## Local Development

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # production build
```

---

## Data Pipeline

Rug data was scraped from the original Wix site and cleaned via a
.NET pipeline (`ShaiaDescriptions` → `ShaiaClean`) into structured JSON.

**Image URLs** — every record's `image_url` points to a local file in
`public/images/rugs/` (Wix media hash, `~mv2` suffix stripped). The data is
reconciled against the live Wix site's gallery pages by
`scripts/reconcile-live.mjs`, which matches each live image+caption pair to a
record by SKU (fuzzy description match as fallback), creates records for
items missing from the data, and downloads/resizes any missing image files.
Records created this way carry the flag "Imported from live site — review in
admin".

---

## Deployment

Every push to `main` auto-deploys to Vercel production.
