import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const fieldControlClassName =
  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus-visible:ring-3";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldControlClassName, className)} {...props} />;
}
