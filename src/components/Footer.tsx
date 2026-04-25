import { Link } from 'react-router-dom'
import { CONTACT_EMAIL, SITE_DOMAIN } from '../data/siteData'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section__container">
        <p className="site-footer__brand">Singularity Shift</p>
        <p>
          Built in Cheltenham. Shipping AI systems, Web3 integrations, and compliance-aware product
          infrastructure.
        </p>
        <div className="site-footer__links">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/work">Work</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact email</a>
        </div>
        <p className="site-footer__meta">
          © {year} Singularity Shift Ltd. https://
          {SITE_DOMAIN.replace('https://', '')}
        </p>
      </div>
    </footer>
  )
}
