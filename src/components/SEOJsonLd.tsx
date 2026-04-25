import { CONTACT_EMAIL, SITE_DOMAIN } from '../data/siteData'

export function SEOJsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Singularity Shift',
    url: SITE_DOMAIN,
    email: CONTACT_EMAIL,
    sameAs: [SITE_DOMAIN],
    description:
      'AI and Web3 systems consultancy focused on AI workflows, wallet infrastructure, and trust-ready software delivery.'
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Singularity Shift',
    url: SITE_DOMAIN,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cheltenham',
      addressRegion: 'GL',
      addressCountry: 'GB'
    },
    areaServed: 'United Kingdom',
    serviceArea: {
      '@type': 'Place',
      name: 'Cheltenham and remote clients'
    },
    priceRange: 'To be scoped',
    description:
      'Practical engineering partner for AI systems, Web3 integrations, and compliance-aware deployment for founder-led teams.'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  )
}
