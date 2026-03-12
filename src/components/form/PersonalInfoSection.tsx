"use client";

import { useTranslations } from "next-intl";
import { useCVStore } from "@/hooks/useCVStore";
import type { PersonalInfo } from "@/types/cv.types";

const inputClassName =
  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus-visible:ring-3";

const textareaClassName = `${inputClassName} min-h-28 resize-y py-3`;

export function PersonalInfoSection() {
  const tForm = useTranslations("form");
  const tEditor = useTranslations("editor");
  const { document, updatePersonalInfo } = useCVStore();

  function updateField(field: keyof PersonalInfo, value: string) {
    updatePersonalInfo({ [field]: value });
  }

  return (
    <section className="bg-card grid gap-4 rounded-2xl border p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {tEditor("sections.personal")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {tEditor("personalDescription")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium">
            {tForm("labels.fullName")}
          </span>
          <input
            className={inputClassName}
            placeholder={tForm("placeholders.fullName")}
            value={document.personalInfo.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">{tForm("labels.email")}</span>
          <input
            type="email"
            autoComplete="email"
            className={inputClassName}
            placeholder={tForm("placeholders.email")}
            value={document.personalInfo.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">{tForm("labels.phone")}</span>
          <input
            type="tel"
            autoComplete="tel"
            className={inputClassName}
            placeholder={tForm("placeholders.phone")}
            value={document.personalInfo.phone ?? ""}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">
            {tForm("labels.location")}
          </span>
          <input
            className={inputClassName}
            placeholder={tForm("placeholders.location")}
            value={document.personalInfo.location ?? ""}
            onChange={(event) => updateField("location", event.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-medium">{tForm("labels.website")}</span>
          <input
            type="url"
            autoComplete="url"
            className={inputClassName}
            placeholder={tForm("placeholders.website")}
            value={document.personalInfo.website ?? ""}
            onChange={(event) => updateField("website", event.target.value)}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">
            {tForm("labels.linkedIn")}
          </span>
          <input
            type="url"
            className={inputClassName}
            placeholder={tForm("placeholders.linkedIn")}
            value={document.personalInfo.linkedIn ?? ""}
            onChange={(event) => updateField("linkedIn", event.target.value)}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">{tForm("labels.github")}</span>
          <input
            type="url"
            className={inputClassName}
            placeholder={tForm("placeholders.github")}
            value={document.personalInfo.github ?? ""}
            onChange={(event) => updateField("github", event.target.value)}
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-medium">{tForm("labels.summary")}</span>
        <textarea
          className={textareaClassName}
          placeholder={tForm("placeholders.summary")}
          value={document.personalInfo.summary ?? ""}
          onChange={(event) => updateField("summary", event.target.value)}
        />
      </label>
    </section>
  );
}
