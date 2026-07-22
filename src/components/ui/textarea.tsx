import type { ComponentProps } from "react";
import { fieldControlClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        fieldControlClassName,
        "min-h-22 resize-y py-2 leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
