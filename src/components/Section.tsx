import type { ReactNode } from 'react'

type SectionProps = {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
  className?: string
  align?: 'left' | 'center'
}

export function Section({ id, eyebrow, title, description, children, className = '', align = 'left' }: SectionProps) {
  return (
    <section id={id} className={`section ${className} section--${align}`}>
      <div className="section__container">
        {eyebrow ? <p className="section__eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p className="section__intro">{description}</p> : null}
        <div className="section__body">{children}</div>
      </div>
    </section>
  )
}
