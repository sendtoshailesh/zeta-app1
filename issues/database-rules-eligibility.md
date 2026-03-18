# [DATABASE] Rules & Eligibility

## User Story
As a system I need a Rule model with versioning support so that Operations Admins can define, save, and reuse Eligibility Policies across multiple Offers.

## Assignment Order
Step 2 of 21 — assign after: [DATABASE] Offer Lifecycle Management is merged
Tier: DATABASE — extension slice 1

## Context
Pre-built models from copilot-instructions.md:
- User model — do not modify
Previously added models:
- Sponsor, Offer (from [DATABASE] Offer Lifecycle Management)
This issue adds the Rule model required for eligibility policy management.

## Models to Add

**Enums**
```
enum RuleType {
  PRODUCT_CATEGORY
  MERCHANT_LOCATION
  MEMBER_ATTRIBUTE
  PURSE_MAPPING
  PRIORITY
}
```

**Rule**
- id: String @id @default(cuid()) — unique identifier
- name: String — human-readable rule name
- description: String? — rule description
- ruleType: RuleType — category of eligibility rule
- criteria: String — JSON string defining rule criteria (products, merchants, member attributes, etc.)
- version: Int @default(1) — version number; increments on each update
- parentRuleId: String? — FK to parent Rule (previous version)
- isActive: Boolean @default(true) — whether this version is current
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt

## Relationships
- Rule optionally references a parent Rule (self-relation for versioning)

## Seed Data
Add realistic sample data to src/backend/prisma/seed.ts so the app is
usable immediately after migration — never leave domain tables empty.

**Rules** — add 4 records:
- name: "Grocery Category Inclusion", ruleType: PRODUCT_CATEGORY, criteria: `{"categories":["groceries","fresh-produce"],"action":"include"}`, version: 1, isActive: true
- name: "Fuel Station Merchant Rule", ruleType: MERCHANT_LOCATION, criteria: `{"merchantTypes":["fuel-station","petrol"],"action":"include"}`, version: 1, isActive: true
- name: "Electronics Category Rule", ruleType: PRODUCT_CATEGORY, criteria: `{"categories":["electronics","computers"],"action":"include"}`, version: 2, isActive: true (with a version 1 parent record set to isActive: false)
- name: "Premium Member Eligibility", ruleType: MEMBER_ATTRIBUTE, criteria: `{"attribute":"memberTier","values":["premium","gold"]}`, version: 1, isActive: true

Seed data is required for:
- Frontend to show real content after login (not a blank page)
- Playwright tests to find and interact with real records

## Acceptance Criteria
- [ ] Migration runs without errors
- [ ] Rule model created with correct fields, enums, and self-relation for versioning
- [ ] Seed data populates at least 4 Rule records including one with a parent version
- [ ] Pre-built User model and previously added models unchanged
