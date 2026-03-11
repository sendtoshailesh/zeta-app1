---
name: create-brd
description: Creates a Business Requirements Document from a requirement Issue or text.
  Use this when asked to create a BRD, analyse requirements, or produce a business
  requirements document from an Issue or requirement text.
---

# Skill — Create BRD

## What You Do
Read the requirement and produce a complete BRD that is **faithful to the
domain model, entities, and terminology in the source requirement**.
Do not substitute your own interpretation for the domain the requirement defines.
If the requirement names specific entities (e.g. "Offer", "Member", "Clip"),
use those exact names — do not rename them to generic equivalents.
Do not ask clarifying questions — make reasonable assumptions and document them.

## Steps
1. Read the requirement text or GitHub Issue provided in full before writing anything
2. Extract the domain model — list every named entity, its states/lifecycle, and the actions users perform on it
3. Identify user roles — use the exact role names from the requirement; do not invent generic substitutes
4. Identify functional requirements — derive them from the domain model and named user actions
5. Identify non-functional requirements — if not stated, apply sensible defaults
6. Define scope — what is in and what is out, using the requirement's own framing
7. Document assumptions — where the requirement was unclear and what was assumed
8. Produce the BRD in the format below
9. Save as `docs/requirements/BRD.md`

## BRD Format

```markdown
# Business Requirements Document
**Project:** [App Name]
**Date:** [Today]
**Source:** [Issue number or requirement text reference]

## 1. Summary
One paragraph describing what the application does.

## 2. User Roles
| Role | Description |
|------|-------------|
| [Role] | [What they do] |

## 3. In Scope
- [Feature 1]
- [Feature 2]

## 4. Out of Scope
- [Explicitly excluded feature]

## 5. Functional Requirements
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-001 | [Requirement] | [2 testable criteria] |

## 6. Non-Functional Requirements
| ID | Category | Requirement |
|----|----------|-------------|
| NFR-001 | Security | JWT authentication on all protected routes |
| NFR-002 | Performance | Page load under 3 seconds |
| NFR-003 | Usability | Responsive — works on desktop and mobile |

## 7. Assumptions
- [Assumption 1 — what was unclear and what was assumed]
- [Assumption 2]
```

## Functional Requirements — How to Extract Them
1. **Use the requirement's own domain model** — identify the named entities,
   their states/lifecycles, and the actions users perform on them.
2. **Preserve lifecycle states verbatim** — if the requirement defines states
   (e.g. `Draft → Active → Expired`), reproduce them exactly as requirements.
3. **Preserve business rules verbatim** — if the requirement defines explicit rules
   (e.g. "discounts applied before purse deductions"), capture them as FRs.
4. **Use the requirement's role names** — do not invent generic substitutes.
   If the requirement names "Member" and "Sponsor", use those — not "Employee" and "Admin".
5. Only after extracting domain-specific requirements, check if generic concerns apply:
   - Is authentication implied? (if users are mentioned, likely yes)
   - Are there CRUD operations on the domain entities?
   - Are there role-based access controls?

## Do Not Do This
- Do NOT rename domain entities to generic equivalents
  (e.g. do not rename "Member" → "Employee", "Offer" → "Perk", "Clip" → "Claim")
- Do NOT reduce a complex domain to a simple catalogue + form pattern
  unless the requirement actually describes that
- Do NOT invent a simpler domain model because the requirement is complex —
  complexity in the requirement must be reflected in the BRD
- Do NOT discard explicit lifecycle states or business rules as "out of scope"
  unless the requirement itself says so

## Non-Functional Requirement Defaults
Apply these if the requirement does not state otherwise:
- Security: JWT authentication for protected routes
- Performance: Page load under 3 seconds
- Usability: Responsive design for desktop and mobile

## Examples

### Example 1 — Domain Preservation (Perks Engine)

If the requirement says:
> "Members can clip Offers. Clipped Offers are evaluated during a Transaction
> to compute Discounts before Purse deductions. Offers have states:
> Draft → Configured → Active → Suspended → Expired → Archived."

The BRD MUST:
- Name entities as: `Member`, `Offer`, `Clip`, `Transaction`, `Discount`, `Purse`
- Name the user role as: `Member` (not "Employee")
- Include FR: Member can clip/unclip an Offer (not "claim a perk")
- Include FR: Offer lifecycle follows states Draft → Configured → Active → Suspended → Expired → Archived
- Include business rule as FR: Discounts are applied before Purse deductions

The BRD must NOT say:
- Entities: `User`, `Perk`, `Claim`
- Role: `Employee`
- FR: "Employee can claim a perk"

### Example 2 — Simple Catalogue App (Food Ordering)

Requirement:
> "We want to build an online food ordering platform. Customers browse
> restaurants, view menus and add items to a cart."

Produces:

**User Roles:** Customer, Restaurant Admin
**In Scope:** Browse restaurants, view menus, cart management
**Out of Scope:** Payment processing (not mentioned — assumed out of scope)
**Assumptions:** Auth required as customers need persistent carts;
payment out of scope as not mentioned in requirement
