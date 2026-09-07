# Solo English Web

Vietnamese self-learning English app using Next.js App Router, React, Tailwind,
TanStack Query and Better Auth. Use Bun; backend setup is in ../be/README.md.

```sh
bun install --frozen-lockfile
bun dev
```

Default: http://localhost:3000, API http://localhost:8000/v1.
Set NEXT_PUBLIC_API_BASE_URL in .env.local for another local API.
It is a build-time public URL, never a secret.

```sh
bun run lint
bun run typecheck
bun test
bun run build
bun start
```

## First session

1. Register, create a collection and a topic in /library.
2. Copy a sample from /explore or import public/examples/greetings.json.
3. Add valid questions for all four stages to a draft, save PRIVATE, and start learning.
4. Use /review and /mistakes; compose your own exam from personal questions.
5. /progress shows learning/review separately from exam history.

Editors save explicitly and warn before leaving with unsaved data. A version
conflict preserves your edits in the current tab. Compare the latest saved
version in another tab before reloading; export contains saved content only.
Media must be HTTPS URLs. The browser loads it directly, not through Next's image
optimizer. Only trusted media hosts should be used.

## Structure

- src/features/auth: Better Auth client and query cache lifecycle.
- src/features/learning: editor, library, learning/review, independent exam player.
- src/features/shell: app shell and static landing with isolated GSAP wrapper.
- src/styles/solo.css: responsive semantic-token styles.
- public/examples/greetings.json: schemaVersion 1 import example.
- public/images: original generated landing assets.

Landing images were generated for this project: a quiet silver-headphones/
notebook/blue-pen learning desk and a natural English conversation between two
adults. No fabricated user counts or testimonials. Motion respects reduced-motion.
The application supports light/dark/system themes, keyboard controls and mobile.

Browser QA artifacts belong in ignored .playwright-cli/, never commit cookies,
storage state or user data. UI primitives from the original starter are retained.
