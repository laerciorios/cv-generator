"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCVStore } from "@/hooks/useCVStore";

const inputClassName =
  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus-visible:ring-3";

const textareaClassName = `${inputClassName} min-h-24 resize-y py-3`;

export function ProjectsSection() {
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

  const projects = document.sections.projects;

  return (
    <section className="bg-card grid gap-4 rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {tEditor("sections.projects")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {tEditor("projectsDescription")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSectionVisibility("projects", !projects.visible)}
          >
            {projects.visible ? <EyeOff /> : <Eye />}
            {projects.visible
              ? tSections("actions.hide")
              : tSections("actions.show")}
          </Button>
          <Button size="sm" onClick={() => addSectionItem("projects")}>
            <Plus />
            {tSections("actions.addItem")}
          </Button>
        </div>
      </div>

      {!projects.visible ? (
        <p className="bg-muted text-muted-foreground rounded-lg border px-3 py-2 text-sm">
          {tEditor("sectionHidden")}
        </p>
      ) : null}

      <div className="grid gap-4">
        {projects.items.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-6 text-sm">
            {tEditor("emptyProjects")}
          </p>
        ) : null}

        {projects.items.map((item, index) => (
          <article key={item.id} className="grid gap-4 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">
                {item.name || tEditor("untitledProject")}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.toggleVisibility")}
                  aria-pressed={item.visible}
                  onClick={() =>
                    setSectionItemVisibility("projects", item.id, !item.visible)
                  }
                >
                  {item.visible ? <EyeOff /> : <Eye />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.moveUp")}
                  onClick={() =>
                    reorderSectionItems("projects", index, index - 1)
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
                    reorderSectionItems("projects", index, index + 1)
                  }
                  disabled={index === projects.items.length - 1}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  aria-label={tEditor("actions.deleteItem")}
                  onClick={() => removeSectionItem("projects", item.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("project.name")}
                </span>
                <input
                  className={inputClassName}
                  value={item.name}
                  onChange={(event) =>
                    updateSectionItem("projects", item.id, {
                      name: event.target.value,
                    })
                  }
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("project.role")}
                </span>
                <input
                  className={inputClassName}
                  value={item.role}
                  onChange={(event) =>
                    updateSectionItem("projects", item.id, {
                      role: event.target.value,
                    })
                  }
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("project.website")}
                </span>
                <input
                  className={inputClassName}
                  value={item.website}
                  onChange={(event) =>
                    updateSectionItem("projects", item.id, {
                      website: event.target.value,
                    })
                  }
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("project.github")}
                </span>
                <input
                  className={inputClassName}
                  value={item.github}
                  onChange={(event) =>
                    updateSectionItem("projects", item.id, {
                      github: event.target.value,
                    })
                  }
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("project.current")}
                </span>
                <label className="border-input bg-background flex h-10 items-center gap-2 rounded-lg border px-3 text-sm">
                  <input
                    type="checkbox"
                    checked={item.current}
                    onChange={(event) =>
                      updateSectionItem("projects", item.id, {
                        current: event.target.checked,
                      })
                    }
                  />
                  <span>{tEditor("project.current")}</span>
                </label>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("project.startDate")}
                </span>
                <input
                  className={inputClassName}
                  value={item.startDate}
                  onChange={(event) =>
                    updateSectionItem("projects", item.id, {
                      startDate: event.target.value,
                    })
                  }
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("project.endDate")}
                </span>
                <input
                  className={inputClassName}
                  value={item.endDate}
                  disabled={item.current}
                  onChange={(event) =>
                    updateSectionItem("projects", item.id, {
                      endDate: event.target.value,
                    })
                  }
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium">
                {tEditor("project.technologies")}
              </span>
              <input
                className={inputClassName}
                value={item.technologies.join(", ")}
                onChange={(event) =>
                  updateSectionItem("projects", item.id, {
                    technologies: event.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">
                {tEditor("project.summary")}
              </span>
              <textarea
                className={textareaClassName}
                value={item.summary}
                onChange={(event) =>
                  updateSectionItem("projects", item.id, {
                    summary: event.target.value,
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
