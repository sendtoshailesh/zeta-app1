# Agentic SDLC Workshop — Participant Guide

**Duration:** 2-3 hours
**Surface:** github.com/copilot/agents

---

## What You Are Building

You will take a single feature requirement through the entire SDLC —
from a business requirement to tested, working code — using AI agents
at every step.

Every step is driven by an agent. Your job is to guide, review and merge.

---

## How Agents Work

Agents are **not chat assistants**. They work autonomously in the background.

```
You assign a task to an agent on github.com
Agent reads the repo, does the work, raises a Pull Request
You review the PR and merge
Next person picks up from there
```

To assign a task:
1. Go to `github.com` → your repo
2. Click **Copilot** in the top nav → **Agents**
3. Select the agent from the dropdown
4. Type your instruction
5. Wait — the agent works in the background

---

## Test Credentials

Pre-loaded via seed data — used by all agents and tests.
Check `.github/copilot-instructions.md` in your repo for credentials.

---

## Implementation Order — Why It Matters

```
DATABASE first   ← schema must exist before API can reference models
BACKEND second   ← API must exist before frontend can fetch data
FRONTEND third   ← UI connects to working API
TESTS last       ← E2E tests run against the complete working app
```

Running out of order causes import errors and missing tables.
If something is broken — check the order first.

---

## Role Instructions

---

### 🟦 PM — Product Manager

**Your agents:** `brd-agent`, `user-story-agent`
**Your surface:** github.com

---

**Step 1 — Create the BRD**

The facilitator has created Issue #1 with the feature requirement.

1. Go to github.com → Copilot → Agents
2. Select **brd-agent**
3. Type: `Create a BRD from Issue #1`
4. Wait for the agent to raise a PR
5. Open the PR → review `docs/requirements/BRD.md`
6. Check: are functional requirements clear and numbered (FR-001 etc.)?
   Is out of scope explicit?
7. Merge the PR

---

**Step 2 — Create User Stories**

1. Select **user-story-agent**
2. Type: `Create GitHub Issues from the BRD`
3. Wait — the agent reads the BRD, identifies functional slices,
   and writes one issue file per role per slice into `issues/`
4. Review the PR → check each file in the `issues/` folder:
   - Does each issue cover one functional slice only?
   - Does each issue have 2-4 specific acceptance criteria?
   - Is the scope small enough to complete in half a day?
5. Merge the PR
6. GitHub Actions triggers → creates GitHub Issues with labels automatically
7. Go to Issues tab → verify Issues exist with correct labels
8. Hand off to Architect — tell them the Issues are ready

> **Why a PR first?**
> The PR is your review gate. You see what Issues will be created
> before they exist. This is the Human-in-the-Loop checkpoint.

---

**What Good Looks Like**

- BRD has numbered functional requirements (FR-001, FR-002...)
- Each Issue covers one functional slice — not everything at once
- Each Issue has 2-4 specific, verifiable acceptance criteria
- Issues are labelled correctly (database, backend, frontend, playwright)

---

### 🟨 Architect — Solution Architect

**Your agent:** `design-agent`
**Your surface:** github.com
**Your tool:** Also assigns the [DATABASE] Issue to Copilot Coding Agent

---

**Step 1 — Create the Design Document**

Wait for PM to confirm Issues are created.

1. Go to github.com → Copilot → Agents
2. Select **design-agent**
3. Type: `Create design document and schema from the BRD and user story Issues`
4. Wait for the agent to raise a PR with:
   - `docs/design/design-doc.md`
   - `src/prisma/schema.prisma`
5. Review both files:
   - Does the schema match the [DATABASE] Issue models?
   - Are all data-testid values listed in the component tree?
   - Do API endpoints match the [BACKEND] Issue spec?
6. Merge the PR

---

**Step 2 — Assign the DATABASE Issue**

1. Go to Issues → find the `[DATABASE]` Issue for the primary slice
2. Right panel → **Assignees** → assign to **Copilot**
3. Wait for Copilot to raise a PR with the Prisma migration
4. Review: correct models, fields, and relations?
5. Merge the PR — this unblocks Backend Dev

---

**What Good Looks Like**

- Schema models match exactly what the [DATABASE] Issue specifies
- Design doc has component tree with data-testid values listed
- Pre-existing models marked `// PRE-BUILT — do not modify`
- API endpoints in design doc match [BACKEND] Issue

