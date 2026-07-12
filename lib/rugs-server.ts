import { getAllRugs } from './rugs'
import { getAdminRugs } from './kv-rugs'
import type { Rug } from './types'

export async function getAllRugsMerged(): Promise<Rug[]> {
  const [adminRugs, staticRugs] = await Promise.all([
    getAdminRugs(),
    Promise.resolve(getAllRugs()),
  ])

  // Admin rugs override static rugs with the same SKU
  const adminSkus = new Set(adminRugs.map(r => r.sku))
  const filtered = staticRugs.filter(r => !adminSkus.has(r.sku))

  return [...adminRugs, ...filtered]
}
