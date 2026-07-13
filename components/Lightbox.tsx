'use client'
import { useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Rug } from '@/lib/types'
import { formatDimensions } from '@/lib/rugs'
import useZoomPan from '@/lib/useZoomPan'

interface Props {
  rugs: Rug[]
  index: number
  onClose: () => void
  onChange: (index: number) => void
}

export default function Lightbox({ rugs, index, onClose, onChange }: Props) {
  const rug     = rugs[index]
  const hasPrev = index > 0
  const hasNext = index < rugs.length - 1

  const imgRef = useRef<HTMLImageElement>(null)

  const { containerRef, scale, gesturing, contentStyle, handlers, reset } = useZoomPan({
    // The object-contain img element spans the whole viewport; the photo
    // itself occupies a centered fit rect. Taps on the letterbox close.
    isTapOnContent: (x, y, rect) => {
      const img = imgRef.current
      if (!img || !img.naturalWidth) return true
      const fit = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight)
      return Math.abs(x) <= (img.naturalWidth * fit) / 2 && Math.abs(y) <= (img.naturalHeight * fit) / 2
    },
    onTapOutside: onClose,
  })

  // Zoom always starts fresh on prev/next navigation
  useEffect(() => { reset() }, [index, reset])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape')                onClose()
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
      className="fixed inset-0 z-50 select-none"
      style={{ backgroundColor: '#0d0402' }}
      onClick={onClose}
    >

      {/* ── Full-viewport image — click/wheel zoom, drag pan, pinch ── */}
      {rug.image_url && (
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-hidden"
          style={{
            touchAction: 'none',
            cursor: scale > 1 ? (gesturing ? 'grabbing' : 'grab') : 'zoom-in',
          }}
          onClick={e => e.stopPropagation()}
          {...handlers}
        >
          <div className="absolute inset-0" style={contentStyle}>
            <Image
              key={rug.sku}
              ref={imgRef}
              src={rug.image_url}
              alt={title}
              fill
              className="object-contain"
              unoptimized
              priority
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* ── Close button — top right ────────────────────────────────── */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
        style={{ backgroundColor: 'rgba(13,4,2,0.6)', color: 'rgba(255,255,255,0.8)' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 2l12 12M14 2L2 14"/>
        </svg>
      </button>

      {/* ── Counter — top left ──────────────────────────────────────── */}
      {rugs.length > 1 && (
        <div
          className="absolute top-4 left-4 z-10 text-xs tracking-[0.2em] px-3 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(13,4,2,0.6)', color: 'rgba(255,255,255,0.6)' }}
        >
          {index + 1} / {rugs.length}
        </div>
      )}

      {/* ── Prev arrow ─────────────────────────────────────────────── */}
      {hasPrev && (
        <button
          aria-label="Previous"
          onClick={e => { e.stopPropagation(); onChange(index - 1) }}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(13,4,2,0.55)', color: 'rgba(255,255,255,0.85)' }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 4L7 11l7 7"/>
          </svg>
        </button>
      )}

      {/* ── Next arrow ─────────────────────────────────────────────── */}
      {hasNext && (
        <button
          aria-label="Next"
          onClick={e => { e.stopPropagation(); onChange(index + 1) }}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(13,4,2,0.55)', color: 'rgba(255,255,255,0.85)' }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 4l7 7-7 7"/>
          </svg>
        </button>
      )}

      {/* ── Info overlay — bottom, fades over image ─────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-6 py-5 flex items-end justify-between gap-4"
        style={{
          background: 'linear-gradient(to top, rgba(13,4,2,0.85) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="min-w-0" style={{ pointerEvents: 'auto' }}>
          <h2
            className="text-lg md:text-xl font-[family-name:var(--font-playfair)]"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          >
            {title}
          </h2>
          <p className="text-xs tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {dims}{rug.circa_year ? ` · c. ${rug.circa_year}` : ''}{rug.sku ? ` · #${rug.sku}` : ''}
          </p>
        </div>

        {rug.sku && (
          <Link
            href={`/collection/${rug.sku}`}
            onClick={onClose}
            className="shrink-0 text-xs tracking-[0.18em] uppercase px-4 py-2.5 rounded-sm transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: 'rgba(232,213,163,0.9)',
              pointerEvents: 'auto',
            }}
          >
            View Details →
          </Link>
        )}
      </div>
    </div>
  )
}
