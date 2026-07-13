// Faint floral stand-in for rugs awaiting photography — the ghost of a
// rug's plan: a center medallion with corner spandrels, drawn in hairline
// gold at whisper opacity so it reads as texture unless you look for it.
export default function FloralPlaceholder() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      style={{ color: 'var(--gold)', opacity: 0.09 }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {/* Medallion */}
        <g transform="translate(200 250)">
          <circle r="20" />
          {[0, 60, 120, 180, 240, 300].map(a => (
            <ellipse key={a} rx="21" ry="48" cy="-56" transform={`rotate(${a})`} />
          ))}
          <circle r="86" strokeWidth="1.4" />
        </g>
        {/* Corner spandrels */}
        {([[0, 0, 1, 1], [400, 0, -1, 1], [0, 500, 1, -1], [400, 500, -1, -1]] as const).map(([x, y, sx, sy]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
            <path d="M0 96 C 34 88, 66 70, 84 34 C 90 22, 94 12, 96 0" />
            <path d="M46 74 C 52 60, 64 54, 76 56" strokeWidth="1.6" />
            <ellipse cx="58" cy="64" rx="9" ry="4.4" transform="rotate(-34 58 64)" strokeWidth="1.6" />
          </g>
        ))}
      </g>
    </svg>
  )
}
