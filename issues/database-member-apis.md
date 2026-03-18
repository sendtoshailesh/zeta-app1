# [DATABASE] Member APIs

## User Story
As a system I need a Clip model so that Member clip and unclip operations are persisted with correct state, enabling eligibility checks during transaction evaluation and redemption history queries.

## Assignment Order
Step 5 of 21 — assign after: [DATABASE] Syndicator Notifications & Reporting is merged
Tier: DATABASE — extension slice 6

## Context
Pre-built models from copilot-instructions.md:
- User model — do not modify; Member identity is represented by the existing User model
Previously added models:
- Sponsor, Offer (from [DATABASE] Offer Lifecycle Management)
- Rule (from [DATABASE] Rules & Eligibility)
- Purse (from [DATABASE] Purse & Sponsor Configuration)
- Syndicator, SyndicatorEvent (from [DATABASE] Syndicator Notifications & Reporting)
This issue adds the Clip model for Member clip/unclip state.

## Models to Add

**Enums**
```
enum ClipStatus {
  ACTIVE
  UNCLIPPED
  EXHAUSTED
  EXPIRED
}
```

**Clip**
- id: String @id @default(cuid()) — unique identifier
- userId: Int — FK to User (the Member who clipped)
- offerId: String — FK to Offer
- status: ClipStatus @default(ACTIVE) — current clip state
- redemptionCount: Int @default(0) — number of times this clip has been redeemed
- maxRedemptions: Int? — optional clip redemption limit
- clippedAt: DateTime @default(now())
- unclippedAt: DateTime? — timestamp of unclip action
- updatedAt: DateTime @updatedAt

## Relationships
- User has many Clips
- Offer has many Clips
- Clip belongs to one User and one Offer
- @@unique([userId, offerId]) — a Member can only clip an Offer once

## Seed Data
Add realistic sample data to src/backend/prisma/seed.ts so the app is
usable immediately after migration — never leave domain tables empty.

**Clips** — add 3 records for the test user (test@example.com, userId from seeded User):
- userId: (test user id), offerId: "10% Off Groceries" (ACTIVE offer), status: ACTIVE, redemptionCount: 1
- userId: (test user id), offerId: "$5 Off Fuel" (ACTIVE offer), status: ACTIVE, redemptionCount: 0
- userId: (test user id), offerId: "Tech Clearance" (EXPIRED offer), status: EXPIRED, redemptionCount: 2

Seed data is required for:
- Frontend to show real clipped state for the test user immediately after login
- Playwright tests to verify clip/unclip operations using real data
- At least one ACTIVE clip on an ACTIVE offer must exist so Playwright can verify the unclip and clip operations

## Acceptance Criteria
- [ ] Migration runs without errors
- [ ] Clip model created with correct fields, ClipStatus enum, unique constraint, and relations to User and Offer
- [ ] Seed data populates at least 3 Clip records for the test user including at least 1 ACTIVE clip on an ACTIVE offer
- [ ] Pre-built User model and previously added models unchanged
