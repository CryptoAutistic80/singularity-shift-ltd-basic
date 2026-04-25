import { useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
]

export function SiteHeader() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const logoSrc = '/assets/logo_clean_white.png'

  const activeClass = useMemo(
    () => (href: string) => (location.pathname === href || (href === '/services' && location.pathname.startsWith('/services')) ? 'is-active' : ''),
    [location.pathname]
  )

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" to="/" onClick={() => setOpen(false)}>
          <span className="site-brand__mark" aria-hidden="true">
            <img src={logoSrc} alt="" />
          </span>
          <span className="site-brand__text">
            <span>Singularity Shift</span>
            <small>Brought to life in Cheltenham</small>
          </span>
        </Link>

        <button
          aria-controls="primary-nav"
          aria-expanded={open}
          className={`menu-toggle ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((prev) => !prev)}
          type="button"
        >
          <span />
          <span />
          <span />
          <span className="sr-only">Toggle navigation</span>
        </button>

        <nav id="primary-nav" className={`site-nav ${open ? 'is-open' : ''}`}>
          <ul>
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <NavLink
                  className={activeClass(item.href)}
                  to={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link to="/contact" className="header-cta" onClick={() => setOpen(false)}>
          Book a Technical Clarity Call
        </Link>
      </div>
    </header>
  )
}
