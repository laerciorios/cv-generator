"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useCVStore } from "@/hooks/useCVStore";
import { EXPORT_SECTION_ORDER } from "@/lib/exporters/content";
import { cn } from "@/lib/utils";
import {
  CV_TEMPLATES,
  type BaseSectionItem,
  type CVTemplate,
  type ExtraItem,
  type LanguageItem,
  type SectionItemMap,
  type SkillItem,
} from "@/types/cv.types";

const PREVIEW_TEMPLATE_STYLES: Record<CVTemplate, Record<string, string>> = {
  classic: {
    article:
      "mx-auto w-full max-w-198.5 bg-white px-4 py-6 text-neutral-900 shadow-md sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 dark:bg-neutral-50",
    header: "mb-6 border-b border-neutral-300 pb-5",
    fullName: "mb-1 text-3xl font-bold tracking-tight text-neutral-900",
    contact: "mb-0.5 text-sm text-neutral-600",
    link: "text-xs text-neutral-500",
    summary: "mt-3 text-sm leading-relaxed text-neutral-700",
    section: "mb-5",
    sectionTitle:
      "mb-2 border-b border-neutral-300 pb-1 text-xs font-bold tracking-widest text-neutral-500 uppercase",
    itemTitle: "text-sm font-semibold text-neutral-900",
    itemMeta: "text-xs text-neutral-500 tabular-nums",
    itemSub: "text-xs text-neutral-500",
    itemBody: "mt-1 text-sm leading-relaxed text-neutral-700",
    skillChip:
      "rounded border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700",
    langLine: "text-sm text-neutral-700",
    extraLine: "text-sm text-neutral-700",
    extraDetails: "text-xs text-neutral-500",
    sectionContainer: "",
    contentGap: "grid gap-3",
    headerLayout: "",
    sectionTitleWrap: "",
  },
  compact: {
    article:
      "mx-auto w-full max-w-198.5 bg-white px-3 py-4 text-neutral-900 shadow-sm sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6 dark:bg-neutral-50",
    header: "mb-3 border-b border-dashed border-neutral-300 pb-3",
    fullName: "mb-0.5 text-[1.55rem] font-bold tracking-tight text-neutral-900",
    contact: "mb-0.5 text-xs text-neutral-600",
    link: "text-[11px] text-neutral-500",
    summary: "mt-1.5 text-[12px] leading-snug text-neutral-700",
    section: "mb-2.5",
    sectionTitle:
      "text-[10px] font-bold tracking-[0.22em] text-neutral-500 uppercase",
    itemTitle: "text-[13px] font-semibold text-neutral-900",
    itemMeta: "text-[11px] text-neutral-500 tabular-nums",
    itemSub: "text-[11px] text-neutral-500",
    itemBody: "mt-0.5 text-[12px] leading-snug text-neutral-700",
    skillChip:
      "rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-700",
    langLine: "text-[12px] text-neutral-700",
    extraLine: "text-[12px] text-neutral-700",
    extraDetails: "text-[11px] text-neutral-500",
    sectionContainer: "border-b border-dashed border-neutral-200 pb-2",
    contentGap: "grid gap-2",
    headerLayout: "",
    sectionTitleWrap:
      "mb-1.5 flex items-center gap-2 before:h-px before:flex-1 before:bg-neutral-200 after:h-px after:flex-1 after:bg-neutral-200",
  },
  executive: {
    article:
      "mx-auto w-full max-w-198.5 bg-white px-5 py-7 text-neutral-900 shadow-md sm:px-7 sm:py-8 md:px-9 md:py-10 lg:px-12 dark:bg-neutral-50",
    header: "mb-6 border-b-4 border-neutral-800 pb-5",
    fullName: "mb-1 text-3xl font-black tracking-[0.02em] text-neutral-900",
    contact: "mb-1 text-sm font-medium text-neutral-700",
    link: "text-xs font-medium text-neutral-600",
    summary: "mt-3 text-sm leading-relaxed text-neutral-700",
    section: "mb-5",
    sectionTitle:
      "inline-block bg-neutral-800 px-2.5 py-1 text-[11px] font-extrabold tracking-[0.14em] text-white uppercase",
    itemTitle: "text-sm font-bold text-neutral-900",
    itemMeta: "text-xs font-medium text-neutral-600 tabular-nums",
    itemSub: "text-xs font-medium text-neutral-600",
    itemBody: "mt-1 text-sm leading-relaxed text-neutral-700",
    skillChip:
      "rounded border border-neutral-400 bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800",
    langLine: "text-sm text-neutral-700",
    extraLine: "text-sm text-neutral-700",
    extraDetails: "text-xs text-neutral-600",
    sectionContainer:
      "rounded-md border border-neutral-200 bg-neutral-50/70 p-3",
    contentGap: "grid gap-3",
    headerLayout: "text-center",
    sectionTitleWrap: "mb-2",
  },
};

