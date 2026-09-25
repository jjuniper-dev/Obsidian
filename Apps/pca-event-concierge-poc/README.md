# PCA Event Concierge PoC

Clean migration target for selected code and UX patterns from `ReplitExport-spatialsense.tar.gz`.

## What was migrated

### Kept from `Task-Capture-Bot`

- `artifacts/pca-capture/src/lib/taskParser.ts` was migrated as `src/lib/taskParser.ts` with its deterministic task parsing and Obsidian checkbox formatting intact.
- The PCA capture page pattern from `artifacts/pca-capture/src/pages/home.tsx` was simplified into `src/components/PcaTaskCapture.tsx`.
- The app shell pattern from `artifacts/pca-capture/src/App.tsx` was simplified into `src/App.tsx`.
- The AI parse and summary patterns from `artifacts/api-server/src/routes/pca/index.ts` were migrated into `src/api/pca.ts` with a provider-neutral `OPENAI_API_KEY` helper.
- Voice was intentionally not implemented for this pass. `src/api/voice.ts` is a scoped placeholder documenting that voice should be added only when the ChatGPT App PoC requires it.

### Ignored from `Task-Capture-Bot-1`

`Task-Capture-Bot-1` was not migrated because it was a duplicate of `Task-Capture-Bot`.

### Kept from `Couple-Event-Finder`

- Onboarding flow pattern became `src/components/EventOnboarding.tsx`.
- Event card and swipe deck pattern became `src/components/EventSwipeDeck.tsx`.
- Match confirmation pattern became `src/components/EventMatch.tsx`.
- Leaflet map preview pattern became `src/components/LeafletEventMap.tsx`.
- Mock event data was normalized into `src/data/events.ts`.

## What was deliberately removed

This folder does not include Replit runtime/configuration artifacts:

- `.replit`
- `.replitignore`
- `.replit-artifact/`
- `replit.md`
- nested `.git` histories from the export
- `@replit/*` Vite plugins
- Replit-managed OpenAI integration wrappers

## Runtime / framework

- Node.js
- TypeScript
- React
- Vite
- Express
- OpenAI SDK
- Leaflet / React Leaflet
- Framer Motion

## Run locally

Install dependencies from this folder, then run the web app and API in separate terminals:

```bash
npm install
npm run dev
npm run api:dev
```

The Vite dev server proxies `/api` calls to the Express server on port `8787`.

## Environment variables

Only the AI-assisted capture routes require OpenAI credentials:

```bash
OPENAI_API_KEY=...
OPENAI_TEXT_MODEL=gpt-5.4 # optional override
PORT=8787                # optional API port override
```

The deterministic capture path works without API credentials.

## Recommendation

Use this folder as the migration workspace for the PCA Event Concierge / ChatGPT App PoC. Treat the original Replit export as an archive only, not as an active development root.
