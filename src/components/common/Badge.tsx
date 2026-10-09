import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "warning" | "outline";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-emerald-50 text-emerald-800 border-emerald-200",
    secondary: "bg-stone-100 text-stone-700 border-stone-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    outline: "bg-transparent text-stone-600 border-stone-300",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
