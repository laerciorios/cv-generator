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
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-foreground/80 text-[0.8rem] font-medium">
        {label}
      </span>
      {children}
    </label>
  );
}
