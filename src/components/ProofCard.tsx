import type { ProofCard as ProofType } from '../data/siteData'

type ProofCardProps = {
  card: ProofType
}

function statusLabel(status: ProofType['status']) {
  if (status === 'client-work') {
    return 'Client-context proof'
  }
  if (status === 'public') {
    return 'Public project'
  }
  return 'Internal R&D'
}

export function ProofCard({ card }: ProofCardProps) {
  return (
    <article className="proof-card glass-card">
      <header className="proof-card__header">
        <h3>{card.name}</h3>
        <span className="proof-card__status">{statusLabel(card.status)}</span>
      </header>
      <p>
        <strong>Problem:</strong> {card.problem}
      </p>
      <p>
        <strong>Approach:</strong> {card.approach}
      </p>
      <p>
        <strong>Outcome:</strong> {card.outcome}
      </p>
      <p>
        <strong>Next:</strong> {card.next}
      </p>
      <div className="proof-card__tags" aria-label="Proof evidence tags">
        {card.proves.map((proof) => (
          <span key={proof}>{proof}</span>
        ))}
      </div>
    </article>
  )
}
