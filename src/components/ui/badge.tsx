import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "primary";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "neutral", size = "md", ...props }: BadgeProps) {
  const variants = {
    success: "bg-status-success-light dark:bg-emerald-950/50 text-status-success-text dark:text-emerald-300 border-status-success-border dark:border-emerald-800",
    warning: "bg-status-warning-light dark:bg-amber-950/50 text-status-warning-text dark:text-amber-300 border-status-warning-border dark:border-amber-800",
    danger: "bg-status-danger-light dark:bg-rose-950/50 text-status-danger-text dark:text-rose-300 border-status-danger-border dark:border-rose-800",
    info: "bg-status-info-light dark:bg-blue-950/50 text-status-info-text dark:text-blue-300 border-status-info-border dark:border-blue-800",
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    primary: "bg-primary-100 dark:bg-teal-950/60 text-primary-900 dark:text-teal-300 border-primary-200 dark:border-teal-800",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px] font-medium",
    md: "px-2.5 py-1 text-xs font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
