# [BACKEND] Syndicator Notifications & Reporting

## User Story
As a Syndicator / Offer Provider I want to receive clip and unclip event notifications and access redemption settlement reports so that I can reconcile my Offer programme data against the engine's records.

## Assignment Order
Step 11 of 21 — assign after: [BACKEND] Offer Ingestion is merged
Tier: BACKEND — extension slice 4

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts
This issue adds Syndicator notification and reporting endpoints using the Syndicator and SyndicatorEvent models.
All endpoints are protected and require a valid JWT.

## API Endpoints

- **POST /api/syndicator-events** — Record a clip or unclip event for a Syndicator
  Request: `{ syndicatorId, offerId, eventType, payload? }`
  Creates a SyndicatorEvent with status: PENDING; simulates outbound notification by setting status to SENT.
  Response: `{ id, syndicatorId, offerId, eventType, status, createdAt }`
  Auth: required

- **GET /api/syndicator-events** — List SyndicatorEvents with optional filters
  Query params: `syndicatorId`, `offerId`, `eventType`, `status`
  Response: `{ events: [{ id, syndicatorId, offerId, eventType, status, retryCount, createdAt }] }`
  Auth: required

- **GET /api/reports/redemptions** — Aggregated redemption report filterable by Offer, Syndicator, and time period
  Query params: `offerId?`, `syndicatorId?`, `from?` (ISO date), `to?` (ISO date)
  Response: `{ totalRedemptions: number, totalAmountSaved: number, breakdown: [{ offerId, offerName, redemptionCount, totalAmountSaved }] }`
  Auth: required

## Acceptance Criteria
- [ ] POST /api/syndicator-events creates a SyndicatorEvent record and returns 201 with status SENT
- [ ] GET /api/reports/redemptions with a date range filter returns only redemption AuditEvents within that period; results are filterable by offerId and syndicatorId
- [ ] GET /api/syndicator-events with syndicatorId filter returns only events for that syndicator (no cross-syndicator data leakage)
- [ ] All endpoints return 401 without a valid JWT
