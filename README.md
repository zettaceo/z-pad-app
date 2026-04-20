<div align="center">

<img src="public/assets/logo-z.png" width="96" alt="Z-PAD" />

# Z-PAD

### The Only Launchpad You'll Ever Need

**AI-vetted · Multi-chain · Native fiat rails · Part of the ZETTA ecosystem**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-Production-black?logo=vercel&logoColor=white)](https://vercel.com)
[![CodeQL](https://img.shields.io/badge/CodeQL-Enabled-2ea44f?logo=github)](https://github.com/features/security/code)
[![License](https://img.shields.io/badge/License-UNLICENSED-red)]()

</div>

---

## ✨ Features

- **ZION AI Vetting** — Every project scored 0–100 across 6 dimensions
- **Fiat On-Ramp** — Credit card, PIX, wire via native Z-PAY integration
- **Refundable Sales (DYCO)** — 48h refund window post-TGE
- **All Sale Mechanisms** — Fair Launch · Presale · Private · LBP · Bonding Curve
- **Reputation Over Staking** — Earn tiers instead of locking capital
- **7 Chains Supported** — BSC · Ethereum · Polygon · Arbitrum · Solana · Base · ZETTA

---

## 🛡 Security Posture

Enterprise-grade defaults. Every request is hardened:

| Header | Value |
|---|---|
| `Content-Security-Policy` | Strict nonce + `strict-dynamic` (middleware) |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Camera/mic/geolocation/USB disabled |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `X-Powered-By` | *Removed (information disclosure prevention)* |

Additional layers:
- Edge Middleware rate limiting (100 req/min per IP)
- UUID request IDs for audit tracing
- CSP violation reporter (`/api/csp-report`)
- GitHub CodeQL security scanning (weekly + on PR)
- Dependabot automated dependency updates
- RFC 9116 responsible disclosure (`/.well-known/security.txt`)

Report vulnerabilities to **security@zettaword.com**. See [`SECURITY.md`](./SECURITY.md).

---

## 🚀 Quick Start

```bash
# Install
pnpm install

# Dev (Turbopack)
pnpm dev

# Typecheck + lint + build
pnpm typecheck && pnpm lint && pnpm build

# Production
pnpm start
```

Requires **Node.js 20.9+**.

---

## 📁 Project Structure

```
zpad/
├── .github/
│   ├── workflows/          # CI + CodeQL security scans
│   └── dependabot.yml
├── public/
│   ├── .well-known/        # security.txt (RFC 9116)
│   └── assets/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # Edge Runtime endpoints
│   │   ├── projects/[id]/  # Dynamic routes (generateStaticParams)
│   │   ├── layout.tsx      # Root layout (fonts, providers, analytics)
│   │   ├── page.tsx        # Home (Server Component)
│   │   ├── sitemap.ts      # Dynamic sitemap
│   │   ├── robots.ts       # Dynamic robots.txt
│   │   └── manifest.ts     # PWA manifest
│   ├── components/
│   │   ├── ui/             # Base (Button, Badge)
│   │   ├── layout/         # Nav, Footer, Ticker, Starfield
│   │   ├── features/       # ProjectCard, AiScore, WalletModal
│   │   └── zion/           # AI chat widget
│   ├── lib/
│   │   ├── cn.ts           # Class merging
│   │   ├── format.ts       # Formatters
│   │   ├── mock-data.ts    # Projects, positions, activity
│   │   └── wallet-store.tsx
│   ├── types/              # Shared TS types
│   ├── config/             # Site-wide config
│   └── middleware.ts       # Edge: CSP nonce + rate limit
├── next.config.ts          # Security headers
└── tsconfig.json           # strict + noUncheckedIndexedAccess
```

---

## 🎨 Stack

- **Framework** — [Next.js 15](https://nextjs.org) (App Router, Turbopack, React Server Components)
- **UI** — [React 19](https://react.dev) + [Tailwind CSS 4](https://tailwindcss.com) (CSS-first `@theme`)
- **Language** — [TypeScript 5.7](https://www.typescriptlang.org) strict
- **Validation** — [Zod 3](https://zod.dev)
- **Animations** — [Framer Motion 11](https://www.framer.com/motion/)
- **Icons** — [Lucide React](https://lucide.dev)
- **Toasts** — [Sonner](https://sonner.emilkowal.ski)
- **Fonts** — Syne · DM Sans · JetBrains Mono (self-hosted via `next/font`)
- **Analytics** — [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights)
- **Deployment** — [Vercel](https://vercel.com)

---

## 🧪 Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check (no emit) |
| `pnpm format` | Prettier format |
| `pnpm audit` | Dependency vulnerability audit |
| `pnpm analyze` | Bundle analyzer |

---

## 🌐 Deploy to Vercel

```bash
# Via CLI
vercel --prod

# Or connect your GitHub repo at vercel.com
```

Environment variables: see [`.env.example`](./.env.example).

---

## 📄 License

© 2026 ZETTA WORD. All rights reserved.

Built with ❤️ in Paraguay.
