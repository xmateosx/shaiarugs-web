'use client'
import { useState } from 'react'
import Image from 'next/image'
import Lightbox from './Lightbox'
import type { Rug } from '@/lib/types'

interface Props {
  rug: Rug
  title: string
}

export default function RugImageViewer({ rug, title }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className="relative aspect-[4/5] rounded-sm overflow-hidden cursor-zoom-in group"
        style={{ backgroundColor: 'var(--cream-dark)' }}
        onClick={() => rug.image_url && setOpen(true)}
        role={rug.image_url ? 'button' : undefined}
        aria-label={rug.image_url ? 'View fullscreen' : undefined}
      >
        {rug.image_url ? (
          <>
            <Image
              src={rug.image_url}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
              unoptimized
            />
            {/* Expand hint */}
            <div
              className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs tracking-widest uppercase"
                style={{ backgroundColor: 'rgba(18,6,0,0.6)', color: 'var(--gold-light)' }}
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

        {/* Era badge */}
        {rug.era && (
          <span
            className="absolute top-4 left-4 text-xs tracking-widest uppercase px-3 py-1"
            style={{ backgroundColor: 'var(--burgundy)', color: 'var(--gold-light)' }}
          >
            {rug.era}
          </span>
        )}
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
