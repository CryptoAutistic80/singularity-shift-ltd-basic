import { Link } from 'react-router-dom'
import type { ServiceLane } from '../data/siteData'

type ServiceLaneCardProps = {
  lane: ServiceLane
  linkTo?: string
}

export function ServiceLaneCard({ lane, linkTo }: ServiceLaneCardProps) {
  const destination = linkTo ?? `/services/${lane.slug}`
  return (
    <article className="service-card glass-card">
      <header>
        <p className="service-card__audience">{lane.audience}</p>
        <h3>{lane.title}</h3>
      </header>
      <p className="service-card__delivery">Delivery: {lane.delivery}</p>
      <div className="service-card__proof-tags" aria-label="Proof tags">
        {lane.proofTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div>
        <h4>Outcomes</h4>
        <ul>
          {lane.outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Includes</h4>
        <ul>
          {lane.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <p className="service-card__cta">
        <Link to={destination}>{lane.cta}</Link>
      </p>
    </article>
  )
}
