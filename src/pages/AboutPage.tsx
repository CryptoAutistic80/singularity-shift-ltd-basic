import { Section } from '../components/Section'

export function AboutPage() {
  return (
    <Section
      title="Built by a founder who ships, not just advises"
      description="The position: connect architecture, full-stack execution, and governance-aware outcomes for teams that cannot afford drift."
    >
      <div className="founder-grid">
        <article className="glass-card">
          <h3>What I build</h3>
          <p>
            AI systems, Web3 integrations, wallet and signing architectures, prompt governance, and production-facing
            software flows.
          </p>
          <p>
            The value proposition is simple: avoid disconnected pilots and deliver systems that can be deployed, observed,
            and improved.
          </p>
        </article>

        <article className="glass-card">
          <h3>Who this is for</h3>
          <ul>
            <li>Founders with an AI or Web3 concept ready for execution.</li>
            <li>Product teams stuck between prototype success and production constraints.</li>
            <li>Businesses needing trust and evidence layers before scaling AI usage.</li>
            <li>Ecosystems requiring safe wallet, signing, and integration decisions.</li>
          </ul>
        </article>

        <article className="glass-card">
          <h3>Why this works in Cheltenham-first mode</h3>
          <p>
            Direct local availability with global delivery means practical review cycles, easier communication, and easier
            escalation when integration or deployment issues appear.
          </p>
        </article>
      </div>
    </Section>
  )
}
