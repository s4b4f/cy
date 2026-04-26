import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost" | "destructive" | "outline";
type ButtonSize = "sm" | "md" | "lg";

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
    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    "disabled:pointer-events-none disabled:opacity-50",
    size === "sm" && "h-9 px-3 text-sm",
    size === "md" && "h-10 px-4 text-sm",
    size === "lg" && "h-11 px-5 text-sm",
    variant === "default" && "bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
    variant === "secondary" && "border border-zinc-800 bg-zinc-900/80 text-zinc-100 hover:bg-zinc-800",
    variant === "ghost" && "bg-transparent text-zinc-300 hover:bg-zinc-900/70 hover:text-zinc-50",
    variant === "destructive" && "bg-rose-600 text-white hover:bg-rose-700",
    variant === "outline" && "border border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-900/70",
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
