# [DATABASE] Offer Lifecycle Management

## User Story
As a system I need Sponsor and Offer models with full lifecycle state support so that Operations Admins can create, configure, and manage Offers through their complete Draft → Configured → Active → Suspended → Expired → Archived lifecycle.

## Assignment Order
Step 1 of 21 — assign after: nothing (assign this first)
Tier: DATABASE — primary slice

## Context
Pre-built models from copilot-instructions.md:
- User model (src/backend/prisma/schema.prisma) — do not modify
This issue adds the Sponsor and Offer models required for the primary Offer lifecycle slice.

## Models to Add

**Sponsor**
- id: String @id @default(cuid()) — unique identifier
- name: String — sponsor organisation name
- branding: String? — branding/logo URL or descriptor
- reportingPartition: String? — identifier used to isolate reporting data
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt

**Enums**
```
enum OfferStatus {
  DRAFT
  CONFIGURED
  ACTIVE
  SUSPENDED
  EXPIRED
  ARCHIVED
}

enum OfferType {
  AMOUNT_OFF
  PERCENTAGE_OFF
  FIXED_PRICE
  TIERED
  CAPPED
}

enum OfferSource {
  MANUAL
  INGESTED
}
```

**Offer**
- id: String @id @default(cuid()) — unique identifier
- name: String — offer display name
- description: String — offer description
- brand: String? — brand associated with offer
- offerType: OfferType — discount model
- discountValue: Float — numeric discount value
- status: OfferStatus @default(DRAFT) — lifecycle state
- source: OfferSource @default(MANUAL) — how the offer was created
- syndicatorRef: String? — external reference for ingested offers
- sponsorId: String — FK to Sponsor
- effectiveDate: DateTime — when offer becomes effective
- expirationDate: DateTime? — optional expiration date
- depletionLimit: Int? — optional maximum redemptions
- channels: String? — applicable channels (JSON string)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt

## Relationships
- Sponsor has many Offers
- Offer belongs to one Sponsor

## Seed Data
Add realistic sample data to src/backend/prisma/seed.ts so the app is
usable immediately after migration — never leave domain tables empty.

**Sponsors** — add 3 records:
- name: "GroceryCo", reportingPartition: "groceryco-001"
- name: "FuelPlus", reportingPartition: "fuelplus-001"
- name: "TechDeals", reportingPartition: "techdeals-001"

**Offers** — add 6 records covering multiple statuses and types:
- name: "10% Off Groceries", offerType: PERCENTAGE_OFF, discountValue: 10, status: ACTIVE, sponsor: GroceryCo, effectiveDate: (today - 7 days), expirationDate: (today + 30 days)
- name: "$5 Off Fuel", offerType: AMOUNT_OFF, discountValue: 5, status: ACTIVE, sponsor: FuelPlus, effectiveDate: (today - 3 days), expirationDate: (today + 14 days)
- name: "Fixed Price Electronics", offerType: FIXED_PRICE, discountValue: 99, status: CONFIGURED, sponsor: TechDeals, effectiveDate: (today + 1 day), expirationDate: (today + 60 days)
- name: "Summer Grocery Bundle", offerType: AMOUNT_OFF, discountValue: 15, status: DRAFT, sponsor: GroceryCo, effectiveDate: (today + 7 days)
- name: "Weekend Fuel Discount", offerType: PERCENTAGE_OFF, discountValue: 8, status: SUSPENDED, sponsor: FuelPlus, effectiveDate: (today - 14 days), expirationDate: (today + 7 days)
- name: "Tech Clearance", offerType: PERCENTAGE_OFF, discountValue: 20, status: EXPIRED, sponsor: TechDeals, effectiveDate: (today - 60 days), expirationDate: (today - 1 day)

Seed data is required for:
- Frontend to show real content after login (not a blank page)
- Playwright tests to find and interact with real records (must include ACTIVE, CONFIGURED, DRAFT, and SUSPENDED offers)

## Acceptance Criteria
- [ ] Migration runs without errors
- [ ] Sponsor and Offer models created with correct fields, enums, and relations
- [ ] Seed data populates at least 3 Sponsors and 6 Offers covering ACTIVE, CONFIGURED, DRAFT, SUSPENDED, and EXPIRED statuses
- [ ] Pre-built User model and test user unchanged
