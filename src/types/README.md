# Types (src/types)

This directory contains the canonical, single source-of-truth TypeScript types/models used across the application.

Why this exists
- Centralizing type definitions avoids duplication and drift between components.
- Consumers import from the canonical barrel `@/types` (via the `paths` mapping in `tsconfig.base.json`).
- Tests, runtime code, and developer tooling should consistently resolve `@/types`.

Canonical import
- Use the barrel from anywhere in the repo:

  ```ts
  import { Activity, DEFAULT_ACTIVITIES } from '@/types';
  // or sub-imports from the barrel
  import type { TimelineEntry } from '@/types';
  ```

Editor/IDE notes
- If your editor still reports unresolved imports after switching, restart the TypeScript server (in VS Code: Command Palette → "TypeScript: Restart TS Server").
- Ensure your editor uses the workspace `tsconfig` (this repo uses `tsconfig.base.json`/`tsconfig.json`).

Runtime vs type-only exports
- Remember that `interface` and `type` are compile-time only and do not exist at runtime.
- If you rely on runtime values (constants, enums, helper functions) they must be exported from `src/types` or another runtime module.
- A smoke test exists at `src/tests/types-barrel.test.ts` that asserts the presence of runtime exports (e.g. `DEFAULT_ACTIVITIES`).

Exceptions (intentionally-local `./types`)
- Some modules intentionally keep a local `./types` file for encapsulation reasons. These are permitted via ESLint rule overrides:
  - `src/utils/serviceWorker/**` — service worker utilities keep local types because those types are tightly coupled to the sw implementation and should not be used elsewhere.
  - `src/utils/time/**` — time utility modules keep local `./types` to preserve internal api and reduce export surface.

Migration guidance
1. Search for imports that use relative `./types` or `../types`.
   - Example: `import { Activity } from '../../types/activity'`
2. Prefer the barrel import where appropriate:
   - `import type { Activity } from '@/types';` or `import { DEFAULT_ACTIVITIES } from '@/types';`
3. If the type is intentionally local (one of the exceptions above), leave the import as-is and add a code comment explaining why.

Automated codemod suggestion (recommended)
- For large repositories, use a codemod (e.g., `jscodeshift` or a `ts-morph` script) to perform a dry-run and produce diffs:
  - Plan: run a dry-run, review diffs, commit in small batches.
  - Example approach using `jscodeshift`:
    1. Write a transform that finds `ImportDeclaration` nodes whose specifier matches `./types`/`../types/*` and rewrites them to `@/types`.
    2. Run `jscodeshift -t ./scripts/transforms/migrate-types-imports.js src --dry` to preview changes.

Developer checklist
- Run `npm run type-check` after making type import changes.
- Run `npm run lint` and fix ESLint violations (we enforce canonical imports via `no-restricted-imports`).
- Run `npm test`.

Questions and follow-ups
- If you want, I can prepare a codemod (dry-run) and a small subsequent PR series to migrate remaining relative imports in manageable chunks.

Thank you — this README is intentionally short and pragmatic. If you'd like a GIF or snippet showing how to run the TS server restart and codemod, I can add it.