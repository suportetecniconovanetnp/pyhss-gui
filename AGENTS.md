# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the application code. Use `src/pages/` for route-level screens, `src/components/` for reusable UI pieces, `src/modules/` for layout areas such as header, sidebar, and login, `src/services/pyhss/` for API clients, `src/store/` for Redux state, and `src/utils/` plus `src/hooks/` for shared helpers. Static assets live in `public/`; UI reference images live in `screenshots/`. Container and deployment files stay at the repo root and in `.github/workflows/`.

## Build, Test, and Development Commands
Run `npm install` once with the Node version in `.nvmrc` (`v18.7.0`).

- `npm run dev`: start the Vite dev server on localhost.
- `npm run devpub`: start the dev server on `0.0.0.0` for LAN or container access.
- `npm run build`: run TypeScript checks, then create a production build in `dist/`.
- `npm run justbuild`: build without running `tsc` first.
- `npm run preview`: serve the built app locally.
- `npm run format`: apply the repo’s Prettier/ESLint formatting rules.
- `npm run lint`: run the current ESLint script for legacy `.js` files in `src/`.

## Coding Style & Naming Conventions
Prefer React function components in TypeScript. Use PascalCase for components and pages (`Dashboard.tsx`), camelCase for variables and functions, and keep API modules grouped by resource name (`SubscriberApi.ts`, `OamApi.ts`). Prettier enforces single quotes, semicolons, no trailing commas, 80-column wrap, and no bracket spacing. Follow the existing two-space JSX/TS indentation style.

## Testing Guidelines
There is no committed `npm test` script yet. `src/setupTests.ts` and Testing Library dependencies are present, so add new tests next to the code they cover as `*.test.tsx`. Until a fuller suite exists, treat `npm run build` as the required gate and manually verify affected pages and forms against a running PyHSS backend.

## Commit & Pull Request Guidelines
Recent commits are short, imperative, and bug-focused, for example `Fix Bug#6 APN pgw/sgw empty string stored as null` and `Fixed issue: Bugs in Roaming Networks and Rules. #3`. Keep that pattern: start with a verb, name the affected area, and reference issue numbers when available. Pull requests should include a concise summary, impacted screens or APIs, manual verification steps, linked issues, and screenshots for visible UI changes.

## Security & Configuration Tips
Do not commit real API endpoints, provisioning keys, or tokens. Review `.env.example`, and remember the frontend reads API connection details from browser storage in `src/services/pyhss/http-common.js`, so document any setup changes in the PR.
