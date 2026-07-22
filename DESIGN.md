# Design

Visual system for the CV Generator UI. Tokens live in `src/app/globals.css`
(OKLCH, Tailwind v4 `@theme`). The register is **product**: the chrome serves
the document; the white A4 sheet is the visual hero on both themes.

## Theme

- Light and dark, user-switchable (next-themes, `class` attribute).
- Both themes share one warm hue family (~45, terracotta) so the neutral
  chrome recedes behind the pure-white A4 preview sheet.
- The preview sheet sits on a recessed `--canvas` surface (desk metaphor).

## Color

Strategy: **Restrained**. Tinted warm neutrals plus one terracotta accent
used only for primary actions, selection, and focus. Never pure #fff/#000.

| Token                     | Light                   | Dark                        |
| ------------------------- | ----------------------- | --------------------------- |
| `--background`            | `oklch(0.972 0.005 70)` | `oklch(0.185 0.008 45)`     |
| `--foreground`            | `oklch(0.24 0.012 45)`  | `oklch(0.92 0.007 70)`      |
| `--card`                  | `oklch(0.993 0.003 80)` | `oklch(0.22 0.009 45)`      |
| `--primary` (terracotta)  | `oklch(0.49 0.115 40)`  | `oklch(0.7 0.125 45)`       |
| `--secondary`             | `oklch(0.935 0.008 65)` | `oklch(0.265 0.011 45)`     |
| `--muted-foreground`      | `oklch(0.49 0.018 48)`  | `oklch(0.7 0.014 55)`       |
| `--border`                | `oklch(0.895 0.009 65)` | `oklch(0.93 0.01 60 / 11%)` |
| `--canvas` (preview desk) | `oklch(0.925 0.008 65)` | `oklch(0.15 0.007 45)`      |
| `--destructive`           | `oklch(0.53 0.18 27)`   | `oklch(0.68 0.16 25)`       |
| `--success` (save state)  | `oklch(0.52 0.12 150)`  | `oklch(0.72 0.13 150)`      |
| `--ring` (focus)          | `oklch(0.56 0.11 42)`   | `oklch(0.68 0.11 45)`       |

All text/background pairs meet WCAG AA.

## Typography

- **Inter** (`--font-sans`) for all UI: headings, labels, controls, body.
- **Geist Mono** (`--font-mono`) reserved for machine-ish metadata: save
  status, item counts, the ATS hint. 11px, uppercase, wide tracking.
- Tight product scale: labels 0.8rem (12.8px) medium, body/controls 0.875rem,
  section titles 1.125rem semibold. No display sizes inside the app chrome.

## Layout

- Slim sticky top bar (h-12): terracotta "CV" mark + wordmark left; save
  status, language, theme right.
- Desktop (`xl+`): three columns — section rail (11–12.5rem, sticky), form
  column (26–30rem), preview column (remaining width, sticky).
- `lg`: rail becomes a horizontal tab row above a two-column form/preview.
- Mobile: segmented Editor/Preview toggle; single column.
- No card-in-card nesting. The editor column is a flat surface; list items
  are bordered groups (`rounded-lg border`), sections separated by a single
  bottom-border header.

## Components

- **Inputs/Textarea/Select**: h-9, `rounded-md`, `bg-card` on the tinted
  background, `shadow-xs`; focus = `border-ring` + `ring-ring/40` 3px ring.
- **Buttons**: base-ui Button with cva variants; primary = terracotta,
  destructive actions use ghost + `text-destructive`.
- **Segmented controls** (template picker, mobile toggle): `bg-secondary`
  track, active option `bg-card` + `shadow-sm`.
- **Section rail item**: label left, mono item count right, `EyeOff` icon
  when the section is hidden; active = `bg-secondary` + medium weight.
- **Item toolbar**: icon-sm ghost buttons (visibility, move up/down, delete).
- **Empty states**: dashed border block with explanation plus an inline
  "add item" button (teaches the primary action).
- Hidden sections/items communicate with `EyeOff` icon + reduced opacity,
  never color alone.

## Motion

- Color/box-shadow transitions only, ~150ms. No layout animation.
- Global `prefers-reduced-motion` kill switch in `globals.css`.

## Preview document

The A4 sheet (`max-w-198.5` = 794px) keeps fixed neutral paper colors
(`bg-white`, neutral-900 text) independent of the app theme, mirroring the
exported PDF/DOCX. Template-specific styles live in
`src/components/preview/CVPreview.tsx` (`PREVIEW_TEMPLATE_STYLES`).
