import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Labeled form control wrapper shared by all editor forms. */
export function Field({ label, children, className }: FieldProps) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
