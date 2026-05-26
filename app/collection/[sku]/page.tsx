import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllRugs, getRugBySku, formatDimensions } from '@/lib/rugs'
import RugImageViewer from '@/components/RugImageViewer'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ sku: string }>
}

export async function generateStaticParams() {
  return getAllRugs()
    .filter(r => r.sku)
    .map(r => ({ sku: r.sku! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params
  const rug = getRugBySku(sku)
  if (!rug) return {}
  const title = [rug.origin.label, rug.rug_type].filter(Boolean).join(' ') || 'Antique Rug'
  return {
    title,
    description: rug.description_clean?.slice(0, 160) ?? undefined,
  }
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
      <dt className="text-xs tracking-widest uppercase" style={{ color: 'var(--brown-mid)', opacity: 0.7 }}>{label}</dt>
      <dd className="text-sm font-medium capitalize" style={{ color: 'var(--brown-dark)' }}>{value}</dd>
    </div>
  )
}

export default async function RugDetailPage({ params }: Props) {
  const { sku } = await params
  const rug = getRugBySku(sku)
  if (!rug) notFound()

  const title = [rug.origin.label, rug.rug_type].filter(Boolean).join(' ') || 'Antique Rug'
  const dims  = formatDimensions(rug)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs tracking-wide mb-8 flex gap-2 items-center" style={{ color: 'var(--brown-mid)' }}>
        <Link href="/" className="hover:text-burgundy transition-colors">Home</Link>
        <span style={{ color: 'var(--gold)' }}>›</span>
        <Link href="/collection" className="hover:text-burgundy transition-colors">Collection</Link>
        <span style={{ color: 'var(--gold)' }}>›</span>
        <Link href={`/collection?category=${encodeURIComponent(rug.category)}`} className="hover:text-burgundy transition-colors">
          {rug.category}
        </Link>
        <span style={{ color: 'var(--gold)' }}>›</span>
        <span style={{ color: 'var(--brown-dark)' }}>#{rug.sku}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Image — click to fullscreen */}
        <RugImageViewer rug={rug} title={title} />

        {/* Details */}
        <div>
          {/* SKU */}
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>
            Inventory #{rug.sku}
          </p>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl leading-tight mb-2 font-[family-name:var(--font-playfair)]"
            style={{ color: 'var(--burgundy-dk)' }}
          >
            {title}
          </h1>

          {/* Dimensions + date */}
          <p className="text-lg mb-6" style={{ color: 'var(--brown-mid)' }}>
            {dims}{rug.circa_year ? ` · c. ${rug.circa_year}` : ''}
          </p>

          <div className="ornament mb-6 max-w-full">
            <span style={{ color: 'var(--gold)' }}>✦</span>
          </div>

          {/* Description */}
          {rug.description_clean && (
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--brown-mid)' }}>
              {rug.description_clean}
            </p>
          )}

          {/* Detail table */}
          <dl>
            <DetailRow label="Category"   value={rug.category} />
            <DetailRow label="Origin"     value={rug.origin.label} />
            <DetailRow label="Country"    value={rug.origin.country} />
            <DetailRow label="Type"       value={rug.rug_type} />
            <DetailRow label="Weave"      value={rug.weave_type} />
            <DetailRow label="Dimensions" value={dims} />
            <DetailRow label="Area"       value={rug.dimensions ? `${rug.dimensions.area_sq_ft} sq ft` : null} />
            <DetailRow label="Circa"      value={rug.circa_year ? `${rug.circa_year}` : null} />
            <DetailRow label="Decade"     value={rug.circa_decade ?? null} />
            <DetailRow label="Era"        value={rug.era ?? null} />
          </dl>

          {/* Colors */}
          {rug.colors.length > 0 && (
            <div className="mt-4">
              <dt className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--brown-mid)', opacity: 0.7 }}>
                Colors
              </dt>
              <dd className="flex flex-wrap gap-2">
                {rug.colors.map(c => (
                  <span
                    key={c}
                    className="text-xs px-2 py-1 rounded-sm capitalize"
                    style={{ backgroundColor: 'var(--cream-dark)', color: 'var(--brown-mid)', border: '1px solid var(--border)' }}
                  >
                    {c}
                  </span>
                ))}
              </dd>
            </div>
          )}

          {/* Inquiry CTA */}
          <div
            className="mt-10 p-6 rounded-sm"
            style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm mb-3" style={{ color: 'var(--brown-mid)' }}>
              Interested in this piece? Contact Frank directly for pricing and availability.
            </p>
            <a
              href={`mailto:info@shaiarugs.com?subject=Inquiry: ${title} (SKU ${rug.sku})`}
              className="inline-block px-6 py-3 text-sm tracking-widest uppercase transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'var(--burgundy)', color: 'var(--gold-light)' }}
            >
              Inquire About This Rug
            </a>
          </div>
        </div>
      </div>

      {/* Back to collection */}
      <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link
          href={`/collection?category=${encodeURIComponent(rug.category)}`}
          className="text-sm tracking-widest uppercase"
          style={{ color: 'var(--burgundy)' }}
        >
          ← Back to {rug.category}
        </Link>
      </div>
    </div>
  )
}
