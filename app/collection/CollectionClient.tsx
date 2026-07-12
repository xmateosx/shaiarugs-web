'use client'
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import RugCard from '@/components/RugCard'
import Lightbox from '@/components/Lightbox'
import { getCategories, getUniqueOrigins, filterRugs } from '@/lib/rugs'
import type { Rug } from '@/lib/types'

interface Props {
  initialRugs: Rug[]
}

export default function CollectionClient({ initialRugs }: Props) {
  const searchParams = useSearchParams()
  const urlCategory  = searchParams.get('category') ?? ''

  const [category, setCategory] = useState(urlCategory)
  const [origin, setOrigin]     = useState('')
  const [era, setEra]           = useState('')
  const [search, setSearch]     = useState('')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    setCategory(urlCategory)
    setOrigin('')
    setEra('')
    setSearch('')
  }, [urlCategory])

  const categories = getCategories()
  const origins    = getUniqueOrigins()

  const filtered = useMemo(
    () => filterRugs(initialRugs, { category, origin, era, search }),
    [initialRugs, category, origin, era, search]
  )

  const filterStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--hairline)',
    color: 'var(--brown-dark)',
    fontFamily: 'var(--font-jost), sans-serif',
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    paddingBottom: '6px',
    outline: 'none',
  }

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      {/* Heading */}
      <div className="flex items-baseline justify-between gap-5 flex-wrap mb-6">
        <h1 className="text-4xl font-[family-name:var(--font-playfair)]" style={{ color: 'var(--brown-dark)' }}>
          {category || 'The Collection'}
        </h1>
        <span className="label" style={{ color: 'var(--brown-mid)' }}>
          {filtered.length} piece{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters — quiet underline row */}
      <div className="flex flex-wrap items-end gap-x-7 gap-y-4 pb-9">
        <select value={category} onChange={e => setCategory(e.target.value)} style={filterStyle} aria-label="Category">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={origin} onChange={e => setOrigin(e.target.value)} style={filterStyle} aria-label="Origin">
          <option value="">All Origins</option>
          {origins.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={era} onChange={e => setEra(e.target.value)} style={filterStyle} aria-label="Era">
          <option value="">All Eras</option>
          <option value="antique">Antique (pre-1920)</option>
          <option value="vintage">Vintage (1920–1970)</option>
          <option value="modern">Modern</option>
        </select>
        <input
          type="text"
          placeholder="Search the catalog…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[180px]"
          style={{
            ...filterStyle,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            textTransform: 'none',
            letterSpacing: 'normal',
            fontSize: '14px',
          }}
        />
        {(category || origin || era || search) && (
          <button
            onClick={() => { setCategory(''); setOrigin(''); setEra(''); setSearch('') }}
            className="label transition-opacity hover:opacity-70 pb-1.5"
            style={{ color: 'var(--burgundy)' }}
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-2xl mb-3 font-[family-name:var(--font-playfair)]" style={{ color: 'var(--brown-dark)' }}>
            No rugs match your filters
          </p>
          <button
            onClick={() => { setCategory(''); setOrigin(''); setEra(''); setSearch('') }}
            className="label"
            style={{ color: 'var(--burgundy)' }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
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
