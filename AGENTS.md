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


# DDC Property Frontend — Agent Guide

This file applies to the entire frontend repository. Use it as the default workflow unless a more
specific `AGENTS.md` exists deeper in the tree.

## Project snapshot

- Product: Vietnamese real-estate marketplace for public users, customers, brokers, and admins
- Runtime/package manager: Bun 1.3; use `bun.lock` and never create npm/yarn/pnpm lockfiles
- Framework: Next.js 16 preview, App Router, React 19, strict TypeScript
- Rendering/caching: React Server Components, `cacheComponents: true`, partial prefetching, cache tags
- Data: Axios, TanStack Query, Zod 4, React Hook Form, nuqs, and limited Zustand stores
- UI: Tailwind CSS 4, shadcn-style components, Base UI/Radix primitives, Motion
- Integrations: DDC NestJS API, Directus, Goong/MapLibre, Cloudinary, Socket.IO, Google AI
- Quality: Biome 2 and Bun's test runner
- Deployment: standalone Next.js Docker image, deployed from `main` through GitHub Actions

Do not assume stable Next.js behavior: this repository uses `next@16.3.0-preview.5`. Before changing
Next.js code, follow the managed rule block above and read the relevant installed documentation.

## Codex operating model

Use this sequence for non-trivial work:

1. **Karpathy Guidelines** turns the request into explicit, verifiable success criteria and keeps the diff surgical.
2. **CodeGraph** builds repository context and identifies affected routes, symbols, and tests.
3. **Ponytail** selects the smallest complete solution and rejects speculative abstractions.
4. **Taste** sets the visual direction only for visually important public, marketing, editorial, or redesign work.
5. Implement with the existing Next.js and feature-module conventions.
6. Run focused automated checks, then **Playwright CLI** against the real page.
7. Apply the **Definition of done** before handoff.

These are gates, not a request to generate extra documents. Skip a gate only when it is genuinely irrelevant and state why in the final handoff.

## Karpathy goal contract

Apply the installed `karpathy-guidelines` skill to non-trivial implementation, debugging, refactoring, and review work. Invoke it explicitly as `$karpathy-guidelines` when the task is ambiguous, high-risk, or likely to expand in scope.

Before editing:

- State only assumptions that materially affect the result; ask one focused question when choosing silently could produce the wrong UX.
- Convert the request into observable success criteria and attach a runnable or browser verification to each one.
- Name what is intentionally out of scope when adjacent redesign, cleanup, or refactoring is tempting.
- Surface meaningful tradeoffs involving UX, compatibility, caching, privacy, performance, or complexity.
- Require every changed line to trace to the request; remove only dead code created by the current change.

Use this compact contract when useful:

```text
Goal: <observable user behavior>
Assumptions: <material assumptions only>
Success: <behavior> -> verify: <test or Playwright check>
Not changing: <explicit boundary>
```

Do not add this ceremony to copy fixes or obvious one-line changes. Karpathy Guidelines governs decision quality; Ponytail governs implementation size; Taste governs applicable visual quality.

## Repository map

- `src/app/`: App Router pages, layouts, loading/error boundaries, route handlers, and metadata
  - `(site)/(public)`: public and SEO-oriented pages
  - `(site)/(homepage)`: map exploration and property/project details
  - `(customer)`: authenticated customer area
  - `admin`: permission-gated administration
  - `dang-tin`: property-posting wizard
  - `@modal`: parallel/intercepting property-detail routes
  - `api`: Next.js route handlers, including CMS webhooks and GeoJSON
- `src/features/<domain>/`: domain API, schemas, queries, mutations, components, and types
- `src/components/ui/`: shared design-system primitives; extend these before creating duplicates
- `src/components/form/`: React Hook Form field adapters and schema helpers
- `src/components/`: reusable product-level components and layouts
- `src/lib/`: API clients, caching, Directus, uploads, and shared infrastructure
- `src/providers/`: React Query and Socket.IO providers
- `src/types/`: shared API and domain contracts
- `src/config/`: routes and stable application configuration
- `src/hooks/` and `src/utils/`: reusable cross-feature behavior
- `src/app/globals.css` and `src/styles/`: global tokens and styles
- `public/`: static assets
- `../ddc-property-be/`: sibling NestJS backend; inspect its DTO/route contract when integration changes,
  but do not modify it unless the task explicitly includes backend work

Use the `@/*` alias for imports across directories and relative imports inside a cohesive local
feature. Respect Biome's configured import organization.

## Required workflow

### 1. Inspect before editing

