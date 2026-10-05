# Cheltenham guide expansion

Prepared on `feat/site-improvements-october` and approved for release on 5 October 2026.

## Scope

24 new articles (20,414 Markdown body words), alongside the five existing guides. The generated guide library has 29 articles grouped by planning, improving a site, functionality, business type and software.

## Search intent and enquiry routes

The web design service page remains the main commercial destination for website design, website builder and web developer enquiries in Cheltenham. The software service page handles custom software and application work. The guides answer more specific buying and operational questions, then link to those service pages and the contact section.

The topics below are editorial search-intent targets, not measured keyword volumes or a forecast of rankings. Each article has a different decision to support, a practical checklist or worked example, and a clearly labelled hypothetical scenario where useful. Sector articles describe different customer journeys; they do not claim sector clients or offices that have not been evidenced.

| New guide | Topic / customer question | Category |
| --- | --- | --- |
| [How to Choose a Web Developer in Cheltenham](../content/articles/choosing-web-developer-cheltenham.md) | Choosing a developer | planning |
| [What Affects the Cost of a Website in Cheltenham?](../content/articles/website-cost-cheltenham.md) | Website costs | planning |
| [Website Builder or Web Developer: Which Suits Your Business?](../content/articles/website-builder-vs-web-developer.md) | DIY or professional build | planning |
| [A Website Brief Checklist for Cheltenham Small Businesses](../content/articles/website-brief-checklist.md) | Writing a website brief | planning |
| [Planning a Website Project Timeline: What Needs to Happen Before Launch](../content/articles/website-project-timeline.md) | Website project timing | planning |
| [Website Redesign in Cheltenham: What to Keep, Fix or Rebuild](../content/articles/website-redesign-cheltenham.md) | Website redesign | planning |
| [Moving Your Website to a New Developer: A Practical Checklist](../content/articles/moving-website-new-developer.md) | Changing website supplier | planning |
| [Website Ownership and Handover: What Your Business Should Receive](../content/articles/website-ownership-handover.md) | Ownership and handover | planning |
| [Website Maintenance in Cheltenham: What Should Be Looked After?](../content/articles/website-maintenance-cheltenham.md) | Website maintenance | improve |
| [Slow Website? A Practical Troubleshooting Guide for Cheltenham Businesses](../content/articles/slow-website-fixes.md) | Website speed | improve |
| [Why Is Your Website Not Getting Enquiries? A Cheltenham Business Checklist](../content/articles/website-not-getting-enquiries.md) | Website enquiries | improve |
| [Is Your Website Easy to Use on a Phone? A Cheltenham Business Guide](../content/articles/mobile-friendly-website.md) | Mobile usability | improve |
| [A Local Search Website Checklist for Cheltenham Businesses](../content/articles/local-search-website-checklist.md) | Local search | improve |
| [Adding Online Booking to a Cheltenham Business Website](../content/articles/website-booking-system.md) | Online booking | functionality |
| [Planning an Ecommerce Website for a Cheltenham Business](../content/articles/ecommerce-website-planning.md) | Online shops | functionality |
| [Hiring a Web App Developer in Cheltenham: Scope the First Useful Version](../content/articles/web-app-developer-cheltenham.md) | Web applications | functionality |
| [Websites for Trades in Cheltenham: Turn Enquiries into Useful Quote Requests](../content/articles/websites-for-trades-cheltenham.md) | Trades websites | business-types |
| [Restaurant and Cafe Websites in Cheltenham: Help Guests Plan a Visit](../content/articles/restaurant-cafe-websites-cheltenham.md) | Restaurant and cafe websites | business-types |
| [Independent Shop Websites in Cheltenham: Browse, Check Stock or Buy Online?](../content/articles/independent-shop-websites-cheltenham.md) | Independent shop websites | business-types |
| [Consultant Websites in Cheltenham: Explain Your Work and Attract Better Enquiries](../content/articles/consultant-websites-cheltenham.md) | Consultant websites | business-types |
| [Salon Websites in Cheltenham: Make Choosing and Booking an Appointment Easier](../content/articles/salon-websites-cheltenham.md) | Salon websites | business-types |
| [Holiday Accommodation Websites in Cheltenham: Answer Questions Before Guests Book](../content/articles/holiday-accommodation-websites-cheltenham.md) | Accommodation websites | business-types |
| [Charity Websites in Cheltenham: Clear Routes for Supporters, Volunteers and People Seeking Help](../content/articles/charity-websites-cheltenham.md) | Charity and community websites | business-types |
| [Creative Portfolio Websites in Cheltenham: Show Your Role and Win the Right Enquiries](../content/articles/creative-portfolio-websites-cheltenham.md) | Creative portfolio websites | business-types |

## Site integration

- Crawlable categorized hub, article contents links, related guides and service-specific enquiry calls to action.
- Homepage and both service pages link into the expanded library.
- Unique titles, descriptions, canonical URLs, Article and breadcrumb structured data for each guide.
- The sitemap now describes 33 pages: homepage, guide hub, two services and 29 articles.
- Markdown is authoritative; `npm run build` regenerates root HTML and creates the production build. GitHub Pages publishes the checked-in root output.
- `npm run check:content` checks metadata, generated inventory, schemas, internal links, anchors, sitemap coverage and production-build inclusion.

## Editorial and publication notes

Technical claims link to relevant primary sources. Pricing examples are explicitly hypothetical planning arithmetic, not Singularity Shift quotes or market-price claims. No testimonials, case-study results, credentials or publication dates have been invented.

Keep the Markdown and generated root HTML together in version control. The root `.nojekyll` marker keeps GitHub Pages serving the static output without converting the source Markdown into additional HTML pages. Check the deployed sitemap and a sample of live article URLs, then use Search Console to follow discovery, indexing, relevant queries and enquiries. Do not infer indexing or ranking from a successful local build.

Further content should follow real client questions and Search Console evidence. Improve weak or overlapping guides before expanding merely to increase the page count.

## Validation completed

- Production build passed: all 29 guide pages included.
- Content checks passed: 33 HTML pages, 33 sitemap URLs and 1,122 internal links/anchors.
- Editorial cross-review found no blocking issues; source-link and migration-guidance improvements applied.
- Browser checks covered the desktop hub, guide reading layout, category and contents anchors, service-page guide cards, plus 390 by 844 mobile hub/article layouts and the mobile menu. No horizontal overflow in checked views.
- Local Vite reported a development WebSocket connection warning; pages loaded through HTTP and final rendered pages were checked after navigation. Production build validation does not rely on that development connection.
- Git whitespace checks passed. These checks cover local output; deployment, indexing and traffic outcomes are separate release checks.
