export const SITE_DOMAIN = 'https://sshift.xyz'

export interface RouteMeta {
  path: string
  title: string
  description: string
  canonical: string
}

export interface ServiceLane {
  slug: string
  title: string
  audience: string
  outcomes: string[]
  includes: string[]
  delivery: string
  cta: string
  proofTags: string[]
}

export interface ProofCard {
  name: string
  status: 'internal' | 'client-work' | 'public'
  proves: string[]
  problem: string
  approach: string
  outcome: string
  next: string
}

export interface LeadFormPayload {
  name: string
  company?: string
  email: string
  projectType: string
  stage: string
  timeline: string
  budgetBand: string
  stack: string
  risk: string
  goal: string
  consent: boolean
}

export interface SiteMetric {
  label: string
  value: string
  caption: string
}

export const CONTACT_EMAIL = 'singularityshiftai@gmail.com'

export const ROUTE_META: RouteMeta[] = [
  {
    path: '/',
    title: 'Singularity Shift | AI & Web3 systems partner in Cheltenham',
    description:
      'Singularity Shift builds working AI systems, wallet and signing infrastructure, and Web3 integrations for teams that need outcomes, not just architecture diagrams.',
    canonical: '/'
  },
  {
    path: '/services',
    title: 'Services | Singularity Shift',
    description:
      'AI systems, Web3 integration, wallet architecture, and AI trust lanes designed to move ideas into production.',
    canonical: '/services'
  },
  {
    path: '/services/ai-systems',
    title: 'AI Systems & Automation | Singularity Shift',
    description:
      'Build practical AI assistants, workflows, and dashboards with measurable outputs and clear governance.',
    canonical: '/services/ai-systems'
  },
  {
    path: '/services/web3-wallet',
    title: 'Web3 & Wallet Integration | Singularity Shift',
    description:
      'Smart contracts, on-chain access controls, wallet adapters, and secure signing flows that work in production.',
    canonical: '/services/web3-wallet'
  },
  {
    path: '/services/ai-governance',
    title: 'AI Trust & Prompt Governance | Singularity Shift',
    description:
      'Monitoring, logging, audit trails, and governance-ready evidence layers for AI-powered products.',
    canonical: '/services/ai-governance'
  },
  {
    path: '/work',
    title: 'Work & Lab | Singularity Shift',
    description:
      'Selected engineering examples with practical context and conservative, verified framing for AI, Web3, and product architecture.',
    canonical: '/work'
  },
  {
    path: '/about',
    title: 'About Singularity Shift | Builder-first AI & Web3 Engineering',
    description:
      'A founder-led systems engineering partner for AI and Web3 builds where architecture, implementation, and launch readiness must align.',
    canonical: '/about'
  },
  {
    path: '/contact',
    title: 'Contact Singularity Shift',
    description: 'Start a discovery call and turn your complex AI or Web3 idea into a buildable roadmap.',
    canonical: '/contact'
  },
  {
    path: '/services/:slug',
    title: 'Services | Singularity Shift',
    description: 'AI systems, Web3 integration, wallet architecture, and AI trust work built for founder teams in Cheltenham and remote.',
    canonical: '/services'
  },
  {
    path: '*',
    title: 'Singularity Shift | AI and Web3 systems consultant',
    description:
      'Practical engineering for teams that need working AI systems, wallet infrastructure, and production-ready deployment.',
    canonical: '/'
  }
]

export const ROUTE_META_BY_PATH = ROUTE_META.reduce<Record<string, RouteMeta>>((acc, route) => {
  acc[route.path] = route
  return acc
}, {})

export const getRouteMeta = (path: string): RouteMeta => {
  const normalizedPath = path === '' ? '/' : path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path
  if (ROUTE_META_BY_PATH[normalizedPath]) {
    return ROUTE_META_BY_PATH[normalizedPath]
  }

  if (normalizedPath.startsWith('/services/')) {
    return ROUTE_META_BY_PATH['/services/:slug'] ?? ROUTE_META_BY_PATH['*']
  }

  return ROUTE_META_BY_PATH['*']
}

