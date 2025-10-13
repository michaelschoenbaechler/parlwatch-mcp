# Repository Guidelines

## Monorepo Structure
All source code is organized into workspace packages under `packages/`:

```
packages/
  shared/  -> Pure TypeScript types & utilities (no external side-effects)
  server/  -> MCP server (Node, ESM) exposing tools & resources
  ui/      -> React widgets (Vite build, inlined into MCP resources)
```

Legacy root `src/` directory was removed during the monorepo migration.

## Package Responsibilities
- **@parlwatch/shared**: Reusable type definitions (`Config`, `QueryOptions`, etc.). Should remain lightweight and fast to build. Use `composite: true` for TS project references.
- **@parlwatch/server**: Registers MCP tools/resources. Avoid UI-specific logic here—only load inlined HTML via the widget loader.
- **@parlwatch/ui**: Standalone React widgets. Keep them framework‑agnostic (no direct MCP SDK imports) so they can be embedded elsewhere later.

## Build & Development
Root scripts orchestrate builds:
- `npm run dev` – Concurrent UI dev server + server (ts-node).
- `npm run build` – `ui` → `shared` → `server` (ensures widgets are available for inlining).
- `npm start` – Runs compiled server (`packages/server/dist`).
- `npm run type-check` – TS project references + UI no‑emit check.
- `npm run lint` / `lint:fix` – ESLint across all packages.

Widget inlining: The server loads `packages/ui/dist/index.html`, inlines referenced CSS/JS into a single HTML payload, and exposes it via the `vote-widget` resource (`ui://widget/vote-card.html`). If the UI build is missing, a placeholder HTML document is returned.

## Coding Standards
- Use ESM (`type: module`) everywhere.
- Use `new URL(import.meta.url)` for filesystem path derivation (no CommonJS globals).
- Keep `shared` free of runtime dependencies that could bloat consumers.
- Prefer explicit types—avoid `any`; export domain types in `@parlwatch/shared` if used across packages.
- Tool registrations live in `packages/server/src/tools/*` with the pattern `register<Name>Tool`.
- UI components live under `packages/ui/src/components` and should accept data via props (e.g., `initialState`).

## Adding a New MCP Tool
1. Implement domain logic or data access (reuse fetch helpers in `server/src/http.ts`).
2. Create `packages/server/src/tools/<tool-name>.ts` exporting `register<Name>Tool`.
3. Register resource (HTML template) if UI output is required.
4. Reference the HTML resource via `_meta.openai/outputTemplate` for models supporting UI rendering.
5. Add structured content (JSON) to pair with UI where helpful.

## Adding a New Widget
1. Add component under `ui/src/components`.
2. Wire it in `ui/src/main.tsx` (or create a separate entry + HTML if multiple widgets will be built independently).
3. Build UI: `npm run build:ui`.
4. Add a new resource loader (can reuse existing inline strategy) and register in a new tool.

## Testing Strategy (Planned)
Testing is not yet configured. Recommended roadmap:
- Introduce **Vitest** in `ui` for component tests.
- Introduce **Jest or Vitest** in `server` for tool handler units (mock SwissParl network calls).
- Add a lightweight contract test ensuring widget inlining returns a single HTML document (no external `<script src>` or `<link href>` tags).

## Commit & PR Guidelines
Follow Conventional Commits (e.g., `feat(server): add debate tool`, `fix(ui): correct date formatting`). Keep scope to package or concern. Provide:
- Summary
- Motivation / context
- Verification steps (commands + expected output)

Squash or rebase to maintain a linear history.

## Performance & Scaling Guidance
- Keep `shared` fast: avoid transitive deps that would slow every build.
- Consider code-splitting UI widgets if bundle size grows; then add an HTML build per widget.
- Add caching (e.g., simple in-memory) in server data fetch layer if rate or latency becomes a concern.
- Introduce CI with separate jobs: (1) type-check, (2) lint, (3) build, (4) future test matrix.

## Security & Stability
- Avoid embedding secrets in code; prefer environment variables (support forthcoming if needed).
- Validate all tool inputs with `zod` schemas (already in use).
- Fail gracefully: return textual fallback content plus diagnostic `_meta` when data calls fail.

## Release & Versioning (Future)
For publishing (if desired):
- Adopt `changesets` for independent version bumps.
- Automate changelog generation & GitHub releases.
- Tag releases matching MCP server versions (e.g., `server-v0.2.0`).

## SwissParl Data Usage Notes
- Use `top` and `skip` for pagination; avoid fetching large unbounded sets.
- Always specify ordering (`VoteEnd desc`) for deterministic results.
- Add search filters via `substringOf` only when needed to reduce payload size.

## Quick Reference Commands
```bash
npm run dev              # Dev mode (ui + server)
npm run build            # Full build
npm run build:ui         # Build widgets only
npm run type-check       # TS project refs + UI
npm run lint             # Lint all packages
npm run clean            # Remove all build outputs
```

## Open TODOs
- [ ] Add tests (Vitest/Jest) per package
- [ ] Provide Storybook or alternative component explorer
- [ ] Implement CI pipeline
- [ ] Add additional MCP tools (e.g., list committees, members)
- [ ] Introduce caching / rate limiting layer

---
Questions or proposals: open an issue or draft a PR describing intent + impact.
