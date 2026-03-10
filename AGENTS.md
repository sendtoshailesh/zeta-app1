# AGENTS.md

Instructions for GitHub Copilot Coding Agent when assigned a GitHub Issue.

## Before You Start
Read these files first — in this order:
1. `.github/copilot-instructions.md` — project context and standards
2. The assigned GitHub Issue — requirements and acceptance criteria
3. `docs/design/design-doc.md` — architecture and API contracts (if it exists)
4. `src/backend/prisma/schema.prisma` — current data model

## What Is Pre-built — Do Not Touch
- `src/backend/middleware/auth.ts` — JWT middleware
- `src/backend/routes/auth.ts` — login and register routes
- `src/backend/index.ts` — Express app entry point
- `src/frontend/src/App.tsx` — React Router and auth guard
- `src/frontend/src/pages/LoginPage.tsx`
- `src/frontend/src/pages/RegisterPage.tsx`
- `src/backend/prisma/schema.prisma` User model — do not modify the User model

## Issue Assignment Guide

### [DATABASE] Issues — Architect assigns
You are responsible for:
- Adding new domain models to `src/backend/prisma/schema.prisma`
- Running `npx prisma migrate dev --name {descriptive-name}`
- Running `npx prisma generate`
- Adding domain seed data to `src/backend/prisma/seed.ts` as specified in the Issue
- Running `npx prisma db seed` after adding seed data

**Seed data is mandatory — never skip it.**
The [DATABASE] Issue specifies what sample records to create.
Empty domain tables cause the frontend to show a blank page
and Playwright tests to fail — both break the workshop pipeline.

Do not touch backend or frontend files.

### [BACKEND] Issues — Backend Dev assigns
You are responsible for:
- `src/backend/routes/` — new route files only
- `src/backend/controllers/` — new controller files only
- `src/backend/services/` — new service files only

Always use existing auth middleware on protected routes.
Do not touch frontend files or schema.prisma.

### [FRONTEND] Issues — UI Dev assigns
You are responsible for:
- `src/frontend/src/pages/` — new and updated page files
- `src/frontend/src/components/` — new component files
- `src/frontend/src/context/` — new context files
- `src/frontend/src/services/` — new API service files
- `src/frontend/src/components/Navbar.tsx` — only if the Issue requires changes

**HomePage update — always required:**
`src/frontend/src/pages/HomePage.tsx` currently shows a placeholder.
Replace its content with the primary feature component this Issue builds.
The user must see real feature UI after login — not "Features coming soon".

All interactive elements must have `data-testid` attributes.
The exact `data-testid` values are specified in the Issue.
Do not touch backend files or schema.prisma.

## Implementation Order
Always implement in this order to avoid dependency failures:
1. [DATABASE] — schema + seed data must exist before API can reference models
2. [BACKEND]  — API must exist before frontend can fetch data
3. [FRONTEND] — connects to working API with real data

## PR Conventions
- Link PR to the originating Issue using `Closes #N`
- PR title format: `feat: {feature name} [{issue type}]`
- Run `npm run lint` before raising PR — fix all errors
- Run `npm run build` — confirm it succeeds
- Do not merge your own PR — leave for human review

## Run Commands
```bash
# Backend
cd src/backend && npm run dev

# Frontend
cd src/frontend && npm run dev

# Database
npx prisma migrate dev
npx prisma generate
npx prisma db seed

# Tests
npm run test
npx playwright test
```
