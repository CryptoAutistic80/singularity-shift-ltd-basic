import { Link } from 'react-router-dom'

import { SERVICE_LANES } from '../data/siteData'
import { ServiceLaneCard } from '../components/ServiceLaneCard'
import { Section } from '../components/Section'

export function ServicesPage() {
  return (
    <>
      <Section
        title="Services"
        description="Four lanes, each with explicit outcomes, deliverables, and next action."
      >
        <div className="card-grid card-grid--4">
          {SERVICE_LANES.map((lane) => (
            <ServiceLaneCard lane={lane} key={lane.slug} />
          ))}
        </div>
      </Section>
      <Section
        title="Route to the right build lane"
        description="Every path starts with a scoping call and a short risk map."
      >
        <div className="cta-band">
          <Link className="btn btn--primary" to="/contact">
            Book a Technical Clarity Call
          </Link>
          <Link className="btn btn--secondary" to="/contact">
            Start a scoped discovery form
          </Link>
        </div>
      </Section>
    </>
  )
}
