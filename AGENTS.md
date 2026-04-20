# Agent Instructions

Guidance for AI coding agents (Claude, GitHub Copilot, Cursor) working on this codebase.

## Stack

- Next.js 15 App Router + React 19 + TypeScript strict
- Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`)
- No third-party browser storage — use React state (WalletProvider is the source of truth)

## Conventions

- **Server Components by default.** Add `'use client'` only when needed (state, effects, browser APIs).
- **Imports** — use `@/*` alias. Keep paths absolute.
- **Types** — put shared types in `src/types/`. Avoid `any`; prefer `unknown` + narrowing.
- **Styling** — Tailwind utilities only. Use `cn()` from `@/lib/cn` to merge classes.
- **Mock data** — all in `src/lib/mock-data.ts`. Real chain data will replace this later.
- **Formatters** — use `fmt.currency`, `fmt.token`, `fmt.address` etc. from `@/lib/format`.

## Security Invariants (do NOT break)

1. CSP is **nonce-based**, enforced in `src/middleware.ts`. Do not add `'unsafe-inline'` to `script-src`.
2. Security headers live in `next.config.ts`. Any change requires security review.
3. Never commit `.env.local` or real API keys.
4. No inline `<script>` tags without using the nonce from `headers()`.
5. Keep `poweredByHeader: false` — never expose Next.js version.

## Commands

```bash
pnpm dev          # Dev (Turbopack)
pnpm typecheck    # Must pass before commit
pnpm lint         # Must pass before commit
pnpm build        # Must pass before PR merge
```

## Adding a new page

1. Create `src/app/<route>/page.tsx`
2. Default to Server Component (no `'use client'`)
3. If interactive, extract client sub-components
4. Add to `src/app/sitemap.ts`
5. Add to `Nav.tsx` `NAV_LINKS` if user-facing

## Adding a new API route

1. Create `src/app/api/<route>/route.ts`
2. Use `export const runtime = 'edge'` when possible
3. Rate limiting is applied automatically via middleware
4. Never log secrets or PII
