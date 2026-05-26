import Link from 'next/link'
import Image from 'next/image'
import type { Rug } from '@/lib/types'
import { formatDimensions } from '@/lib/rugs'

interface Props {
  rug: Rug
}

export default function RugCard({ rug }: Props) {
  const href = rug.sku ? `/collection/${rug.sku}` : '#'
  const title = [rug.origin.label, rug.rug_type].filter(Boolean).join(' ') || rug.category
  const dims = formatDimensions(rug)

  return (
    <Link href={href} className="group block rug-card">
      {/* Image */}
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-sm mb-3"
        style={{ backgroundColor: 'var(--cream-dark)' }}
      >
        {rug.image_url ? (
          <Image
            src={rug.image_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          /* Elegant placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <div className="text-4xl opacity-20" style={{ color: 'var(--burgundy)' }}>✦</div>
            <p
              className="text-center text-xs tracking-widest uppercase opacity-40"
              style={{ color: 'var(--brown-mid)' }}
            >
              {rug.category}
            </p>
          </div>
        )}

        {/* Era badge */}
        {rug.era && (
          <span
            className="absolute top-2 left-2 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
            style={{ backgroundColor: 'var(--burgundy)', color: 'var(--gold-light)', opacity: 0.92 }}
          >
            {rug.era}
          </span>
        )}

        {/* SKU */}
        {rug.sku && (
          <span
            className="absolute bottom-2 right-2 text-[10px] tracking-wider opacity-60 px-1.5 py-0.5 rounded-sm"
            style={{ backgroundColor: 'var(--brown-dark)', color: 'var(--gold-light)' }}
          >
            #{rug.sku}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1 px-0.5">
        <h3
          className="font-[family-name:var(--font-playfair)] text-base leading-snug group-hover:text-burgundy transition-colors"
          style={{ color: 'var(--brown-dark)' }}
        >
          {title}
        </h3>

        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--brown-mid)' }}>
          <span>{dims}</span>
          {rug.circa_year && <span>c. {rug.circa_year}</span>}
        </div>

        {rug.colors.length > 0 && (
          <p className="text-xs opacity-60 truncate" style={{ color: 'var(--brown-mid)' }}>
            {rug.colors.slice(0, 4).join(', ')}
          </p>
        )}
      </div>
    </Link>
  )
}
