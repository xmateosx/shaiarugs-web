import { redirect, notFound } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getAdminRugs } from '@/lib/kv-rugs'
import { getRugBySku } from '@/lib/rugs'
import EditRugForm from './EditRugForm'

export default async function EditRugPage({ params }: { params: Promise<{ sku: string }> }) {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const { sku } = await params

  // Admin override takes precedence, fall back to static
  const adminRugs = await getAdminRugs()
  const rug = adminRugs.find(r => r.sku === sku) ?? getRugBySku(sku)

  if (!rug) notFound()

  return <EditRugForm rug={rug} />
}
