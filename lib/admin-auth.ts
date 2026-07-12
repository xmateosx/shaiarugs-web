import { cookies } from 'next/headers'

const COOKIE_NAME = 'shaia-admin'

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return !!token && token === process.env.ADMIN_PASSWORD
}

export { COOKIE_NAME }
