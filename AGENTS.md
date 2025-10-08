# Repository Guidelines

## Project Structure & Module Organization
All TypeScript sources live inside `src/`. `index.ts` wires up the MCP server and registers tools—keep it limited to bootstrap logic. Shared utilities include `http.ts` (SwissParl fetch helpers), `formatters.ts` (string shaping via `formatVote`), and `types.ts` (query helpers). Each tool lives in `src/tools/<name>.ts`; today only `get-votes.ts` is registered, so mirror its layout when adding more. Built output belongs in `dist/`; leave generated files untouched.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` runs the MCP server with ts-node for rapid iteration.
- `npm run build` transpiles sources into `dist/`.
- `npm start` executes the built bundle.
- `npm run type-check` runs `tsc --noEmit` to catch typing issues.
- `npm run lint` / `npm run lint:fix` apply ESLint rules.
- `npm run prettier:fix` runs Prettier across `src/`.
- `npm run clean` clears `dist/` prior to rebuilding.

## Coding Style & Naming Conventions
Use modern ESM (`type: module`) and stay within the existing TypeScript style. ESLint (`js/recommended` + `typescript-eslint`) and Prettier dictate formatting—resolve findings rather than suppressing them. Stick to two-space indentation, trailing semicolons, and single quotes. File names stay lowercase with optional dashes. Export types/interfaces in `PascalCase`; functions, constants, and tool ids in `camelCase`. Keep tool handlers focused: perform validation with `zod`, delegate data access to `makeVotesRequest`, and reuse formatters.

## Testing Guidelines
A formal test runner is not yet configured. When introducing behavior, add unit specs under `src/__tests__/` (e.g., `src/__tests__/formatters.test.ts`) and wire them into `npm test`. Mock SwissParl calls by stubbing `fetchSwissParlEntity`. Always run `npm run type-check`, `npm run lint`, and a dry-run of any new tests before opening a PR.

## Commit & Pull Request Guidelines
History follows Conventional Commit prefixes (e.g., `chore: basic setup`). Continue with `feat|fix|chore|docs|refactor: concise summary` lines under 72 characters. Pull requests should outline context, a bullet list of changes, and verification steps (including relevant commands or sample MCP output). Reference issue numbers when available and attach logs or screenshots when behavior changes. Prefer squash merges or rebases to keep the main branch linear.

## SwissParl & Agent Notes
The SwissParl client automatically paginates; pass `skip` and `top` through tool parameters instead of manual slicing. New MCP tools should export `register<Name>Tool` and register inside `index.ts`. Reuse `makeVotesRequest` for consistent filtering and ordering, and extend `formatters.ts` for any new text responses.
