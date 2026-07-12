import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--cream-dark)', borderTop: '1px solid var(--hairline)' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h3
            className="uppercase mb-3 font-[family-name:var(--font-jost)]"
            style={{ color: 'var(--brown-dark)', letterSpacing: '0.24em', fontSize: '16px', fontWeight: 350 }}
          >
            Shaia Rugs
          </h3>
          <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--brown-mid)' }}>
            Family-owned antique oriental rug dealership specializing in rare
            Persian, Caucasian, and tribal rugs. Serving collectors and designers
            since 1973.
          </p>
        </div>

        {/* Collection links */}
        <div>
          <h4 className="label mb-4" style={{ color: 'var(--gold)' }}>
            Collection
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ['Scatter Rugs', '/collection?category=Scatter+Rugs'],
              ['Room Size Rugs', '/collection?category=Room+Size+Rugs'],
              ['Runners', '/collection?category=Runners'],
              ['Oversize Rugs', '/collection?category=Oversize+Rugs'],
              ['Tribal Rugs', '/collection?category=Tribal+Rugs'],
              ['European & Textiles', '/collection?category=European+%26+Textiles'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="transition-colors hover:text-brown-dark"
                  style={{ color: 'var(--brown-mid)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="label mb-4" style={{ color: 'var(--gold)' }}>
            Contact
          </h4>
          <address className="not-italic text-sm space-y-1 leading-relaxed" style={{ color: 'var(--brown-mid)' }}>
            <p>Frank Shaia</p>
            <p>5560 Foundation St</p>
            <p>Williamsburg, VA 23188</p>
            <p className="pt-2">
              <a href="tel:7572200400" className="transition-colors hover:text-brown-dark">
                (757) 220-0400
              </a>
            </p>
            <p>
              <a href="mailto:info@shaiarugs.com" className="transition-colors hover:text-brown-dark">
                info@shaiarugs.com
              </a>
            </p>
          </address>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="label text-center py-4"
        style={{ borderTop: '1px solid var(--hairline)', color: 'var(--brown-mid)', opacity: 0.7 }}
      >
        &copy; {new Date().getFullYear()} Shaia Rugs &mdash; All Rights Reserved
      </div>
    </footer>
  )
}
