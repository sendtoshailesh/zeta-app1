# [BACKEND] Audit & Events

## User Story
As an Operations Admin I want to query the audit trail for Offer state changes, Rule updates, and redemption events so that I can review the full history of any entity and satisfy compliance requirements.

## Assignment Order
Step 14 of 21 — assign after: [BACKEND] Member APIs is merged
Tier: BACKEND — extension slice 7

## Context
Pre-built from copilot-instructions.md:
- JWT auth middleware → src/backend/middleware/auth.ts
Previously added models:
- AuditEvent (from [DATABASE] Audit & Events)
This issue adds audit trail query endpoints and ensures audit events are written by all other controllers.
All endpoints are protected and require a valid JWT.

**Note on route registration:** Register `/api/audit` before any parameterised routes in index.ts to avoid path conflicts.

## API Endpoints

- **GET /api/audit** — Query audit events with optional filters
  Query params: `entityType?`, `entityId?`, `action?`, `actorId?`, `from?` (ISO date), `to?` (ISO date)
  Response: `{ events: [{ id, action, entityType, entityId, actorId, beforeState, afterState, metadata, createdAt }] }`
  Results ordered by createdAt descending (most recent first).
  Auth: required

- **GET /api/audit/:entityType/:entityId** — Get full audit trail for a specific entity
  Response: `{ events: [{ id, action, actorId, beforeState, afterState, metadata, createdAt }] }`
  Auth: required

## Controller Integration
The following controllers must write AuditEvent records as part of their operations (add this behaviour to the existing controllers from previous slices):
- Offer CRUD controller: write OFFER_CREATED on POST, OFFER_UPDATED on PUT (with before/after snapshot), OFFER_STATE_CHANGED on PATCH /status
- Rule controller: write RULE_CREATED on POST, RULE_UPDATED on PUT
- Clip controller: write CLIP_CREATED on POST /member/clips, CLIP_UNCLIPPED on DELETE /member/clips/:offerId
- Transaction evaluation controller: write REDEMPTION_APPLIED when a Perk discount is applied

## Acceptance Criteria
- [ ] GET /api/audit with entityType and entityId filters returns only matching events in descending createdAt order
- [ ] GET /api/audit/:entityType/:entityId returns the complete trail for that entity including all action types
- [ ] Performing a PATCH /api/offers/:id/status state transition creates a corresponding OFFER_STATE_CHANGED AuditEvent with correct beforeState and afterState snapshots
- [ ] All endpoints return 401 without a valid JWT
