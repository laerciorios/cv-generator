"use client";

import { useTranslations } from "next-intl";
import { useCVStore } from "@/hooks/useCVStore";

export function CVPreview() {
  const t = useTranslations("editor");
  const { document } = useCVStore();

  const { personalInfo, sections } = document;

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

  return (
    <section className="bg-card flex flex-col gap-4 rounded-2xl border p-4 shadow-sm lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)]">
      <header className="shrink-0 border-b pb-3">
        <h2 className="text-base font-semibold tracking-tight">
          {t("previewTitle")}
        </h2>
        <p className="text-muted-foreground text-xs">
          {t("previewDescription")}
        </p>
      </header>

      {/* Scrollable A4 preview area */}
      <div className="min-h-0 flex-1 overflow-auto rounded-lg">
        {/* A4 paper: 794px wide at 96 DPI */}
        <article className="mx-auto w-full max-w-198.5 bg-white px-4 py-6 text-neutral-900 shadow-md sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 dark:bg-neutral-50">
          {/* Header: name + contacts + summary */}
          <header className="mb-6 border-b border-neutral-300 pb-5">
            <h1 className="mb-1 text-3xl font-bold tracking-tight text-neutral-900">
              {personalInfo.fullName || t("emptyName")}
            </h1>

            {contactLine ? (
              <p className="mb-0.5 text-sm text-neutral-600">{contactLine}</p>
            ) : (
              <p className="mb-0.5 text-sm text-neutral-400">
                {t("emptyContacts")}
              </p>
            )}

            {linkLine ? (
              <p className="text-xs text-neutral-500">{linkLine}</p>
            ) : null}

            {personalInfo.summary ? (
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                {personalInfo.summary}
              </p>
            ) : null}
          </header>

          {/* Experience */}
          {sections.experience.visible ? (
            <section className="mb-5">
              <h2 className="mb-2 border-b border-neutral-300 pb-1 text-xs font-bold tracking-widest text-neutral-500 uppercase">
                {t("sections.experience")}
              </h2>

              {visibleExperience.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyExperiencePreview")}
                </p>
              ) : (
                <div className="grid gap-3">
                  {visibleExperience.map((item) => (
                    <div key={item.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-neutral-900">
                          {item.role || t("untitledExperience")}
                        </p>
                        <p className="text-xs text-neutral-500 tabular-nums">
                          {item.startDate || "--"} –{" "}
                          {item.current ? t("current") : item.endDate || "--"}
                        </p>
                      </div>
                      {item.company || item.location ? (
                        <p className="text-xs text-neutral-500">
                          {[item.company, item.location]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {item.summary ? (
                        <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                          {item.summary}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Education */}
          {sections.education.visible ? (
            <section className="mb-5">
              <h2 className="mb-2 border-b border-neutral-300 pb-1 text-xs font-bold tracking-widest text-neutral-500 uppercase">
                {t("sections.education")}
              </h2>

              {visibleEducation.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyEducationPreview")}
                </p>
              ) : (
                <div className="grid gap-3">
                  {visibleEducation.map((item) => (
                    <div key={item.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-neutral-900">
                          {[item.degree, item.fieldOfStudy]
                            .filter(Boolean)
                            .join(" · ") || t("untitledEducation")}
                        </p>
                        <p className="text-xs text-neutral-500 tabular-nums">
                          {item.startDate || "--"} –{" "}
                          {item.current ? t("current") : item.endDate || "--"}
                        </p>
                      </div>
                      {item.institution || item.location ? (
                        <p className="text-xs text-neutral-500">
                          {[item.institution, item.location]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {item.summary ? (
                        <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                          {item.summary}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Skills */}
          {sections.skills.visible ? (
            <section className="mb-5">
              <h2 className="mb-2 border-b border-neutral-300 pb-1 text-xs font-bold tracking-widest text-neutral-500 uppercase">
                {t("sections.skills")}
              </h2>

              {visibleSkills.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptySkillsPreview")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {visibleSkills.map((item) => (
                    <span
                      key={item.id}
                      className="rounded border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700"
                    >
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
            <section className="mb-5">
              <h2 className="mb-2 border-b border-neutral-300 pb-1 text-xs font-bold tracking-widest text-neutral-500 uppercase">
                {t("sections.languages")}
              </h2>

              {visibleLanguages.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyLanguagesPreview")}
                </p>
              ) : (
                <div className="grid gap-1">
                  {visibleLanguages.map((item) => (
                    <p key={item.id} className="text-sm text-neutral-700">
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
            <section className="mb-5">
              <h2 className="mb-2 border-b border-neutral-300 pb-1 text-xs font-bold tracking-widest text-neutral-500 uppercase">
                {t("sections.volunteer")}
              </h2>

              {visibleVolunteer.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyVolunteerPreview")}
                </p>
              ) : (
                <div className="grid gap-3">
                  {visibleVolunteer.map((item) => (
                    <div key={item.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-neutral-900">
                          {item.role || t("untitledVolunteer")}
                        </p>
                        <p className="text-xs text-neutral-500 tabular-nums">
                          {item.startDate || "--"} –{" "}
                          {item.current ? t("current") : item.endDate || "--"}
                        </p>
                      </div>
                      {item.organization || item.location ? (
                        <p className="text-xs text-neutral-500">
                          {[item.organization, item.location]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {item.summary ? (
                        <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                          {item.summary}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Projects */}
          {sections.projects.visible ? (
            <section className="mb-5">
              <h2 className="mb-2 border-b border-neutral-300 pb-1 text-xs font-bold tracking-widest text-neutral-500 uppercase">
                {t("sections.projects")}
              </h2>

              {visibleProjects.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyProjectsPreview")}
                </p>
              ) : (
                <div className="grid gap-3">
                  {visibleProjects.map((item) => (
                    <div key={item.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-neutral-900">
                          {item.name || t("untitledProject")}
                        </p>
                        <p className="text-xs text-neutral-500 tabular-nums">
                          {item.startDate || "--"} –{" "}
                          {item.current ? t("current") : item.endDate || "--"}
                        </p>
                      </div>
                      {item.role ? (
                        <p className="text-xs text-neutral-500">{item.role}</p>
                      ) : null}
                      {item.website || item.github ? (
                        <p className="text-xs text-neutral-500">
                          {[item.website, item.github]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {item.technologies.length > 0 ? (
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {item.technologies.join(", ")}
                        </p>
                      ) : null}
                      {item.summary ? (
                        <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                          {item.summary}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Extras */}
          {sections.extras.visible ? (
            <section className="mb-5">
              <h2 className="mb-2 border-b border-neutral-300 pb-1 text-xs font-bold tracking-widest text-neutral-500 uppercase">
                {t("sections.extras")}
              </h2>

              {visibleExtras.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  {t("emptyExtrasPreview")}
                </p>
              ) : (
                <div className="grid gap-2">
                  {visibleExtras.map((item) => (
                    <div key={item.id}>
                      <p className="text-sm text-neutral-700">
                        <span className="font-medium text-neutral-900">
                          {item.title || t("untitledExtra")}
                        </span>
                        {item.value ? `: ${item.value}` : ""}
                      </p>
                      {item.details ? (
                        <p className="text-xs text-neutral-500">
                          {item.details}
                        </p>
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
