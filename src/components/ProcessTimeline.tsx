type ProcessTimelineProps = {
  steps: string[]
  descriptions?: Record<string, string>
}

export function ProcessTimeline({ steps, descriptions = {} }: ProcessTimelineProps) {
  return (
    <ol className="process">
      {steps.map((step, index) => (
        <li className="process__step glass-card" key={step}>
          <div className="process__index">{index + 1}</div>
          <div>
            <h3>{step}</h3>
            {descriptions[step] ? <p>{descriptions[step]}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
