# [DATABASE] Audit & Events

## User Story
As a system I need an AuditEvent model so that every Offer state transition, Rule change, and Transaction redemption is logged with actor, timestamp, and before/after snapshot for end-to-end auditability.

## Assignment Order
Step 6 of 21 — assign after: [DATABASE] Member APIs is merged
Tier: DATABASE — extension slice 7

## Context
Pre-built models from copilot-instructions.md:
- User model — do not modify
Previously added models:
- Sponsor, Offer (from [DATABASE] Offer Lifecycle Management)
- Rule (from [DATABASE] Rules & Eligibility)
- Purse (from [DATABASE] Purse & Sponsor Configuration)
- Syndicator, SyndicatorEvent (from [DATABASE] Syndicator Notifications & Reporting)
- Clip (from [DATABASE] Member APIs)
This issue adds the AuditEvent model used across all slices for the end-to-end audit trail.

## Models to Add

**Enums**
```
enum AuditAction {
  OFFER_CREATED
  OFFER_UPDATED
  OFFER_STATE_CHANGED
  RULE_CREATED
  RULE_UPDATED
  CLIP_CREATED
  CLIP_UNCLIPPED
  REDEMPTION_APPLIED
  REVERSAL_APPLIED
  ADJUSTMENT_APPLIED
}
```

**AuditEvent**
- id: String @id @default(cuid()) — unique identifier
- action: AuditAction — type of audit action
- entityType: String — e.g. "Offer", "Rule", "Clip"
- entityId: String — ID of the affected entity
- actorId: String? — ID of the user or system that performed the action
- beforeState: String? — JSON snapshot of entity state before change
- afterState: String? — JSON snapshot of entity state after change
- metadata: String? — additional context (e.g. transaction ID, merchant ID)
- createdAt: DateTime @default(now())

## Relationships
- AuditEvent is standalone (no Prisma-level FK enforced — entityId and actorId are flexible string references to support different entity types)

## Seed Data
Add realistic sample data to src/backend/prisma/seed.ts so the app is
usable immediately after migration — never leave domain tables empty.

**AuditEvents** — add 5 records:
- action: OFFER_CREATED, entityType: "Offer", entityId: (id of "10% Off Groceries"), actorId: (test user id), afterState: `{"status":"DRAFT"}`
- action: OFFER_STATE_CHANGED, entityType: "Offer", entityId: (id of "10% Off Groceries"), actorId: (test user id), beforeState: `{"status":"DRAFT"}`, afterState: `{"status":"CONFIGURED"}`
- action: OFFER_STATE_CHANGED, entityType: "Offer", entityId: (id of "10% Off Groceries"), actorId: (test user id), beforeState: `{"status":"CONFIGURED"}`, afterState: `{"status":"ACTIVE"}`
- action: CLIP_CREATED, entityType: "Clip", entityId: (id of clip for test user on "10% Off Groceries"), actorId: (test user id), afterState: `{"status":"ACTIVE"}`
- action: REDEMPTION_APPLIED, entityType: "Clip", entityId: (id of clip for test user on "10% Off Groceries"), actorId: (test user id), metadata: `{"amountSaved":5.50,"merchant":"FreshMart"}`

Seed data is required for:
- Frontend to show real audit log entries after login (not an empty log)
- Playwright tests to verify audit trail entries exist

## Acceptance Criteria
- [ ] Migration runs without errors
- [ ] AuditEvent model created with correct fields and AuditAction enum
- [ ] Seed data populates at least 5 AuditEvent records covering OFFER_CREATED, OFFER_STATE_CHANGED, CLIP_CREATED, and REDEMPTION_APPLIED actions
- [ ] Pre-built User model and previously added models unchanged
