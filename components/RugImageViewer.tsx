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
        className="framed cursor-zoom-in group"
        onClick={() => rug.image_url && setOpen(true)}
        role={rug.image_url ? 'button' : undefined}
        aria-label={rug.image_url ? 'View fullscreen' : undefined}
      >
      <div
        className="arch relative aspect-[4/5] overflow-hidden"
        style={{ backgroundColor: 'var(--cream-dark)' }}
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
