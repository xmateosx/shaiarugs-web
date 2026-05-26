import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--burgundy-dk)', color: 'var(--gold-light)' }}>
      {/* Gold top rule */}
      <div className="h-px w-full" style={{ backgroundColor: 'var(--gold)', opacity: 0.4 }} />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h3
            className="text-2xl italic mb-2 font-[family-name:var(--font-playfair)]"
            style={{ color: 'var(--gold)' }}
          >
            Shaia Rugs
          </h3>
          <p className="text-sm leading-relaxed opacity-80">
            Family-owned antique oriental rug dealership specializing in rare
            Persian, Caucasian, and tribal rugs. Serving collectors and designers
            since 1973.
          </p>
        </div>

        {/* Collection links */}
        <div>
          <h4 className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--gold)' }}>
            Collection
          </h4>
          <ul className="space-y-2 text-sm opacity-80">
            {[
              ['Scatter Rugs', '/collection?category=Scatter+Rugs'],
              ['Room Size Rugs', '/collection?category=Room+Size+Rugs'],
              ['Runners', '/collection?category=Runners'],
              ['Oversize Rugs', '/collection?category=Oversize+Rugs'],
              ['Tribal Rugs', '/collection?category=Tribal+Rugs'],
              ['European & Textiles', '/collection?category=European+%26+Textiles'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-gold transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--gold)' }}>
            Contact
          </h4>
          <address className="not-italic text-sm opacity-80 space-y-1 leading-relaxed">
            <p>Frank Shaia</p>
            <p>5560 Foundation St</p>
            <p>Williamsburg, VA 23188</p>
            <p className="pt-2">
              <a href="tel:7572200400" className="hover:opacity-100 transition-opacity">
                (757) 220-0400
              </a>
            </p>
            <p>
              <a href="mailto:info@shaiarugs.com" className="hover:opacity-100 transition-opacity">
                info@shaiarugs.com
              </a>
            </p>
          </address>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t text-center text-xs py-4 opacity-50 tracking-wide"
        style={{ borderColor: 'var(--gold)', opacity: 0.5 }}
      >
        &copy; {new Date().getFullYear()} Shaia Rugs &mdash; All Rights Reserved
      </div>
    </footer>
  )
}
