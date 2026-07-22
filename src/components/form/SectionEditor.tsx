"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCVStore } from "@/hooks/useCVStore";
import { cn } from "@/lib/utils";
import type {
  BaseSectionItem,
  CVSectionKey,
  SectionItemMap,
} from "@/types/cv.types";
import {
  SECTION_FORM_CONFIGS,
  type SectionFieldConfig,
} from "./section-form-configs";

type SectionItem = BaseSectionItem & Record<string, unknown>;

interface SectionEditorProps {
  section: CVSectionKey;
}

/**
 * Config-driven editor for every list-based CV section. Field layout, labels,
 * and behavior come from SECTION_FORM_CONFIGS.
 */
export function SectionEditor({ section }: SectionEditorProps) {
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

  const config = SECTION_FORM_CONFIGS[section];
  const state = document.sections[section];
  const items = state.items as unknown as SectionItem[];

  function updateField(itemId: string, name: string, value: unknown) {
    updateSectionItem(section, itemId, {
      [name]: value,
    } as Partial<SectionItemMap[typeof section]>);
  }

  function itemTitle(item: SectionItem): string {
    const title = config.titleFields
      .map((field) => String(item[field] ?? ""))
      .find(Boolean);

    return title || tEditor(config.untitledKey);
  }

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {tEditor(`sections.${section}`)}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-[0.8rem]">
            {tEditor(config.descriptionKey)}
          </p>
        </div>

        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSectionVisibility(section, !state.visible)}
          >
            {state.visible ? <EyeOff /> : <Eye />}
            {state.visible
              ? tSections("actions.hide")
              : tSections("actions.show")}
          </Button>
          <Button size="sm" onClick={() => addSectionItem(section)}>
            <Plus />
            {tSections("actions.addItem")}
          </Button>
        </div>
      </header>

      {!state.visible ? (
        <p className="bg-muted text-muted-foreground flex items-center gap-2 rounded-md px-3 py-2 text-[0.8rem]">
          <EyeOff className="size-3.5 shrink-0" aria-hidden="true" />
          {tEditor("sectionHidden")}
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed px-5 py-6">
          <p className="text-muted-foreground text-sm">
            {tEditor(config.emptyKey)}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSectionItem(section)}
          >
            <Plus />
            {tSections("actions.addItem")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <article
              key={item.id}
              className={cn(
                "border-border/70 flex flex-col gap-4 rounded-lg border p-4",
                !item.visible && "opacity-60",
              )}
            >
              <div className="-mt-1 flex flex-wrap items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold">
                  {itemTitle(item)}
                </p>

                <div className="flex gap-0.5" role="group">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={tEditor("actions.toggleVisibility")}
                    aria-pressed={item.visible}
                    onClick={() =>
                      setSectionItemVisibility(section, item.id, !item.visible)
                    }
                  >
                    {item.visible ? <EyeOff /> : <Eye />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={tEditor("actions.moveUp")}
                    onClick={() =>
                      reorderSectionItems(section, index, index - 1)
                    }
                    disabled={index === 0}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={tEditor("actions.moveDown")}
                    onClick={() =>
                      reorderSectionItems(section, index, index + 1)
                    }
                    disabled={index === items.length - 1}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10"
                    aria-label={tEditor("actions.deleteItem")}
                    onClick={() => removeSectionItem(section, item.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>

              <div
                className={cn(
                  "grid gap-3",
                  config.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
                )}
              >
                {config.fields.map((field) => (
                  <SectionItemField
                    key={field.name}
                    field={field}
                    item={item}
                    columns={config.columns}
                    label={tEditor(`${config.labelPrefix}.${field.name}`)}
                    translate={tEditor}
                    onChange={(value) =>
                      updateField(item.id, field.name, value)
                    }
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

interface SectionItemFieldProps {
  field: SectionFieldConfig;
  item: SectionItem;
  columns: 2 | 3;
  label: string;
  translate: (key: string) => string;
  onChange: (value: unknown) => void;
}

function SectionItemField({
  field,
  item,
  columns,
  label,
  translate,
  onChange,
}: SectionItemFieldProps) {
  const value = item[field.name];
  const disabled = field.disabledWhenCurrent && Boolean(item.current);
  const className = field.fullWidth
    ? columns === 3
      ? "md:col-span-3"
      : "md:col-span-2"
    : undefined;

  switch (field.kind) {
    case "textarea":
      return (
        <Field label={label} className={className}>
          <Textarea
            value={String(value ?? "")}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
          />
        </Field>
      );
    case "checkbox":
      return (
        <label
          className={cn(
            "border-input bg-card hover:bg-muted/60 flex h-9 cursor-pointer items-center gap-2 self-end rounded-md border px-2.5 text-sm shadow-xs transition-colors",
            className,
          )}
        >
          <input
            type="checkbox"
            className="accent-primary size-3.5"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
          />
          <span className="text-[0.8rem] font-medium">{label}</span>
        </label>
      );
    case "select":
      return (
        <Field label={label} className={className}>
          <Select
            value={String(value ?? "")}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">
              {translate(`${field.optionsKeyPrefix}.select`)}
            </option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {translate(`${field.optionsKeyPrefix}.${option}`)}
              </option>
            ))}
          </Select>
        </Field>
      );
    case "list":
      return (
        <Field label={label} className={className}>
          <Input
            value={Array.isArray(value) ? value.join(", ") : ""}
            disabled={disabled}
            onChange={(event) =>
              onChange(
                event.target.value
                  .split(",")
                  .map((entry) => entry.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
      );
    default:
      return (
        <Field label={label} className={className}>
          <Input
            value={String(value ?? "")}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
          />
        </Field>
      );
  }
}
