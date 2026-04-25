import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { SERVICE_LANES_BY_SLUG } from '../data/siteData'
import { Section } from '../components/Section'
import { LeadCard } from '../components/LeadCard'

export function ServicePage() {
  const { slug } = useParams<{ slug: string }>()
  const lane = useMemo(() => (slug ? SERVICE_LANES_BY_SLUG[slug] : undefined), [slug])

  if (!lane) {
    return (
      <Section title="Service not found" description="That lane is not published yet. Pick the best match from the service index.">
        <div className="cta-band">
          <Link className="btn btn--primary" to="/services">
            Return to services
          </Link>
        </div>
      </Section>
    )
  }

  return (
    <>
      <Section
        title={lane.title}
        description={`Built for: ${lane.audience}`}
      >
        <div className="service-detail">
          <article className="glass-card">
            <h3>Outcomes</h3>
            <ul>
              {lane.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </article>
          <article className="glass-card">
            <h3>Includes</h3>
            <ul>
              {lane.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="glass-card">
            <h3>Delivery flow</h3>
            <p>{lane.delivery}</p>
          </article>
          <article className="glass-card">
            <h3>Next step</h3>
            <ul className="inline-tags">
              {lane.proofTags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <p>
              We recommend a 60- to 90-minute scoping call, then a 1- to 3-week build sprint based on selected outcomes.
            </p>
          </article>
        </div>
      </Section>

      <Section>
        <LeadCard
          title={`Scope ${lane.title} now`}
          body="Tell us your technical context and constraints, then get a practical route to production."
          ctaText="Book a Technical Clarity Call"
          ctaTo="/contact"
          ctaSecondary="mailto:singularityshiftai@gmail.com"
        />
      </Section>
    </>
  )
}
