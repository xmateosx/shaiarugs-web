import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getAdminRugs } from '@/lib/kv-rugs'
import { getAllRugs } from '@/lib/rugs'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const [adminRugs, staticRugs] = await Promise.all([
    getAdminRugs(),
    Promise.resolve(getAllRugs()),
  ])

  // Merge: admin overrides static by SKU
  const adminSkus = new Set(adminRugs.map(r => r.sku))
  const allRugs = [
    ...adminRugs,
    ...staticRugs.filter(r => !adminSkus.has(r.sku)),
  ]

  return <AdminDashboard allRugs={allRugs} adminSkus={[...adminSkus].filter((s): s is string => s !== null)} />
}
