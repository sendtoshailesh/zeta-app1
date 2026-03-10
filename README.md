# Agentic SDLC Workshop

A hands-on workshop where a team of 5 takes a single business requirement
all the way to tested, working code — using AI agents at every step.

---

## What You Will Build

You will be given a feature requirement on the day. Starting from a bare app
with only login and registration working, your team will use AI agents to:

- Write a Business Requirements Document
- Break it into technical Issues
- Design the data model and API
- Build the backend and frontend
- Generate and run end-to-end tests

Everything is built during the workshop. Nothing is pre-built except auth.

---

## Before You Arrive — Prerequisites

Install these before the workshop day:

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18 or higher | `node --version` |
| Git | Any recent | `git --version` |
| VS Code | Latest | — |
| GitHub Copilot | Active licence | — |

> ⚠️ You must have an active GitHub Copilot licence to use the agents.
> Check with your facilitator if you are unsure.

---

## Setup — Do This Before the Workshop Starts

### 1. Clone the repo

```bash
git clone https://github.com/AIInSDLC/agentic-workshop-template.git
cd agentic-workshop-template
```

### 2. Install dependencies

```bash
# Backend
cd src/backend && npm install

# Frontend — open a new terminal
cd src/frontend && npm install
```

### 3. Set up environment files

```bash
# Backend — no changes needed, defaults work
cp src/backend/.env.example src/backend/.env

# Frontend — your facilitator will tell you the app name
cp src/frontend/.env.example src/frontend/.env
```

Open `src/frontend/.env` and set the app name your facilitator gives you:
```
VITE_APP_NAME="BookIt"
```

### 4. Set up the database

```bash
cd src/backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Start the app

```bash
# Terminal 1 — backend (port 3001)
cd src/backend && npm run dev

# Terminal 2 — frontend (port 5173)
cd src/frontend && npm run dev
```

### 6. Verify it works

Open http://localhost:5173 in your browser.

Login with:
```
Email:    test@example.com
Password: password123
```

You should see a page that says **"Features coming soon"** after login.
This is correct — the feature is built during the workshop.

---

## Your Role

Your facilitator will assign you one of these roles:

| Role | What You Do |
|------|-------------|
| PM | Write requirements, create Issues |
| Architect | Design the system, assign DATABASE work |
| Backend Dev | Build the API, generate unit tests |
| UI Dev | Build the frontend components |
| QA Engineer | Generate and run Playwright tests |

See `workshop/workshop-flow.md` for exactly what your role does during the workshop.

---

## Where Agents Live

All agents are on GitHub — not in VS Code.

```
github.com → your repo → Agents tab → New session → agent dropdown
```

You will find: `brd-agent`, `user-story-agent`, `design-agent`,
`unit-test-agent`, `playwright-agent`

> The **Agents tab** is visible only if Copilot coding agent is enabled
> for the repo. Ask your facilitator if you cannot see it.

---

## Tech Stack

```
Backend   Node.js + Express + Prisma + SQLite
Frontend  React + Vite + TypeScript
Tests     Jest (unit) + Playwright (e2e)
Database  SQLite (local file — no setup needed)
```
