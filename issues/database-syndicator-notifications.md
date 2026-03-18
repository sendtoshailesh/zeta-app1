# [DATABASE] Syndicator Notifications & Reporting

## User Story
As a system I need Syndicator and SyndicatorEvent models so that the engine can record outbound clip/unclip notifications and track provider acknowledgements and redemption reporting data.

## Assignment Order
Step 4 of 21 — assign after: [DATABASE] Purse & Sponsor Configuration is merged
Tier: DATABASE — extension slice 4

## Context
Pre-built models from copilot-instructions.md:
- User model — do not modify
Previously added models:
- Sponsor, Offer (from [DATABASE] Offer Lifecycle Management)
- Rule (from [DATABASE] Rules & Eligibility)
- Purse (from [DATABASE] Purse & Sponsor Configuration)
This issue adds Syndicator and SyndicatorEvent models for notification and reporting tracking.

## Models to Add

**Enums**
```
enum SyndicatorEventType {
  CLIP
  UNCLIP
  DEPLETION
  REDEMPTION
}

enum SyndicatorEventStatus {
  PENDING
  SENT
  ACKNOWLEDGED
  FAILED
  RETRYING
}
```

**Syndicator**
- id: String @id @default(cuid()) — unique identifier
- name: String — syndicator/provider name
- webhookUrl: String? — endpoint for outbound notifications
- clipSlaSeconds: Int @default(30) — SLA for clip notifications in seconds
- isActive: Boolean @default(true)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt

**SyndicatorEvent**
- id: String @id @default(cuid()) — unique identifier
- syndicatorId: String — FK to Syndicator
- offerId: String — FK to Offer
- eventType: SyndicatorEventType — type of event (clip, unclip, depletion, redemption)
- status: SyndicatorEventStatus @default(PENDING) — delivery status
- payload: String? — JSON payload sent to syndicator
- providerResponse: String? — response received from provider
- retryCount: Int @default(0)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt

## Relationships
- Syndicator has many SyndicatorEvents
- SyndicatorEvent belongs to one Syndicator and one Offer

## Seed Data
Add realistic sample data to src/backend/prisma/seed.ts so the app is
usable immediately after migration — never leave domain tables empty.

**Syndicators** — add 2 records:
- name: "OfferHub", webhookUrl: "https://api.offerhub.example.com/events", clipSlaSeconds: 15, isActive: true
- name: "PerkStream", webhookUrl: "https://notify.perkstream.example.com/clips", clipSlaSeconds: 30, isActive: true

**SyndicatorEvents** — add 4 records (linked to seeded Offers and Syndicators):
- syndicator: OfferHub, offer: "10% Off Groceries", eventType: CLIP, status: ACKNOWLEDGED
- syndicator: OfferHub, offer: "$5 Off Fuel", eventType: CLIP, status: SENT
- syndicator: PerkStream, offer: "10% Off Groceries", eventType: REDEMPTION, status: ACKNOWLEDGED
- syndicator: PerkStream, offer: "Weekend Fuel Discount", eventType: DEPLETION, status: FAILED, retryCount: 2

Seed data is required for:
- Frontend to show real content after login (not a blank page)
- Playwright tests to find and interact with real records

## Acceptance Criteria
- [ ] Migration runs without errors
- [ ] Syndicator and SyndicatorEvent models created with correct fields, enums, and relations
- [ ] Seed data populates at least 2 Syndicators and 4 SyndicatorEvents covering multiple event types and statuses
- [ ] Pre-built User model and previously added models unchanged
