import { put, head, del, list } from '@vercel/blob'
import type { Rug } from './types'

const BLOB_FILENAME = 'admin-rugs.json'

async function getBlobUrl(): Promise<string | null> {
  try {
    const { blobs } = await list({ prefix: BLOB_FILENAME })
    return blobs[0]?.url ?? null
  } catch {
    return null
  }
}

export async function getAdminRugs(): Promise<Rug[]> {
  try {
    const url = await getBlobUrl()
    if (!url) return []
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

async function saveAdminRugs(rugs: Rug[]): Promise<void> {
  // Delete old blob first (Blob is immutable — put creates a new URL each time)
  const { blobs } = await list({ prefix: BLOB_FILENAME })
  for (const blob of blobs) {
    await del(blob.url)
  }
  await put(BLOB_FILENAME, JSON.stringify(rugs), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })
}

export async function addAdminRug(rug: Rug): Promise<void> {
  const rugs = await getAdminRugs()
  rugs.unshift(rug)
  await saveAdminRugs(rugs)
}

export async function upsertAdminRug(rug: Rug): Promise<void> {
  const rugs = await getAdminRugs()
  const idx = rugs.findIndex(r => r.sku === rug.sku)
  if (idx >= 0) {
    rugs[idx] = rug
  } else {
    rugs.unshift(rug)
  }
  await saveAdminRugs(rugs)
}

export async function deleteAdminRug(sku: string): Promise<void> {
  const rugs = await getAdminRugs()
  await saveAdminRugs(rugs.filter(r => r.sku !== sku))
}
