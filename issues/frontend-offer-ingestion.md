# [FRONTEND] Offer Ingestion

## User Story
As an Operations Admin I want to view the pending review queue of ingested Offers and promote or reject them so that externally supplied Offers are reviewed before going live.

## Assignment Order
Step 18 of 21 — assign after: [FRONTEND] Purse & Sponsor Configuration is merged
Tier: FRONTEND — extension slice 3

## Context
Pre-built from copilot-instructions.md:
- Router + auth guard → src/frontend/src/App.tsx (add /ingestion route)
- Navbar shell → src/frontend/src/components/Navbar.tsx (add "Ingestion" nav link)
API endpoints available:
- GET /api/offers/pending-review
- PUT /api/offers/:id (for editing ingested offer fields before approval)
- PATCH /api/offers/:id/status (for transitioning DRAFT→CONFIGURED to approve)

## What to Build

- **IngestionPage** — new page at /ingestion; shows the pending review queue
- **IngestionQueue** — list of all INGESTED DRAFT Offers awaiting review; shows name, syndicatorRef, offerType, discountValue, and effective dates
- **IngestionOfferCard** — card for each pending Offer with inline edit capability; fields: name, description, discountValue, effectiveDate, expirationDate are editable before approval
- **ApproveOfferButton** — button per card that calls PATCH /api/offers/:id/status with `{ status: "CONFIGURED" }` to approve the ingested offer; only shown while offer is in DRAFT status
- **RejectOfferButton** — button per card that calls PATCH /api/offers/:id/status with `{ status: "ARCHIVED" }` to reject and archive the ingested offer; only shown while offer is in DRAFT status

## data-testid Values
Every interactive and key display element must have a data-testid.
Playwright tests will use these — list them explicitly:
- `ingestion-queue` — on the IngestionQueue container
- `ingested-offer-card` — on each IngestionOfferCard (multiple)
- `ingested-offer-syndicator-ref` — on the syndicatorRef display per card
- `approve-offer-button` — on the ApproveOfferButton per card (DRAFT status only)
- `reject-offer-button` — on the RejectOfferButton per card (DRAFT status only)
- `edit-ingested-name-input` — on the editable name field in IngestionOfferCard
- `edit-ingested-discount-input` — on the editable discountValue field in IngestionOfferCard
- `save-ingested-edits-button` — on the Save button for inline edits in IngestionOfferCard

## Acceptance Criteria
- [ ] /ingestion page renders the pending review queue with INGESTED DRAFT Offers; manually-created DRAFT Offers are not shown
- [ ] Clicking "Approve" on a card calls PATCH /api/offers/:id/status with CONFIGURED; the card is removed from the queue and the offer appears as CONFIGURED in the main Offer dashboard
- [ ] Clicking "Reject" on a card archives the offer; the card is removed from the queue
- [ ] All data-testid values listed above are present on the correct elements
