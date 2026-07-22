import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const fieldControlClassName =
  "border-input bg-card placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/40 flex h-9 w-full rounded-md border px-2.5 py-1.5 text-sm shadow-xs outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldControlClassName, className)} {...props} />;
}
