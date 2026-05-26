import Link from 'next/link'
import RugCard from '@/components/RugCard'
import { getFeaturedRugs, getCategories, getCategorySlug } from '@/lib/rugs'

const categoryDescriptions: Record<string, string> = {
  'Scatter Rugs':         'Intimate pieces, 3×5 to 5×8. Perfect for entry halls, sitting rooms, and beside beds.',
  'Room Size Rugs':       'Commanding room-defining pieces, typically 6×9 to 9×12.',
  'Runners':              'Elegant long-format rugs ideal for hallways and staircases.',
  'Oversize Rugs':        'Grand statement pieces for large rooms and grand halls.',
  'Tribal Rugs':          'Raw, expressive pieces woven by nomadic and village tribes.',
  'European & Textiles':  'Aubusson tapestries, needlepoints, and fine European weavings.',
}

export default function HomePage() {
  const featured = getFeaturedRugs()
  const categories = getCategories()

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        className="relative py-24 md:py-36 text-center px-4"
        style={{ backgroundColor: 'var(--burgundy-dk)' }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />

        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
            Williamsburg, Virginia
          </p>
          <h1
            className="text-4xl md:text-6xl mb-6 leading-tight font-[family-name:var(--font-playfair)]"
            style={{ color: 'var(--cream)' }}
          >
            Antique Oriental Rugs<br />
            <em className="not-italic" style={{ color: 'var(--gold)' }}>of Distinction</em>
          </h1>

          <div className="ornament my-6 max-w-sm mx-auto">
            <span className="text-sm italic" style={{ color: 'var(--gold)' }}>✦</span>
          </div>

          <p className="text-base md:text-lg leading-relaxed mb-10 opacity-80" style={{ color: 'var(--cream)' }}>
            For over fifty years, Frank Shaia has assembled one of Virginia&apos;s finest
            collections of antique Persian, Caucasian, and tribal rugs —
            each piece a living work of art.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/collection"
              className="px-8 py-3 text-sm tracking-widest uppercase font-medium transition-colors duration-200"
              style={{ backgroundColor: 'var(--gold)', color: 'var(--brown-dark)' }}
            >
              View Collection
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 text-sm tracking-widest uppercase border transition-colors duration-200"
              style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Rugs ──────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: 'var(--gold)' }}>
              From the Collection
            </p>
            <h2
              className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)]"
              style={{ color: 'var(--burgundy)' }}
            >
              Featured Pieces
            </h2>
            <div className="ornament mt-4 max-w-xs mx-auto">
              <span style={{ color: 'var(--gold)' }}>✦</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {featured.map(rug => (
              <RugCard key={rug.sku} rug={rug} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/collection"
              className="inline-block px-10 py-3 text-sm tracking-widest uppercase border transition-all duration-200 hover:opacity-80"
              style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
            >
              View All 78 Rugs
            </Link>
          </div>
        </section>
      )}

      {/* ── Category Browser ───────────────────────────────── */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--cream-dark)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: 'var(--gold)' }}>
              Browse by Type
            </p>
            <h2
              className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)]"
              style={{ color: 'var(--burgundy)' }}
            >
              The Collection
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <Link
                key={cat}
                href={`/collection?category=${encodeURIComponent(cat)}`}
                className="group p-6 border transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border)' }}
              >
                <h3
                  className="text-lg mb-2 font-[family-name:var(--font-playfair)] group-hover:text-burgundy transition-colors"
                  style={{ color: 'var(--burgundy-dk)' }}
                >
                  {cat}
                </h3>
                <p className="text-sm leading-relaxed opacity-70" style={{ color: 'var(--brown-mid)' }}>
                  {categoryDescriptions[cat]}
                </p>
                <p
                  className="text-xs tracking-widest uppercase mt-4 group-hover:opacity-100 opacity-50 transition-opacity"
                  style={{ color: 'var(--gold)' }}
                >
                  Browse →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Strip ────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
          Est. 1973
        </p>
        <h2
          className="text-3xl md:text-4xl mb-6 font-[family-name:var(--font-playfair)]"
          style={{ color: 'var(--burgundy)' }}
        >
          Fifty Years of Expertise
        </h2>
        <p className="text-base leading-relaxed opacity-80 mb-8" style={{ color: 'var(--brown-mid)' }}>
          Frank Shaia has spent a lifetime studying, collecting, and dealing in antique
          oriental rugs. Every piece in the collection has been personally selected for
          its quality, rarity, and beauty. We invite serious collectors and first-time
          buyers alike to explore the collection.
        </p>
        <Link
          href="/about"
          className="text-sm tracking-widest uppercase border-b pb-0.5 transition-colors duration-200"
          style={{ borderColor: 'var(--gold)', color: 'var(--burgundy)' }}
        >
          Read Our Story
        </Link>
      </section>
    </>
  )
}
