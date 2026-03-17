# CV Generator - Development Plan

> Single-page Next.js application for creating, editing, and exporting CVs.
> No backend, no authentication. Data is persisted in browser localStorage.

## Overview

| Attribute         | Detail                                |
| ----------------- | ------------------------------------- |
| Framework         | Next.js 15+ (App Router) + TypeScript |
| State/Persistence | Zustand + localStorage                |
| Styling           | Tailwind CSS 4+                       |
| Theme             | next-themes (light/dark)              |
| i18n              | next-intl (PT-BR, EN, ES)             |
| Forms             | React Hook Form + Zod                 |
| PDF Export        | pdfmake (100% client-side)            |
| DOCX Export       | docx (100% client-side)               |
| UI Components     | shadcn/ui + Radix UI                  |

## Scope Decisions

- Included: local application, no backend, no authentication.
- Included: single-page editing + preview + export flow, with no separate home page.
- Included: 3 languages (PT-BR, EN, ES).
- Included: persistent light/dark theme.
- Included: client-side PDF and DOCX export.
- Included: visibility by section and by item.
- Included: JSON import/export as manual backup.
- Out of scope for v1: advanced multiple templates, collaboration, cloud sync, analytics.

## Post-v1 Updates

- Added 3 ATS-oriented CV templates selectable by the user (`classic`, `compact`, `executive`).
- Template selection is persisted in the main CV document and applied consistently to preview, PDF, and DOCX.

## Data Model (High Level)

```ts
interface CVDocument {
  id: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
    website?: string;
    linkedIn?: string;
    github?: string;
    photo?: string;
  };
  sections: {
    experience: { items: ExperienceItem[]; visible: boolean };
    education: { items: EducationItem[]; visible: boolean };
    languages: { items: LanguageItem[]; visible: boolean };
    skills: { items: SkillItem[]; visible: boolean };
    volunteer: { items: VolunteerItem[]; visible: boolean };
    projects: { items: ProjectItem[]; visible: boolean };
    extras: { items: ExtraItem[]; visible: boolean };
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    schemaVersion: number;
  };
}
```

Each list item must include `id` and `visible` for fine-grained export control.

## Folder Structure

```text
src/
  app/
    layout.tsx
    [locale]/
      layout.tsx
      page.tsx
    globals.css
  components/
    ui/
    layout/
      AppHeader.tsx
      SectionNav.tsx
    form/
      PersonalInfoSection.tsx
      ExperienceSection.tsx
      EducationSection.tsx
      LanguagesSection.tsx
      SkillsSection.tsx
      VolunteerSection.tsx
      ProjectsSection.tsx
      ExtrasSection.tsx
    preview/
      CVPreview.tsx
    export/
      ExportPanel.tsx
      VisibilityPanel.tsx
  hooks/
    useCVStore.ts
    useExport.ts
  lib/
    storage.ts
    schemas.ts
    utils.ts
    exporters/
      pdf.generator.ts
      docx.generator.ts
  types/
    cv.types.ts
  locales/
    pt-br.json
    en.json
    es.json
  proxy.ts
```

## Phase 0 - Project Setup

Goal: a functional foundation ready for development.

Checklist:

- [x] Initialize the project with create-next-app (TypeScript + App Router).
- [x] Configure Tailwind CSS.
- [x] Install and configure next-themes.
- [x] Install and configure next-intl with locale routes.
- [x] Install Zustand.
- [x] Install React Hook Form and Zod.
- [x] Install pdfmake and docx.
- [x] Configure shadcn/ui with base components.
- [x] Configure import aliases in tsconfig.
- [x] Configure lint/format.
- [x] Validate that the project starts without errors.

Done criteria:

- [x] Application starts correctly.
- [x] Language routes work (PT-BR, EN, ES).
- [x] Theme switching works without noticeable flicker.

## Phase 1 - Data Modeling and Store

Goal: define a robust local data contract and persistence layer.

Checklist:

