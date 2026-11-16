# Singularity Shift Ltd website

The marketing website for [Singularity Shift Ltd](https://sshift.xyz), a founder-led software engineering studio based in Cheltenham, UK.

## Local development

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
```

The site is a static Vite project and deploys through GitHub Pages from the `main` branch.

## Structure

- `index.html` — page content, metadata and structured data
- `styles.css` — visual system and responsive layouts
- `script.js` — progressive header and reveal behaviour
- `assets/` — production image and brand assets

## App policies

To add an app, create `content/apps/<slug>/` with a permanent lowercase slug
using hyphens, for example `pdf-easy-sign-pro`. Add an `app.json` containing
`name`, `description`, `supportEmail` and `updated` (a YYYY-MM-DD date, or
`null` for drafts). Add `privacy.md` and `terms.md`, each with at least one
`##` section. The page template supplies the document title and draft notice
or last-updated date.

`npm run build` generates the app directory at `/apps/` and the policies at
`/apps/<slug>/privacy/` and `/apps/<slug>/terms/`. Run `npm run check:content`
after building. Include the generated HTML under `apps/` and the sitemaps in
the change because GitHub Pages serves those files from the repository root.
Draft policies display a review notice and stay out of the sitemap. Use the
public URLs in the app or store listing once the policy content is approved
and the pages are deployed.
