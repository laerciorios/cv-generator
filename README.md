# CV Generator

Single-page CV builder built with Next.js, focused on local editing, preview, and client-side export.

The application has no backend and no authentication. CV data is intended to live in the browser via localStorage.

## Current Status

- Phase 0 is complete.
- Phase 1 is complete.
- Phase 2 is complete.
- Phase 3 is complete.
- Phase 4 is complete.
- Phase 5 is complete.
- Phase 6 is complete.
- Phase 7 is complete.
- Phase 8 is complete.
- The project is bootstrapped with Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui, next-intl, and next-themes.
- Localized routes are working for `pt-br`, `en`, and `es`.
- Theme switching is working.
- The CV data contract, Zod validation, safe localStorage persistence, and Zustand store are implemented.
- The localized main page exposes a full editor + preview + export workflow with autosave, reset, and JSON import/export.
- Locale messages are organized by namespaces (`common`, `form`, `sections`, `export`, `errors`).
- Selected language persists across visits, including root-route redirects.
- All CV sections are editable with per-section and per-item visibility plus item ordering.
- Preview/export parity is enforced through a shared visibility filter.
- The editor includes 3 ATS-friendly templates (`classic`, `compact`, `executive`) applied to preview, PDF, and DOCX.
- Unit tests cover schema validation, storage behavior, export filtering, the shared export content model, and core store actions.
- Build and lint are clean.
- The codebase was fully refactored (2026-07): section forms are config-driven, exporters render a shared content model, and duplicated UI/helpers were consolidated.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- next-intl
- next-themes
- Zustand
- React Hook Form
- Zod
- pdfmake
- docx

## Available Routes

- `/` redirects to `/pt-br`
- `/pt-br`
- `/en`
- `/es`

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
npm run format
npm run format:check
```

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    [locale]/
      layout.tsx
      page.tsx
  components/
    editor/
      CVEditorWorkspace.tsx
    form/
      PersonalInfoSection.tsx
      SectionEditor.tsx          # config-driven editor for all list sections
      section-form-configs.ts    # per-section field/label configuration
    export/
      ExportPanel.tsx
    layout/
      AppHeader.tsx
      LanguageSwitcher.tsx
      SaveStatusBadge.tsx
      SectionNav.tsx
      ThemeSwitcher.tsx
    preview/
      CVPreview.tsx
    providers/
      theme-provider.tsx
    ui/
      button.tsx
      field.tsx
      input.tsx
      select.tsx
      textarea.tsx
  hooks/
    useCVStore.ts
    useExport.ts
  i18n/
    navigation.ts
    request.ts
    routing.ts
  lib/
    cv-factories.ts              # document/item factories and sample data
    download.ts                  # shared browser download helper
    schemas.ts
    storage.ts
    utils.ts
    exporters/
      content.ts                 # shared format-agnostic export model
      filter.ts
      pdf.generator.ts
      docx.generator.ts
      latex.generator.ts
  types/
    cv.types.ts                  # data contract (types and constants only)
  locales/
    pt-br.json
    en.json
    es.json
  proxy.ts
```

## Architecture Notes

- All seven list-based sections (experience, education, languages, skills, volunteer, projects, extras) are edited through a single `SectionEditor` component driven by `section-form-configs.ts`.
- Exporters share `buildExportContent` (`src/lib/exporters/content.ts`), which owns visibility filtering, section ordering, and document traversal; PDF, DOCX, and LaTeX generators are pure renderers of that model, keeping output parity by construction.
- The preview mirrors the same section order via `EXPORT_SECTION_ORDER`.

## Localization

- Supported locales: `pt-br`, `en`, `es`
- Default locale: `pt-br`
- Messages are loaded from `src/locales`
- Navigation helpers are centralized in `src/i18n/navigation.ts`

## Theme

- Theme handling is powered by next-themes.
- The current shell supports light and dark mode.
- Theme switching is exposed in the header.

## Planning Documents

- Main roadmap: `PLAN.md`
- LLM/session context: `LLM_CONTEXT.md`
- Visual reference: `example.pdf`

## Notes

- This repository now includes the full v1 editing, preview, and export flow.
- The app remains fully client-side with localStorage persistence and no backend/auth.
- Testing and final validation (Phase 8) are implemented with Vitest.
