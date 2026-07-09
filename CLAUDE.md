# CLAUDE.md

## Project overview

Static marketing site for Singularity Shift Ltd (`sshift.xyz`), a Cheltenham-based software engineering consultancy. The site uses semantic HTML, standalone CSS and a small progressive-enhancement script, with Vite for local development and build validation.

## Commands

- `npm install` — install development dependencies
- `npm run dev` — run the local Vite server
- `npm run build` — create and validate the production bundle

## Architecture

- `index.html` — SEO metadata, JSON-LD, content and semantic layout
- `styles.css` — design tokens, desktop/tablet/mobile layouts and reduced-motion handling
- `script.js` — current-year text, scrolled header state and intersection-based reveals
- `assets/` — logos, founder portrait and favicon

## Deployment

GitHub Pages publishes from `main`. Preserve the root `CNAME` file and ensure all production asset paths remain relative.

## Content rules

- Keep the positioning founder-led and Cheltenham-specific.
- Do not invent testimonials, client logos, awards or performance metrics.
- Keep the Inferenco partnership visible and link it to `https://inferenco.com`.
- Core services are full-stack development, Move development, mobile apps, desktop apps and custom software.
- Maintain accessible contrast, semantic landmarks, keyboard focus states and reduced-motion support.
