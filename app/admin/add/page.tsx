import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import AddRugForm from './AddRugForm'

export default async function AddRugPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }
  return <AddRugForm />
}
