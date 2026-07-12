'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/collection', label: 'Collection' },
  { href: '/collection?category=Scatter+Rugs', label: 'Scatter' },
  { href: '/collection?category=Room+Size+Rugs', label: 'Room Size' },
  { href: '/collection?category=Runners', label: 'Runners' },
  { href: '/collection?category=Oversize+Rugs', label: 'Oversize' },
  { href: '/collection?category=Tribal+Rugs', label: 'Tribal' },
  { href: '/collection?category=European+%26+Textiles', label: 'European & Textiles' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{ borderBottom: '1px solid var(--hairline)' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-baseline justify-between gap-6 pt-6 pb-5 flex-wrap">
        {/* Wordmark */}
        <Link href="/" className="flex flex-col leading-tight">
          <span
            className="text-[21px] md:text-[23px] uppercase font-[family-name:var(--font-jost)]"
            style={{ color: 'var(--brown-dark)', letterSpacing: '0.24em', fontWeight: 350 }}
          >
            Shaia Rugs
          </span>
          <span className="label mt-1" style={{ color: 'var(--gold)' }}>
            Est. 1973 · Williamsburg, Virginia
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-baseline gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="label pb-1 border-b border-transparent transition-colors duration-200 hover:border-[var(--gold)]"
              style={{ color: 'var(--brown-mid)', fontSize: '11.5px' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--brown-dark)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--brown-mid)')}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block w-6 h-px transition-all duration-200"
              style={{ backgroundColor: 'var(--brown-dark)' }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="lg:hidden px-5 py-4 flex flex-col gap-3"
          style={{ borderTop: '1px solid var(--hairline)' }}
        >
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="label py-1"
              style={{ color: 'var(--brown-mid)' }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
