# Crimson Deli — Session handoff (Cursor + Claude)

Last updated: 2026-08-29

Use this file so Cursor and Claude do not duplicate or undo each other's work.

---

## What Cursor did (this chat)

### Login / Signup (customer auth UI)
- **`/login`** — `app/login/page.tsx`
- **`/signup`** — `app/signup/page.tsx`
- **Components:** `components/auth/AuthShell.tsx`, `LoginForm.tsx`, `SignupForm.tsx`, `FirebaseAuthButtons.tsx`, `firebase-session.ts`
- **Layout:** split screen — left brand panel (Crimson product photos: fruit bowl, turkey wrap, hoagie), right cream form panel
- **Login:** email + password, Google button, **Phone number** (Facebook removed per user request)
- **Signup:** Google + Phone + email form (name, phone, email, password)

### Auth backend (interim JSON store, not full Firebase yet)
- **`POST /api/auth/register`** — customer signup (`role: customer`), saves phone
- **`POST /api/auth/firebase`** — verifies Firebase ID token, creates/updates user, sets session cookie
- **`lib/auth/types.ts`** — added `phone`, `firebaseUid` on `User`
- **`lib/auth/store.ts`** — `upsertFirebaseUser()`, phone normalization
- **`lib/firebase/client.ts`**, **`lib/firebase/admin.ts`**
- **npm:** `firebase`, `firebase-admin` added

### Assets generated
- `public/assets/img/crimson/auth/leaves-bg.webp`
- `public/assets/img/crimson/auth/wrap-lineart.webp`

### UI attempts vs reference
- User provided a **reference login** (orange left panel, green buttons, CRIS-style layout)
- Cursor tried several iterations; user confirmed **NOT pixel-perfect same** (~70–75% layout similarity)
- Wrong additions that were removed: **black left sidebar**, **heavy brown photo band** (not in reference)

### Other (earlier in same project session)
- Store page pagination, sticky sidebar, food cards, cart work — see git diff / `SITE.md`
- Deleted planning MDs: `02-TRD.md`, `04-user-flows.md`, `06-client-assets-checklist.md`, `08-launch-runbook.md`, `CLAUDE.md`

---

## What Claude is doing (terminal, live)

From Claude Code session (`terminals/1.txt`):

1. **Bug fix — store/food category rows:** external-link icon was dropping below text because `.cd-link { display: inline }` in `app/globals.css` overrides Tailwind flex on containers. Fix in progress on category link rows.
2. **Collision checks:** `scripts/check-class-collisions.mjs` on `app/(site)/food/page.tsx` and `app/(site)/store/page.tsx`
3. **Build verify:** `NEXT_DIST_DIR=.next-build npx next build`
4. **Auth UI refactor (already in repo):** Claude moved auth styles to **`components/auth/auth.css`** and rewrote **`AuthShell.tsx`** — **Crimson brand palette** (crimson `#900000` left panel, cream form), not the orange/green reference. Uses `FoodLineArt` SVG + `Zig` markers + `siteConfig`.

**Important:** Cursor and Claude both touched auth. **Current files on disk = Claude's AuthShell + auth.css** for styling; **Cursor's LoginForm / SignupForm / FirebaseAuthButtons** still drive form logic.

---

## Password reset (Claude, 2026-08-31)

Full flow shipped: `/forgot-password` -> emailed link -> `/reset-password?token=`.

| Piece | Path |
|-------|------|
| Token store (hashed, single-use, 1h TTL) | `lib/auth/reset-tokens.ts` |
| Mailer (console fallback) | `lib/auth/mailer.ts` |
| Request link | `app/api/auth/forgot-password/route.ts` |
| Redeem link | `app/api/auth/reset-password/route.ts` |
| Pages | `app/forgot-password/`, `app/reset-password/` |
| Forms | `components/auth/ForgotPasswordForm.tsx`, `ResetPasswordForm.tsx` |
| Password field + eye toggle | `components/auth/PasswordInput.tsx` |

**Blocking for production:** no mail provider. Until `RESEND_API_KEY` is set,
`deliver()` in `lib/auth/mailer.ts` prints the reset link to the server console
instead of emailing it — implement that one function and the flow is live.

**Also fixed:** header "Log In" pointed at `/account`, so middleware bounced
every role to `/account?next=` after sign-in instead of `/admin` or `/team`.
Now points at `/login` (`components/site/SiteHeader.tsx`).

**Known gap:** resetting a password does not invalidate existing session
cookies — they are stateless and self-expire after 12h. Revoking needs a
password version in the cookie payload plus a store read in middleware.

---

