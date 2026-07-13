'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Rug } from '@/lib/types'

interface Props {
  allRugs: Rug[]
  adminSkus: string[]
}

export default function AdminDashboard({ allRugs, adminSkus }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const adminSkuSet = new Set(adminSkus)

  const filtered = search.trim()
    ? allRugs.filter(r => {
        const q = search.toLowerCase()
        return [r.sku, r.rug_type, r.origin?.label, r.category, r.description_clean]
          .join(' ').toLowerCase().includes(q)
      })
    : allRugs

  async function handleDelete(sku: string) {
    if (!confirm('Remove this rug from admin overrides?')) return
    setDeleting(sku)
    await fetch(`/api/admin/rugs/${encodeURIComponent(sku)}`, { method: 'DELETE' })
    router.refresh()
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-1" style={{ color: 'var(--gold)' }}>Admin</p>
          <h1 className="text-3xl font-[family-name:var(--font-playfair)]" style={{ color: 'var(--burgundy)' }}>
            Rug Management
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-xs tracking-widest uppercase border transition-opacity hover:opacity-70"
            style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}
          >
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
            style={{ color: 'var(--brown-mid)' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Actions + search */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/admin/add"
          className="px-6 py-2.5 text-sm tracking-widest uppercase font-medium transition-opacity hover:opacity-80 flex-shrink-0"
          style={{ backgroundColor: 'var(--burgundy)', color: 'var(--gold-light)' }}
        >
          + Add New Rug
        </Link>
        <input
          type="text"
          placeholder="Search all rugs…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 text-sm border rounded-sm outline-none"
          style={{ backgroundColor: 'var(--cream-dark)', borderColor: 'var(--border)', color: 'var(--brown-dark)' }}
        />
      </div>

      <p className="text-xs mb-6 opacity-60" style={{ color: 'var(--brown-mid)' }}>
        {filtered.length} rug{filtered.length !== 1 ? 's' : ''} shown
        · <span style={{ color: 'var(--gold)' }}>Gold border</span> = admin-added or edited
      </p>

      {/* Rug list */}
      <div className="space-y-3">
        {filtered.map(rug => {
          const isAdmin = adminSkuSet.has(rug.sku ?? '')
          const title = [rug.origin?.label, rug.rug_type].filter(Boolean).join(' ') || rug.category
          return (
            <div
              key={rug.sku ?? rug.description_raw?.slice(0, 20)}
              className="flex items-center gap-4 p-4 rounded-sm"
              style={{
                backgroundColor: 'var(--cream)',
                border: isAdmin ? '1px solid var(--gold)' : '1px solid var(--border)',
              }}
            >
              {/* Thumbnail */}
              <div
                className="relative w-14 h-14 flex-shrink-0 rounded-sm overflow-hidden"
                style={{ backgroundColor: 'var(--cream-dark)' }}
              >
                {rug.image_url ? (
                  <Image src={rug.image_url} alt={title} fill sizes="56px" className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-lg opacity-20" style={{ color: 'var(--burgundy)' }}>✦</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-[family-name:var(--font-playfair)] text-sm" style={{ color: 'var(--brown-dark)' }}>
                  {title}
                </p>
                <p className="text-xs opacity-60 mt-0.5" style={{ color: 'var(--brown-mid)' }}>
                  {rug.category}{rug.circa_year ? ` · c. ${rug.circa_year}` : ''}{rug.sku ? ` · #${rug.sku}` : ''}
                  {isAdmin && <span style={{ color: 'var(--gold)' }}> · edited</span>}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/admin/edit/${encodeURIComponent(rug.sku ?? '')}`}
                  className="px-3 py-1.5 text-xs tracking-widest uppercase border transition-opacity hover:opacity-70"
                  style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
                >
                  Edit
                </Link>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(rug.sku!)}
                    disabled={deleting === rug.sku}
                    className="px-3 py-1.5 text-xs tracking-widest uppercase border transition-opacity hover:opacity-70 disabled:opacity-40"
                    style={{ borderColor: '#dc2626', color: '#dc2626' }}
                  >
                    {deleting === rug.sku ? '…' : 'Remove'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
