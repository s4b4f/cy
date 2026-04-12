import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function buttonClassName({
  variant = "default",
  size = "md",
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    "disabled:pointer-events-none disabled:opacity-50",
    size === "sm" ? "h-9 px-3" : "h-10 px-4",
    variant === "default" && "bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
    variant === "secondary" && "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
    variant === "ghost" && "bg-transparent text-zinc-100 hover:bg-zinc-900",
    variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
    className
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "md", type = "button", ...props },
  ref
) {
  return (
    <button ref={ref} type={type} className={buttonClassName({ variant, size, className })} {...props} />
  );
});