## Admin products: edit fix + hide (Claude, 2026-08-31)

**Edit looked broken.** The editor row was rendered in a *second* `products.map()`
appended after every product row, so the form opened at the foot of the table,
below every item — off screen. Clicking Edit only appeared to toggle the label
to "Cancel".

Now a **modal**, not an inline row: one native `<dialog>` outside the table,
driven by `showModal()`. Native rather than a hand-rolled overlay because the
browser then supplies focus trapping, Escape, page inertness and `::backdrop`.
Closes via Escape, the backdrop, ×, or Cancel.

Note `.portal-modal` sets `margin: auto` explicitly — a `<dialog>` centres
itself with the UA's `margin: auto`, which Tailwind's preflight resets to 0,
pinning it to the top-left corner.

**New: hide from site.** `available` (sold out — still listed, marked
unavailable) and `hidden` (off the storefront entirely) are now separate.

| Change | Path |
|--------|------|
| `hidden?: boolean` on FoodItem | `lib/data/types.ts` |
| `listAvailableProducts()` filters, `getVisibleProduct()` added | `lib/products/store.ts` |
| Hide/Show button + Hidden badge | `components/portal/ProductsWorkspace.tsx` |
| `/food` + home read visible only | `app/(site)/food/page.tsx`, `app/(site)/page.tsx` |
| Home offer slider gated on visible slugs | `components/site/OfferSlider.tsx` |

Hiding is admin-only (the API already restricts anything but `available` to
admins). Hidden items 404 on the detail page.

**Also fixed while here:** `/food/[slug]` read the *seed* (`lib/data/food-menu.ts`),
not the product store — so admin edits to price/name/description never showed on
the detail page, and a hidden item stayed reachable by URL. It now reads the
store and is `force-dynamic`, matching `/food` and the home page.

---

## What still needs to be done

### Decide first (user)
| Topic | Options |
|-------|---------|
| Login look | A) Match reference (orange + green) exactly, or B) Keep Claude's Crimson-branded auth.css |
| Auth source of truth | One owner: either finish in Cursor or Claude — avoid both editing `AuthShell` / auth CSS |

### Firebase (required for Google + Phone login)
Add to `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_SERVICE_ACCOUNT_JSON=
```
Firebase Console: enable **Phone** + **Google** auth; add `localhost` to authorized domains.

Until configured, Google/Phone buttons show errors; **email/password login still works** via JSON user store.

### Storefront / porting
- **`/checkout`** — verify not still Mozzo demo HTML
- **`/order/[token]`** — order tracking polish
- Remove or ignore `public/site/*.html` when matching `app/` route exists (`SITE.md`)

### Data / deploy
- `.data/users.json` — dev-only; won't persist on Vercel/serverless
- Many `public/assets/img/crimson/**` images may be untracked — commit before deploy
- **`CLAUDE.md` deleted** — restore from git if agents need project rules (pickup vs DoorDash, roles, etc.)

### Login UI polish (if reference match chosen)
- Softer photo shade (no visible brown box)
- Reference-style vegetable line-art (not heavy circles)
- Exact orange/green hex values, spacing, divider, corner leaves
- Signup page same shell as login

### QA checklist
- [x] `/login` — email login, redirect by role (fixed 2026-08-31)
- [x] `/forgot-password` -> `/reset-password` — token issue, redeem, replay-reject
- [ ] `/signup` — register → `/account`
- [ ] `/store` — category icons aligned, pagination, DoorDash links
- [ ] `/food` — catalog matches detail "More from" cards
- [ ] `/cart` → `/checkout` flow
- [ ] Staff: `/admin`, `/team` after bootstrap (`POST /api/auth/bootstrap` once)

---

## Key paths

| Area | Path |
|------|------|
| Login | `app/login/page.tsx` |
| Signup | `app/signup/page.tsx` |
| Auth UI shell | `components/auth/AuthShell.tsx` |
| Auth CSS | `components/auth/auth.css` |
| Auth forms | `components/auth/LoginForm.tsx`, `SignupForm.tsx`, `FirebaseAuthButtons.tsx` |
| Session API | `app/api/auth/login`, `register`, `firebase` |
| User store | `lib/auth/store.ts`, `.data/users.json` |
| Middleware roles | `middleware.ts` |
| Site rules | `SITE.md` |

---

## Rules (do not break)

- **Fresh food** = in-store pickup only (cart/checkout)
- **Convenience** = browse in store; order via **DoorDash** only (no cart)
- **Minimum change** — don't refactor unrelated files
- **Don't change Crimson product images** without user approval
- **Two agents:** read this file before editing auth, store, or food pages
