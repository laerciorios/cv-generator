"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCVStore } from "@/hooks/useCVStore";

const inputClassName =
  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus-visible:ring-3";

const textareaClassName = `${inputClassName} min-h-24 resize-y py-3`;

export function LanguagesSection() {
  const tEditor = useTranslations("editor");
  const tSections = useTranslations("sections");
  const proficiencyOptions = [
    "basic",
    "intermediate",
    "advanced",
    "fluent",
    "native",
  ] as const;
  const {
    document,
    addSectionItem,
    removeSectionItem,
    updateSectionItem,
    setSectionVisibility,
    setSectionItemVisibility,
    reorderSectionItems,
  } = useCVStore();

  const languages = document.sections.languages;

  return (
    <section className="bg-card grid gap-4 rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {tEditor("sections.languages")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {tEditor("languagesDescription")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSectionVisibility("languages", !languages.visible)
            }
          >
            {languages.visible ? <EyeOff /> : <Eye />}
            {languages.visible
              ? tSections("actions.hide")
              : tSections("actions.show")}
          </Button>
          <Button size="sm" onClick={() => addSectionItem("languages")}>
            <Plus />
            {tSections("actions.addItem")}
          </Button>
        </div>
      </div>

      {!languages.visible ? (
        <p className="bg-muted text-muted-foreground rounded-lg border px-3 py-2 text-sm">
          {tEditor("sectionHidden")}
        </p>
      ) : null}

      <div className="grid gap-4">
        {languages.items.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-6 text-sm">
            {tEditor("emptyLanguages")}
          </p>
        ) : null}

        {languages.items.map((item, index) => (
          <article key={item.id} className="grid gap-4 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">
                {item.name || tEditor("untitledLanguage")}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.toggleVisibility")}
                  aria-pressed={item.visible}
                  onClick={() =>
                    setSectionItemVisibility(
                      "languages",
                      item.id,
                      !item.visible,
                    )
                  }
                >
                  {item.visible ? <EyeOff /> : <Eye />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.moveUp")}
                  onClick={() =>
                    reorderSectionItems("languages", index, index - 1)
                  }
                  disabled={index === 0}
                >
                  <ArrowUp />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.moveDown")}
                  onClick={() =>
                    reorderSectionItems("languages", index, index + 1)
                  }
                  disabled={index === languages.items.length - 1}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  aria-label={tEditor("actions.deleteItem")}
                  onClick={() => removeSectionItem("languages", item.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("language.name")}
                </span>
                <input
                  className={inputClassName}
                  value={item.name}
                  onChange={(event) =>
                    updateSectionItem("languages", item.id, {
                      name: event.target.value,
                    })
                  }
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("language.proficiency")}
                </span>
                <select
                  className={inputClassName}
                  value={item.proficiency}
                  onChange={(event) =>
                    updateSectionItem("languages", item.id, {
                      proficiency: event.target.value,
                    })
                  }
                >
                  <option value="">
                    {tEditor("language.proficiencyOptions.select")}
                  </option>
                  {proficiencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {tEditor(`language.proficiencyOptions.${option}`)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium">
                {tEditor("language.details")}
              </span>
              <textarea
                className={textareaClassName}
                value={item.details}
                onChange={(event) =>
                  updateSectionItem("languages", item.id, {
                    details: event.target.value,
                  })
                }
              />
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}
