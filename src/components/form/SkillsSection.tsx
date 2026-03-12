"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCVStore } from "@/hooks/useCVStore";

const inputClassName =
  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus-visible:ring-3";

export function SkillsSection() {
  const tEditor = useTranslations("editor");
  const tSections = useTranslations("sections");
  const {
    document,
    addSectionItem,
    removeSectionItem,
    updateSectionItem,
    setSectionVisibility,
    setSectionItemVisibility,
    reorderSectionItems,
  } = useCVStore();

  const skills = document.sections.skills;

  return (
    <section className="bg-card grid gap-4 rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {tEditor("sections.skills")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {tEditor("skillsDescription")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSectionVisibility("skills", !skills.visible)}
          >
            {skills.visible ? <EyeOff /> : <Eye />}
            {skills.visible
              ? tSections("actions.hide")
              : tSections("actions.show")}
          </Button>
          <Button size="sm" onClick={() => addSectionItem("skills")}>
            <Plus />
            {tSections("actions.addItem")}
          </Button>
        </div>
      </div>

      {!skills.visible ? (
        <p className="bg-muted text-muted-foreground rounded-lg border px-3 py-2 text-sm">
          {tEditor("sectionHidden")}
        </p>
      ) : null}

      <div className="grid gap-4">
        {skills.items.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-6 text-sm">
            {tEditor("emptySkills")}
          </p>
        ) : null}

        {skills.items.map((item, index) => (
          <article key={item.id} className="grid gap-4 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">
                {item.name || tEditor("untitledSkill")}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.toggleVisibility")}
                  aria-pressed={item.visible}
                  onClick={() =>
                    setSectionItemVisibility("skills", item.id, !item.visible)
                  }
                >
                  {item.visible ? <EyeOff /> : <Eye />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.moveUp")}
                  onClick={() =>
                    reorderSectionItems("skills", index, index - 1)
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
                    reorderSectionItems("skills", index, index + 1)
                  }
                  disabled={index === skills.items.length - 1}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  aria-label={tEditor("actions.deleteItem")}
                  onClick={() => removeSectionItem("skills", item.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("skill.name")}
                </span>
                <input
                  className={inputClassName}
                  value={item.name}
                  onChange={(event) =>
                    updateSectionItem("skills", item.id, {
                      name: event.target.value,
                    })
                  }
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("skill.category")}
                </span>
                <input
                  className={inputClassName}
                  value={item.category}
                  onChange={(event) =>
                    updateSectionItem("skills", item.id, {
                      category: event.target.value,
                    })
                  }
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("skill.level")}
                </span>
                <input
                  className={inputClassName}
                  value={item.level}
                  onChange={(event) =>
                    updateSectionItem("skills", item.id, {
                      level: event.target.value,
                    })
                  }
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
