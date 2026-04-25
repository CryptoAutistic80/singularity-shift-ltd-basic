import { Link } from 'react-router-dom'

import { FAQS, HOME_PROBLEM_STATEMENTS, LOCAL_TRUST_LINES, PROCESS_DETAILS, PROCESS_STEPS, PROOF_CARDS, SERVICE_LANES, SITE_METRICS } from '../data/siteData'
import { Hero } from '../components/Hero'
import { LeadCard } from '../components/LeadCard'
import { ProcessTimeline } from '../components/ProcessTimeline'
import { ProofCard } from '../components/ProofCard'
import { Section } from '../components/Section'
import { ServiceLaneCard } from '../components/ServiceLaneCard'

export function HomePage() {
  return (
    <>
      <Hero
        ctaPrimaryHref="/contact"
        ctaSecondaryHref="/services"
        ctaPrimaryText="Book a Technical Clarity Call"
        ctaSecondaryText="View services"
        title="The best AI/Web3 systems partner in Cheltenham for teams that need outcomes, not architecture theater."
        subtitle="Singularity Shift builds the systems layer behind practical AI and blockchain products: AI workflows, wallet integrations, prompt governance, and production-facing delivery."
        trustLines={['Designed for founder teams', 'Built in Cheltenham + remote delivery', 'Production-first defaults']}
      />

      <Section
        eyebrow="Where projects usually stall"
        title="Most AI/Web3 projects stall in handoff moments, not execution."
        description="If your project is moving slowly, it is usually not because the idea is weak. It is because architecture, build, and governance drift apart."
      >
        <div className="card-grid">
          {HOME_PROBLEM_STATEMENTS.map((item) => (
            <article key={item} className="problem-card glass-card">
              {item}
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="services"
        eyebrow="Outcomes-led lanes"
        title="Four service lanes built for revenue-bearing results"
        description="Each lane is scoped so that teams know exactly what is coming, why it matters, and what success looks like."
      >
        <div className="card-grid card-grid--4">
          {SERVICE_LANES.map((lane) => (
            <ServiceLaneCard key={lane.slug} lane={lane} linkTo={`/services/${lane.slug}`} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Proof framework"
        title="Proof you can trust before commitment"
        description="Status-conscious, honest framing: internal R&D and production-oriented work only, with clear next steps."
      >
        <div className="card-grid">
          {PROOF_CARDS.slice(0, 3).map((card) => (
            <ProofCard key={card.name} card={card} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="The process"
        title="Discover → Architect → Prototype → Harden → Deploy"
        description="A predictable funnel from problem to shippable output."
      >
        <ProcessTimeline steps={PROCESS_STEPS} descriptions={PROCESS_DETAILS} />
      </Section>

      <Section
        eyebrow="Founder + trust"
        title="A builder who can connect frontend, backend, protocol, and launch reality"
        description="The company sits at the intersection of AI systems, wallet architecture, and production software delivery."
      >
        <div className="founder-grid">
          <article className="glass-card">
            <h3>Founder trust signal</h3>
            <ul>
              <li>Hands-on systems builder across AI, Web3, and full-stack execution.</li>
              <li>Architecture decisions aimed at usable shipping, not theoretical beauty.</li>
              <li>Conservative claim language with explicit verification notes where needed.</li>
            </ul>
            <p className="tiny-link">
              <Link to="/about">Read the full founder build profile</Link>
            </p>
          </article>
          <article className="glass-card">
            <h3>Why Cheltenham + remote</h3>
            <ul>
              {LOCAL_TRUST_LINES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="metrics">
              {SITE_METRICS.map((metric) => (
                <p key={metric.label}>
                  <strong>{metric.label}</strong>
                  <span>{metric.value}</span>
                  <em>{metric.caption}</em>
                </p>
              ))}
            </div>
          </article>
        </div>
      </Section>

      <Section
        eyebrow="Objection handling"
        title="Clear answers before risk escalates"
        description="If one of these is blocking you, we handle it in the first week."
      >
        <div className="faq-list">
          {FAQS.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <section className="section section--center">
        <div className="section__container">
          <LeadCard
            ctaText="Start with a Technical Clarity Call"
            ctaTo="/contact"
            ctaSecondary="mailto:singularityshiftai@gmail.com"
            title="Your next step can be one short decision."
            body="If your project is stuck in architecture loops or prototype debt, let us move you to measurable execution."
          />
        </div>
      </section>
    </>
  )
}