export const SERVICE_LANES: ServiceLane[] = [
  {
    slug: 'ai-systems',
    title: 'AI Systems & Automation',
    audience: 'Founders and teams shipping AI tools, support engines, and internal copilots.',
    outcomes: [
      'Faster execution through AI-assisted workflows',
      'Reduction in manual processes with measurable handoffs',
      'Production-ready integrations instead of demo-only models',
      'Safer governance defaults for prompts and interactions'
    ],
    includes: [
      'Custom AI assistants and integrations',
      'OpenAI/API tooling and prompt infrastructure',
      'Decision dashboards with logs and action paths',
      'API orchestration and observability'
    ],
    delivery: 'Scope -> prototype sprint -> production handover',
    cta: 'Scope an AI System',
    proofTags: ['SShift GPT', 'internal R&D', 'AI governance']
  },
  {
    slug: 'web3-wallet',
    title: 'Web3 Product & Integration',
    audience: 'Founders and ecosystems translating blockchain ideas into usable products.',
    outcomes: [
      'Wallet-aware user journeys',
      'Secure signing and verification flows',
      'Clear on-chain access and subscription architecture',
      'Reduced “it works in demo” failure risk'
    ],
    includes: [
      'Move smart contract integrations',
      'Aptos/Cedra ecosystem connectivity',
      'Wallet adapters, transaction history, and onboarding flows',
      'API bridges and cross-device signing plans'
    ],
    delivery: 'Strategy -> integration sprint -> testable release',
    cta: 'Discuss a Web3 Integration',
    proofTags: ['Nova Wallet', 'Nova Protocol', 'on-chain subscriptions']
  },
  {
    slug: 'ai-governance',
    title: 'AI Trust, Prompt Governance & Compliance',
    audience: 'Teams needing control, auditability, and evidence around AI usage.',
    outcomes: [
      'Visible AI interaction logs and prompt evolution',
      'Governance-ready evidence structure',
      'Risk maps for rollout and team process control',
      'Safer commercial deployment for internal and client-facing systems'
    ],
    includes: [
      'Prompt monitoring and governance controls',
      'Model interaction and risk logging',
      'DSAR/GDPR-aware handling patterns',
      'Evidence-ready workflow maps'
    ],
    delivery: 'Control map -> monitoring MVP -> compliance-ready baseline',
    cta: 'Build the Trust Layer',
    proofTags: ['Prompt Sentinel', 'audit ready workflows']
  },
  {
    slug: 'platform',
    title: 'Product Build Partnerships',
    audience: 'Teams needing architecture-to-deployment execution and long-term engineering continuity.',
    outcomes: [
      'Reliable MVP-to-prod delivery',
      'Clear technical ownership with operational handover',
      'Less rework through documented architecture',
      'Predictable rollout across AI, Web3, and backend layers'
    ],
    includes: [
      'Frontend and backend architecture',
      'Deployment, SSL/domain routing, and monitoring',
      'Monorepo and team handoff planning',
      'Iterative roadmap and support cadence'
    ],
    delivery: 'Discovery -> architecture -> build -> hardening -> deploy',
    cta: 'Start a Product Build Partnership',
    proofTags: ['full-stack delivery', 'production systems']
  }
]

export const SERVICE_LANES_BY_SLUG = SERVICE_LANES.reduce<Record<string, ServiceLane>>((acc, lane) => {
  acc[lane.slug] = lane
  return acc
}, {})

