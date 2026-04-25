import { Link } from 'react-router-dom'

type HeroProps = {
  title: string
  subtitle: string
  ctaPrimaryHref: string
  ctaSecondaryHref: string
  ctaPrimaryText: string
  ctaSecondaryText: string
  trustLines: string[]
}

export function Hero({
  title,
  subtitle,
  ctaPrimaryHref,
  ctaSecondaryHref,
  ctaPrimaryText,
  ctaSecondaryText,
  trustLines
}: HeroProps) {
  return (
    <section className="hero section">
      <div className="section__container hero__inner">
        <p className="hero__eyebrow">AI + Web3 systems partner · Cheltenham</p>
        <h1>{title}</h1>
        <p className="hero__subtitle">{subtitle}</p>
        <div className="hero__actions">
          <Link className="btn btn--primary" to={ctaPrimaryHref}>
            {ctaPrimaryText}
          </Link>
          <Link className="btn btn--secondary" to={ctaSecondaryHref}>
            {ctaSecondaryText}
          </Link>
        </div>
        <ul className="hero__trust">
          {trustLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
