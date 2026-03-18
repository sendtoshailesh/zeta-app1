# [DATABASE] Purse & Sponsor Configuration

## User Story
As a system I need a Purse model so that Operations Admins can configure Benefit Purses of standard and Perks-only types and associate them with Sponsors.

## Assignment Order
Step 3 of 21 — assign after: [DATABASE] Rules & Eligibility is merged
Tier: DATABASE — extension slice 2

## Context
Pre-built models from copilot-instructions.md:
- User model — do not modify
Previously added models:
- Sponsor, Offer (from [DATABASE] Offer Lifecycle Management)
- Rule (from [DATABASE] Rules & Eligibility)
This issue adds the Purse model and extends Sponsor with ownership/limit configuration.

## Models to Add

**Enums**
```
enum PurseType {
  STANDARD
  PERKS_ONLY
}
```

**Purse**
- id: String @id @default(cuid()) — unique identifier
- name: String — purse display name
- purseType: PurseType — whether this is a standard or Perks-only purse
- productCategories: String? — JSON string of applicable product/category mappings
- sponsorId: String — FK to Sponsor (owning sponsor)
- maxDiscountPerTransaction: Float? — optional per-transaction discount cap
- maxDiscountPerDay: Float? — optional daily discount cap
- isActive: Boolean @default(true)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt

## Relationships
- Sponsor has many Purses
- Purse belongs to one Sponsor

## Seed Data
Add realistic sample data to src/backend/prisma/seed.ts so the app is
usable immediately after migration — never leave domain tables empty.

**Purses** — add 4 records (linked to seeded Sponsors):
- name: "GroceryCo Standard Purse", purseType: STANDARD, sponsor: GroceryCo, productCategories: `["groceries","fresh-produce"]`, maxDiscountPerTransaction: 50.0
- name: "FuelPlus Perks Purse", purseType: PERKS_ONLY, sponsor: FuelPlus, productCategories: `["fuel"]`, maxDiscountPerTransaction: 20.0
- name: "TechDeals Perks Purse", purseType: PERKS_ONLY, sponsor: TechDeals, productCategories: `["electronics"]`, maxDiscountPerTransaction: 100.0
- name: "GroceryCo Perks Purse", purseType: PERKS_ONLY, sponsor: GroceryCo, productCategories: `["groceries"]`, maxDiscountPerTransaction: 30.0, maxDiscountPerDay: 60.0

Seed data is required for:
- Frontend to show real content after login (not a blank page)
- Playwright tests to find and interact with real records

## Acceptance Criteria
- [ ] Migration runs without errors
- [ ] Purse model created with correct fields, PurseType enum, and Sponsor relation
- [ ] Seed data populates at least 4 Purse records including at least 1 STANDARD and 2 PERKS_ONLY
- [ ] Pre-built User model and previously added models unchanged
