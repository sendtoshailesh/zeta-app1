# Workshop Verification Checklist

Use this checklist to verify the full end-to-end setup before and after the workshop pipeline.
Run through each section in order — do not skip ahead.

---

## Section 1 — Install Dependencies & Build

```bash
# Backend
cd src/backend
npm install
npm run build

# Frontend
cd src/frontend
npm install
npm run build
```

**Expected output:**
```
✅ Backend build completes with no errors
✅ Frontend build completes with no errors
✅ No TypeScript errors
✅ No missing module errors
```

---

## Section 2 — Database Setup

```bash
cd src/backend

# Generate Prisma client
npx prisma generate

# Run migration
npx prisma migrate dev

# Seed database
npx prisma db seed
```

**Expected output:**
```
✅ prisma generate — "Generated Prisma Client"
✅ migrate dev     — "All migrations have been applied" or "Migration applied successfully"
✅ db seed         — "Seed complete — test user ready"
```

**Verify migration is clean (User model only at start):**
```bash
# Check migration file contains only expected tables
cat src/backend/prisma/migrations/*/migration.sql | grep "CREATE TABLE"
```

Expected at workshop start:
```
✅ CREATE TABLE "User"   — present
❌ No other tables       — if you see Room, Booking etc, run reset script
```

Expected after DATABASE Issues merged:
```
✅ CREATE TABLE "User"
✅ CREATE TABLE domain models (e.g. Room, Booking)
```

---

## Section 3 — Start Both Servers

Open two terminals:

```bash
# Terminal 1 — Backend
cd src/backend && npm run dev
```

```bash
# Terminal 2 — Frontend
cd src/frontend && npm run dev
```

**Expected output:**
```
✅ Backend  — "API server running on port 3001"
✅ Frontend — "Local: http://localhost:5173"
✅ No startup errors in either terminal
```

---

## Section 4 — Verify App Starting State

Open browser → `http://localhost:5173`

```
✅ Browser tab title matches VITE_APP_NAME (e.g. "BookIt")
✅ Login page loads
✅ App name shown as H1 on login page
✅ Register link works — registration page loads
```

**Login with test user:**
```
Email:    test@example.com
Password: password123
```

```
✅ Login succeeds — no error message
✅ Redirected to /home after login
✅ Navbar visible with app name and Logout button
✅ HomePage shows "Features coming soon"
✅ Logout button works — redirects to login
```

---

## Section 5 — Verify Auth Protection

```
✅ Navigating to /home without login redirects to /login
✅ Login with wrong password shows error message
✅ Login with unknown email shows error message
```

---

## Section 6 — Verify GitHub Actions Pipeline

Go to GitHub repo → Actions tab

```
✅ create-issues workflow is present
✅ Workflow permissions set to Read and write
   (Settings → Actions → General → Workflow permissions)
✅ ISSUES_TOKEN secret added if using PAT approach
   (Settings → Secrets and variables → Actions)
```

---

## Section 7 — Verify Agents Are Available

Go to GitHub repo → Copilot tab → Agents

```
✅ brd-agent          — visible in dropdown
✅ user-story-agent   — visible in dropdown
✅ design-agent       — visible in dropdown
✅ unit-test-agent    — visible in dropdown
✅ playwright-agent   — visible in dropdown
✅ Copilot Coding Agent available for Issue assignment
```

---

## Section 8 — Post-Pipeline Verification

Run after all Issues (DATABASE, BACKEND, FRONTEND) are merged.

### Database

```bash
cd src/backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

```
✅ Migration applied — domain tables created
✅ Seed complete — test user + domain sample data
```

### Verify Domain Data Seeded

```bash
# Quick check via Prisma Studio (optional)
npx prisma studio
```

```
✅ User table    — test user present
✅ Domain tables — at least 3 sample records each
✅ No empty domain tables
```

### API Endpoints

```bash
# Health check — confirm backend is running
curl http://localhost:3001/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

```
✅ Returns 200 with token and user object
✅ No 500 errors
```

### Frontend Journey

Open browser → `http://localhost:5173`

```
✅ Login → HomePage shows real feature UI (not "Features coming soon")
✅ Navbar has feature navigation items
✅ Primary slice journey works end to end in browser
✅ All data-testid values present on interactive elements
```

---

## Section 9 — Run Playwright Tests

Ensure both servers are running (Section 3), then:

```bash
# From repo root
npx playwright test --ui
```

```
✅ Playwright opens browser UI
✅ Login step passes
✅ Primary journey — all steps green
✅ No selector errors (missing data-testid)
✅ Extension journey passes (if implemented)
```

**If tests fail:**
```
Selector not found    → data-testid missing from component
                        Add to component and re-run

Login fails           → Check test credentials in playwright test
                        Should match test@example.com / password123

Network error         → Confirm backend running on port 3001
                        Confirm frontend proxy config in vite.config.ts

Empty page            → Domain seed data missing
                        Run: npx prisma db seed
```

---

## Section 10 — Reset Verification

After running reset script, verify clean state:

```bash
# Check schema has only User model
grep "model " src/backend/prisma/schema.prisma
```

```
✅ Only "model User" appears — no domain models
```

```bash
# Check migration has only User table
cat src/backend/prisma/migrations/*/migration.sql | grep "CREATE TABLE"
```

```
✅ Only CREATE TABLE "User" — no domain tables
```

```bash
# Check seed has only test user
grep "upsert\|create" src/backend/prisma/seed.ts
```

```
✅ Only test@example.com upsert — no domain seed data
```

```bash
# Check issues folder is empty
ls issues/
```

```
✅ Only .gitkeep — no .md files
```

---

## Quick Reference — Common Commands

```bash
# Database
npx prisma generate          # regenerate Prisma client after schema change
npx prisma migrate dev       # apply pending migrations
npx prisma migrate dev --name init   # fresh migration with name
npx prisma db seed           # run seed file
npx prisma studio            # open database browser UI

# Servers
cd src/backend && npm run dev        # start backend on port 3001
cd src/frontend && npm run dev       # start frontend on port 5173

# Tests
npx playwright test --ui             # run E2E tests with visual UI
npx playwright test                  # run E2E tests headless
cd src/backend && npm run test       # run Jest unit tests

# Reset
bash reset-workshop.sh               # Mac/Linux full reset
.\reset-workshop.ps1                 # Windows full reset
                                     # (run Set-ExecutionPolicy Bypass first)
```
