import { Link } from 'react-router-dom'

type LeadCardProps = {
  title: string
  body: string
  ctaText: string
  ctaTo: string
  ctaSecondary?: string
}

export function LeadCard({ title, body, ctaText, ctaTo, ctaSecondary }: LeadCardProps) {
  return (
    <article className="lead-card glass-card">
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="hero__actions">
        <Link className="btn btn--primary" to={ctaTo}>
          {ctaText}
        </Link>
        {ctaSecondary ? <a className="btn btn--ghost" href={ctaSecondary}>Discuss constraints first</a> : null}
      </div>
    </article>
  )
}
