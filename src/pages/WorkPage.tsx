import { Link } from 'react-router-dom'

import { PROOF_CARDS } from '../data/siteData'
import { ProofCard } from '../components/ProofCard'
import { Section } from '../components/Section'

export function WorkPage() {
  return (
    <Section
      title="Work and lab evidence"
      description="Practical builds, with status labels that protect clarity and avoid over-claiming."
    >
      <div className="card-grid">
        {PROOF_CARDS.map((proof) => (
          <ProofCard key={proof.name} card={proof} />
        ))}
      </div>
      <div className="cta-band cta-band--muted">
        <p>
          Want to test this approach on your stack first? <Link to="/contact">Scope your project in under 15 minutes</Link>.
        </p>
      </div>
    </Section>
  )
}
