import Link from 'next/link'
import Image from 'next/image'
import FloralPlaceholder from './FloralPlaceholder'
import type { Rug } from '@/lib/types'
import { formatDimensions } from '@/lib/rugs'

interface Props {
  rug: Rug
  onZoom?: () => void
}

export default function RugCard({ rug, onZoom }: Props) {
  const href = rug.id ? `/collection/${rug.id}` : (rug.sku ? `/collection/${rug.sku}` : '#')
  const title = [rug.origin.label, rug.rug_type].filter(Boolean).join(' ') || rug.category
  const dims = formatDimensions(rug)

  return (
    <Link href={href} className="group block rug-card">
      {/* Image */}
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ backgroundColor: 'var(--cream-dark)' }}
      >
        {rug.image_url ? (
          <>
            <Image
              src={rug.image_url}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
            {/* Expand / zoom button */}
            {onZoom && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onZoom() }}
                aria-label="View fullscreen"
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: 'rgba(36,31,24,0.55)', color: 'var(--gold-light)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 1h4v4M5 13H1V9M14 1l-5 5M1 13l5-5"/>
                </svg>
              </button>
            )}
          </>
        ) : (
          /* Elegant placeholder — faint medallion-and-spandrel plan */
          <>
            <FloralPlaceholder />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <p className="label text-center opacity-40" style={{ color: 'var(--brown-mid)' }}>
                {rug.category}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Plaque caption */}
      <div className="pt-3 px-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="label" style={{ color: 'var(--brown-mid)', fontSize: '10px' }}>
            {rug.sku ? <>&#8470; {rug.sku}</> : 'Unnumbered'}
            {rug.origin.label ? ` · ${rug.origin.label}` : ''}
          </span>
          {rug.era && <span className="era-chip shrink-0">{rug.era}</span>}
        </div>
        <h3
          className="text-[19px] leading-snug mt-1 font-[family-name:var(--font-playfair)] transition-colors group-hover:text-burgundy"
          style={{ color: 'var(--brown-dark)' }}
        >
          {title}
        </h3>
        <p className="text-[13.5px] italic" style={{ color: 'var(--brown-mid)' }}>
          {dims}{rug.circa_year ? ` · c. ${rug.circa_year}` : ''}
        </p>
      </div>
    </Link>
  )
}
