import { Link } from 'react-router-dom'

export function StickyCTABar() {
  return (
    <div className="sticky-cta-bar">
      <Link className="btn btn--primary" to="/contact">
        Book a Technical Clarity Call
      </Link>
      <Link className="btn btn--ghost" to="/services">
        See Service Scope
      </Link>
    </div>
  )
}
