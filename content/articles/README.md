# Website and software guides

Markdown in this directory is the source of truth for the static `/articles/` library. The generator discovers all `.md` files except this README. Generated HTML, the guide index and `sitemap.xml` are committed alongside the source because GitHub Pages serves the repository root.

## Authoring

Every guide needs double-quoted front matter: `title`, `description`, `slug`, `audience`, `category`, `topic`, `label`, `service`, `related`, and `order`. The filename must match `slug.md`. The five original guides retain presentation metadata in the generator for compatibility.

- Categories: `design`, `planning`, `improve`, `functionality`, `business-types`, `software`.
- Service: `websites` or `software`; this selects the relevant service link and enquiry panel.
- Related: two or three distinct, existing article slugs separated by commas.
- Optional `concept`: `collection`, `daybreak`, `field-form` or `luma`. Adds a static screenshot and demo link after the opening paragraphs, concept-specific social imagery and a contextual WhatsApp enquiry.
- Order: a numeric value in quotes. Categories have a fixed reading order; this controls guides within them.
- Supported Markdown: paragraphs, H2/H3 headings, flat lists, blockquotes, bold, inline code and links. H1 is supplied by the title. Tables and nested lists are not supported.
- Internal links from an article use `../other-guide/`, `../../services/web-design-cheltenham/` or `../../#contact`. External HTTP(S) links open separately.

## Quality and publishing

Give every guide a distinct client question, concrete decision steps and an example clearly labelled when hypothetical. Keep James's Cheltenham positioning, use real evidence for claims and never invent prices, clients, testimonials or results. Do not create near-duplicate pages for synonyms or neighbourhood names. Platform, search and accessibility claims should link to current primary documentation where relevant. Publication dates are intentionally omitted until an actual publication date is recorded.

Run `npm run build` to regenerate the library and build every page. Run `npm run check:content` to check the source-to-page inventory, metadata, sitemap coverage, internal links, anchors and content structure. Review the rendered guide hub and representative articles at desktop and mobile sizes.

The local content collection does not become live until an authorised push and deployment. Indexing and rankings must be checked separately in Search Console after publication.