---

### 🟩 Backend Developer

**Your surface:** github.com
**Your tool:** Assigns the [BACKEND] Issue to Copilot Coding Agent

---

**Step 1 — Wait for DATABASE PR to merge**

Schema models must exist before the API can reference them.

---

**Step 2 — Assign the BACKEND Issue**

1. Go to Issues → find the `[BACKEND]` Issue for the primary slice
2. Right panel → **Assignees** → assign to **Copilot**
3. Wait for Copilot to raise a PR with the API implementation
4. Review the PR — focus on three things:
   - Auth middleware applied to all protected routes?
   - Response shapes match the [BACKEND] Issue spec?
   - Correct HTTP status codes returned?
5. Test locally: `cd src/backend && npm run dev`
6. Merge the PR

---

**What Good Looks Like**

- All endpoints from the [BACKEND] Issue are implemented
- Protected endpoints return 401 without a valid JWT
- Response shapes match what the Issue specifies

---

### 🟧 UI Developer

**Your surface:** github.com
**Your tool:** Assigns the [FRONTEND] Issue to Copilot Coding Agent

---

**Step 1 — Wait for BACKEND PR to merge**

The frontend fetches from the API — the API must exist first.

---

**Step 2 — Assign the FRONTEND Issue**

1. Go to Issues → find the `[FRONTEND]` Issue for the primary slice
2. Right panel → **Assignees** → assign to **Copilot**
3. Wait for Copilot to raise a PR with the UI implementation
4. Review the PR — focus on three things:
   - Are all data-testid values from the Issue present?
   - Does the UI fetch real data from the API?
   - Does the user journey from the Issue work end to end?
5. Test locally: `cd src/frontend && npm run dev`
6. Walk through the user journey manually to verify
7. Merge the PR

---

**What Good Looks Like**

- UI fetches real data from the API — no placeholders
- User can complete the journey described in the [FRONTEND] Issue
- All data-testid values from the Issue are present on correct elements

---

### 🟥 QA Engineer

**Your agent:** `playwright-agent`
**Your surface:** github.com

---

**Step 1 — Wait for FRONTEND PR to merge**

Both backend and frontend must be merged and running locally.

---

**Step 2 — Generate Playwright Tests**

1. Go to github.com → Copilot → Agents
2. Select **playwright-agent**
3. Type: `Generate Playwright E2E tests from the [PLAYWRIGHT] Issue`
4. Wait for the agent to raise a PR with test files in `e2e/`
5. Review the PR:
   - Does the test follow the journey in the [PLAYWRIGHT] Issue?
   - Are all selectors using data-testid only — no CSS classes?
6. Merge the PR

---

**Step 3 — Run the Tests**

Ensure both servers are running:
```bash
# Terminal 1
cd src/backend && npm run dev

# Terminal 2
cd src/frontend && npm run dev

# Terminal 3 — run tests
cd src/frontend
npx playwright test --ui
```

The `--ui` flag opens Playwright's visual runner — watch the browser
execute the journey in real time. This is the workshop closing demo.

---

**What Good Looks Like**

- Tests use `data-testid` selectors only — no CSS classes or text
- Journey in tests matches the [PLAYWRIGHT] Issue step by step
- Playwright report shows all green

---

## Quick Reference

| Agent | Owner | Input | Output |
|-------|-------|-------|--------|
| brd-agent | PM | Issue #1 | BRD.md PR |
| user-story-agent | PM | BRD.md | Issue files → PR → GitHub Issues |
| design-agent | Architect | BRD + Issues | design-doc + schema PR |
| Copilot (DATABASE) | Architect | [DATABASE] Issue | Migration PR |
| Copilot (BACKEND) | Backend Dev | [BACKEND] Issue | API implementation PR |
| Copilot (FRONTEND) | UI Dev | [FRONTEND] Issue | UI implementation PR |
| playwright-agent | QA | [PLAYWRIGHT] Issue | E2E tests PR |

---

## Extension Slices

If your group completes the primary slice with time to spare,
the PM can trigger `user-story-agent` to generate extension slice Issues.
The pipeline repeats from the Architect step with the new Issues.

The [PLAYWRIGHT] Issue already includes an optional extension journey section
— the QA Engineer can extend tests without a new Issue.
