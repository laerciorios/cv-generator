"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useCVStore } from "@/hooks/useCVStore";

const PREVIEW_TEMPLATE_STYLES = {
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
} as const;

export function CVPreview() {
  const t = useTranslations("editor");
  const { document, setTemplate } = useCVStore();

  const { personalInfo, sections, template } = document;
  const styles = PREVIEW_TEMPLATE_STYLES[template];

  const visibleExperience = sections.experience.items.filter(
    (item) => item.visible,
  );
  const visibleEducation = sections.education.items.filter(
    (item) => item.visible,
  );
  const visibleLanguages = sections.languages.items.filter(
    (item) => item.visible,
  );
  const visibleSkills = sections.skills.items.filter((item) => item.visible);
  const visibleVolunteer = sections.volunteer.items.filter(
    (item) => item.visible,
  );
  const visibleProjects = sections.projects.items.filter(
    (item) => item.visible,
  );
  const visibleExtras = sections.extras.items.filter((item) => item.visible);

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

  const templateOptions: Array<{
    value: keyof typeof PREVIEW_TEMPLATE_STYLES;
    label: string;
  }> = [
    { value: "classic", label: t("templates.options.classic") },
    { value: "compact", label: t("templates.options.compact") },
    { value: "executive", label: t("templates.options.executive") },
  ];

  return (
    <section className="bg-card flex flex-col gap-4 rounded-2xl border p-4 shadow-sm lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)]">
      <header className="shrink-0 border-b pb-3">
        <h2 className="text-base font-semibold tracking-tight">
          {t("previewTitle")}
        </h2>
        <p className="text-muted-foreground text-xs">
          {t("previewDescription")}
        </p>

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
            {templateOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTemplate(option.value)}
                aria-pressed={template === option.value}
                className={cn(
                  "rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                  template === option.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Scrollable A4 preview area */}
      <div className="min-h-0 flex-1 overflow-auto rounded-lg">
        {/* A4 paper: 794px wide at 96 DPI */}
        <article className={styles.article}>
          {/* Header: name + contacts + summary */}
          <header className={cn(styles.header, styles.headerLayout)}>
            <h1 className={styles.fullName}>
              {personalInfo.fullName || t("emptyName")}
            </h1>

            {contactLine ? (
              <p className={styles.contact}>{contactLine}</p>
            ) : (
              <p className={styles.contact}>{t("emptyContacts")}</p>
            )}

            {linkLine ? <p className={styles.link}>{linkLine}</p> : null}

            {personalInfo.summary ? (
              <p className={styles.summary}>{personalInfo.summary}</p>
            ) : null}
          </header>

          {/* Experience */}
          {sections.experience.visible ? (
            <section className={cn(styles.section, styles.sectionContainer)}>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>
                  {t("sections.experience")}
                </h2>
              </div>

              {visibleExperience.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyExperiencePreview")}
                </p>
              ) : (
                <div className={styles.contentGap}>
                  {visibleExperience.map((item) => (
                    <div key={item.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className={styles.itemTitle}>
                          {item.role || t("untitledExperience")}
                        </p>
                        <p className={styles.itemMeta}>
                          {item.startDate || "--"} –{" "}
                          {item.current ? t("current") : item.endDate || "--"}
                        </p>
                      </div>
                      {item.company || item.location ? (
                        <p className={styles.itemSub}>
                          {[item.company, item.location]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {item.summary ? (
                        <p className={styles.itemBody}>{item.summary}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Education */}
          {sections.education.visible ? (
            <section className={cn(styles.section, styles.sectionContainer)}>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>
                  {t("sections.education")}
                </h2>
              </div>

              {visibleEducation.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyEducationPreview")}
                </p>
              ) : (
                <div className={styles.contentGap}>
                  {visibleEducation.map((item) => (
                    <div key={item.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className={styles.itemTitle}>
                          {[item.degree, item.fieldOfStudy]
                            .filter(Boolean)
                            .join(" · ") || t("untitledEducation")}
                        </p>
                        <p className={styles.itemMeta}>
                          {item.startDate || "--"} –{" "}
                          {item.current ? t("current") : item.endDate || "--"}
                        </p>
                      </div>
                      {item.institution || item.location ? (
                        <p className={styles.itemSub}>
                          {[item.institution, item.location]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {item.summary ? (
                        <p className={styles.itemBody}>{item.summary}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Skills */}
          {sections.skills.visible ? (
            <section className={cn(styles.section, styles.sectionContainer)}>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>{t("sections.skills")}</h2>
              </div>

              {visibleSkills.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptySkillsPreview")}
                </p>
              ) : template === "compact" ? (
                <p className={styles.itemBody}>
                  {visibleSkills
                    .map((item) =>
                      item.name
                        ? `${item.name}${item.level ? ` (${item.level})` : ""}`
                        : t("untitledSkill"),
                    )
                    .join(" | ")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {visibleSkills.map((item) => (
                    <span key={item.id} className={styles.skillChip}>
                      {item.name || t("untitledSkill")}
                      {item.level ? ` · ${item.level}` : ""}
                    </span>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Languages */}
          {sections.languages.visible ? (
            <section className={cn(styles.section, styles.sectionContainer)}>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>
                  {t("sections.languages")}
                </h2>
              </div>

              {visibleLanguages.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyLanguagesPreview")}
                </p>
              ) : (
                <div className="grid gap-1">
                  {visibleLanguages.map((item) => (
                    <p key={item.id} className={styles.langLine}>
                      <span className="font-medium text-neutral-900">
                        {item.name || t("untitledLanguage")}
                      </span>
                      {item.proficiency ? ` — ${item.proficiency}` : ""}
                      {item.details ? (
                        <span className="text-neutral-500">
                          {" "}
                          ({item.details})
                        </span>
                      ) : null}
                    </p>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Volunteer */}
          {sections.volunteer.visible ? (
            <section className={cn(styles.section, styles.sectionContainer)}>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>
                  {t("sections.volunteer")}
                </h2>
              </div>

              {visibleVolunteer.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyVolunteerPreview")}
                </p>
              ) : (
                <div className={styles.contentGap}>
                  {visibleVolunteer.map((item) => (
                    <div key={item.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className={styles.itemTitle}>
                          {item.role || t("untitledVolunteer")}
                        </p>
                        <p className={styles.itemMeta}>
                          {item.startDate || "--"} –{" "}
                          {item.current ? t("current") : item.endDate || "--"}
                        </p>
                      </div>
                      {item.organization || item.location ? (
                        <p className={styles.itemSub}>
                          {[item.organization, item.location]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {item.summary ? (
                        <p className={styles.itemBody}>{item.summary}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Projects */}
          {sections.projects.visible ? (
            <section className={cn(styles.section, styles.sectionContainer)}>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>
                  {t("sections.projects")}
                </h2>
              </div>

              {visibleProjects.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyProjectsPreview")}
                </p>
              ) : (
                <div className={styles.contentGap}>
                  {visibleProjects.map((item) => (
                    <div key={item.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className={styles.itemTitle}>
                          {item.name || t("untitledProject")}
                        </p>
                        <p className={styles.itemMeta}>
                          {item.startDate || "--"} –{" "}
                          {item.current ? t("current") : item.endDate || "--"}
                        </p>
                      </div>
                      {item.role ? (
                        <p className={styles.itemSub}>{item.role}</p>
                      ) : null}
                      {item.website || item.github ? (
                        <p className={styles.itemSub}>
                          {[item.website, item.github]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {item.technologies.length > 0 ? (
                        <p className={styles.itemSub}>
                          {item.technologies.join(", ")}
                        </p>
                      ) : null}
                      {item.summary ? (
                        <p className={styles.itemBody}>{item.summary}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Extras */}
          {sections.extras.visible ? (
            <section className={cn(styles.section, styles.sectionContainer)}>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>{t("sections.extras")}</h2>
              </div>

              {visibleExtras.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyExtrasPreview")}
                </p>
              ) : (
                <div className="grid gap-2">
                  {visibleExtras.map((item) => (
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
              )}
            </section>
          ) : null}
        </article>
      </div>
    </section>
  );
}
