# [FRONTEND] Member APIs

## User Story
As a Member I want to browse available Offers, clip the ones I want, and view my savings history so that I can discover and use Perks at checkout.

## Assignment Order
Step 19 of 21 — assign after: [FRONTEND] Offer Ingestion is merged
Tier: FRONTEND — extension slice 6

## Context
Pre-built from copilot-instructions.md:
- Router + auth guard → src/frontend/src/App.tsx (add /my-offers route)
- Navbar shell → src/frontend/src/components/Navbar.tsx (add "My Offers" nav link)
API endpoints available:
- GET /api/member/offers (with merchantId, category, search, sponsorId filters)
- POST /api/member/clips
- DELETE /api/member/clips/:offerId
- GET /api/member/redemptions (with from/to date filters)

## What to Build

- **MemberOffersPage** — new page at /my-offers; shows available offers and savings summary
- **AvailableOffersList** — grid/list of ACTIVE Offers with clip state shown; shows name, description, offerType, discountValue, expiration date, and clipped badge if already clipped
- **ClipButton** — button on each unclipped Offer card to clip the Offer; calls POST /api/member/clips; button becomes "Unclip" after clipping
- **UnclipButton** — button on each clipped Offer card to unclip; calls DELETE /api/member/clips/:offerId; button reverts to "Clip" after unclipping
- **ClippedBadge** — visual indicator shown on clipped Offer cards
- **RedemptionHistory** — section below the offers list showing past redemptions with offer name, amount saved, merchant, and date
- **SavingsSummary** — summary bar showing total savings and redemption count for the current month

## data-testid Values
Every interactive and key display element must have a data-testid.
Playwright tests will use these — list them explicitly:
- `available-offers-list` — on the AvailableOffersList container
- `offer-detail-card` — on each Offer card in the member view (multiple)
- `clip-button` — on the ClipButton for each unclipped offer card
- `unclip-button` — on the UnclipButton for each clipped offer card
- `clipped-badge` — on the ClippedBadge for each clipped offer card
- `member-offer-search-input` — on the search text input
- `redemption-history-list` — on the RedemptionHistory container
- `redemption-history-item` — on each redemption row (multiple)
- `savings-summary` — on the SavingsSummary bar
- `savings-total` — on the total savings amount display
- `savings-count` — on the redemption count display

## Acceptance Criteria
- [ ] /my-offers page renders the list of seeded ACTIVE Offers with correct clipped state for the test user (seeded clips show ClippedBadge and UnclipButton; unclipped offers show ClipButton)
- [ ] Clicking ClipButton on an unclipped offer calls POST /api/member/clips; the card immediately shows ClippedBadge and UnclipButton without a page refresh
- [ ] Clicking UnclipButton on a clipped offer calls DELETE /api/member/clips/:offerId; the card immediately shows ClipButton and removes ClippedBadge
- [ ] All data-testid values listed above are present on the correct elements
