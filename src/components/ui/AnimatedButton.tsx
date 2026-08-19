"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { buttonBounce, springSnappy } from "@/lib/animations";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "danger" | "info" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  glow?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--duo-green)] text-white btn-shadow hover:brightness-110 active:brightness-95",
  danger:
    "bg-[var(--duo-danger)] text-white btn-shadow-danger hover:brightness-110 active:brightness-95",
  info:
    "bg-[var(--duo-info)] text-white btn-shadow-info hover:brightness-110 active:brightness-95",
  ghost:
    "bg-transparent text-[var(--duo-text)] hover:bg-black/5 dark:hover:bg-white/10",
  outline:
    "bg-transparent text-[var(--duo-green)] border-2 border-[var(--duo-green)] hover:bg-[var(--duo-green)] hover:text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm rounded-[var(--radius-button)]",
  md: "h-12 px-6 text-sm rounded-[var(--radius-button)]",
  lg: "h-14 px-8 text-base rounded-[var(--radius-button)]",
  xl: "h-16 px-10 text-lg rounded-[var(--radius-button)]",
};

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      icon,
      iconRight,
      loading = false,
      glow = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        variants={buttonBounce}
        initial="rest"
        whileHover={disabled || loading ? "rest" : "hover"}
        whileTap={disabled || loading ? "rest" : "tap"}
        transition={springSnappy}
        disabled={disabled || loading}
        className={`
          relative inline-flex items-center justify-center gap-2
          font-bold select-none cursor-pointer
          transition-all duration-120
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${glow ? "animate-glow" : ""}
          ${disabled || loading ? "opacity-50 cursor-not-allowed grayscale" : ""}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children as React.ReactNode}</span>}
        {iconRight && <span className="shrink-0">{iconRight}</span>}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
export default AnimatedButton;
