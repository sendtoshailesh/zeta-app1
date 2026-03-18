# [FRONTEND] Rules & Eligibility

## User Story
As an Operations Admin I want to view, create, and update Eligibility Rules so that I can define reusable policy criteria for Offer targeting.

## Assignment Order
Step 16 of 21 — assign after: [FRONTEND] Offer Lifecycle Management is merged
Tier: FRONTEND — extension slice 1

## Context
Pre-built from copilot-instructions.md:
- Router + auth guard → src/frontend/src/App.tsx (add /rules route)
- Navbar shell → src/frontend/src/components/Navbar.tsx (add "Rules" nav link)
API endpoints available:
- POST /api/rules
- GET /api/rules (with ruleType filter)
- GET /api/rules/:id
- PUT /api/rules/:id

## What to Build

- **RulesPage** — new page at /rules; shows the rule list and a "New Rule" button
- **RuleList** — table/card list of active Rules showing name, ruleType, version, and creation date
- **RuleForm** — modal or inline form for creating a new Rule; fields: name, description (optional), ruleType (select), criteria (JSON textarea)
- **RuleVersionBadge** — small badge showing the current version number (e.g. "v2")

## data-testid Values
Every interactive and key display element must have a data-testid.
Playwright tests will use these — list them explicitly:
- `rule-list` — on the RuleList container
- `rule-card` — on each rule row/card (multiple)
- `rule-version-badge` — on the RuleVersionBadge for each rule
- `create-rule-button` — on the "New Rule" button
- `rule-name-input` — on the name field in RuleForm
- `rule-type-select` — on the ruleType dropdown in RuleForm
- `rule-criteria-input` — on the criteria JSON textarea in RuleForm
- `rule-form-submit` — on the Create button in RuleForm
- `update-rule-button` — on the "Update / New Version" button per rule card

## Acceptance Criteria
- [ ] /rules page renders the seeded Rules list with name, ruleType, and version badge
- [ ] Creating a new Rule via RuleForm calls POST /api/rules and the new rule appears in the list at version 1
- [ ] Clicking "Update / New Version" on a rule opens RuleForm pre-populated with existing criteria; submitting calls PUT /api/rules/:id and the version badge increments
- [ ] All data-testid values listed above are present on the correct elements
