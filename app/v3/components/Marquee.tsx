/**
 * Marquee — a slow ghost-type scroller. The track is duplicated so
 * the -50% translate loops seamlessly. Pauses on hover.
 */
const PHRASES = [
  'Run your whole company',
  'Department by department',
  'byte builds — you approve',
  'Ship what you understand',
]

export default function Marquee() {
  // Two copies of the sequence → seamless -50% loop.
  const items = [...PHRASES, ...PHRASES]
  return (
    <div className="v3-marquee" aria-hidden="true">
      <div className="v3-marquee-track">
        {items.map((p, i) => (
          <span key={i} className="v3-marquee-item">
            {p}
            <span className="star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
