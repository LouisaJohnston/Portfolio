# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A mobile-responsive personal portfolio (https://www.louisajohnston.com/) built with Next.js 15 (Pages Router), React 18, and plain CSS. Deployed on Vercel. The defining feature is a GitHub contribution heatmap that pulls live data via the GitHub GraphQL API and can merge contributions from two accounts.

## Commands

```bash
npm run dev            # start dev server at http://localhost:3000
npm run build          # production build
npm run start          # serve the production build (run build first)
npm test               # run the full Vitest suite once
npm run test:watch     # watch mode for TDD
npm run test:coverage  # run with coverage report
```

Run a single file or test:

```bash
npx vitest run lib/contributions.test.js     # one file
npx vitest run -t "sums counts per date"     # tests matching a name
```

There is no lint script. Node >= 24 is required per `engines` in package.json (the installed environment may be older, which Vitest tolerates).

### Testing

- **Runner:** Vitest + React Testing Library, jsdom environment. Config in `vitest.config.js`; global matchers and DOM cleanup in `vitest.setup.js`. Test files are `*.test.{js,jsx}` colocated next to the code they cover; `archived/` is excluded.
- Pure logic lives in `lib/` precisely so it can be unit-tested without network/env (see `lib/contributions.js`). Prefer extracting logic there over testing it through the API handler.
- Component tests assert rendered output and the data-derived branches (loading / empty / populated, singular vs. plural), not implementation details.

## Environment

`.env.local` (gitignored) must define:
- `GITHUB_TOKEN` — classic PAT with `read:user` and `repo` scopes. Must belong to `GITHUB_USER` so private contribution counts are included.
- `GITHUB_USER` — primary account; its calendar is the base.
- `GITHUB_USER_2` — optional second account; its public contributions are merged into the heatmap using the same token.

Without these, `/api/github-contributions` returns a 500 with `{ error }` and the heatmap silently renders nothing.

## Development principles

These are required for new work in this repo:

- **Test-driven development.** Write a failing test that describes the desired behavior *before* writing the implementation, then make it pass (see Testing above for how to run). Vitest + React Testing Library is set up; pure logic belongs in `lib/` where it can be tested directly.
- **DRY.** Don't duplicate logic or markup. If the same pattern appears twice, extract it — a shared component, a helper in `lib/`, or a constant. Heatmap colors (`lib/levelColor.js`) and data-shaping (`lib/contributions.js`) were pulled out of their call sites this way; the repeated inline margin styles in `GitHubContributions.jsx` are a remaining candidate.
- **Reusable components.** Build components to be parameterized via props and reused, the way `IntroParagraph` is rendered multiple times from `index.js`. Before adding new markup, check whether an existing component (including ones in `archived/`) can be reused or generalized instead of writing a one-off.

## Architecture

This is a single-page app under the **Pages Router** (`pages/`, not `app/`):

- `pages/_app.js` wraps every page with `<Navbar>` and `<Footer>` and imports global CSS. Global styles can only be imported here.
- `pages/index.js` is the entire visible site. It fetches `/api/github-contributions` client-side in a `useEffect` and tracks its own `loading`/`data` state.
- `pages/api/github-contributions.js` is the only backend. It runs a GraphQL query against `api.github.com/graphql`, optionally fetches a second user, then delegates to `lib/contributions.js` (`shapeCalendar` for one user, `mergeCalendars` to sum per-day counts across two). Responses are CDN-cached via `Cache-Control: s-maxage=3600, stale-while-revalidate=86400`. The internal shape (`{ total, weeks: [{ days: [{ date, count }] }] }`) differs from GitHub's raw shape — `GitHubContributions.jsx` consumes this transformed shape, so changes to `lib/contributions.js` and the component must track each other.

### Conventions

- Components live in `components/` as `.jsx`; pages/API are `.js`. Default exports, function components, no TypeScript.
- Styling: global classes in `styles/globals.css` plus inline `style={{}}` for layout tweaks. Heatmap cell colors are defined in `lib/levelColor.js`.
- Pure, framework-free logic goes in `lib/` (importable and unit-tested); React UI goes in `components/`.
- `projects.json` holds portfolio project data (with a `display` flag), but is not currently wired into any rendered page.

### archived/

`archived/` (`Tech.jsx`, `LanguageBars.jsx`) holds components removed from the live site, kept for reference. Don't assume they're imported anywhere — verify before reusing.
