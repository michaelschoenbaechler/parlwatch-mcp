# Parlwatch MCP Monorepo

This repository hosts the Model Context Protocol (MCP) server for Swiss parliament data together with a React UI widget and shared TypeScript types.

## Packages

```
packages/
  shared/   -> Reusable TypeScript types & utilities (no runtime deps)
  server/   -> MCP server exposing tools/resources (Node)
  ui/       -> React widget(s) built with Vite (browser)
```

### server (@parlwatch/server)
Implements the MCP server and registers tools like `get_votes`. It exposes a resource `ui://widget/vote-card.html` whose HTML is dynamically sourced from the built React widget (or a placeholder if not built yet).

### ui (@parlwatch/ui)
React application compiled by Vite. The build output is inlined (JS/CSS) into a single HTML document for transport via MCP resource responses.

### shared (@parlwatch/shared)
Holds shared TypeScript interfaces (e.g. query/options) consumed by the server (and potentially UI in future). Built automatically via `prepare` script.

## Prerequisites
- Node.js 18+ (ESM + top-level await support)
- npm 9+ recommended

## Install
```bash
npm install
```
All workspace dependencies and local linking are handled automatically by npm workspaces.

## Scripts
Root scripts orchestrate package scripts:

| Script | Description |
| ------ | ----------- |
| `npm run build` | Build ui, shared, then server (in that order). |
| `npm run build:ui` | Build only the React widget. |
| `npm run build:shared` | Build shared types. |
| `npm run build:server` | Build MCP server. |
| `npm run dev` | Run UI dev server (Vite) + MCP server (ts-node) concurrently. |
| `npm run dev:ui` | Vite dev for UI. |
| `npm run dev:server` | MCP server in watch/dev mode (ts-node). |
| `npm start` | Run the compiled MCP server from `packages/server/dist`. |
| `npm run type-check` | Project references build + UI type check (no emit). |
| `npm run lint` | ESLint across server/shared/ui. |
| `npm run clean` | Remove all build artifacts. |

## Development Workflow
1. Start concurrent dev:
   ```bash
   npm run dev
   ```
   - UI: http://localhost:5173 (default Vite port)
   - Server: runs via stdio (intended to be launched by an MCP-compatible client)

2. Build when you need the inlined widget resource:
   ```bash
   npm run build:ui
   ```
   The server’s `vote-widget` resource will then inline the built assets. If the UI is not built you’ll see a placeholder with instructions.

3. Type checking & lint before commit:
   ```bash
   npm run type-check
   npm run lint
   ```

## Adding a New Widget
1. Create a component in `packages/ui/src/components`.
2. Expose it via `main.tsx` or a new entry (adjust `index.html` if needed).
3. Rebuild UI: `npm run build:ui`.
4. Register a new resource + tool in `packages/server/src/tools` referencing the resource URI (e.g. `ui://widget/your-widget.html`).
5. Optionally create a helper like `widget-loader` if you need specialized bundling logic.

## Adding a New Package
1. `mkdir packages/<name>`
2. Add a `package.json` with `name": "@parlwatch/<name>` and scripts.
3. Add `tsconfig.json` extending `../../tsconfig.base.json` (use `composite: true` if it will be referenced by others).
4. (Optional) Add a `prepare` script to auto-build after install.
5. Update root `tsconfig.json` `references` if other packages depend on it.

## MCP Resource Inlining
The server loads `packages/ui/dist/index.html`, then:
- Inlines `<link rel="stylesheet" ...>` contents into `<style>` tags.
- Inlines `<script type="module" src=...>` modules directly.
This produces a single self-contained HTML string for the MCP resource.

## Troubleshooting
| Issue | Fix |
| ----- | --- |
| Resource shows placeholder | Run `npm run build:ui` |
| Type errors in server imports | Ensure `@parlwatch/shared` built: `npm run build:shared` |
| Lint errors about `any` | Add precise interface types in UI or shared package |
| ESM path issues | Use `new URL(import.meta.url)` pattern for file resolution |

## Future Enhancements (Ideas)
- Add Storybook workspace for richer component dev (`packages/storybook`).
- Add Vitest or Jest test suites per package.
- Introduce CSS-in-JS or Tailwind if styling grows.
- Add release/versioning automation (changesets) for publishing selected packages.
- Add CI workflow for build + lint + type-check.

## License
ISC – see `LICENSE` (or root package.json) for details.
