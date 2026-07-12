'use client'
import { useEffect, useRef } from 'react'

// Faint floral field — vine sprigs, rosettes, and botehs in muted brass —
// fixed behind the page, drifting at half the scroll speed. The pattern
// tile is 280px tall, so the drift wraps seamlessly.
export default function FloralField() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const flora = ref.current
    if (!flora || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let last = -1
    const top = () =>
      (document.scrollingElement || document.documentElement).scrollTop || 0
    const drift = () => {
      const y = top()
      if (y !== last) {
        last = y
        flora.style.transform = `translateY(${-((y * 0.5) % 280)}px)`
      }
      raf = requestAnimationFrame(drift)
    }
    raf = requestAnimationFrame(drift)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-0 w-full"
      style={{ height: 'calc(100vh + 280px)', color: 'var(--gold)', opacity: 0.105, willChange: 'transform' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <g id="sprig" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M0 54 C 22 40, 44 62, 66 44 C 84 30, 104 40, 118 26" />
          <path d="M28 48 C 30 38, 40 34, 48 38" />
          <path d="M76 40 C 74 30, 64 26, 56 30" />
          <ellipse cx="24" cy="56" rx="7" ry="3.4" transform="rotate(-32 24 56)" />
          <ellipse cx="58" cy="49" rx="7" ry="3.4" transform="rotate(24 58 49)" />
          <ellipse cx="96" cy="34" rx="7" ry="3.4" transform="rotate(-28 96 34)" />
        </g>
        <g id="rosette" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle r="4.5" />
          <ellipse rx="5" ry="11" cy="-13" />
          <ellipse rx="5" ry="11" cy="-13" transform="rotate(60)" />
          <ellipse rx="5" ry="11" cy="-13" transform="rotate(120)" />
          <ellipse rx="5" ry="11" cy="-13" transform="rotate(180)" />
          <ellipse rx="5" ry="11" cy="-13" transform="rotate(240)" />
          <ellipse rx="5" ry="11" cy="-13" transform="rotate(300)" />
        </g>
        <g id="boteh" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M0 0 C -14 -4, -16 -22, -4 -30 C 8 -38, 18 -28, 14 -18 C 11 -10, 4 -8, 0 0 Z" />
          <path d="M-2 -12 C -8 -14, -9 -22, -3 -25" />
        </g>
        <pattern id="vinefield" width="260" height="280" patternUnits="userSpaceOnUse">
          <use href="#rosette" x="130" y="70" />
          <use href="#sprig" x="10" y="120" />
          <use href="#sprig" x="140" y="190" transform="scale(-1,1) translate(-420,0)" />
          <use href="#boteh" x="52" y="52" />
          <use href="#boteh" x="216" y="240" transform="rotate(180 216 240)" />
          <use href="#rosette" x="72" y="368" transform="scale(.62)" />
          <use href="#rosette" x="330" y="52" transform="scale(.62)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#vinefield)" />
    </svg>
  )
}
