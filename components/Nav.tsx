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
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{ backgroundColor: 'var(--burgundy-dk)' }}>
      {/* Top bar */}
      <div
        className="text-center py-1.5 text-xs tracking-widest uppercase"
        style={{ backgroundColor: 'var(--burgundy)', color: 'var(--gold-light)' }}
      >
        Quality Antique Oriental Rugs Since 1973 &mdash; Williamsburg, Virginia
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span
            className="text-2xl md:text-3xl font-[family-name:var(--font-playfair)] italic"
            style={{ color: 'var(--gold)' }}
          >
            Shaia Rugs
          </span>
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--gold-light)', opacity: 0.7 }}>
            Est. 1973
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide uppercase transition-colors duration-200"
              style={{ color: 'var(--gold-light)' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--gold-light)')}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block w-6 h-0.5 transition-all duration-200"
              style={{ backgroundColor: 'var(--gold)' }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="md:hidden border-t px-4 py-4 flex flex-col gap-3"
          style={{ borderColor: 'var(--burgundy)', backgroundColor: 'var(--burgundy-dk)' }}
        >
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide uppercase py-1"
              style={{ color: 'var(--gold-light)' }}
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
