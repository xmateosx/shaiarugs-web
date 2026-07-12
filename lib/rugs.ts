import type { Rug, Category } from './types'
import rugsData from '@/data/rugs.json'

const rugs = rugsData as unknown as Rug[]

export function getAllRugs(): Rug[] {
  // Rugs with images first, then placeholders
  return [...rugs].sort((a, b) => {
    const aHas = a.image_url ? 1 : 0
    const bHas = b.image_url ? 1 : 0
    return bHas - aHas
  })
}

export function getRugById(id: string): Rug | undefined {
  return rugs.find(r => r.id === id || r.sku === id)
}

// Keep for backward compat
export function getRugBySku(sku: string): Rug | undefined {
  return getRugById(sku)
}

export function getRugsByCategory(category: Category): Rug[] {
  return rugs.filter(r => r.category === category)
}

export function getCategories(): Category[] {
  return [
    'Scatter Rugs',
    'Room Size Rugs',
    'Runners',
    'Oversize Rugs',
    'Tribal Rugs',
    'European & Textiles',
  ]
}

export function getUniqueOrigins(): string[] {
  const origins = rugs
    .map(r => r.origin.label)
    .filter((o): o is string => !!o)
  return [...new Set(origins)].sort()
}

export function getUniqueEras(): string[] {
  return ['antique', 'vintage', 'modern']
}

export function filterRugs(
  allRugs: Rug[],
  { category, origin, era, search }: { category: string; origin: string; era: string; search: string }
): Rug[] {
  return allRugs.filter(rug => {
    if (category && rug.category !== category) return false
    if (origin && rug.origin.label !== origin) return false
    if (era && rug.era !== era) return false
    if (search) {
      const q = search.toLowerCase()
      const hay = [
        rug.rug_type,
        rug.origin.label,
        rug.category,
        rug.description_clean,
        rug.colors.join(' '),
      ].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export function formatDimensions(rug: Rug): string {
  if (!rug.dimensions) return 'Dimensions upon request'
  const { width_ft, width_in, length_ft, length_in } = rug.dimensions
  const w = width_in > 0 ? `${width_ft}'${width_in}"` : `${width_ft}'`
  const l = length_in > 0 ? `${length_ft}'${length_in}"` : `${length_ft}'`
  return `${w} × ${l}`
}

export function getCategorySlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function getCategoryFromSlug(slug: string): Category | undefined {
  return getCategories().find(c => getCategorySlug(c) === slug) as Category | undefined
}

// Featured rugs for homepage — highest confidence, one per category
export function getFeaturedRugs(): Rug[] {
  const categories = getCategories()
  return categories
    .map(cat => rugs.find(r => r.category === cat && r.data_quality.confidence === 'high'))
    .filter((r): r is Rug => !!r)
    .slice(0, 6)
}
