# End-to-end tests

Tier A: the path a customer actually walks — menu → cart → checkout → order
token — plus the guards around it.

```bash
npm run test:e2e          # headless
npm run test:e2e:ui       # pick and watch tests
npx playwright test -g "water ice"
```

The run starts its own dev server on **port 3100**, building into `.next-e2e`.
That isolation is deliberate: a second Next server sharing `.next` with the one
you are working in corrupts its module cache. It never reuses a server it did
not start, because one left over from the previous run answers the readiness
check while it is still shutting down and then dies mid-test.

Already have a server you want to test against — your own, or a preview
deployment?

```bash
E2E_BASE_URL=http://localhost:3000 npm run test:e2e
```

## What runs without an account

`storefront.spec.ts` needs nothing set up:

- the public pages answer
- signed-out `/checkout` goes to `/login?next=%2Fcheckout` and back
- a menu item reaches the cart at the menu's price
- water ice refuses to be added until a flavor is chosen, and the flavor
  reaches the line
- the cart survives a reload and can be emptied
- everyday essentials link out to DoorDash and have no cart button — the link
  is read, never followed, so no test can walk into a real DoorDash order

## What needs an account

`order.spec.ts` signs in, so it needs a real customer:

```bash
E2E_EMAIL=customer@example.com E2E_PASSWORD='...' npm run test:e2e
```

Without those it skips, with the reason printed.

Two of its tests **place a real order in the store's Firestore**, so they are
opt-in as well:

```bash
E2E_PLACE_ORDER=1 E2E_EMAIL=... E2E_PASSWORD='...' npm run test:e2e
```

They leave a note on the order asking the counter to cancel it. One of them
rewrites the cart in `localStorage` to one cent before checking out: the order
must come back priced from the menu, never from the number the browser sent.
