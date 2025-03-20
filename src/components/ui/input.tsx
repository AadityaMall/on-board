import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}
// Input Field Component
function InputField({
  label,
  type,
  id,
  name,
  icon,
  error,
  className,
  ...rest // Capture all additional props
}: {
  label: string;
  type: string;
  id: string;
  name: string;
  icon: React.ReactNode;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) { // Accepts all input props
  return (
    <div className="py-2">
      <label htmlFor={id} className="text-sm">
        {label} <span className="text-red-500 text-[10px]">*</span>
      </label>
      <div className="form-group"> {/* Ensuring flex layout */}
        {icon} {/* Add margin for icon */}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={label}
          className={cn(
            "form-input",
            "w-full",
            "text-sm",
            "font-medium",
            "rounded-md",
            className
          )}
          {...rest} // Pass down additional props
        />
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

export { Input, InputField }