1. Clarify the observable behavior and acceptance criteria from the request.
2. Run `git status --short`; preserve unrelated and pre-existing changes.
3. Run `codegraph status .`; use `codegraph sync .` if the index is stale.
4. Build context with `codegraph context "<task>" -p .`. Before changing a shared component, query key,
   cache helper, public type, or route utility, run `codegraph impact <symbol> -p .`.
5. Trace the complete affected flow: route/layout -> feature component -> query/mutation -> API client
   -> backend contract -> cache or navigation side effects.
6. Read neighboring implementations, shared primitives, schemas, and relevant tests.
7. For Next.js behavior, read only the relevant files under `node_modules/next/dist/docs/` completely.
   Common starting points are Server/Client Components, data fetching, caching, revalidation, route
   handlers, navigation, metadata, and error handling.

CodeGraph is the first pass for relationships and impact; use `rg`/`rg --files` for dynamic imports,
route/config strings, CSS, copy, and anything the graph cannot resolve. Always read the referenced code
before deciding. After source changes, run `codegraph sync .` and
`codegraph affected <changed-files...> -p .` to select focused tests. The `.codegraph/` database and
runtime files are local-only and must never be committed.

### 2. Apply Ponytail

Choose the first rung that fully solves the task:

1. Does new code need to exist?
2. Is the behavior already present in a feature, component, hook, utility, or route?
3. Can React, Next.js, the browser, HTML, or CSS solve it natively?
4. Can an already-installed dependency solve it?
5. Only then add the minimum new code or dependency.

Prefer one root-cause fix at the shared boundary, deletion over addition, and the fewest files that
complete the behavior. Do not create speculative wrappers, factories, generic hooks, configuration,
or “future-proof” component APIs. Ponytail never removes accessibility, input validation, auth,
privacy, error handling, or the smallest useful regression check.

### 3. Plan the smallest complete change

Check every boundary affected by the task:

- server versus client component ownership
- route groups, layouts, parallel/intercepting routes, loading, and error states
- URL state, browser state, and server state
- API request/response types and Zod validation
- authentication, permissions, and identification requirements
- TanStack Query invalidation and Next.js cache revalidation
- responsive design, accessibility, Vietnamese copy, and SEO metadata
- maps, uploads, realtime, analytics, or other integration side effects
- focused automated tests and browser verification

Do not silently change public URLs, search parameters, cache-tag formats, query keys, API envelopes,
permission IDs, analytics events, or environment variables.

### 4. Implement using project conventions

#### Next.js and React boundaries

- Keep pages and layouts as Server Components by default. Add `"use client"` only at the smallest
  boundary that needs state, effects, browser APIs, event handlers, or client-only libraries.
- Do not move server-only modules, secrets, cookie access, or privileged API logic into client bundles.
- Compose Server and Client Components instead of converting an entire route to the client.
- Use App Router conventions (`loading.tsx`, `not-found.tsx`, route handlers, metadata APIs, parallel
  routes) rather than Pages Router patterns.
- Treat request APIs and framework props according to the installed Next.js documentation; do not
  copy patterns from older versions.
- Use `next/image`, `next/font`, and `next/link` where appropriate. New remote image hosts must also be
  added narrowly to `next.config.ts`.
- Preserve the root provider order unless a task specifically requires a dependency change.

#### Cache Components and data ownership

- `cacheComponents` is enabled. Understand whether data must be request-time, client-cached, or shared
  across requests before adding `"use cache"`, `cacheLife`, or `cacheTag`.
- Cached functions must not depend implicitly on per-user cookies or other request-specific secrets.
  Pass safe inputs explicitly or keep personalized data outside shared caches.
- Follow existing tag families in cached feature/lib files. Every mutation of cached public content
  must invalidate the corresponding tags and paths through the established revalidation helpers.
- Client query invalidation and Next.js cache invalidation solve different layers; handle both when a
  mutation affects both authenticated UI and public server-rendered pages.
- Avoid request waterfalls. Fetch independent server data concurrently and keep payloads across the
  Server/Client boundary small and serializable.

#### Feature data flow

- Keep domain logic in `src/features/<domain>/`. A typical feature uses:
  - `api.ts` for API functions and Zod schemas
  - `queries.ts` for `queryOptions` and hierarchical, stable query keys
  - `mutations.ts` for `useMutation`, invalidation, and success side effects
  - `search-params.ts` for nuqs parsers
  - `types.ts`, `components/`, and `forms/` as needed
  - `index.ts` as the feature's public export surface
- Use `src/lib/api-client.ts` for authenticated requests and `api-client-public.ts` for deliberately
  public data. The Axios interceptors already unwrap to the backend response body; type functions to
  the actual `ApiResponse<T>` / `List<T>` envelope from `src/types/api.ts`.
