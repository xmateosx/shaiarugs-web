import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllRugs, getRugById, formatDimensions } from '@/lib/rugs'
import RugImageViewer from '@/components/RugImageViewer'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ sku: string }>
}

export async function generateStaticParams() {
  return getAllRugs()
    .filter(r => r.id || r.sku)
    .map(r => ({ sku: r.id ?? r.sku! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params
  const rug = getRugById(sku)
  if (!rug) return {}
  const title = [rug.origin.label, rug.rug_type].filter(Boolean).join(' ') || 'Antique Rug'
  return {
    title,
    description: rug.description_clean?.slice(0, 160) ?? undefined,
  }
}

function SpecRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex justify-between items-baseline py-2.5" style={{ borderTop: '1px solid var(--hairline)' }}>
      <dt className="label" style={{ color: 'var(--brown-mid)', fontSize: '10.5px' }}>{label}</dt>
      <dd className="text-sm capitalize" style={{ color: 'var(--brown-dark)', fontVariantNumeric: 'tabular-nums' }}>{value}</dd>
    </div>
  )
}

export default async function RugDetailPage({ params }: Props) {
  const { sku } = await params
  const rug = getRugById(sku)
  if (!rug) notFound()

  const title = [rug.origin.label, rug.rug_type].filter(Boolean).join(' ') || 'Antique Rug'
  const dims  = formatDimensions(rug)

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="label mb-8 flex gap-2 items-center flex-wrap" style={{ color: 'var(--brown-mid)' }}>
        <Link href="/" className="hover:text-brown-dark transition-colors">Home</Link>
        <span style={{ color: 'var(--gold)' }}>/</span>
        <Link href="/collection" className="hover:text-brown-dark transition-colors">Collection</Link>
        <span style={{ color: 'var(--gold)' }}>/</span>
        <Link href={`/collection?category=${encodeURIComponent(rug.category)}`} className="hover:text-brown-dark transition-colors">
          {rug.category}
        </Link>
        {rug.sku && <>
          <span style={{ color: 'var(--gold)' }}>/</span>
          <span style={{ color: 'var(--brown-dark)' }}>&#8470; {rug.sku}</span>
        </>}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-10 md:gap-14 items-start">
        <RugImageViewer rug={rug} title={title} />

        {/* Plaque */}
        <div style={{ borderTop: '3px double var(--gold)', paddingTop: '22px' }}>
          <div className="flex items-baseline gap-3.5">
            {rug.sku && (
              <span className="italic text-xl font-[family-name:var(--font-playfair)]" style={{ color: 'var(--burgundy)' }}>
                &#8470; {rug.sku}
              </span>
            )}
            {rug.era && <span className="era-chip">{rug.era}</span>}
          </div>

          <h1
            className="text-3xl md:text-[40px] leading-[1.1] mt-2.5 mb-2 font-[family-name:var(--font-playfair)]"
            style={{ color: 'var(--brown-dark)' }}
          >
            {title}
          </h1>

          <p className="italic text-lg mb-5" style={{ color: 'var(--brown-mid)' }}>
            {dims}{rug.circa_year ? ` · circa ${rug.circa_year}` : ''}
          </p>

          {rug.description_clean && (
            <p className="leading-relaxed mb-7" style={{ color: 'var(--brown-mid)' }}>
              {rug.description_clean}
            </p>
          )}

          <div className="ornament mb-5" role="presentation">
            <span style={{ fontSize: '15px' }}>&#10086;</span>
          </div>

          <dl className="mb-8" style={{ borderBottom: '1px solid var(--hairline)' }}>
            <SpecRow label="Category"   value={rug.category} />
            <SpecRow label="Origin"     value={rug.origin.label} />
            <SpecRow label="Country"    value={rug.origin.country} />
            <SpecRow label="Type"       value={rug.rug_type} />
            <SpecRow label="Weave"      value={rug.weave_type} />
            <SpecRow label="Dimensions" value={dims} />
            <SpecRow label="Area"       value={rug.dimensions ? `${rug.dimensions.area_sq_ft} sq ft` : null} />
            <SpecRow label="Circa"      value={rug.circa_year ? `${rug.circa_year}` : null} />
            <SpecRow label="Era"        value={rug.era ?? null} />
            {rug.colors.length > 0 && (
              <SpecRow label="Colors" value={rug.colors.slice(0, 5).join(', ')} />
            )}
          </dl>

          <a
            href={`mailto:info@shaiarugs.com?subject=Inquiry: ${title}${rug.sku ? ` (No. ${rug.sku})` : ''}`}
            className="label inline-block px-8 py-4 transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: 'var(--burgundy)', color: 'var(--madder-ink)' }}
          >
            Inquire About This Piece
          </a>
          <p className="italic text-sm mt-4" style={{ color: 'var(--brown-mid)' }}>
            Interested? Contact Frank directly for pricing and availability
            &mdash; <a href="tel:7572200400" className="underline decoration-[var(--hairline)] underline-offset-2">(757) 220-0400</a>
          </p>
        </div>
      </div>

      <div className="mt-14 pt-7" style={{ borderTop: '1px solid var(--hairline)' }}>
        <Link
          href={`/collection?category=${encodeURIComponent(rug.category)}`}
          className="label"
          style={{ color: 'var(--burgundy)' }}
        >
          ← Back to {rug.category}
        </Link>
      </div>
    </div>
  )
}