- [x] Create complete types in `src/types/cv.types.ts`.
- [x] Create Zod schemas in `src/lib/schemas.ts`.
- [x] Create a localStorage wrapper in `src/lib/storage.ts`.
- [x] Implement the global Zustand store in `src/hooks/useCVStore.ts`.
- [x] Implement autosave for all relevant mutations.
- [x] Implement full reset with UX confirmation.
- [x] Implement schema-validated JSON import/export.

Implementation notes:

- Added the full CV document contract, section item factories, and schema versioning.
- Added safe localStorage hydration with invalid data discard and empty-document fallback.
- Added a localized validation panel on the main locale route to exercise autosave, reset, and JSON import/export.

Done criteria:

- [x] Data persists after reload.
- [x] Invalid localStorage data is discarded with a safe fallback.

## Phase 2 - Internationalization

Goal: complete PT-BR, EN, and ES coverage.

Checklist:

- [x] Create translation files `pt-br.json`, `en.json`, `es.json`.
- [x] Structure namespaces (`common`, `form`, `sections`, `export`, `errors`).
- [x] Translate labels, placeholders, validations, and export text.
- [x] Create a LanguageSwitcher in the header.
- [x] Persist the selected language.
- [x] Guarantee language switching without losing form data.

Implementation notes:

- Added namespace-based translation structure with dedicated keys for form labels/placeholders, section controls, export actions, and error messages.
- Replaced hardcoded storage/import error text with localized error-code mapping in the UI.
- Persisted locale selection in cookies and made root redirect respect persisted locale.
- Kept data continuity during locale switches through autosaved store hydration.

Done criteria:

- [x] The entire UI changes language with no remaining hardcoded text.

## Phase 3 - Light/Dark Theme

Goal: consistent light and dark theme support.

Checklist:

- [x] Configure ThemeProvider in the root application layout.
- [x] Define color tokens for light/dark.
- [x] Create a ThemeSwitcher in the header.
- [x] Apply the theme to forms, preview, buttons, and modals.
- [x] Validate contrast and readability in both themes.

Implementation notes:

- Added theme coverage across the new section editor forms and preview cards.
- Replaced native reset confirmation with a themed in-app modal.
- Localized theme toggle labels and verified contrast in both light and dark surfaces.

Done criteria:

- [x] Theme persists after reload and does not break components.

## Phase 4 - CV Editor by Section

Goal: complete form editing for all CV sections.

General checklist:

- [x] Implement a responsive editor + preview layout.
- [x] Implement section navigation.
- [x] Implement CRUD by section.
- [x] Implement item reorder.
- [x] Implement visibility toggle by section and by item.

Implementation notes:

- Added an editor workspace with responsive layout and live preview.
- Added section navigation with all sections enabled.
- Added initial CRUD, ordering, and visibility controls for Experience items.
- Enabled Education, Languages, and Skills sections with CRUD, per-item visibility, and item reordering.
- Added Volunteer, Projects, and Extras sections with full CRUD, reorder, and visibility controls.
- Expanded live preview to include all sections with section/item visibility rules.

Sections:

- [x] Personal Info (name, email, contacts, summary, links, photo).
- [x] Work Experience.
- [x] Education.
- [x] Languages.
- [x] Skills.
- [x] Volunteer / Other Experience.
- [x] Projects.
- [x] Extra Information.

Done criteria:

- [x] User can fill in and edit all sections.
- [x] Item visibility works in local state.

## Phase 5 - Dynamic Preview

Goal: accurate preview of the final exported CV.

Checklist:

- [x] Create the main preview component.
- [x] Apply the strict rule: visible section and visible item.
- [x] Respect the item order defined in the editor.
- [x] Adjust the visual hierarchy based on `example.pdf`.
- [x] Define an A4-like preview width for export parity.

Implementation notes:

- Redesigned CVPreview as a scrollable panel containing an A4-width article (max-width 794px).
- Preview uses fixed neutral colors to represent the paper document independently from the app theme.
- Section headings use uppercase tracking with a bottom border divider, mirroring export hierarchy.
- All 7 sections are rendered with strict visibility filtering (section.visible + item.visible).
- Item order in the preview matches the editor order directly from the store array.

Done criteria:

- [x] Preview content exactly matches exported content.

