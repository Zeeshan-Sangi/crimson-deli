# Crimson Deli — compiled QA report
**From:** Bugi (QA lead) + Scout, Pipeline, Contract, Vault, Pulse, Access, Gate  
**Date:** 2026-09-11  
**Code:** `~/Documents/Crimson Deli` (branch `seo-mobile-and-role-fixes`)  
**Live:** https://crimsondeli.com  
**For:** Projects Manager / Zeeshan

---

## Go / no-go (Gate)

| Path | Call |
|------|------|
| Password auth + pay-at-store pickup | **GO** with residuals (no S0) |
| Google / Phone Firebase login | **NO-GO** until S1 CD-AUTH-01 fixed |
| WCAG AA launch | Treat **CD-A11Y-01** as launch residual (S1 labels) |

Mozzo checkout check: **closed** (live unauth `/checkout` → 307 `/login?next=%2Fcheckout`).

---

## Security (Vault + Contract)

### Escalate
| ID | Sev | Finding | Evidence |
|----|-----|---------|----------|
| CD-AUTH-01 | **S1** | `POST /api/auth/firebase` links by uid→phone→email, **keeps existing role**, no `email_verified` check → staff/admin takeover via matching unverified Firebase email | `firebase/route.ts`, `store.ts` upsertFirebaseUser |
| CD-AUTH-02 | **S1** (cond.) | Email-verify attempt counter ineffective (codes keyed by hash of code; wrong guesses miss live doc); only IP RL 8/15m | `email-verify.ts`, `verify-email/route.ts` |

### S2
- CD-MW-01 — Middleware reads cookie HMAC only; does not re-check `disabledAt` / `sessionVersion` (layouts/handlers do → stale portal HTML up to 12h; APIs 403)
- CD-RL-01 — In-process rate limit (serverless = per-instance bump)
- CD-RL-02 — `/api/auth/firebase` has **no** rate limit
- CD-MAIL-01 — `deliver()` console-dumps email (incl. reset URL) when Resend unset

### Pass / good
- Firestore deny-all client R/W; Admin SDK only
- Reset tokens: SHA-256, 1h, single-use txn, prior invalidated
- Passwords: scrypt + timingSafeEqual
- Session HMAC httpOnly 12h; password change bumps `sv` (portal layout enforces)
- Forgot-password non-enumerating; login generic 401
- Register hardcodes `role: customer`; staff create admin-only
- `createOrder` **recomputes** prices from menu (client totals not trusted)
- Secrets gitignored (service account + `.env.local` not tracked)

### Ops hygiene (S3)
- Local `.firebase-service-account.json` / leftover `.data/users.json` on disk (gitignored)

---

## Accessibility (Access)

| ID | Sev | Finding |
|----|-----|---------|
| CD-A11Y-01 | **S1** | Live `/login` + `/signup`: placeholder-only fields (no `<label>` / aria-label) — WCAG 1.3.1 / 3.3.2 / 4.1.2 |
| CD-A11Y-02 | **S2** | Product edit dialog errors render **outside** `<dialog>` (no `role="alert"`) |
| CD-A11Y-03 | S3 | Login alert placement after social buttons |

Passes: native product dialog + labelled fields; password toggle a11y.

---

## Performance (Pulse)

| ID | Sev | Finding |
|----|-----|---------|
| CD-IMG-01 | **S2** | Product “-small” assets often ~1MB+; home+food unique imgs ≈ **13.7 MB**; mostly raw `<img>` (matches lint no-img warnings) |
| CD-IMG-02 | **S2** | Homepage Fresh picks 404: `banana-pudding-ice-cream-small.png`, `blue-panda-ice-cream-small.png` |
| CD-DOC-01 | S3 | HTML always `private, no-store` / Vercel MISS; TTFB ~0.5–1.25s |

No LCP/CLS numbers (PSI 429 / Lighthouse hung) — not invented.

---

## Exploratory UX (Scout)

- Live `/` `/food` `/store` `/cart` `/login` 200; checkout auth redirect works
- Essentials = DoorDash only (no cart) — correct
- Fresh food = pickup / pay-at-store — correct
- Second Brain “cosmetic filters” / “demo home cards” / Mozzo: **stale or closed**
- Still open: signup→account + staff bootstrap + full cart→order **with session** not exercised this dig
- S4: cart DoorDash copy links to `/store`; no `/blog/[slug]`

---

## Automation (Pipeline)

- **S2** — No Playwright / Vitest / Jest / Cypress in `package.json`
- Tier A designed: login → food add → cart → checkout → order token; price-integrity via localStorage; DoorDash never completed; fresh context + clear `crimson-cart-v2`
- HANDOFF QA still unchecked for signup / store / food / cart→checkout / staff

---

## Lints (Bugi)

`npm run lint`: **0 errors, 31 warnings** — all `@next/next/no-img-element`.

---

## Remaining work (priority)

1. **Block Firebase social/phone** until CD-AUTH-01 fixed (email_verified + careful privileged-link rules)
2. Fix CD-A11Y-01 labels on login/signup
3. Compress / `next/image` product thumbs; fix CD-IMG-02 404s
4. Scaffold Playwright Tier A (Pipeline design)
5. Middleware re-check sv/disabled (CD-MW-01)
6. Rate-limit `/api/auth/firebase`; harden email-verify counters
7. Exercise signup + staff bootstrap + authenticated order smoke
8. Confirm Vercel/prod env (Resend, AUTH_SECRET, Firebase) — local keys SET but prod not verified this dig

---

## Smoke checklist (Gate) — pickup only, no card, no DoorDash complete

1. Login customer; honor `?next=/checkout`
2. Unauth `/checkout` → `/login?next=%2Fcheckout`
3. `/food` add → `/cart` → checkout
4. Place pickup → 200 + `/order/[token]`
5. Inflate cart `priceCents` → server total = menu
6. Empty cart → no successful POST
7. Reset password → old cookie rejected (sv)
8. Keep Google/Phone off until CD-AUTH-01
9. After A11Y fix: visible labels on login/signup
10. Home Fresh picks: no 404 thumbs

---

## Sources
Scout / Pipeline / Contract / Vault / Pulse / Access / Gate DONE notes 2026-09-11; Bugi lint + HANDOFF/Second Brain cross-check.

---

## Amendment 2026-09-11 — Pulse CWV (lab Lighthouse)

| | Mobile | Desktop |
|--|--------|--------|
| Perf | 0.90 | 1.00 |
| **LCP** | **3.5 s** | **0.6 s** |
| FCP | 1.1 s | 0.4 s |
| CLS | 0.054 | 0.014 |
| TBT | 30 ms | 0 |

### CD-LCP-01 — S2
Mobile LCP node = `storefront-cover.webp` with **`loading="lazy"`** (`lcp-lazy-loaded` score 0). Load Delay ~65% (~2.25s) of LCP. Desktop LCP is preloaded hero burger (0.6s).

**Min fix:** don’t lazy-load that storefront cover on mobile (or `fetchpriority=high` / `next/image`).

Lab only — no field p50/p95. PSI still 429. **Go/no-go unchanged.**

Also refined earlier:
- CD-IMG-02 thumbs exist locally/git-tracked; live 404 = deploy drift
- Cold HTML: `force-dynamic` on `app/(site)/layout.tsx` (session in header)
