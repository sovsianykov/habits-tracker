# Habit Activity Tracker – Project Specification

## Project Overview

Habit Activity Tracker is a web application that allows users to track how much time they spend on daily habits and activities.

it should be a PWA app

The application helps users build discipline and understand how they spend their time.

Users can:

* create habits
* track activity sessions
* record start and end time of each activity
* track total time spent per habit
* analyze activity history

Each activity session records when the activity started, when it ended, and the duration.

The system supports multiple sessions per habit per day.

---

# Tech Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Server Components by default
* Client Components only when necessary

## Backend

Backend logic is implemented using Next.js Route Handlers.

Technologies:

* Prisma ORM
* SQLite database

## Authentication

Authentication is implemented using NextAuth Credentials Provider.

Authentication features:

* email and password login
* password hashing
* session handling
* protected routes

---

# Project Architecture

The application follows a **fullstack Next.js architecture**.

Frontend and backend exist in the same repository.

Recommended folder structure:

/app
  /api
  /dashboard
  /habits
  /login
  /register

/components
/lib
/prisma
/types
/hooks

Responsibilities:

* UI components → /components
* database access → /prisma
* business logic → /lib
* API routes → /app/api
* custom hooks → /hooks

---

# Database

The database is implemented using SQLite and Prisma ORM.

The schema supports:

* users
* habits
* habit activity sessions

---

# Prisma Schema

```prisma
generator client {
 provider = "prisma-client-js"
}

datasource db {
 provider = "sqlite"
 url      = "file:./dev.db"
}

model User {
 id        String   @id @default(cuid())
 email     String   @unique
 password  String
 createdAt DateTime @default(now())

 habits    Habit[]
 sessions  HabitSession[]
}

model Habit {
 id          String   @id @default(cuid())
 title       String
 description String?
 createdAt   DateTime @default(now())

 userId String
 user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

 sessions HabitSession[]

 @@index([userId])
}

model HabitSession {
 id        String   @id @default(cuid())

 habitId String
 habit   Habit @relation(fields: [habitId], references: [id], onDelete: Cascade)

 userId String
 user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

 startTime DateTime
 endTime   DateTime

 duration Int

 notes String?

 createdAt DateTime @default(now())

 @@index([habitId])
 @@index([userId])
 @@index([startTime])
}
```

---

# Data Model Explanation

## User

Represents an application user.

Fields:

* id
* email
* password
* createdAt

A user can own multiple habits.

---

## Habit

Represents a habit that the user wants to track.

Examples:

* Reading
* Gym
* Meditation
* Coding
* Studying

Fields:

* id
* title
* description
* createdAt
* userId

Each habit belongs to exactly one user.

---

## HabitSession

Represents a specific activity session.

Each time a user performs a habit, a session is recorded.

Fields:

* startTime — when the activity started
* endTime — when the activity ended
* duration — total activity time in minutes
* notes — optional notes about the session

Example session:

startTime: 2026-03-12 19:00
endTime: 2026-03-12 19:45
duration: 45

Multiple sessions can exist per day.

---

# Core Application Features

## Authentication

Users must be authenticated before accessing the application.

Features:

* registration
* login
* logout
* session persistence

Unauthenticated users are redirected to login.

---

# Habit Management

Users can manage habits.

Supported actions:

* create habit
* edit habit
* delete habit
* list habits

Users can only access their own habits.

---

# Activity Tracking

Users can record activity sessions.

Features:

* start activity
* stop activity
* record startTime and endTime
* calculate duration
* add notes

Multiple sessions per habit per day are allowed.

---

# Dashboard

The dashboard shows:

* list of habits
* today's activity
* total time spent per habit
* recent activity sessions

Possible future widgets:

* weekly activity
* monthly activity
* habit streaks

---

# API Design

Example API routes:

POST /api/auth/register
POST /api/auth/login

GET /api/habits
POST /api/habits
PATCH /api/habits/:id
DELETE /api/habits/:id

GET /api/sessions
POST /api/sessions
PATCH /api/sessions/:id
DELETE /api/sessions/:id

---

# Security Rules

Security rules include:

* users can only access their own habits
* users can only access their own sessions
* passwords must be hashed
* authenticated routes must verify session

---

# UI Guidelines

The UI should be:

* minimalistic
* fast
* mobile friendly
* accessible

Server components should be used whenever possible.

Client components should only be used for interactive UI.

---

# Development Rules

Code must follow best practices:

* TypeScript strict mode
* reusable components
* separation of concerns
* small components
* readable code

Avoid unnecessary client-side state.

Prefer server rendering when possible.

---

# Future Improvements

Potential future features:

* habit streak tracking
* analytics and charts
* weekly activity reports
* reminders
* notifications
* dark mode
* PWA support
* offline support
* export activity data

```
```