- Keep frontend types and Zod schemas aligned with backend DTOs, including `snake_case` fields. Never
  guess a changed contract when the backend repository can be inspected.
- Build query keys from the feature key factory and include every input that changes the result.
- Mutations must invalidate or update every affected query. Preserve caller callbacks when wrapping
  `UseMutationOptions`.
- Use TanStack Query for server state, nuqs for shareable URL filters, and Zustand/local state only for
  transient UI or interaction state. Do not duplicate the same source of truth across layers.

#### Forms, uploads, and errors

- Use React Hook Form with Zod and the shared `src/components/form/rhf-*` adapters.
- Reuse `schemaHelper` for nullable/empty inputs and keep user-facing validation text in Vietnamese.
- Disable submissions while pending, prevent duplicate actions, surface backend errors, and preserve
  entered values after recoverable failures.
- Upload flows must validate file type/count/size and follow the existing signed-upload helpers. Do not
  expose Cloudinary secrets or trust client-provided upload metadata blindly.
- Handle success, loading, empty, error, and permission-denied states deliberately. Do not swallow an
  error solely to keep the page visually quiet.

#### Authentication and permissions

- Reuse `useAuth`, auth guards, `usePermissions`, and `PermissionGuard`/`RoleBasedGuard` patterns.
- Client-side guards control presentation only; backend authorization remains authoritative.
- Verify loading, authenticated, unauthenticated, forbidden, and incomplete-identification states as
  applicable. Avoid protected-content flashes while auth data is loading.
- Do not log or expose cookies, access tokens, profile details, legal documents, or server-only secrets.

#### UI, accessibility, and performance

- Reuse `src/components/ui` and existing product components before adding new primitives. Preserve the
  current design language rather than introducing isolated styling systems.
- Use Tailwind tokens and `cn()`/`cva()`; avoid arbitrary values when a shared token or variant exists.
- Keep layouts responsive from mobile through desktop, and check long Vietnamese text, empty values,
  and realistic data density.
- Use semantic HTML, labels, keyboard navigation, visible focus, and appropriate ARIA. Biome's a11y
  lint domain is disabled, so accessibility requires explicit review.
- Honor `prefers-reduced-motion`, avoid layout-shifting animation, and keep motion purposeful.
- Preserve image aspect ratios, reserve layout space, lazy-load below-the-fold media, and avoid pulling
  large map/chart/browser-only packages into routes that do not need them.
- For SEO pages, verify metadata, canonical/share URLs, JSON-LD where present, sitemap implications,
  headings, and cache invalidation.

#### Taste gate for visual work

Use the `design-taste-frontend` skill for public landing pages, marketing sections, editorial pages,
and visually significant redesigns. It does not govern admin dashboards, data tables, or the posting
wizard; those should follow the existing dense product patterns and shared components.

For applicable work:

1. Audit the existing page, brand tokens, information architecture, copy, SEO, and interaction patterns.
2. State a one-line Design Read and choose explicit `DESIGN_VARIANCE`, `MOTION_INTENSITY`, and
   `VISUAL_DENSITY` values based on the page and audience.
3. Preserve the DDC brand, Vietnamese copy voice, URLs, analytics hooks, and working accessibility.
4. Reuse the existing Tailwind tokens, shadcn-style primitives, fonts, icons, and Motion setup. Do not
   add a second design system or animation library for aesthetic novelty.
5. Avoid generic AI patterns: arbitrary gradients/glows, repeated equal cards, fake data, decorative
   labels, excessive pills, and motion without a communication purpose.
6. Verify mobile collapse, contrast, focus/keyboard behavior, reduced motion, loading/empty/error states,
   image layout stability, and realistic Vietnamese content before browser sign-off.

#### Code quality and safety

- TypeScript is strict. Prefer precise types, discriminated unions, and shared contracts. Existing lint
  allowances for `any` are not permission to add it casually.
- Biome defines tabs, double quotes, a 100-column line width, import order, and Tailwind class sorting
  in `cn()`/`cva()` calls.
- Do not change lint/type rules, add suppressions, or remove tests merely to make checks pass.
- Do not edit `.next/`, generated Next.js types, dependencies, coverage, or build output.
- Never print or commit `.env*`, webhook secrets, map keys, AI keys, auth cookies, or production data.
- Do not run deployments, destructive cleanup, bulk formatting, or dependency upgrades unless the task
  explicitly requires them.

### 5. Fix bugs from evidence

For bug fixes:

1. Reproduce the issue when possible and record the route, viewport, state, and relevant network/error
   evidence.
