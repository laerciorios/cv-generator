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
    <section className="bg-card grid gap-4 rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {tEditor(`sections.${section}`)}
          </h2>
          <p className="text-muted-foreground text-sm">
            {tEditor(config.descriptionKey)}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
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
      </div>

      {!state.visible ? (
        <p className="bg-muted text-muted-foreground rounded-lg border px-3 py-2 text-sm">
          {tEditor("sectionHidden")}
        </p>
      ) : null}

      <div className="grid gap-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-6 text-sm">
            {tEditor(config.emptyKey)}
          </p>
        ) : null}

        {items.map((item, index) => (
          <article key={item.id} className="grid gap-4 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{itemTitle(item)}</p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.toggleVisibility")}
                  aria-pressed={item.visible}
                  onClick={() =>
                    setSectionItemVisibility(section, item.id, !item.visible)
                  }
                >
                  {item.visible ? <EyeOff /> : <Eye />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.moveUp")}
                  onClick={() => reorderSectionItems(section, index, index - 1)}
                  disabled={index === 0}
                >
                  <ArrowUp />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={tEditor("actions.moveDown")}
                  onClick={() => reorderSectionItems(section, index, index + 1)}
                  disabled={index === items.length - 1}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  aria-label={tEditor("actions.deleteItem")}
                  onClick={() => removeSectionItem(section, item.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            <div
              className={cn(
                "grid gap-4",
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
                  onChange={(value) => updateField(item.id, field.name, value)}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
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
        <Field label={label} className={className}>
          <span className="border-input bg-background flex h-10 items-center gap-2 rounded-lg border px-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(event) => onChange(event.target.checked)}
            />
            <span>{label}</span>
          </span>
        </Field>
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
