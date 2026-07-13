import Link from 'next/link'
import Image from 'next/image'
import FloralPlaceholder from '@/components/FloralPlaceholder'
import { getAllRugs, getCategories, getRugsByCategory, getRugById, formatDimensions } from '@/lib/rugs'

export default function HomePage() {
  const categories = getCategories()
  const totalCount = getAllRugs().length

  // Representative image + count per category
  const tiles = categories.map(cat => {
    const inCat = getRugsByCategory(cat)
    const withImage = inCat.find(r => r.image_url)
    return { cat, count: inCat.length, image: withImage?.image_url ?? null }
  })

  // Featured lot — the antique Serapi (falls back to first high-confidence rug)
  const featured =
    getRugById('15891') ??
    getAllRugs().find(r => r.image_url && r.data_quality.confidence === 'high')

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-10 md:gap-14 items-center py-14 md:py-20">
          <div>
            <p className="label flex items-center gap-3" style={{ color: 'var(--gold)' }}>
              <span className="inline-block w-11 h-px" style={{ backgroundColor: 'var(--gold)' }} />
              Quality Antique Oriental Rugs Since 1973
            </p>
            <h1
              className="text-4xl md:text-6xl leading-[1.06] mt-5 mb-5 font-[family-name:var(--font-playfair)]"
              style={{ color: 'var(--brown-dark)', textWrap: 'balance' }}
            >
              A dealer&rsquo;s collection, numbered one rug at a time.
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: 'var(--brown-mid)' }}>
              Persian, Caucasian, tribal, and European pieces, hand-picked by
              Frank Shaia over fifty years on the show circuit. Every rug
              photographed, measured, and catalogued.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/collection"
                className="label px-8 py-4 transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: 'var(--burgundy)', color: 'var(--madder-ink)' }}
              >
                Browse the Collection
              </Link>
              <Link
                href="/about"
                className="label px-8 py-4 border transition-colors duration-200 hover:border-[var(--gold)]"
                style={{ borderColor: 'var(--hairline)', color: 'var(--brown-dark)' }}
              >
                Visit Us in Williamsburg
              </Link>
            </div>
          </div>

          <figure className="m-0 hidden sm:block">
            <div className="framed">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/hero/booth.jpg"
                  alt="The Shaia Rugs booth, hung floor to ceiling with antique rugs"
                  fill
                  priority
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
            <figcaption className="label text-center mt-4" style={{ color: 'var(--brown-mid)' }}>
              The Shaia booth &mdash; on the show circuit
            </figcaption>
          </figure>
        </div>

        <div className="ornament max-w-lg mx-auto" role="presentation">
          <span style={{ fontSize: '17px' }}>&#10086;</span>
        </div>

        {/* ── Category tiles ─────────────────────────────────── */}
        <div className="flex items-baseline justify-between gap-5 flex-wrap pt-10 pb-7">
          <h2 className="text-3xl md:text-[32px] font-[family-name:var(--font-playfair)]" style={{ color: 'var(--brown-dark)' }}>
            The Collection
          </h2>
          <span className="label" style={{ color: 'var(--brown-mid)' }}>
            {totalCount} pieces &middot; six categories
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-9 pb-16">
          {tiles.map(({ cat, count, image }) => (
            <Link key={cat} href={`/collection?category=${encodeURIComponent(cat)}`} className="group block rug-card">
              <div
                className="relative aspect-[4/3] overflow-hidden"
                style={{ backgroundColor: 'var(--cream-dark)' }}
              >
                {image ? (
                  <Image
                    src={image}
                    alt={cat}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <FloralPlaceholder />
                )}
              </div>
              <div
                className="flex items-baseline justify-between gap-3 pt-3.5 pb-3.5 px-0.5"
                style={{ borderBottom: '1px solid var(--hairline)' }}
              >
                <span className="text-xl font-[family-name:var(--font-playfair)]" style={{ color: 'var(--brown-dark)' }}>
                  {cat}
                </span>
                <span className="label" style={{ color: 'var(--brown-mid)' }}>
                  {count} piece{count !== 1 ? 's' : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured lot ───────────────────────────────────── */}
      {featured && (
        <section style={{ backgroundColor: 'var(--cream-dark)' }}>
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-10 md:gap-14 items-center">
            <figure className="m-0">
              {featured.image_url && (
                <div className="framed">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={featured.image_url}
                      alt={[featured.origin.label, featured.rug_type].filter(Boolean).join(' ')}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </figure>
            <div>
              <p className="label flex items-center gap-3" style={{ color: 'var(--gold)' }}>
                <span className="inline-block w-11 h-px" style={{ backgroundColor: 'var(--gold)' }} />
                From the Catalog
              </p>
              <h3 className="text-3xl md:text-4xl leading-tight mt-4 mb-3 font-[family-name:var(--font-playfair)]" style={{ color: 'var(--brown-dark)' }}>
                {[featured.origin.label, featured.rug_type].filter(Boolean).join(' ')}{' '}
                {featured.sku && (
                  <span className="italic text-lg align-middle" style={{ color: 'var(--burgundy)' }}>
                    &#8470;&nbsp;{featured.sku}
                  </span>
                )}
              </h3>
              <p className="italic mb-5" style={{ color: 'var(--brown-mid)' }}>
                {formatDimensions(featured)}
                {featured.circa_year ? ` · circa ${featured.circa_year}` : ''}
                {featured.era ? ` · ${featured.era}` : ''}
              </p>
              {featured.description_clean && (
                <p className="leading-relaxed mb-8 max-w-xl" style={{ color: 'var(--brown-mid)' }}>
                  &ldquo;{featured.description_clean}&rdquo;
                </p>
              )}
              <Link
                href={`/collection/${featured.id ?? featured.sku}`}
                className="label inline-block px-8 py-4 transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: 'var(--burgundy)', color: 'var(--madder-ink)' }}
              >
                View This Lot
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── About strip ────────────────────────────────────── */}
      <section className="py-20 px-5 max-w-2xl mx-auto text-center">
        <p className="label mb-4" style={{ color: 'var(--gold)' }}>
          Est. 1973
        </p>
        <h2 className="text-3xl md:text-4xl mb-6 font-[family-name:var(--font-playfair)]" style={{ color: 'var(--brown-dark)' }}>
          Fifty Years of Expertise
        </h2>
        <p className="leading-relaxed mb-8" style={{ color: 'var(--brown-mid)' }}>
          Frank Shaia has spent a lifetime studying, collecting, and dealing in
          antique oriental rugs. Every piece in the collection has been
          personally selected for its quality, rarity, and beauty. We invite
          serious collectors and first-time buyers alike to explore the
          collection.
        </p>
        <Link
          href="/about"
          className="label border-b pb-1 transition-colors duration-200 hover:border-[var(--gold)]"
          style={{ borderColor: 'var(--hairline)', color: 'var(--burgundy)' }}
        >
          Read Our Story
        </Link>
      </section>
    </>
  )
}
