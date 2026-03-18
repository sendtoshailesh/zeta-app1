# [BACKEND] Member APIs

## User Story
As a Member I want to discover available Offers, clip and unclip them, and view my redemption history and savings summaries so that I can take advantage of Perks at checkout.

## Assignment Order
Step 13 of 21 — assign after: [BACKEND] Transaction Evaluation is merged
Tier: BACKEND — extension slice 6

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts (JWT token identifies the Member/User)
Previously added models:
- Offer (with OfferStatus), Clip (with ClipStatus), AuditEvent
This issue adds Member-facing discovery, clip/unclip, and history endpoints.
All endpoints are protected and require a valid JWT. The authenticated user's ID is used as the memberId.

## API Endpoints

- **GET /api/member/offers** — Discover ACTIVE Offers available to the authenticated Member
  Query params: `merchantId?`, `category?`, `search?` (text), `sponsorId?`
  Response: `{ offers: [{ id, name, description, offerType, discountValue, effectiveDate, expirationDate, clipped: boolean }] }`
  — `clipped: true` if the authenticated user has an ACTIVE Clip for this Offer
  Auth: required

- **POST /api/member/clips** — Clip an Offer
  Request: `{ offerId }`
  Creates a Clip record with status: ACTIVE. Returns 409 if a clip already exists for this Member and Offer.
  Response: `{ id, offerId, status, clippedAt }`
  Auth: required

- **DELETE /api/member/clips/:offerId** — Unclip an Offer
  Sets the Clip status to UNCLIPPED and records unclippedAt.
  Returns 404 if no active clip exists for this Member and Offer.
  Response: `{ id, offerId, status, unclippedAt }`
  Auth: required

- **GET /api/member/redemptions** — Redemption history and savings summary
  Query params: `from?` (ISO date), `to?` (ISO date)
  Response: `{ totalSaved: number, redemptionCount: number, history: [{ offerName: string, amountSaved: number, merchant: string, redeemedAt: string }] }`
  Derived from AuditEvents with action: REDEMPTION_APPLIED for the authenticated user.
  Auth: required

## Acceptance Criteria
- [ ] GET /api/member/offers returns only ACTIVE Offers with correct `clipped` boolean for the authenticated user
- [ ] POST /api/member/clips creates a Clip and the Offer immediately shows `clipped: true` in a subsequent GET /api/member/offers call; duplicate clip returns 409
- [ ] DELETE /api/member/clips/:offerId sets clip status to UNCLIPPED; a subsequent GET /api/member/offers shows `clipped: false` for that Offer
- [ ] GET /api/member/redemptions with a date range returns only redemptions within that window for the authenticated user
- [ ] All endpoints return 401 without a valid JWT
