# Crimson Deli — site structure

Production website for **Crimson Deli Inc.** (`crimsondeli.com`). This repo is the live site codebase — not a theme demo, not a third-party template.

## Architecture (LOCKED)

**Pure Next.js App Router** — all customer and staff UI lives in `app/`.

| Layer | Owns |
|-------|------|
| `app/` | Home, food, store, cart, checkout, about, contact, order tracking, account, team, admin |
| `public/assets/` | Crimson Deli images, fonts, icons (`public/assets/img/crimson/`, logo, etc.) |
| `middleware.ts` | Auth/role guards only — **not** static HTML rewrites |
| Firebase (later) | Data, auth, orders — React app + Cloud Functions |

**Do not:** serve `public/site/*.html` as the live storefront, invent product data, or treat this repo as a generic theme.

**Do:** Tailwind + TypeScript in `app/`, brand crimson `#900000`, preserve real menu items and assets already in the repo.

---

## Route map

| URL | App route |
|-----|-----------|
| `/` | `app/page.tsx` |
| `/food` | `app/food/page.tsx` |
| `/food/[slug]` | `app/food/[slug]/page.tsx` |
| `/store` | `app/store/page.tsx` |
| `/store/[category]` | `app/store/[category]/page.tsx` |
| `/cart` | `app/cart/page.tsx` |
| `/checkout` | `app/checkout/page.tsx` |
| `/order/[token]` | `app/order/[token]/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/contact` | `app/contact/page.tsx` |
| `/login` | `app/login/page.tsx` |
| `/signup` | `app/signup/page.tsx` |
| `/forgot-password` | `app/forgot-password/page.tsx` |
| `/reset-password` | `app/reset-password/page.tsx` |
| `/account` | `app/(portals)/account/` |
| `/team` | `app/(portals)/team/` |
| `/admin/*` | `app/(portals)/admin/` |

Nav: Home · Fresh Food · Everyday Essentials · Cart · About · Contact. Log In → `/login`
(pointing it at `/account` made middleware bounce every role to `/account` via `?next=`).

---

## Transition (while porting to `app/`)

Some routes may still be served from interim files under `public/site/` until the matching `app/` page ships. **End state:** every route above is Next.js only; interim HTML can be removed. Customer-facing UI is always **Crimson Deli** — never labeled or documented as an external template.
