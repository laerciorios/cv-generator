# AGENTS.md

## Project Scope

- This repository is a single-page CV builder built with Next.js.
- The app is fully client-side.
- Do not introduce backend, authentication, cloud sync, analytics, or server persistence unless explicitly requested.
- Persist CV data in browser localStorage.

## Current Status

- Phases 0 through 8 are complete.
- The repository includes the full v1 flow: editing, preview, export, and automated validation.
- The app is production-ready within the original single-page/local-first scope.
- Use `PLAN.md` as the roadmap and implementation checklist.

## Source of Truth

- `PLAN.md`: roadmap, scope, phases, and completion tracking.
- `README.md`: developer-facing project overview and setup.
- `LLM_CONTEXT.md`: compact project context for coding agents and LLM sessions.
- `example.pdf`: visual reference for preview and export hierarchy.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- shadcn/ui
- next-intl
- next-themes
- Zustand
- React Hook Form + Zod
- pdfmake
- docx

## Routing and Localization

- Supported locales are `pt-br`, `en`, and `es`.
- Default locale is `pt-br`.
- Root route `/` must redirect to `/pt-br`.
- User-facing text should be localized through `src/locales`.
- Keep locale routing aligned with the current `next-intl` setup.

## Code and Comment Rules

- All code comments must be written in English only.
- Do not add comments in Portuguese, Spanish, or mixed language.
- Keep comments concise and only add them when they materially improve readability.
- User-facing UI text may be localized, but implementation comments must remain English-only.

## Implementation Guidelines

- Keep changes minimal and aligned with the current architecture.
- Prefer fixing the root cause over adding temporary patches.
- Preserve consistency between preview and export logic.
- When export features are implemented, use a shared visibility filtering path for PDF and DOCX.
- Avoid introducing new abstractions before they are justified by the current phase.

## Documentation Rules

- When project status changes, keep `README.md`, `PLAN.md`, and `LLM_CONTEXT.md` consistent.
- Mark completed work in `PLAN.md` only when it is actually implemented and validated.
- Keep documentation in English unless the user explicitly requests another language.

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run format:check
```

## Next Priority

- There is no pending in-scope milestone in the original roadmap; treat new work as post-v1 scope.
