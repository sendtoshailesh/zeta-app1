# [BACKEND] Offer Lifecycle Management

## User Story
As an Operations Admin I want to create, retrieve, update, and manage the lifecycle state of Offers so that I can configure and control Perks Offers through their full Draft → Configured → Active → Suspended → Expired → Archived workflow.

## Assignment Order
Step 7 of 21 — assign after: [DATABASE] Audit & Events is merged
Tier: BACKEND — primary slice

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts (use on all routes below)
- Auth routes → src/backend/routes/auth.ts
- Express app entry → src/backend/index.ts
This issue adds Offer CRUD endpoints and state-transition endpoints.
All endpoints are protected and require a valid JWT.

## API Endpoints

- **POST /api/offers** — Create a new Offer (status defaults to DRAFT)
  Request: `{ name, description, brand?, offerType, discountValue, sponsorId, effectiveDate, expirationDate?, depletionLimit?, channels? }`
  Response: `{ id, name, offerType, discountValue, status, sponsorId, effectiveDate, expirationDate, createdAt }`
  Auth: required

- **GET /api/offers** — List/search Offers with optional filters
  Query params: `status`, `sponsorId`, `type`, `search` (name/brand text search)
  Response: `{ offers: [{ id, name, offerType, discountValue, status, sponsorId, effectiveDate, expirationDate }] }`
  Auth: required

- **GET /api/offers/:id** — Get a single Offer by ID
  Response: full Offer record including sponsor details
  Auth: required

- **PUT /api/offers/:id** — Update an Offer (allowed in DRAFT, CONFIGURED, ACTIVE states only; ARCHIVED offers return 403)
  Request: any updatable Offer fields
  Response: updated Offer record
  Auth: required

- **PATCH /api/offers/:id/status** — Transition Offer lifecycle state
  Request: `{ status: "CONFIGURED" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "ARCHIVED" }`
  Valid transitions only: DRAFT→CONFIGURED, CONFIGURED→ACTIVE, ACTIVE→SUSPENDED, ACTIVE→EXPIRED, SUSPENDED→ACTIVE, SUSPENDED→EXPIRED, EXPIRED→ARCHIVED
  Response: updated Offer record
  Auth: required

## Acceptance Criteria
- [ ] POST /api/offers creates a DRAFT Offer and returns 201 with all supplied fields; missing mandatory fields return 400
- [ ] GET /api/offers returns filtered results; status and sponsorId filters work correctly
- [ ] PATCH /api/offers/:id/status enforces valid transitions; attempting DRAFT→ACTIVE returns 400; attempting to modify an ARCHIVED offer returns 403
- [ ] All endpoints return 401 without a valid JWT
