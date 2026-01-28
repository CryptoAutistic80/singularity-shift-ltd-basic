# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for Singularity Shift Ltd (sshift.xyz), a software engineering consultancy. Pure HTML/CSS with no JavaScript framework or build process.

## Development

**No build commands** - This is a static site with no npm, bundlers, or dependencies.

- **Edit:** Make changes directly to `index.html`
- **Test:** Open `index.html` in a browser; no automated tests
- **Deploy:** Push to `main` branch; GitHub Pages deploys automatically

## Architecture

Single-file architecture (`index.html` - ~760 lines):
- Lines 1-14: HTML head with meta tags and Google Fonts
- Lines 15-642: Embedded CSS with custom properties
- Lines 646-763: HTML markup (semantic sections)

### CSS Design System

Uses CSS custom properties for theming:
- `--ink-primary` (#0a2540) - dark blue text
- `--accent-primary` (#1d5bff) - blueprint blue accent
- `--bg-paper` (#eef3fa) - light background
- `--space-1` through `--space-9` - spacing scale

### Responsive Breakpoints

- Desktop: default
- Tablet: 960px
- Mobile: 720px

### Page Sections

1. Header (sticky nav with CTA)
2. Hero (grid with copy + logo)
3. About (company story + founder card)
4. Capabilities (5 service cards in grid)
5. Tools (technology stack pills)
6. Footer (copyright + contact)

## Assets

- `assets/logo_clean_white.png` - main logo (1.3MB)
- `assets/favicon.ico` - favicon
- Google Fonts loaded via preconnect (Inter, Inter Tight, IBM Plex Mono)

## Git Workflow

Feature branches use `codex/` prefix. Main branch is production.
