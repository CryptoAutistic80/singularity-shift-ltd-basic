import { Link } from 'react-router-dom'

import { Section } from '../components/Section'

export function NotFoundPage() {
  return (
    <Section title="Page not found" description="This route does not exist on this build.">
      <div className="cta-band">
        <Link className="btn btn--primary" to="/">
          Return home
        </Link>
        <Link className="btn btn--secondary" to="/contact">
          Start a technical clarity call
        </Link>
      </div>
    </Section>
  )
}
