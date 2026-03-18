# [BACKEND] Offer Ingestion

## User Story
As an Operations Admin I want to ingest Offers from external Syndicators via API and review them before activation so that third-party Offer data is validated and approved before going live.

## Assignment Order
Step 10 of 21 — assign after: [BACKEND] Purse & Sponsor Configuration is merged
Tier: BACKEND — extension slice 3

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts
This issue adds Offer ingestion and review-queue endpoints using the existing Offer model (source: INGESTED, status: DRAFT).
All endpoints are protected and require a valid JWT.

**Note on route registration:** Register the `/api/offers/ingestion` and `/api/offers/pending-review` routers **before** the `/:id` route defined in [BACKEND] Offer Lifecycle Management in index.ts to prevent the static path segments from being matched as an offer ID parameter.

## API Endpoints

- **POST /api/offers/ingest** — Ingest one or more Offers from a Syndicator
  Request: `{ syndicatorRef, sponsorId, offers: [{ name, description, brand?, offerType, discountValue, effectiveDate, expirationDate?, channels? }] }`
  Creates each submitted Offer with status: DRAFT and source: INGESTED.
  Response: `{ created: number, offers: [{ id, name, status, source }] }`
  Auth: required

- **GET /api/offers/pending-review** — List all ingested Offers awaiting review (source: INGESTED, status: DRAFT)
  Response: `{ offers: [{ id, name, offerType, discountValue, status, source, syndicatorRef, createdAt }] }`
  Auth: required

## Acceptance Criteria
- [ ] POST /api/offers/ingest creates Offers with status DRAFT and source INGESTED; each Offer is retrievable by ID
- [ ] GET /api/offers/pending-review returns only INGESTED DRAFT Offers; manually created DRAFT Offers are excluded
- [ ] An ingested Offer can be edited via the existing PUT /api/offers/:id endpoint and promoted to CONFIGURED via PATCH /api/offers/:id/status before being set to ACTIVE
- [ ] All endpoints return 401 without a valid JWT
