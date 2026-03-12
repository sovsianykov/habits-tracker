# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                        # Start dev server
npm run build                      # Build for production
npm run lint                       # Run ESLint
npx prisma migrate dev             # Run DB migrations
npx prisma generate                # Regenerate Prisma client
npx prisma studio                  # Open DB GUI
```

## Architecture

Fullstack Next.js 16 App Router — **Habit Activity Tracker** PWA. Users log time spent on habits and analyze their activity.

**Folder structure:**
- `src/app/api/` — Route Handlers (backend API)
- `src/app/dashboard/`, `src/app/habits/`, `src/app/stats/`, `src/app/profile/`, `src/app/login/`, `src/app/register/`
- `src/components/` — Reusable UI components
- `src/lib/` — Business logic, DB client (`prisma.ts`), auth config (`auth.ts`), validations (`validations.ts`)
- `src/proxy.ts` — Route protection (Next.js 16 uses `proxy` instead of `middleware`)
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript types
- `prisma/` — Schema and migrations

**Database:** SQLite via Prisma ORM (`file:./dev.db`). Client generated to `src/generated/prisma`. Three models: `User`, `Habit`, `HabitSession`.

**Auth:** NextAuth v4 Credentials Provider (email/password, bcrypt). Session strategy: JWT. All routes except `/login` and `/register` protected via middleware.

**Key data relationships:**
- User → many Habits → many HabitSessions
- HabitSession: `startTime`, `endTime`, `duration` (minutes), optional `notes`

**API routes:**
- `POST /api/auth/register`
- `GET|POST /api/habits`, `PATCH|DELETE /api/habits/:id`
- `GET|POST /api/sessions`, `PATCH|DELETE /api/sessions/:id`

## Conventions

- **Server Components by default**; `"use client"` only for interactive UI (forms, timers, charts)
- All API route handlers call `getServerSession(authOptions)` and filter DB queries by `userId`
- Form validation: `react-hook-form` + `zod`
- Styling: Tailwind CSS v4, mobile-first, bottom navigation bar (4 tabs: Home/Habits/Stats/Profile)
- Charts: `recharts` (must be in a Client Component)
- Dashboard shows a **calendar/date picker** — sessions filtered by selected date
- Stats page has **animated Recharts diagrams**: bar chart (daily activity), line chart (30-day trend), pie chart (time per habit), + CSS progress bars
- TypeScript strict mode
