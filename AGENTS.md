<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.

Before writing or modifying Next.js code, read the relevant guide in:

`node_modules/next/dist/docs/`

Heed all deprecation notices and prefer the conventions documented for the installed version.

**Keep this block, including in commits.**

It is part of the project's agent setup, maintained by `next dev` for every agent that works here.

If it appears as an uncommitted change, that is intentional. Commit it as-is.

Do not remove it to clean up a diff; it will be regenerated.

<!-- END:nextjs-agent-rules -->

# Solo English Frontend Agent Guide

This guide applies to this repository. Read README.md and ../be/docs/API.md before changing cross-stack contracts.
The old real-estate starter's TypeORM/JWT, maps, broker, payment and admin instructions no longer apply.

## Stack

- Next.js 16.3 preview App Router, React 19, TypeScript, Tailwind 4.
- Bun only; retain bun.lock. Do not create npm/yarn/pnpm lockfiles.
- Server Components for static layout/content, client components for interaction.
- TanStack Query for server state; Better Auth cookies, never localStorage tokens.
- Existing UI primitives and semantic light/dark/system tokens; Geist and Apple blue.
- GSAP belongs only to the landing wrapper. Respect reduced motion and mobile.
- src/features/learning contains content/editor, separate learning and exam players.
- src/features/auth handles identity and cache clearing on login/logout.
- src/providers/react-query owns refetch defaults. Invalidated inactive routes must refetch.
- public/examples/greetings.json is the schemaVersion 1 example.

## Workflow

1. Apply Karpathy Guidelines: inspect the actual flow, define observable acceptance checks, make assumptions explicit.
2. If .codegraph exists, use codegraph explore before grep/find or broad file reads. Prefer current source over stale symbol listings.
3. Apply Ponytail: reuse the platform and existing code; no speculative abstraction. Do not remove validation, access checks or requested behavior.
4. Implement with apply_patch, preserve unrelated changes, never commit secrets or authenticated browser artifacts.
5. Run targeted checks and the full lint/type/build gate after cross-cutting changes.
6. Verify browser-visible flows using a named playwright-cli session, fresh snapshots and accessible labels.
7. Check desktop 1440x900, mobile 390x844, both themes, keyboard and reduced motion.
8. Sync CodeGraph after changes; inspect git diff --check and the complete task diff.
9. Report actual checks and remaining blockers. Never claim a check that was not run.

## Data Integrity

- Scope private resources by session owner and active account. Return 404 for inaccessible content.
- No cookie/session/Authorization values in logs, screenshots or committed files.
- Clear private caches when identity changes. No shared caching of private API data.
- Explicit editor saves preserve local input on error and use version conflicts against stale tabs.
- Import/copy issues new IDs and never imports ownership or progress.
- Keep immutable attempt/session snapshots and soft-delete content.
- Answer retries and exam submit are idempotent; exams never affect mastery.
- A learning session completes all four stages regardless of accuracy. Repetition is bounded.
- External HTTPS media loads directly in the browser. Never fetch user media server-side.
- Use a dedicated local database for tests; never reset or seed a shared/production database.

## Checks

```sh
bun install --frozen-lockfile
bun test
bun run lint
bun run typecheck
bun run build
bun dev
```

For local production: bun run build then bun start (PORT may override 3000).
The start script assembles public/static assets into the standalone output.
