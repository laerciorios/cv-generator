import type { ComponentProps } from "react";
import { fieldControlClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(fieldControlClassName, className)} {...props} />;
}
