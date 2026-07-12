'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--burgundy-dk)' }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-sm"
        style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--border)' }}
      >
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--gold)' }}>
            Shaia Rugs
          </p>
          <h1 className="text-2xl font-[family-name:var(--font-playfair)]" style={{ color: 'var(--burgundy)' }}>
            Admin
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 text-sm border rounded-sm outline-none"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cream-dark)', color: 'var(--brown-dark)' }}
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm tracking-widest uppercase font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: 'var(--burgundy)', color: 'var(--gold-light)' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
