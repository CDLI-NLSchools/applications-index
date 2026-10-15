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

A GitHub Actions workflow (.github/workflows/daily-refresh.yml) is included to run the updater and rebuild daily.
