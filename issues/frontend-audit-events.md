# [FRONTEND] Audit & Events

## User Story
As an Operations Admin I want to view the audit log so that I can review the complete history of Offer state changes, Rule updates, and redemption events for compliance and troubleshooting.

## Assignment Order
Step 20 of 21 — assign after: [FRONTEND] Member APIs is merged
Tier: FRONTEND — extension slice 7

## Context
Pre-built from copilot-instructions.md:
- Router + auth guard → src/frontend/src/App.tsx (add /audit route)
- Navbar shell → src/frontend/src/components/Navbar.tsx (add "Audit Log" nav link)
API endpoints available:
- GET /api/audit (with entityType, entityId, action, actorId, from, to filters)
- GET /api/audit/:entityType/:entityId

## What to Build

- **AuditPage** — new page at /audit; shows the full audit log with filter controls
- **AuditLogList** — scrollable list of AuditEvents showing action, entityType, entityId, actorId, and createdAt timestamp, ordered by most recent first
- **AuditEventRow** — row component for each event showing a coloured action badge, entity reference, and timestamp
- **AuditFilters** — filter controls: entityType dropdown, action dropdown, date range pickers (from / to)

## data-testid Values
Every interactive and key display element must have a data-testid.
Playwright tests will use these — list them explicitly:
- `audit-log-list` — on the AuditLogList container
- `audit-event-row` — on each AuditEventRow (multiple)
- `audit-action-badge` — on the action badge per event row
- `audit-filter-entity-type` — on the entityType filter dropdown
- `audit-filter-action` — on the action filter dropdown
- `audit-filter-from-date` — on the from-date picker input
- `audit-filter-to-date` — on the to-date picker input

## Acceptance Criteria
- [ ] /audit page renders the seeded AuditEvent records ordered by createdAt descending (most recent first)
- [ ] Filtering by entityType="Offer" returns only Offer-related events; the list updates without a page reload
- [ ] Each event row displays the action, entityType, entityId, and timestamp
- [ ] All data-testid values listed above are present on the correct elements
