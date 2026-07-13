'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Lightbox from './Lightbox'
import type { Rug } from '@/lib/types'

const HOVER_ZOOM_SCALE = 2.5

interface Props {
  rug: Rug
  title: string
}

export default function RugImageViewer({ rug, title }: Props) {
  const [open, setOpen] = useState(false)
  const [hoverZoomEnabled, setHoverZoomEnabled] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const zoomWrapRef = useRef<HTMLDivElement>(null)

  // Hover zoom only for precise hover pointers, and never under reduced motion
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setHoverZoomEnabled(fine.matches && !reduced.matches)
    update()
    fine.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => {
      fine.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverZoomEnabled || !zoomWrapRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ox = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))
    const oy = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100))
    // Written directly to the element: transform-origin must update instantly
    // (its jumps ARE the pan) and per-mousemove re-renders aren't needed
    zoomWrapRef.current.style.transformOrigin = `${ox}% ${oy}%`
    if (!zoomed) setZoomed(true)
  }

  return (
    <>
      <div
        className="framed cursor-zoom-in group"
        onClick={() => rug.image_url && setOpen(true)}
        role={rug.image_url ? 'button' : undefined}
        aria-label={rug.image_url ? 'View fullscreen' : undefined}
      >
      <div
        className="arch relative aspect-[4/5] overflow-hidden"
        style={{ backgroundColor: 'var(--cream-dark)' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomed(false)}
      >
        {rug.image_url ? (
          <>
            {/* Wrapper (not the img) is transformed: `.arch > img` carries the
                arch radius, so scaling the img itself would scale its rounded
                corners and expose background while panning */}
            <div
              ref={zoomWrapRef}
              className="absolute inset-0 will-change-transform"
              style={{
                transform: zoomed ? `scale(${HOVER_ZOOM_SCALE})` : 'scale(1)',
                transition: 'transform 250ms ease',
              }}
            >
              <Image
                src={rug.image_url}
                alt={title}
                fill
                className="object-cover"
                priority
                unoptimized
                draggable={false}
              />
            </div>
            {/* Expand hint — bottom right on hover */}
            <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs tracking-widest uppercase"
                style={{ backgroundColor: 'rgba(13,4,2,0.65)', color: 'rgba(255,255,255,0.8)' }}
              >
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 1h4v4M5 13H1V9M14 1l-5 5M1 13l5-5"/>
                </svg>
                Fullscreen
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="text-8xl opacity-10" style={{ color: 'var(--burgundy)' }}>✦</div>
            <p className="text-sm tracking-widest uppercase opacity-30" style={{ color: 'var(--brown-mid)' }}>
              Image coming soon
            </p>
          </div>
        )}

      </div>
      </div>

      {open && (
        <Lightbox
          rugs={[rug]}
          index={0}
          onClose={() => setOpen(false)}
          onChange={() => {}}
        />
      )}
    </>
  )
}
