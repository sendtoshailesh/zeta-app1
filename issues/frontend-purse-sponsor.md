# [FRONTEND] Purse & Sponsor Configuration

## User Story
As an Operations Admin I want to view Sponsors and their associated Purses, and create new Purses so that I can configure Benefit Purse types with correct discount limits per Sponsor.

## Assignment Order
Step 17 of 21 — assign after: [FRONTEND] Rules & Eligibility is merged
Tier: FRONTEND — extension slice 2

## Context
Pre-built from copilot-instructions.md:
- Router + auth guard → src/frontend/src/App.tsx (add /sponsors route)
- Navbar shell → src/frontend/src/components/Navbar.tsx (add "Sponsors" nav link)
API endpoints available:
- POST /api/purses
- GET /api/purses (with sponsorId filter)
- GET /api/sponsors
- GET /api/sponsors/:id
- PUT /api/sponsors/:id

## What to Build

- **SponsorsPage** — new page at /sponsors; shows the sponsor list
- **SponsorList** — table/card list of Sponsors showing name and reporting partition
- **SponsorDetail** — expandable section or sub-page showing one Sponsor's Purses and Offers counts
- **PurseForm** — modal form for creating a new Purse; fields: name, purseType (select: STANDARD / PERKS_ONLY), sponsorId (select), productCategories (optional text), maxDiscountPerTransaction (optional number), maxDiscountPerDay (optional number)
- **PurseList** — list of Purses shown within SponsorDetail, with type badge (STANDARD=blue, PERKS_ONLY=purple)

## data-testid Values
Every interactive and key display element must have a data-testid.
Playwright tests will use these — list them explicitly:
- `sponsor-list` — on the SponsorList container
- `sponsor-card` — on each sponsor row/card (multiple)
- `sponsor-detail` — on the SponsorDetail expanded section
- `create-purse-button` — on the "New Purse" button within SponsorDetail
- `purse-list` — on the PurseList container
- `purse-card` — on each purse row/card (multiple)
- `purse-type-badge` — on the purse type badge per purse card
- `purse-name-input` — on the name field in PurseForm
- `purse-type-select` — on the purseType dropdown in PurseForm
- `purse-sponsor-select` — on the sponsorId dropdown in PurseForm
- `purse-max-discount-input` — on the maxDiscountPerTransaction field in PurseForm
- `purse-form-submit` — on the Create button in PurseForm

## Acceptance Criteria
- [ ] /sponsors page renders the seeded Sponsors list with name and reporting partition
- [ ] Clicking a Sponsor card opens SponsorDetail showing that sponsor's Purses and Offer count; no purses from other sponsors are shown
- [ ] Creating a new Purse via PurseForm calls POST /api/purses and the new purse appears in the correct SponsorDetail
- [ ] All data-testid values listed above are present on the correct elements
