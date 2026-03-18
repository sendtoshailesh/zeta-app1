# [FRONTEND] Offer Lifecycle Management

## User Story
As an Operations Admin I want to view all Offers, create new Offers, and manage their lifecycle states so that I can control the Perks Offer catalogue from a single dashboard.

## Assignment Order
Step 15 of 21 — assign after: [BACKEND] Audit & Events is merged
Tier: FRONTEND — primary slice

## Context
Pre-built from copilot-instructions.md:
- React app entry → src/frontend/src/main.tsx
- Router + auth guard → src/frontend/src/App.tsx (authenticated routes only)
- Navbar shell → src/frontend/src/components/Navbar.tsx
- Login and Register pages already exist
HomePage.tsx currently shows a placeholder — this Issue replaces its content with the OfferDashboard component below.
API endpoints available:
- POST /api/offers
- GET /api/offers (with status, sponsorId, search filters)
- GET /api/offers/:id
- PUT /api/offers/:id
- PATCH /api/offers/:id/status

## What to Build

- **OfferDashboard** — top-level component rendered on HomePage; shows the offer list with filter controls and a "New Offer" button
- **OfferList** — table/card list of all Offers showing name, type, status badge, sponsor, and effective dates
- **OfferStatusBadge** — coloured badge component showing the current OfferStatus (DRAFT=grey, CONFIGURED=blue, ACTIVE=green, SUSPENDED=amber, EXPIRED=red, ARCHIVED=black)
- **OfferForm** — modal or inline form for creating a new Offer; fields: name, description, brand (optional), offerType (select), discountValue, sponsorId (select from fetched sponsors), effectiveDate, expirationDate (optional)
- **OfferActions** — context-sensitive action buttons rendered per Offer based on its current status:
  - DRAFT → "Configure" button (transitions to CONFIGURED)
  - CONFIGURED → "Activate" button (transitions to ACTIVE)
  - ACTIVE → "Suspend" button (transitions to SUSPENDED)
  - SUSPENDED → "Reactivate" button (transitions to ACTIVE) and "Expire" button (transitions to EXPIRED)
  - EXPIRED → "Archive" button (transitions to ARCHIVED)
  - ARCHIVED → no action buttons (read-only)

## HomePage Update
Replace the placeholder content in HomePage.tsx to render `<OfferDashboard />`.
The user must see the Offer management dashboard immediately after login.

## data-testid Values
Every interactive and key display element must have a data-testid.
Playwright tests will use these — list them explicitly:
- `offer-dashboard` — on the OfferDashboard root container
- `offer-list` — on the OfferList container
- `offer-card` — on each offer row/card (multiple)
- `offer-status-badge` — on the OfferStatusBadge element for each offer
- `create-offer-button` — on the "New Offer" button
- `offer-name-input` — on the name field in OfferForm
- `offer-type-select` — on the offerType dropdown in OfferForm
- `offer-discount-input` — on the discountValue field in OfferForm
- `offer-sponsor-select` — on the sponsorId dropdown in OfferForm
- `offer-effective-date-input` — on the effectiveDate field in OfferForm
- `offer-form-submit` — on the Create/Save button in OfferForm
- `configure-offer-button` — on the "Configure" action button (DRAFT offers only)
- `activate-offer-button` — on the "Activate" action button (CONFIGURED offers only)
- `suspend-offer-button` — on the "Suspend" action button (ACTIVE offers only)
- `reactivate-offer-button` — on the "Reactivate" action button (SUSPENDED offers only)
- `archive-offer-button` — on the "Archive" action button (EXPIRED offers only)
- `offer-search-input` — on the search/filter text input
- `offer-status-filter` — on the status filter dropdown

## Acceptance Criteria
- [ ] HomePage renders OfferDashboard with the list of seeded Offers immediately after login; not a blank page
- [ ] Creating a new Offer via OfferForm calls POST /api/offers and the new offer appears in the list with DRAFT status
- [ ] OfferActions renders only the correct action button(s) for each Offer's current status; ARCHIVED offers show no action buttons
- [ ] All data-testid values listed above are present on the correct elements
