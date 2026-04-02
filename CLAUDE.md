# CLAUDE.md — Zari App

## Project Overview

**Zari** is a full-stack AI companion app. Users sign in, choose a personality style and language, then chat with Zari — an AI that thinks autonomously, speaks out loud, remembers everything, and includes responsible disclosures for health/finance/legal topics. Available in 16 languages.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Backend | Convex (real-time BaaS) |
| Auth | Clerk (Google + Apple + email) |
| Styling | Tailwind CSS 3 |
| AI | Claude API (@anthropic-ai/sdk) — server-side only |
| TTS | Web Speech API (browser) |
| Payments | Stripe (future) |
| Email | Resend (future) |
| Deploy | Vercel |
| Animation | Framer Motion |
| Icons | Lucide React |

## Project Structure

```
app/                  → Next.js App Router pages
  api/chat/           → Claude AI chat endpoint
  api/extract-memories/ → Memory extraction via Claude Haiku
  api/webhook/        → Clerk webhook handler (svix)
  chat/               → Protected chat page
  sign-in/            → Clerk sign-in
  sign-up/            → Clerk sign-up
  page.tsx            → Marketing/landing page
components/
  chat/               → Chat interface, memory panel, settings, onboarding
  landing/            → Demo chat, features, testimonials, how-it-works, etc.
  convex-provider.tsx → Convex client wrapper
convex/               → Convex backend (schema, mutations, queries)
lib/                  → Languages config, TTS helper
```

## Critical Rules

- **NEVER expose ANTHROPIC_API_KEY to the browser** — all Claude calls happen in API routes
- **Do NOT run `npm run build`** unless explicitly asked
- **Max 200 lines per file**, split if longer
- **Max 30 lines per function**
- **Named exports only** (no default exports except pages)
- **Files: kebab-case**, Components: PascalCase, Functions: camelCase

## Auth

- Clerk handles authentication (Google, Apple, email)
- `ClerkProvider` wraps the app in layout.tsx
- Middleware protects `/chat` routes; public routes: `/`, `/sign-in`, `/sign-up`
- Clerk webhooks (`user.created`, `user.updated`) sync users to Convex via `/api/webhook`
- **To enable Google/Apple login:** Configure in Clerk Dashboard > User & Authentication > Social Connections

## Convex Schema

- **users** — clerkId, name, email, gender, language, mood, voiceEnabled
- **conversations** — userId, title, timestamps
- **messages** — conversationId, userId, role, content
- **memories** — userId, category, fact, people[], date, time, dayOfWeek

## AI Architecture

- **Chat**: `/api/chat` → Claude Sonnet with personality-aware system prompt + user memories
- **Memory Extraction**: `/api/extract-memories` → Claude Haiku parses user messages for facts/events/people
- 3 personality modes: female (warm), neutral (balanced), male (bold)
- 7 autonomous behaviors built into system prompt
- Responsible disclosures for health (red), finance (green), legal (blue)

## Development

```bash
npm run dev          # Start Next.js dev server
npx convex dev       # Start Convex dev server (run in separate terminal)
npm run lint         # Lint
npm run build        # Production build
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — from Clerk Dashboard
- `CLERK_SECRET_KEY` — from Clerk Dashboard
- `CLERK_WEBHOOK_SECRET` — from Clerk Webhooks page
- `NEXT_PUBLIC_CONVEX_URL` — from Convex Dashboard
- `CONVEX_DEPLOY_KEY` — from Convex Dashboard
- `ANTHROPIC_API_KEY` — from Anthropic Console

## Deploy

- **Vercel**: Connect GitHub repo, add env vars, deploy
- **Convex**: `npx convex deploy` (uses CONVEX_DEPLOY_KEY)
- **Clerk Webhook**: Point to `https://yourdomain.com/api/webhook` for user.created + user.updated events