2. Identify the root cause across UI, cache, query, API, and backend boundaries.
3. Add a focused regression test when the behavior can be tested deterministically.
4. Apply the smallest complete fix, rerun the reproduction, and inspect nearby behavior.

Do not claim a UI bug is fixed solely because the code compiles.

### 6. Verify proportionally

Use Bun for all project commands:

```bash
# Focused test
bun test path/to/file.test.ts

# Full test suite
bun test

# Read-only quality gates
bun run lint
bun run typecheck

# Production integration/build check
bun run build
```

`bun run lint` is read-only (`biome check .`). `bun run lint:fix` and `bun run format` rewrite files
across the repository; use them only when intentional, then review every changed file. For a focused
format fix, prefer `bunx biome check --write path/to/changed-file.tsx`.

Verification expectations:

- Pure docs/config change: inspect the diff and run the relevant formatter/parser check.
- Utility/schema/query-key change: focused Bun tests + lint + typecheck.
- Component/form/mutation change: focused tests + lint + typecheck + browser verification.
- Route/layout/cache/metadata change: focused tests + lint + typecheck + production build + browser
  verification of direct navigation and client navigation.
- Auth/permission/upload/map/realtime change: verify both success and failure/denied states with the
  required local services running.

For visible UI work, run `bun dev` and verify the actual page at representative mobile and desktop
viewports. Check interactions, keyboard behavior, console errors, and relevant network requests. When
available, `playwright-cli` can be used for snapshots, interaction, console/network inspection, and
screenshots. Prefer stable accessible targets from a fresh snapshot over brittle CSS selectors.

The production build can require environment variables, external APIs, or network access (for example,
fonts and build-time data). If a check is blocked, report the exact missing prerequisite and still run
all independent checks.

### 7. Browser verification with Playwright CLI

Browser-visible work is not complete until it is exercised in a real browser.

1. Confirm availability with `playwright-cli --version` and start `bun dev` plus required backend services.
2. Open a named session: `playwright-cli -s=ddc-fe open http://localhost:3000/<route>`.
3. Run `snapshot` before each interaction phase and use accessible refs or visible labels as targets.
4. Verify the primary journey and relevant loading, empty, validation, error, unauthenticated, and
   forbidden states.
5. Use `resize 390 844` for a representative mobile viewport and `resize 1440 900` for desktop; add
   intermediate widths when the layout changes materially.
6. Inspect `console error`, `requests`, and the relevant `request <index>` / response details. Confirm
   direct navigation, client navigation, back/forward behavior, and URL/search-param state where relevant.
7. Use `screenshot` for visual evidence when helpful, then close the named session.

Prefer semantic snapshot refs over CSS selectors. Use `eval` only when normal Playwright commands cannot
observe the behavior. Never commit or expose cookies, tokens, saved storage state, traces, recordings,
screenshots, or uploads containing private user data. Browser artifacts are evidence, not source files.

### 8. Review and hand off

Before finishing:

1. Review `git diff --check`, `git diff --stat`, and the complete task diff.
2. Confirm no unrelated files, generated artifacts, secrets, debug logs, or accidental formatting were
   added.
3. Confirm API, query-key, URL, cache-tag, and permission compatibility where relevant.
4. Summarize user-visible behavior and list the checks actually run with their results.
5. Call out new environment variables, backend coordination, deployment steps, or verification gaps.

## Common commands

```bash
bun install --frozen-lockfile
bun dev
bun test
bun run lint
bun run typecheck
bun run build
bun run next:analyze
```

Add dependencies with `bun add` / `bun add --dev` only when justified, and commit the corresponding
`package.json` and `bun.lock` changes together.

## Definition of done

A task is complete only when all applicable statements are true:

- CodeGraph context/impact was checked for non-trivial work and the index was synced after source changes.
- Material assumptions, boundaries, and observable success criteria were made explicit using Karpathy Guidelines.
- The implementation is the smallest complete solution, with no speculative abstraction or dependency.
- Applicable visual work passed the Taste gate while preserving the DDC brand and existing product system.
- The requested flow works end-to-end, including loading, empty, error, auth, permission, cache, and
  responsive states relevant to the change.
- Backend/API contracts, query keys, URL state, cache tags, metadata, and analytics remain aligned.
- CodeGraph-selected tests plus proportional Biome, typecheck, and build checks pass, or exact blockers
  are reported.
- Browser-visible behavior was verified with Playwright CLI on relevant mobile and desktop viewports,
  with console/network checks clean for the tested flow.
- `git diff --check` passes and the diff contains no unrelated edits, generated output, debug code,
  secrets, or sensitive browser artifacts.
- The handoff lists behavior changed, checks actually run, and any backend, environment, deployment,
  or follow-up requirement.
