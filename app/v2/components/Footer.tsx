import Image from 'next/image'

/**
 * Footer — Section 10 of the /v2 landing.
 *
 * Blue (#1C40CF) band matching the tier-4 "Expert" color from the
 * Skill Tree palette. Simplified layout per brief:
 *   - Pixel-art "C" logo on the left
 *   - Single inline row of the same 4 section links used by the
 *     primary nav (Home, Product, Get Good, Skill Tree)
 *   - "© 2026 All right reserved" copy below the C
 *
 * Previous layout had a second column of social-media links (X,
 * Youtube, Instagram, Contra) plus /works /about /contact routes.
 * Both groups are removed — footer mirrors the top nav only.
 */
const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Product', href: '#product' },
  { label: 'Get Good', href: '#get-good' },
  { label: 'Skill Tree', href: '#skill-trees' },
] as const

export default function Footer() {
  return (
    <footer id="footer" className="v2-footer">
      <div className="v2-footer-inner">
        <div className="v2-footer-brand">
          {/* Logo PNG at /public/v2/logo/codepet-c.png. Intrinsic
              width/height match the sprite's native 4:5 pixel
              ratio; displayed size is handled by .v2-footer-logo. */}
          <Image
            src="/v2/logo/codepet-c.png"
            alt="Codepet"
            width={192}
            height={240}
            unoptimized
            className="v2-footer-logo"
          />
          <p className="v2-footer-copyright">&copy; 2026 All right reserved</p>
        </div>

        <nav className="v2-footer-nav" aria-label="Footer">
          <ul className="v2-footer-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="v2-footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
