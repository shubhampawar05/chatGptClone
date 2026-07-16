# ChatGPT Clone Project Details

## What This Repository Is About

This repository is the foundation of a custom ChatGPT-style application built
with Next.js, Prisma, PostgreSQL, and a modern component system. The project is
being created from scratch, starting with repository setup, database setup, and
 core application architecture before the actual AI chat experience is added.

The goal of this codebase is to become a full-stack AI product where users can:

- create an account and sign in securely
- access protected application pages
- interact with an AI chat interface
- store user and app data in PostgreSQL through Prisma
- scale later with features such as conversation history, model selection,
  billing, profile settings, and team collaboration

## Current Stack

- Next.js 16 with the App Router
- React 19
- Prisma ORM
- PostgreSQL
- NextAuth v5 beta for authentication
- bcryptjs for password hashing
- Tailwind CSS based styling

## What Has Been Implemented

As of July 16, 2026, this repository includes:

- project setup and dependency installation
- Prisma configuration connected to PostgreSQL
- a user authentication schema in Prisma
- credentials-based email and password authentication
- a public sign-in page with sign-up support
- a protected route example at `/chat`
- redirect logic for unauthenticated users

## Authentication Architecture

The authentication flow in this project works like this:

1. A visitor lands on the public sign-in page at `/sign-in`.
2. A new user can create an account with name, email, and password.
3. Passwords are hashed with `bcryptjs` before being stored.
4. Returning users sign in using email and password.
5. Auth state is managed with NextAuth using the credentials provider.
6. Protected routes are guarded in `proxy.ts`.
7. If a user is not authenticated, they are redirected to `/sign-in`.
8. If a signed-in user visits `/sign-in`, they are redirected to `/chat`.

## Database Models

The Prisma schema is prepared for authentication-focused growth and includes:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Authenticator`

Right now, the important custom field is:

- `passwordHash` on `User` for storing the hashed password

This structure keeps the project ready for future upgrades such as OAuth,
session persistence, passkeys, and email verification.

## Protected App Area

The initial protected route is:

- `/chat`

This page is only available to authenticated users. It currently acts as the
starter authenticated workspace where the real chat interface can be built next.

## Suggested Next Build Steps

After this auth foundation, the most logical next tasks are:

1. create conversation and message Prisma models
2. design the protected chat UI
3. connect an OpenAI API route or server action
4. persist conversations per user
5. add profile and settings pages
6. add email verification and password reset flows

## Important Files

- `prisma/schema.prisma` for database models
- `lib/db.ts` for Prisma client setup
- `auth.ts` for NextAuth configuration
- `proxy.ts` for protected route redirects
- `app/api/auth/[...nextauth]/route.ts` for auth handlers
- `app/(auth)/sign-in/page.tsx` for the public auth page
- `app/(protected)/chat/page.tsx` for the protected route example

## Summary

This repository is now structured as the beginning of a real full-stack AI app,
not just a UI mock. It has a database-backed authentication foundation, route
protection, and a protected application entry point that future chat features
can build on safely.
