# applications-index

Applications indexer + UI for CDLI-NLSchools — daily refresh scanner and embeddable UI (GitHub Pages)

## Local development

Requirements: Node.js (>=18) and npm

1. Install dependencies

   npm install

2. (Optional) Update the index from a remote source:

   DATA_SOURCE_URL="https://.../applications.json" npm run update-index

3. Run local dev server

   npm run dev

Open http://localhost:5173

## Build

Produces a static site in the `docs/` folder suitable for GitHub Pages:

  npm run build

Then push to GitHub. Configure Pages to serve from branch `main` → folder `docs/`.

## Automation

A GitHub Actions workflow (.github/workflows/daily-refresh.yml) runs daily at 06:00 UTC (and on demand via workflow_dispatch). It scans the CDLI-NLSchools org for public repos, writes `public/data/applications.json` (linking each app to its GitHub Pages URL, skipping infrastructure repos like this one and the sim template), rebuilds the site into `docs/`, and commits the result to `main`. GitHub Pages serves the site from branch `main` → folder `docs/`, so the index stays current automatically.

Note: `npm run update-index` / `scripts/update-index.js` is a separate local-dev helper that fetches index data from a `DATA_SOURCE_URL`. The automated workflow does not use it; it generates the index directly from the GitHub API.
