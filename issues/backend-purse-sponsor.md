# [BACKEND] Purse & Sponsor Configuration

## User Story
As an Operations Admin I want to configure Purses and Sponsor settings so that I can define Benefit Purse types, associate them with Sponsors, and enforce ownership and discount limits.

## Assignment Order
Step 9 of 21 — assign after: [BACKEND] Rules & Eligibility is merged
Tier: BACKEND — extension slice 2

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts
This issue adds Purse CRUD endpoints and Sponsor settings endpoints.
All endpoints are protected and require a valid JWT.

## API Endpoints

- **POST /api/purses** — Create a new Purse linked to a Sponsor
  Request: `{ name, purseType, sponsorId, productCategories?, maxDiscountPerTransaction?, maxDiscountPerDay? }`
  Response: `{ id, name, purseType, sponsorId, isActive, createdAt }`
  Auth: required

- **GET /api/purses** — List Purses, optionally filtered by sponsorId or purseType
  Query params: `sponsorId`, `purseType`
  Response: `{ purses: [{ id, name, purseType, sponsorId, isActive }] }`
  Auth: required

- **GET /api/sponsors** — List all Sponsors
  Response: `{ sponsors: [{ id, name, reportingPartition, createdAt }] }`
  Auth: required

- **GET /api/sponsors/:id** — Get Sponsor details including associated Purses and Offers
  Response: `{ sponsor: { ...fields, purses: [...], offers: [...] } }`
  Auth: required

- **PUT /api/sponsors/:id** — Update Sponsor branding and reporting partition
  Request: `{ branding?, reportingPartition? }`
  Response: updated Sponsor record
  Auth: required

## Acceptance Criteria
- [ ] POST /api/purses creates a Purse with correct sponsorId and purseType; missing mandatory fields return 400
- [ ] GET /api/sponsors/:id returns the sponsor with all associated purses and offers visible only for that sponsor (no cross-sponsor data leakage)
- [ ] GET /api/purses with sponsorId filter returns only purses belonging to that sponsor
- [ ] All endpoints return 401 without a valid JWT
