# [BACKEND] Transaction Evaluation

## User Story
As a Channel System I want to submit a Transaction to the Data Plane and receive evaluated Perks discounts so that the correct Offers are applied at checkout based on the Member's clips, merchant, product eligibility, priority rules, and discount limits.

## Assignment Order
Step 12 of 21 — assign after: [BACKEND] Syndicator Notifications & Reporting is merged
Tier: BACKEND — extension slice 5

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts
Previously added models (no new models required for this slice):
- Offer (with OfferStatus, OfferType), Clip (with ClipStatus) — used for candidate resolution
This issue adds the Transaction evaluation pipeline endpoint.
The endpoint is protected and requires a valid JWT.

## API Endpoints

- **POST /api/transactions/evaluate** — Evaluate Perks for a Transaction
  Request:
  ```json
  {
    "memberId": "string (userId)",
    "sponsorId": "string",
    "merchantId": "string",
    "channel": "string",
    "lineItems": [{ "productId": "string", "category": "string", "price": number, "quantity": number }],
    "transactionTime": "ISO datetime string"
  }
  ```
  Pipeline steps (in order):
  1. Resolve candidate ACTIVE Offers matching sponsorId, merchantId (via Offer.channels), and transactionTime within effectiveDate/expirationDate window
  2. Filter to clipped Offers (Clip.userId = memberId, Clip.status = ACTIVE) and automatic Offers (source: MANUAL with no clip required — for this implementation, treat MANUAL Offers as automatic if no clip record exists)
  3. Apply priority rules: if stacking is not available (same line item targeted by two Offers), keep the higher-value Offer
  4. Apply discount caps: ensure total Perks discount does not exceed sum of Purse.maxDiscountPerTransaction limits
  5. Return discount breakdown
  Response:
  ```json
  {
    "perksAvailable": true,
    "appliedOffers": [{ "offerId": "string", "offerName": "string", "discountAmount": number }],
    "totalPerksDiscount": number,
    "lineItems": [{ "productId": "string", "originalPrice": number, "perksDiscount": number, "finalPrice": number }]
  }
  ```
  On Perks evaluation failure (unhandled error), return graceful degradation response:
  ```json
  { "perksAvailable": false, "appliedOffers": [], "totalPerksDiscount": 0, "lineItems": [...originalPrices], "degraded": true }
  ```
  Auth: required

## Acceptance Criteria
- [ ] POST /api/transactions/evaluate with a valid clipped ACTIVE Offer returns the correct discount amount and appliedOffers list
- [ ] A Transaction for an EXPIRED or SUSPENDED Offer returns an empty appliedOffers array and totalPerksDiscount of 0
- [ ] When two Offers target the same line item and stacking is disabled, only the higher-value Offer is applied
- [ ] If an internal error occurs during Perks evaluation, the response returns perksAvailable: false and degraded: true with no error status code returned to the caller
- [ ] Endpoint returns 401 without a valid JWT