type PreviewStyles = (typeof PREVIEW_TEMPLATE_STYLES)[CVTemplate];

type EntrySectionKey = "experience" | "education" | "volunteer" | "projects";

interface PreviewEntryData {
  title: string;
  subLines: string[];
  body: string;
}

function joinDot(parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(" · ");
}

interface EntryPreviewConfig<K extends EntrySectionKey> {
  emptyKey: string;
  untitledKey: string;
  toEntry: (item: SectionItemMap[K]) => PreviewEntryData;
}

const ENTRY_PREVIEW_CONFIGS: {
  [K in EntrySectionKey]: EntryPreviewConfig<K>;
} = {
  experience: {
    emptyKey: "emptyExperiencePreview",
    untitledKey: "untitledExperience",
    toEntry: (item) => ({
      title: item.role,
      subLines: [joinDot([item.company, item.location])],
      body: item.summary,
    }),
  },
  education: {
    emptyKey: "emptyEducationPreview",
    untitledKey: "untitledEducation",
    toEntry: (item) => ({
      title: joinDot([item.degree, item.fieldOfStudy]),
      subLines: [joinDot([item.institution, item.location])],
      body: item.summary,
    }),
  },
  volunteer: {
    emptyKey: "emptyVolunteerPreview",
    untitledKey: "untitledVolunteer",
    toEntry: (item) => ({
      title: item.role,
      subLines: [joinDot([item.organization, item.location])],
      body: item.summary,
    }),
  },
  projects: {
    emptyKey: "emptyProjectsPreview",
    untitledKey: "untitledProject",
    toEntry: (item) => ({
      title: item.name,
      subLines: [
        item.role,
        joinDot([item.website, item.github]),
        item.technologies.join(", "),
      ],
      body: item.summary,
    }),
  },
};

function isEntrySection(key: string): key is EntrySectionKey {
  return key in ENTRY_PREVIEW_CONFIGS;
}

function visibleItems<T extends BaseSectionItem>(items: T[]): T[] {
  return items.filter((item) => item.visible);
}

export function CVPreview() {
  const t = useTranslations("editor");
  const { document } = useCVStore();

  const { personalInfo, sections, template } = document;
  const styles = PREVIEW_TEMPLATE_STYLES[template];

  const contactLine = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
  ]
    .filter(Boolean)
    .join(" • ");

  const linkLine = [
    personalInfo.website,
    personalInfo.linkedIn,
    personalInfo.github,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <section className="bg-card flex flex-col gap-4 rounded-2xl border p-4 shadow-sm lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)]">
      <PreviewToolbar />

      {/* Scrollable A4 preview area (794px wide at 96 DPI) */}
      <div className="min-h-0 flex-1 overflow-auto rounded-lg">
        <article className={styles.article}>
          <header className={cn(styles.header, styles.headerLayout)}>
            <h1 className={styles.fullName}>
              {personalInfo.fullName || t("emptyName")}
            </h1>

            <p className={styles.contact}>
              {contactLine || t("emptyContacts")}
            </p>

            {linkLine ? <p className={styles.link}>{linkLine}</p> : null}

            {personalInfo.summary ? (
              <p className={styles.summary}>{personalInfo.summary}</p>
            ) : null}
          </header>

          {EXPORT_SECTION_ORDER.map((key) => {
            const section = sections[key];

            if (!section.visible) {
              return null;
            }

            if (key === "skills") {
              return (
                <SkillsPreview
                  key={key}
                  styles={styles}
                  template={template}
                  skills={visibleItems(section.items as SkillItem[])}
                />
              );
            }

            if (key === "languages") {
              return (
                <LanguagesPreview
                  key={key}
                  styles={styles}
                  languages={visibleItems(section.items as LanguageItem[])}
                />
              );
            }

            if (key === "extras") {
              return (
                <ExtrasPreview
                  key={key}
                  styles={styles}
                  extras={visibleItems(section.items as ExtraItem[])}
                />
              );
            }

            if (isEntrySection(key)) {
              return (
                <EntriesPreview
                  key={key}
                  sectionKey={key}
                  styles={styles}
                  items={visibleItems<EntrySectionItem>(sections[key].items)}
                />
              );
            }

            return null;
          })}
        </article>
      </div>
    </section>
  );
}