## Phase 6 - PDF and DOCX Export

Goal: generate final files with consistent content.

Shared checklist:

- [x] Create a `filterCVForExport` function to apply visibility filters.
- [x] Guarantee use of the same function for PDF and DOCX.

PDF:

- [x] Implement the generator in `src/lib/exporters/pdf.generator.ts`.
- [x] Build structure with heading, section, and body styles.
- [x] Include only visible sections/items.
- [x] Download with a friendly filename.

DOCX:

- [x] Implement the generator in `src/lib/exporters/docx.generator.ts`.
- [x] Reproduce the same ordering and visibility rules used in PDF.
- [ ] Validate opening in Word and LibreOffice.

Export UI:

- [x] Create a panel with PDF, DOCX, and JSON buttons.
- [x] Display loading state and friendly errors.

Done criteria:

- [x] PDF and DOCX are exported with parity in content and expected structure.

## Phase 7 - UX, Responsiveness, and Basic Accessibility

Goal: solid real-world experience on desktop and mobile.

Checklist:

- [x] Full responsiveness for editor and preview.
- [x] Confirmation before clearing data.
- [x] Visual feedback for save/export/errors.
- [x] Accessible labels and focus behavior in all fields.
- [x] Functional keyboard navigation for main actions.

Implementation notes:

- Added a mobile editor/preview tab toggle (only visible below xl breakpoint) in CVEditorWorkspace, allowing users to switch between the editor and the live preview on small screens.
- CVPreview sticky positioning and max-height now only apply at the xl breakpoint so the preview renders correctly in single-column layouts.
- Added a SaveStatusBadge client component in the header that shows a green "Saved" dot after any autosave, reading lastSavedAt from the Zustand store.
- Added aria-label and aria-pressed to all icon-only item buttons (toggle visibility, move up, move down, delete) across all 7 form sections.
- Added proper input types (type="email", type="tel", type="url") and autoComplete attributes to PersonalInfoSection contact fields.
- Added aria-label to the section navigation element using the existing sections.title translation key.
- Added mobileView, actions, and header.saveStatus locale keys to pt-br, en, and es translation files.

Done criteria:

- [x] End-to-end flow is usable on desktop and mobile without breakage.

## Phase 8 - Testing and Final Validation

Goal: reduce regressions and ensure v1 reliability.

Automated checklist:

- [x] Test Zod schemas.
- [x] Test the localStorage wrapper.
- [x] Test export filtering by visibility.
- [x] Test the main store actions.

Manual checklist:

- [x] Fill out a complete CV and validate persistence after reload.
- [x] Hide a section/item and validate absence in preview and exports.
- [x] Switch language and validate the full interface.
- [x] Switch theme and validate visual persistence.
- [x] Export PDF and DOCX with different data combinations.
- [x] Import JSON and confirm full restoration.

Implementation notes:

- Added Vitest + jsdom test infrastructure and scripts (`test`, `test:watch`).
- Added unit tests for `cvDocumentSchema`, storage wrapper behavior, export visibility filtering, and critical Zustand store actions.
- Validation commands executed successfully: `npm run test`, `npm run lint`, and `npm run build`.

Done criteria:

- [x] Manual checklist is executed with no critical blockers.

## Dependencies Between Phases

Recommended order:

1. Phase 0
2. Phase 1
3. Phase 2 and Phase 3, which can happen in parallel
4. Phase 4
5. Phase 5
6. Phase 6
7. Phase 7
8. Phase 8

## Risks and Mitigations

| Risk                                      | Severity | Mitigation                                            |
| ----------------------------------------- | -------- | ----------------------------------------------------- |
| Data loss when browser storage is cleared | High     | JSON import/export and backup guidance                |
| Preview/export divergence                 | High     | Single `filterCVForExport` funnel for both generators |
| Poor layout for very long CVs             | Medium   | Tune PDF page breaks and review template              |
| Invalid data in localStorage              | Medium   | Zod validation + safe fallback                        |
| Theme inconsistency                       | Low      | Centralized theme tokens + visual testing             |

## Visual Reference

- Reference file in the workspace: `example.pdf`
