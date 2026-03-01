# dndevs-remake

`dndevs-remake` rebuilds the legacy **Dungeons & Developers** talent tree as a modern React application using plain JavaScript, Vite, and ~~Tachyons CSS~~, while preserving the original visual style, rules, and shareable-build behavior as closely as possible.

This project also serves as a practical demonstration of agentic AI software development: the app is being rebuilt incrementally by an autonomous coding agent (ChatGPT Codex) with minimal human assistance, using the legacy site as the behavioral and visual specification.

## Project goals

- Recreate the original intro experience and talent tree UI
- Preserve the original skill dependencies, rank rules, and stats
- Use modern React with functional components and hooks
- Keep the codebase plain JavaScript only
- Build and deploy cleanly to GitHub Pages under `/dndevs-remake/`
- Add share-link format as query params hash

## Tech stack

- React
- Vite
- ~~Tachyons CSS~~
- Plain JavaScript
- localStorage for persistence

## Requirements summary

The rebuild is based on the original specification:

- React app with a single reducer-driven state model
- Legacy styles and assets ported from the archived site
- Skills data ported into `src/data/skills.js`
- Pure domain logic for rules, stats, hashing, and storage
- Support for the original legacy hash format:
  - `_{skillLettersAndDigits}_{portrait}_{avatarName}`
- GitHub Pages compatibility with `base: "/dndevs-remake/"`
- No jQuery, Knockout, TypeScript, or external state libraries

## Current implementation status

Completed:

- Project bootstrap with Vite, React, ~~Tachyons~~, and legacy CSS/assets
- Skills data port
- Domain logic for:
  - dependency rules
  - stats and level calculations
  - legacy hash encode/decode/apply
  - localStorage helpers
- Reducer-driven talent tree UI
- Skill node add/remove interactions
- Avatar panel updates for portrait, level, stats, and talents
- Intro/talent-tree mode toggle
- Direct-link cleanup for ported skill resources

Still remaining:

- GitHub Actions deployment workflow
- Final README deployment details polish
- Final GitHub Pages verification with deployed hash links

## Development

Install dependencies:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173/dndevs-remake/
```

## Testing

Run the automated test suite:

```bash
npm test
```

The tests currently cover:

- skills data expectations
- reducer-driven UI behavior
- dependency and point-allocation rules
- stats and level calculations
- hash encoding/decoding behavior
- localStorage helpers

## Build

Create a production build:

```bash
npm run build
```

## GitHub Pages deployment

The app is configured for GitHub Pages subpath hosting with:

```js
base: "/dndevs-remake/"
```

Target deployment URL format:

```text
https://<username>.github.io/dndevs-remake/
```

A GitHub Actions deployment workflow still needs to be added.

## Legacy reference

The rebuild uses the original archived site assets and source files as the reference specification:

- `legacy/index.html`
- `legacy/layout.css`
- `legacy/tft.dnd.js`
- `legacy/tft.dnd.data.js`
- `legacy/utils.js`
- `legacy/img/...`
