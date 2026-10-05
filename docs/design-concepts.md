# Working design concept collection

Local experiment on `feat/interactive-playground`. Not published.

- `/concepts/`: indexable collection page, with original concept work clearly distinguished from client commissions.
- `/concepts/daybreak/`: fictional independent coffee site, layered parallax, a photographic scroll story, flavour discovery and a tasting list.
- `/concepts/field-form/`: fictional architecture portfolio, a scroll-driven photographic aperture, stacking image studies, project stories and a colour/monochrome reveal.
- `/concepts/luma/`: fictional lighting brand, a scroll-driven exploded product story and a WebGL configurator.

The three fictional businesses are `noindex,follow` and omitted from the sitemap; the collection is included. All demo enquiry routes return to Singularity Shift. Preference and product controls operate locally without payments, orders or external messages.

Each concept owns its HTML, CSS, JS and image assets. The main site links through the homepage navigation and a separate concept collection section. The actual work portfolio remains distinct.

Three.js is pinned in package.json and vendored under `assets/vendor/` because production GitHub Pages serves the repository root. Run `npm run vendor:three` after changing the pinned version. The 3D library loads only on the LUMA demo.

Run `npm run build` then `npm run check:content`. Inspect desktop/mobile navigation and each concept's controls in a browser before publishing. Gallery preview images are captures of the actual rendered concepts, not commissioned-client claims.

## Motion direction

The gallery uses a pointer-responsive preview deck and scroll parallax. Each concept has its own larger scroll sequence. All scrolling remains native. Effects respond to `prefers-reduced-motion`, including preference changes during the session; essential content and controls remain available without motion. Narrow screens use reduced travel or static scenes where pinning would obstruct the content. No perpetual background animation is required.
