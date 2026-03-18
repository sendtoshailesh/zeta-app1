# [BACKEND] Rules & Eligibility

## User Story
As an Operations Admin I want to create, retrieve, update, and version Eligibility Rules so that I can define reusable policy criteria and attach them to multiple Offers.

## Assignment Order
Step 8 of 21 — assign after: [BACKEND] Offer Lifecycle Management is merged
Tier: BACKEND — extension slice 1

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts
This issue adds Rule CRUD endpoints with versioning behaviour.
All endpoints are protected and require a valid JWT.

## API Endpoints

- **POST /api/rules** — Create a new Rule (version defaults to 1)
  Request: `{ name, description?, ruleType, criteria }`
  Response: `{ id, name, ruleType, criteria, version, isActive, createdAt }`
  Auth: required

- **GET /api/rules** — List all active Rules with optional filter by ruleType
  Query params: `ruleType`
  Response: `{ rules: [{ id, name, ruleType, version, isActive, createdAt }] }`
  Auth: required

- **GET /api/rules/:id** — Get a Rule by ID including version history (all versions sharing same root)
  Response: `{ rule: { ...fields }, versions: [{ id, version, isActive, createdAt }] }`
  Auth: required

- **PUT /api/rules/:id** — Update a Rule by creating a new version; previous version is set to isActive: false
  Request: `{ name?, description?, criteria? }`
  Response: new Rule version record with incremented version number; previous version preserved with isActive: false
  Auth: required

## Acceptance Criteria
- [ ] POST /api/rules creates a Rule at version 1 and returns 201
- [ ] PUT /api/rules/:id creates a new version record (version N+1, isActive: true) and sets the previous record to isActive: false; old version remains retrievable
- [ ] GET /api/rules returns only isActive: true records unless version history is requested
- [ ] All endpoints return 401 without a valid JWT
