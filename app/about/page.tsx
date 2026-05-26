import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Frank Shaia has been dealing in fine antique oriental rugs since 1973 from his gallery in Williamsburg, Virginia.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-20 px-4 text-center"
        style={{ backgroundColor: 'var(--burgundy-dk)' }}
      >
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--gold)' }}>
          Est. 1973
        </p>
        <h1
          className="text-4xl md:text-5xl font-[family-name:var(--font-playfair)]"
          style={{ color: 'var(--cream)' }}
        >
          The Shaia Story
        </h1>
        <div className="ornament mt-6 max-w-xs mx-auto">
          <span style={{ color: 'var(--gold)' }}>✦</span>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-6 text-base leading-relaxed" style={{ color: 'var(--brown-mid)' }}>
          <h2
            className="text-2xl font-[family-name:var(--font-playfair)]"
            style={{ color: 'var(--burgundy)' }}
          >
            A Lifetime With Rugs
          </h2>
          <p>
            Frank Shaia has been immersed in the world of antique oriental rugs for over fifty years.
            What began as a passion became a life&rsquo;s work &mdash; building one of the finest
            private collections and dealerships in the mid-Atlantic region.
          </p>
          <p>
            Every rug in the collection has been personally selected by Frank for its quality, rarity,
            condition, and beauty. He has an eye developed over decades of handling thousands of pieces,
            and a deep knowledge of weaving traditions from Persia, the Caucasus, Central Asia, and beyond.
          </p>

          <div className="ornament my-8">
            <span style={{ color: 'var(--gold)' }}>✦</span>
          </div>

          <h2
            className="text-2xl font-[family-name:var(--font-playfair)]"
            style={{ color: 'var(--burgundy)' }}
          >
            Antique, Not Just Old
          </h2>
          <p>
            The collection focuses primarily on true antiques &mdash; pieces woven before 1920.
            These rugs were made before synthetic dyes became widespread, at a time when master
            weavers passed their knowledge through generations. The wool, the natural dyes, the
            hand-spun foundations: everything about an antique rug speaks to a craft that no longer
            exists in the same form.
          </p>
          <p>
            Frank also carries carefully selected vintage pieces from the 1920s through 1960s,
            and occasional fine European textiles including Aubusson tapestries and English needlepoints.
          </p>

          <div className="ornament my-8">
            <span style={{ color: 'var(--gold)' }}>✦</span>
          </div>

          <h2
            className="text-2xl font-[family-name:var(--font-playfair)]"
            style={{ color: 'var(--burgundy)' }}
          >
            Williamsburg, Virginia
          </h2>
          <p>
            Shaia Rugs is based in Williamsburg, Virginia, where Frank operates by appointment
            and participates in select antique shows throughout the year. Whether you are a
            seasoned collector or encountering your first antique rug, Frank welcomes the
            conversation.
          </p>
        </div>

        {/* Contact block */}
        <div
          className="mt-12 p-8 rounded-sm text-center"
          style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--border)' }}
        >
          <h3
            className="text-xl mb-3 font-[family-name:var(--font-playfair)]"
            style={{ color: 'var(--burgundy)' }}
          >
            Get in Touch
          </h3>
          <address className="not-italic text-sm space-y-1 mb-6" style={{ color: 'var(--brown-mid)' }}>
            <p>5560 Foundation St, Williamsburg, VA 23188</p>
            <p><a href="tel:7572200400" className="hover:underline">(757) 220-0400</a></p>
            <p><a href="mailto:info@shaiarugs.com" className="hover:underline">info@shaiarugs.com</a></p>
          </address>
          <Link
            href="/collection"
            className="inline-block px-8 py-3 text-sm tracking-widest uppercase transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--burgundy)', color: 'var(--gold-light)' }}
          >
            Browse the Collection
          </Link>
        </div>
      </section>
    </div>
  )
}