function PreviewToolbar() {
  const t = useTranslations("editor");
  const { document, setTemplate } = useCVStore();

  return (
    <header className="shrink-0 border-b pb-3">
      <h2 className="text-base font-semibold tracking-tight">
        {t("previewTitle")}
      </h2>
      <p className="text-muted-foreground text-xs">{t("previewDescription")}</p>

      <div className="mt-3 grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {t("templates.title")}
          </p>
          <p className="text-[11px] text-neutral-500">
            {t("templates.atsHint")}
          </p>
        </div>

        <div className="bg-background grid grid-cols-3 gap-1 rounded-xl border p-1">
          {CV_TEMPLATES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTemplate(option)}
              aria-pressed={document.template === option}
              className={cn(
                "rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                document.template === option
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`templates.options.${option}`)}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

interface PreviewSectionShellProps {
  title: string;
  styles: PreviewStyles;
  emptyText: string;
  isEmpty: boolean;
  children: ReactNode;
}

function PreviewSectionShell({
  title,
  styles,
  emptyText,
  isEmpty,
  children,
}: PreviewSectionShellProps) {
  return (
    <section className={cn(styles.section, styles.sectionContainer)}>
      <div className={styles.sectionTitleWrap}>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>

      {isEmpty ? (
        <p className="text-xs text-neutral-400">{emptyText}</p>
      ) : (
        children
      )}
    </section>
  );
}

type EntrySectionItem = SectionItemMap[EntrySectionKey];

interface EntriesPreviewProps {
  sectionKey: EntrySectionKey;
  styles: PreviewStyles;
  items: EntrySectionItem[];
}

function EntriesPreview({ sectionKey, styles, items }: EntriesPreviewProps) {
  const t = useTranslations("editor");
  const config = ENTRY_PREVIEW_CONFIGS[sectionKey];

  return (
    <PreviewSectionShell
      title={t(`sections.${sectionKey}`)}
      styles={styles}
      emptyText={t(config.emptyKey)}
      isEmpty={items.length === 0}
    >
      <div className={styles.contentGap}>
        {items.map((item) => {
          const entry = (
            config.toEntry as (value: EntrySectionItem) => PreviewEntryData
          )(item);

          return (
            <div key={item.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className={styles.itemTitle}>
                  {entry.title || t(config.untitledKey)}
                </p>
                <p className={styles.itemMeta}>
                  {item.startDate || "--"} –{" "}
                  {item.current ? t("current") : item.endDate || "--"}
                </p>
              </div>
              {entry.subLines.filter(Boolean).map((line) => (
                <p key={line} className={styles.itemSub}>
                  {line}
                </p>
              ))}
              {entry.body ? (
                <p className={styles.itemBody}>{entry.body}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </PreviewSectionShell>
  );
}

interface SkillsPreviewProps {
  styles: PreviewStyles;
  template: CVTemplate;
  skills: SkillItem[];
}

function SkillsPreview({ styles, template, skills }: SkillsPreviewProps) {
  const t = useTranslations("editor");

  return (
    <PreviewSectionShell
      title={t("sections.skills")}
      styles={styles}
      emptyText={t("emptySkillsPreview")}
      isEmpty={skills.length === 0}
    >
      {template === "compact" ? (
        <p className={styles.itemBody}>
          {skills
            .map((item) =>
              item.name
                ? `${item.name}${item.level ? ` (${item.level})` : ""}`
                : t("untitledSkill"),
            )
            .join(" | ")}
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((item) => (
            <span key={item.id} className={styles.skillChip}>
              {item.name || t("untitledSkill")}
              {item.level ? ` · ${item.level}` : ""}
            </span>
          ))}
        </div>
      )}
    </PreviewSectionShell>
  );
}

interface LanguagesPreviewProps {
  styles: PreviewStyles;
  languages: LanguageItem[];
}

function LanguagesPreview({ styles, languages }: LanguagesPreviewProps) {
  const t = useTranslations("editor");

  return (
    <PreviewSectionShell
      title={t("sections.languages")}
      styles={styles}
      emptyText={t("emptyLanguagesPreview")}
      isEmpty={languages.length === 0}
    >
      <div className="grid gap-1">
        {languages.map((item) => (
          <p key={item.id} className={styles.langLine}>
            <span className="font-medium text-neutral-900">
              {item.name || t("untitledLanguage")}
            </span>
            {item.proficiency ? ` — ${item.proficiency}` : ""}
            {item.details ? (
              <span className="text-neutral-500"> ({item.details})</span>
            ) : null}
          </p>
        ))}
      </div>
    </PreviewSectionShell>
  );
}

interface ExtrasPreviewProps {
  styles: PreviewStyles;
  extras: ExtraItem[];
}

function ExtrasPreview({ styles, extras }: ExtrasPreviewProps) {
  const t = useTranslations("editor");

  return (
    <PreviewSectionShell
      title={t("sections.extras")}
      styles={styles}
      emptyText={t("emptyExtrasPreview")}
      isEmpty={extras.length === 0}
    >
      <div className="grid gap-2">
        {extras.map((item) => (
          <div key={item.id}>
            <p className={styles.extraLine}>
              <span className="font-medium text-neutral-900">
                {item.title || t("untitledExtra")}
              </span>
              {item.value ? `: ${item.value}` : ""}
            </p>
            {item.details ? (
              <p className={styles.extraDetails}>{item.details}</p>
            ) : null}
          </div>
        ))}
      </div>
    </PreviewSectionShell>
  );
}
