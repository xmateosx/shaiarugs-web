'use client'
import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Rug } from '@/lib/types'
import { formatDimensions } from '@/lib/rugs'

interface Props {
  rugs: Rug[]
  index: number
  onClose: () => void
  onChange: (index: number) => void
}

export default function Lightbox({ rugs, index, onClose, onChange }: Props) {
  const rug    = rugs[index]
  const hasPrev = index > 0
  const hasNext = index < rugs.length - 1

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape')      onClose()
    if (e.key === 'ArrowLeft'  && hasPrev) onChange(index - 1)
    if (e.key === 'ArrowRight' && hasNext) onChange(index + 1)
  }, [onClose, onChange, index, hasPrev, hasNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!rug) return null

  const title = [rug.origin?.label, rug.rug_type].filter(Boolean).join(' ') || rug.category
  const dims  = formatDimensions(rug)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col select-none"
      style={{ backgroundColor: 'rgba(18, 6, 0, 0.97)' }}
      onClick={onClose}
    >
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <span className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--gold)', opacity: 0.55 }}>
          {index + 1} / {rugs.length}
        </span>

        <button
          onClick={onClose}
          aria-label="Close"
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: 'var(--gold-light)' }}
        >
          {/* × icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 3l12 12M15 3L3 15"/>
          </svg>
        </button>
      </div>

      {/* ── Image area ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 px-14 md:px-20">

        {/* Prev arrow */}
        <button
          aria-label="Previous"
          onClick={e => { e.stopPropagation(); onChange(index - 1) }}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full transition-all"
          style={{
            color: 'var(--gold-light)',
            border: '1px solid rgba(201,168,76,0.35)',
            opacity: hasPrev ? 1 : 0.15,
            pointerEvents: hasPrev ? 'auto' : 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M11 3L5 9l6 6"/>
          </svg>
        </button>

        {/* Image container — click stops close-on-backdrop */}
        <div
          className="relative w-full max-w-2xl"
          style={{ height: 'calc(100vh - 190px)', maxHeight: '78vh' }}
          onClick={e => e.stopPropagation()}
        >
          {rug.image_url ? (
            <Image
              key={rug.sku}          // re-trigger on change
              src={rug.image_url}
              alt={title}
              fill
              className="object-contain"
              unoptimized
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl opacity-10" style={{ color: 'var(--gold)' }}>✦</span>
            </div>
          )}
        </div>

        {/* Next arrow */}
        <button
          aria-label="Next"
          onClick={e => { e.stopPropagation(); onChange(index + 1) }}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full transition-all"
          style={{
            color: 'var(--gold-light)',
            border: '1px solid rgba(201,168,76,0.35)',
            opacity: hasNext ? 1 : 0.15,
            pointerEvents: hasNext ? 'auto' : 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M7 3l6 6-6 6"/>
          </svg>
        </button>
      </div>

      {/* ── Bottom info bar ─────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-end justify-between gap-4 px-5 py-4"
        style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="min-w-0">
          <h2
            className="text-base md:text-lg font-[family-name:var(--font-playfair)] truncate"
            style={{ color: 'var(--gold-light)' }}
          >
            {title}
          </h2>
          <p className="text-xs tracking-widest mt-0.5" style={{ color: 'var(--gold)', opacity: 0.65 }}>
            {dims}{rug.circa_year ? ` · c. ${rug.circa_year}` : ''}{rug.sku ? ` · #${rug.sku}` : ''}
          </p>
        </div>

        {rug.sku && (
          <Link
            href={`/collection/${rug.sku}`}
            onClick={onClose}
            className="shrink-0 text-xs tracking-[0.18em] uppercase px-4 py-2.5 transition-opacity hover:opacity-75"
            style={{
              border: '1px solid rgba(201,168,76,0.5)',
              color: 'var(--gold-light)',
            }}
          >
            View Details →
          </Link>
        )}
      </div>
    </div>
  )
}
