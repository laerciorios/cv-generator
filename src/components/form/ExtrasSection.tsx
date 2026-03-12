"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCVStore } from "@/hooks/useCVStore";

const inputClassName =
  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus-visible:ring-3";

const textareaClassName = `${inputClassName} min-h-24 resize-y py-3`;

export function ExtrasSection() {
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

  const extras = document.sections.extras;

  return (
    <section className="bg-card grid gap-4 rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {tEditor("sections.extras")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {tEditor("extrasDescription")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSectionVisibility("extras", !extras.visible)}
          >
            {extras.visible ? <EyeOff /> : <Eye />}
            {extras.visible
              ? tSections("actions.hide")
              : tSections("actions.show")}
          </Button>
          <Button size="sm" onClick={() => addSectionItem("extras")}>
            <Plus />
            {tSections("actions.addItem")}
          </Button>
        </div>
      </div>

      {!extras.visible ? (
        <p className="bg-muted text-muted-foreground rounded-lg border px-3 py-2 text-sm">
          {tEditor("sectionHidden")}
        </p>
      ) : null}

      <div className="grid gap-4">
        {extras.items.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-6 text-sm">
            {tEditor("emptyExtras")}
          </p>
        ) : null}

        {extras.items.map((item, index) => (
          <article key={item.id} className="grid gap-4 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">
                {item.title || tEditor("untitledExtra")}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.toggleVisibility")}
                  aria-pressed={item.visible}
                  onClick={() =>
                    setSectionItemVisibility("extras", item.id, !item.visible)
                  }
                >
                  {item.visible ? <EyeOff /> : <Eye />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.moveUp")}
                  onClick={() =>
                    reorderSectionItems("extras", index, index - 1)
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
                    reorderSectionItems("extras", index, index + 1)
                  }
                  disabled={index === extras.items.length - 1}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  aria-label={tEditor("actions.deleteItem")}
                  onClick={() => removeSectionItem("extras", item.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("extra.title")}
                </span>
                <input
                  className={inputClassName}
                  value={item.title}
                  onChange={(event) =>
                    updateSectionItem("extras", item.id, {
                      title: event.target.value,
                    })
                  }
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium">
                  {tEditor("extra.value")}
                </span>
                <input
                  className={inputClassName}
                  value={item.value}
                  onChange={(event) =>
                    updateSectionItem("extras", item.id, {
                      value: event.target.value,
                    })
                  }
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium">
                {tEditor("extra.details")}
              </span>
              <textarea
                className={textareaClassName}
                value={item.details}
                onChange={(event) =>
                  updateSectionItem("extras", item.id, {
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
