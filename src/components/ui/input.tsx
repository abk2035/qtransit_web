import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-text-muted dark:text-slate-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-3.5 py-2 text-sm text-text-primary dark:text-slate-100 placeholder:text-text-muted dark:placeholder:text-slate-500 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
              icon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              error ? "border-status-danger focus-visible:border-status-danger focus-visible:ring-status-danger" : "",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-status-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
