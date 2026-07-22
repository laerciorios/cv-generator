"use client";

import { useTranslations } from "next-intl";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCVStore } from "@/hooks/useCVStore";
import type { PersonalInfo } from "@/types/cv.types";

interface PersonalFieldConfig {
  name: keyof PersonalInfo;
  type?: "email" | "tel" | "url";
  autoComplete?: string;
}

const CONTACT_FIELDS: readonly PersonalFieldConfig[] = [
  { name: "fullName" },
  { name: "email", type: "email", autoComplete: "email" },
  { name: "phone", type: "tel", autoComplete: "tel" },
  { name: "location" },
];

const LINK_FIELDS: readonly PersonalFieldConfig[] = [
  { name: "website", type: "url", autoComplete: "url" },
  { name: "linkedIn", type: "url" },
  { name: "github", type: "url" },
];

export function PersonalInfoSection() {
  const tForm = useTranslations("form");
  const tEditor = useTranslations("editor");
  const { document, updatePersonalInfo } = useCVStore();

  function renderField(field: PersonalFieldConfig) {
    return (
      <Field key={field.name} label={tForm(`labels.${field.name}`)}>
        <Input
          type={field.type}
          autoComplete={field.autoComplete}
          placeholder={tForm(`placeholders.${field.name}`)}
          value={document.personalInfo[field.name] ?? ""}
          onChange={(event) =>
            updatePersonalInfo({ [field.name]: event.target.value })
          }
        />
      </Field>
    );
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
        {CONTACT_FIELDS.map(renderField)}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {LINK_FIELDS.map(renderField)}
      </div>

      <Field label={tForm("labels.summary")}>
        <Textarea
          className="min-h-28"
          placeholder={tForm("placeholders.summary")}
          value={document.personalInfo.summary ?? ""}
          onChange={(event) =>
            updatePersonalInfo({ summary: event.target.value })
          }
        />
      </Field>
    </section>
  );
}
