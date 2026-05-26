'use client'
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import RugCard from '@/components/RugCard'
import Lightbox from '@/components/Lightbox'
import { getAllRugs, getCategories, getUniqueOrigins, filterRugs } from '@/lib/rugs'

function CollectionContent() {
  const searchParams = useSearchParams()
  const urlCategory  = searchParams.get('category') ?? ''

  const [category, setCategory] = useState(urlCategory)
  const [origin, setOrigin]     = useState('')
  const [era, setEra]           = useState('')
  const [search, setSearch]     = useState('')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Sync category state when the nav link changes the URL param
  useEffect(() => {
    setCategory(urlCategory)
    setOrigin('')
    setEra('')
    setSearch('')
  }, [urlCategory])

  const allRugs    = getAllRugs()
  const categories = getCategories()
  const origins    = getUniqueOrigins()

  const filtered = useMemo(
    () => filterRugs(allRugs, { category, origin, era, search }),
    [allRugs, category, origin, era, search]
  )

  const selectStyle = {
    backgroundColor: 'var(--cream)',
    borderColor: 'var(--border)',
    color: 'var(--brown-dark)',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: 'var(--gold)' }}>
          {filtered.length} Piece{filtered.length !== 1 ? 's' : ''}
        </p>
        <h1
          className="text-4xl font-[family-name:var(--font-playfair)]"
          style={{ color: 'var(--burgundy)' }}
        >
          {category || 'The Full Collection'}
        </h1>
        <div className="ornament mt-4 max-w-xs mx-auto">
          <span style={{ color: 'var(--gold)' }}>✦</span>
        </div>
      </div>

      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-10 p-4 rounded-sm"
        style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--border)' }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search rugs…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 text-sm border rounded-sm outline-none focus:border-gold"
          style={selectStyle}
        />

        {/* Category */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2 text-sm border rounded-sm"
          style={selectStyle}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Origin */}
        <select
          value={origin}
          onChange={e => setOrigin(e.target.value)}
          className="px-3 py-2 text-sm border rounded-sm"
          style={selectStyle}
        >
          <option value="">All Origins</option>
          {origins.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        {/* Era */}
        <select
          value={era}
          onChange={e => setEra(e.target.value)}
          className="px-3 py-2 text-sm border rounded-sm"
          style={selectStyle}
        >
          <option value="">All Eras</option>
          <option value="antique">Antique (pre-1920)</option>
          <option value="vintage">Vintage (1920–1970)</option>
          <option value="modern">Modern</option>
        </select>

        {/* Clear */}
        {(category || origin || era || search) && (
          <button
            onClick={() => { setCategory(''); setOrigin(''); setEra(''); setSearch('') }}
            className="px-4 py-2 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
            style={{ color: 'var(--burgundy)' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-2xl mb-3 font-[family-name:var(--font-playfair)]" style={{ color: 'var(--burgundy)' }}>
            No rugs match your filters
          </p>
          <button
            onClick={() => { setCategory(''); setOrigin(''); setEra(''); setSearch('') }}
            className="text-sm tracking-widest uppercase"
            style={{ color: 'var(--gold)' }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((rug, i) => (
            <RugCard
              key={rug.sku ?? rug.description_raw?.slice(0, 20)}
              rug={rug}
              onZoom={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      )}
      {lightboxIndex !== null && (
        <Lightbox
          rugs={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </div>
  )
}

export default function CollectionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="text-sm tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
          Loading collection…
        </div>
      </div>
    }>
      <CollectionContent />
    </Suspense>
  )
}
