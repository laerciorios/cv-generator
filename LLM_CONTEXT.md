# LLM Context - CV Generator

## Project Summary

- Project name: cv-generator
- Objective: single-page CV builder with edit + preview + export flow.
- Scope: fully client-side app (no backend, no auth).
- Persistence target: browser localStorage.
- Main planning source: PLAN.md.

## Product Direction (from PLAN.md)

- Framework: Next.js App Router + TypeScript.
- Styling: Tailwind CSS v4 + shadcn/ui.
- Theme: next-themes (light/dark).
- i18n: next-intl with locales pt-br, en, es.
- State: Zustand.
- Forms: React Hook Form + Zod.
- Export: pdfmake (PDF) and docx (DOCX), both client-side.

## Current Implementation Status

- Phase 0 bootstrap is implemented.
- Phase 1 data modeling and store infrastructure are implemented.
- Phase 2 internationalization namespace coverage and locale persistence are implemented.
- Phase 3 theme coverage is implemented.
- Phase 4 editor-by-section workflow is implemented across all sections.
- Base app is running with App Router and src/ directory convention.
- i18n routing is active with localized route segment `/[locale]`.
- Theme provider + theme switcher are in place.
- Language switcher is in place.
- shadcn/ui is initialized with base config and button component.
- CV document types, Zod schemas, localStorage wrapper, Zustand store, autosave, reset flow, and JSON import/export are implemented.
- The main locale page renders the full editor workspace without legacy validation-only panels.
- Translation namespaces now include `common`, `form`, `sections`, `export`, and `errors`.
- Language selection persists through cookies and root redirect uses the persisted locale.
- The locale page includes a responsive editor workspace with section navigation, personal info form, experience CRUD, and live preview.
- The editor now includes all 7 sections (experience, education, languages, skills, volunteer, projects, extras) with full CRUD, reorder, and visibility controls.
- The preview was redesigned as a scrollable A4-width panel with neutral paper colors, section dividers, and strict visibility filtering matching the export contract.
- The editor includes three ATS-oriented templates (`classic`, `compact`, `executive`) and keeps template parity across preview, PDF, and DOCX.
- Test infrastructure is implemented with Vitest + jsdom.
- Unit tests now cover Zod schemas, localStorage wrapper behavior, export visibility filtering, and main Zustand store actions.

## Progress Snapshot by Plan

- Phase 0: complete.
- Phase 1: complete.
- Phase 2: complete.
- Phase 3: complete.
- Phase 4: complete (all sections: personal info, experience, education, languages, skills, volunteer, projects, extras).
- Phase 5: complete (A4 preview redesign with visual hierarchy, visibility filtering, and item order parity).
- Phase 6: complete (filterCVForExport, PDF generator via pdfmake, DOCX generator via docx, useExport hook, ExportPanel with loading state and error display).
- Phase 7: complete (responsiveness, save/export feedback, accessibility updates, and mobile editor/preview toggle).
- Phase 8: complete (automated tests plus final validation via test/lint/build).

## Project Language Rules

- All source code comments must be written in English only.
- Do not add code comments in Portuguese, Spanish, or mixed language.
- User-facing text can be localized through `src/locales`, but implementation comments must remain English-only.

## Warnings Fixes Applied

- Fixed Next.js workspace root inference warning:
  - `next.config.ts` now sets `turbopack.root` explicitly to `process.cwd()`.
- Fixed deprecated middleware file warning:
  - Migrated from `src/middleware.ts` to `src/proxy.ts` (same matcher/routing behavior).

## Repository Structure (current)

### Root

- PLAN.md
- README.md
- example.pdf
- next.config.ts
- package.json
- tsconfig.json
- eslint.config.mjs
- postcss.config.mjs
- components.json
- .prettierrc
- .prettierignore
- public/
- src/

### src/

- app/
  - layout.tsx
  - page.tsx (redirects to /pt-br)
  - globals.css
  - [locale]/
    - layout.tsx
    - page.tsx
- components/
  - editor/
    - CVEditorWorkspace.tsx
  - form/
    - PersonalInfoSection.tsx
    - ExperienceSection.tsx
    - EducationSection.tsx
    - LanguagesSection.tsx
    - SkillsSection.tsx
    - VolunteerSection.tsx
    - ProjectsSection.tsx
    - ExtrasSection.tsx
  - export/
    - ExportPanel.tsx
  - layout/
    - AppHeader.tsx
    - LanguageSwitcher.tsx
    - SectionNav.tsx
    - ThemeSwitcher.tsx
  - preview/
    - CVPreview.tsx
  - providers/
    - theme-provider.tsx
  - ui/
    - button.tsx
- hooks/
  - useCVStore.ts
  - useExport.ts
- i18n/
  - routing.ts
  - navigation.ts
  - request.ts
- locales/
  - pt-br.json
  - en.json
  - es.json
- lib/
  - schemas.ts
  - storage.ts
  - utils.ts
  - exporters/
    - filter.ts
    - pdf.generator.ts
    - docx.generator.ts
- types/
  - cv.types.ts
- proxy.ts

## Routing and i18n Details

- Supported locales: `pt-br`, `en`, `es`.
- Default locale: `pt-br`.
- Root route `/` redirects to `/pt-br`.
- Locale messages loaded dynamically from `src/locales/{locale}.json`.
- i18n navigation helpers are centralized in `src/i18n/navigation.ts`.

## Theme Details

- Theme provider uses `next-themes` with system preference support.
- Current app wraps localized layout with theme provider.
- Theme toggle button flips between light and dark mode.

## Key Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Tests: `npm run test`
- Tests (watch): `npm run test:watch`
- Lint: `npm run lint`
- Build: `npm run build`
- Start production: `npm run start`
- Format write: `npm run format`
- Format check: `npm run format:check`

## Dependencies Snapshot

### Runtime

- next, react, react-dom
- next-intl
- next-themes
- zustand
- react-hook-form
- zod
- @hookform/resolvers
- pdfmake
- docx
- shadcn stack helpers: clsx, class-variance-authority, tailwind-merge, lucide-react, tw-animate-css

### Dev

- typescript
- eslint + eslint-config-next
- prettier + prettier-plugin-tailwindcss
- @types/node, @types/react, @types/react-dom, @types/pdfmake

## Source of Truth for Next Work

- Use PLAN.md phases as implementation roadmap.
- Phase roadmap through Phase 8 is complete; any next work should be defined as post-v1 scope.

## Notes for Future LLM Sessions

- Keep implementation aligned with the CV data contract described in PLAN.md.
- Preserve parity rule between preview and exported files via a shared visibility filter function.
- Avoid introducing backend/auth concerns in v1 scope.
- Keep README.md, PLAN.md, and LLM_CONTEXT.md consistent whenever project status changes.