export const PROOF_CARDS: ProofCard[] = [
  {
    name: 'SShift GPT',
    status: 'internal',
    proves: ['AI subscriptions', 'on-chain ownership verification', 'scalable usage patterns'],
    problem: 'AI product models existed but lacked a practical productized workflow for ownership and delivery controls.',
    approach: 'Built a system map around AI access, usage governance, and delivery paths in a production-minded structure.',
    outcome: 'Created a cleaner commercial model for AI delivery while separating product, compliance, and delivery concerns.',
    next: 'Used this foundation for subsequent AI workflow builds and trust-oriented pilots.'
  },
  {
    name: 'Nova Wallet',
    status: 'internal',
    proves: ['non-custodial wallet UX', 'mobile flow design', 'dApp constraints'],
    problem: 'No dedicated mobile wallet flow existed for the Cedra ecosystem context.',
    approach: 'Developed a concept-first product system with secure key and signing patterns and onboarding logic.',
    outcome: 'Defined a practical pattern for wallet UX that is now reusable across ecosystem-level integrations.',
    next: 'Expanded into cross-device signing architecture for broader protocol workflows.'
  },
  {
    name: 'Nova Desk / Nova Protocol',
    status: 'internal',
    proves: ['cross-device signing', 'adapter/plugin architecture', 'security-aware UX'],
    problem: 'Complex signing and approval pathways made wallet integrations feel fragile at product scale.',
    approach: 'Structured a modular architecture with adapter boundaries and transaction verification surfaces.',
    outcome: 'Created a reusable signing model that supports safer signing experiences and cleaner onboarding.',
    next: 'Documented architecture blocks now anchor new ecosystem integrations.'
  },
  {
    name: 'Prompt Sentinel',
    status: 'internal',
    proves: ['monitoring', 'audit trails', 'AI governance controls'],
    problem: 'AI usage in product flows lacked clear inspection, improvement, and accountability paths.',
    approach: 'Designed prompt governance and model-interaction control layers with reporting and traceability surfaces.',
    outcome: 'A stronger trust model for teams adding AI assistants into customer or internal workflows.',
    next: 'Ready to convert into a dedicated commercial trust product depending on status confirmation.'
  },
  {
    name: 'Crypto forecasting / AI pipeline',
    status: 'internal',
    proves: ['data ingestion', 'prediction workflows', 'decision support'],
    problem: 'Data streams and market signals existed but needed coherent interpretation tools.',
    approach: 'Implemented ingestion and dashboard logic using technical indicators and sentiment-informed signals.',
    outcome: 'Built usable decision support rather than raw data output.',
    next: 'Framework now informs later productized AI/analytics prototypes.'
  }
]

export const SITE_METRICS: SiteMetric[] = [
  { label: 'Delivery focus', value: 'Idea -> Prototype', caption: 'Built to reduce concept drift and speed clarity.' },
  { label: 'Delivery lanes', value: 'AI + Web3 + Trust', caption: 'One stack for one outcome: production-ready systems.' },
  { label: 'Geography', value: 'Cheltenham', caption: 'Local presence with global delivery.' }
]

export const PROCESS_STEPS = ['Discover', 'Architect', 'Prototype', 'Harden', 'Deploy']

export const PROCESS_DETAILS: Record<string, string> = {
  Discover: 'We map the business goal, constraints, existing stack, and risks before writing code.',
  Architect: 'We define flows, data boundaries, and deployment assumptions to make build effort predictable.',
  Prototype: 'We deliver the smallest useful version that proves the core workflow under real conditions.',
  Harden: 'We improve reliability, monitoring, security posture, and documentation so it survives handover.',
  Deploy: 'We launch, validate in production-like conditions, and define the next measurable milestone.'
}

export const HOME_PROBLEM_STATEMENTS = [
  'Good ideas stall when AI and Web3 architecture are planned separately from delivery.',
  'Teams lose momentum when prototypes are not connected to production-safe infrastructure.',
  'Legacy codebases and unclear ownership models quietly double delivery risk.',
  'Compliance and auditability are often added too late to be cheap or effective.'
]

export const LOCAL_TRUST_LINES = [
  'Built in Cheltenham for teams who value practical progress over deck cycles.',
  'Serving founder teams in Cheltenham and remote-first builders elsewhere.',
  'Practical process over hype: evidence-first development, clearer handover, lower rework.'
]

export const FAQS = [
  {
    question: 'What if we have a limited budget but need serious progress?',
    answer:
      'Start with a scoped clarity sprint. We identify the highest-value workflow, ship a measurable first milestone, and expand only after proof is clear.'
  },
  {
    question: 'I need compliance, but cannot delay launch.',
    answer:
      'We start with practical evidence surfaces: logging, audit checkpoints, and clear controls. This lets teams ship while building governance depth from day one.'
  },
  {
    question: 'My team already has legacy code. Can you work with it?',
    answer:
      'Yes. We map the current architecture, identify the highest-impact seams, and integrate incrementally rather than rewiring everything.'
  },
  {
    question: 'Can I move quickly without building more technical debt?',
    answer:
      'Prototypes are useful only when they are constrained, documented, and production-ready by default.'
  }
]
