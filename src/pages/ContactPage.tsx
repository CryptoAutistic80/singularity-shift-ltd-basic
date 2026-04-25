import { type FormEvent, useMemo, useState } from 'react'

import { CONTACT_EMAIL, type LeadFormPayload } from '../data/siteData'
import { Section } from '../components/Section'

const INITIAL_FORM: LeadFormPayload = {
  name: '',
  company: '',
  email: '',
  projectType: '',
  stage: '',
  timeline: '',
  budgetBand: '',
  stack: '',
  risk: '',
  goal: '',
  consent: false
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

function buildMailto(payload: LeadFormPayload) {
  const subject = `Lead capture: ${payload.projectType || 'General enquiry'}`
  const lines = [
    `Name: ${payload.name}`,
    `Company: ${payload.company}`,
    `Email: ${payload.email}`,
    `Project type: ${payload.projectType}`,
    `Current stage: ${payload.stage}`,
    `Timeline: ${payload.timeline}`,
    `Budget band: ${payload.budgetBand}`,
    `Technical context: ${payload.stack}`,
    `Main risk: ${payload.risk}`,
    `Goal: ${payload.goal}`,
    `Consent: ${payload.consent ? 'Yes' : 'No'}`
  ]

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
}

export function ContactPage() {
  const [payload, setPayload] = useState<LeadFormPayload>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormPayload, string>>>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const mailtoHref = useMemo(() => buildMailto(payload), [payload])

  const endpoint = import.meta.env.VITE_LEAD_ENDPOINT

  const projectTypes = ['AI Systems', 'Web3 Wallet', 'AI Governance', 'Full-stack Build', 'Unsure']
  const stages = ['Idea', 'Prototype', 'MVP', 'Live product', 'Rescue project']
  const timelines = ['2 weeks', '1 month', '2-3 months', '3+ months', 'Not sure yet']
  const budgetBands = ['£0-5k', '£5k-15k', '£15k-40k', '£40k+', 'Not sure']

  function update<K extends keyof LeadFormPayload>(key: K, value: LeadFormPayload[K]) {
    setPayload((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      if (typeof value === 'boolean') {
        if (value) {
          delete next[key]
        } else {
          next[key] = 'You must confirm consent to continue.'
        }
        return next
      }

      if (String(value).trim().length > 0) {
        delete next[key]
      } else {
        next[key] = next[key] || 'This field is required.'
      }
      return next
    })
  }

  function validate() {
    const nextErrors: Partial<Record<keyof LeadFormPayload, string>> = {}
    const required: Array<keyof LeadFormPayload> = [
      'name',
      'email',
      'projectType',
      'stage',
      'timeline',
      'budgetBand',
      'stack',
      'risk',
      'goal',
      'consent'
    ]

    required.forEach((key) => {
      const value = payload[key]
      if (typeof value === 'string') {
        if (!value.trim()) {
          nextErrors[key] = 'This field is required.'
        }
      } else if (value === false) {
        nextErrors[key] = 'You must confirm consent to continue.'
      }
    })

    if (payload.email && !/\S+@\S+\.\S+/.test(payload.email)) {
      nextErrors.email = 'Enter a valid email.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) {
      return
    }

    setStatus('submitting')

    if (!endpoint) {
      setStatus('success')
      setPayload(INITIAL_FORM)
      return
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setStatus('success')
      setPayload(INITIAL_FORM)
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section
      title="Start a project in one pass"
      description="Share your context and constraints. We reply with a practical scoping direction, not a generic deck."
    >
      <form className="lead-form glass-card" onSubmit={onSubmit} noValidate>
        <label htmlFor="name">
          Full name
          <input
            id="name"
            required
            value={payload.name}
            onChange={(event) => update('name', event.currentTarget.value)}
          />
        </label>
        {errors.name ? <p className="field-error">{errors.name}</p> : null}

        <label htmlFor="company">
          Company (optional)
          <input id="company" value={payload.company} onChange={(event) => update('company', event.currentTarget.value)} />
        </label>

        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            required
            value={payload.email}
            onChange={(event) => update('email', event.currentTarget.value)}
          />
        </label>
        {errors.email ? <p className="field-error">{errors.email}</p> : null}

        <label htmlFor="projectType">
          Project type
          <select
            id="projectType"
            required
            value={payload.projectType}
            onChange={(event) => update('projectType', event.currentTarget.value)}
          >
            <option value="">Choose one</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        {errors.projectType ? <p className="field-error">{errors.projectType}</p> : null}

        <label htmlFor="stage">
          Current stage
          <select
            id="stage"
            required
            value={payload.stage}
            onChange={(event) => update('stage', event.currentTarget.value)}
          >
            <option value="">Choose one</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </label>
        {errors.stage ? <p className="field-error">{errors.stage}</p> : null}

        <label htmlFor="timeline">
          Timeline
          <select
            id="timeline"
            required
            value={payload.timeline}
            onChange={(event) => update('timeline', event.currentTarget.value)}
          >
            <option value="">Choose one</option>
            {timelines.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        {errors.timeline ? <p className="field-error">{errors.timeline}</p> : null}

        <label htmlFor="budgetBand">
          Budget band
          <select
            id="budgetBand"
            required
            value={payload.budgetBand}
            onChange={(event) => update('budgetBand', event.currentTarget.value)}
          >
            <option value="">Choose one</option>
            {budgetBands.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </label>
        {errors.budgetBand ? <p className="field-error">{errors.budgetBand}</p> : null}

        <label htmlFor="stack">
          Technical context
          <textarea
            id="stack"
            required
            value={payload.stack}
            onChange={(event) => update('stack', event.currentTarget.value)}
          />
        </label>
        {errors.stack ? <p className="field-error">{errors.stack}</p> : null}

        <label htmlFor="risk">
          Main risk
          <input
            id="risk"
            required
            value={payload.risk}
            onChange={(event) => update('risk', event.currentTarget.value)}
          />
        </label>
        {errors.risk ? <p className="field-error">{errors.risk}</p> : null}

        <label htmlFor="goal">
          What are you trying to build or fix?
          <textarea
            id="goal"
            required
            value={payload.goal}
            onChange={(event) => update('goal', event.currentTarget.value)}
          />
        </label>
        {errors.goal ? <p className="field-error">{errors.goal}</p> : null}

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={payload.consent}
            onChange={(event) => update('consent', event.currentTarget.checked)}
          />
          I confirm the information is accurate and agree to be contacted for technical clarification.
        </label>
        {errors.consent ? <p className="field-error">{errors.consent}</p> : null}

        <div className="lead-form__actions">
          <button className="btn btn--primary" disabled={status === 'submitting'} type="submit">
            {status === 'submitting' ? 'Submitting...' : 'Submit project brief'}
          </button>
          <a className="btn btn--ghost" href={mailtoHref}>
            Email this in one click
          </a>
        </div>
      </form>

      {status === 'success' && (
        <p className="form-feedback form-feedback--success" role="status">
          Thanks — we got your brief. We review inbound leads manually and typically reply with the next best starting step.
          If you want immediate routing, use the email link above.
        </p>
      )}
      {status === 'error' && (
        <p className="form-feedback form-feedback--error" role="alert">
          Submission endpoint is unavailable right now. Use the email fallback link to send your details directly.
        </p>
      )}
    </Section>
  )
}
