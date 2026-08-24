"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { buttonBounce, springSnappy } from "@/lib/animations";
import { forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "danger"
  | "info"
  | "ghost"
  | "outline"
  | "gold"
  | "purple"
  | "success"
  | "surface";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

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
    "bg-[var(--primary)] text-white btn-shadow hover:brightness-110 active:brightness-95",
  danger:
    "bg-[var(--danger)] text-white btn-shadow-danger hover:brightness-110 active:brightness-95",
  info:
    "bg-[var(--info)] text-white btn-shadow-info hover:brightness-110 active:brightness-95",
  success:
    "bg-[var(--success)] text-white shadow-[0_4px_0_var(--success-bg)] hover:brightness-110 active:brightness-95",
  ghost:
    "bg-transparent text-[var(--fg)] hover:bg-[var(--border-subtle)] active:bg-[var(--border)]",
  outline:
    "bg-transparent text-[var(--primary)] border-2 border-[var(--primary)] hover:bg-[var(--primary-bg)] shadow-none",
  gold:
    "bg-gradient-to-r from-[var(--accent-xp)] via-[#FFC107] to-[var(--accent-xp)] text-[#5C4300] shadow-[0_4px_0_#CC8A00] hover:brightness-110 active:brightness-95 hover:shadow-[0_6px_0_#CC8A00] hover:-translate-y-0.5 active:shadow-[0_2px_0_#CC8A00] active:translate-y-0.5 bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-300",
  purple:
    "bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] text-white shadow-[0_4px_0_var(--purple-dark)] hover:brightness-110 active:brightness-95",
  surface:
    "bg-[var(--surface)] text-[var(--fg)] border-2 border-[var(--border)] shadow-[0_3px_0_var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-[0_3px_0_var(--primary-bg)] active:shadow-none active:translate-y-px",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-8 px-3 text-xs rounded-xl gap-1.5",
  sm: "h-10 px-4 text-sm rounded-[var(--radius-button)]",
  md: "h-12 px-5 text-sm rounded-[var(--radius-button)]",
  lg: "h-14 px-7 text-base rounded-[var(--radius-button)]",
  xl: "h-16 px-9 text-lg rounded-[var(--radius-button)]",
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
    const isDisabled = disabled || loading;
    return (
      <motion.button
        ref={ref}
        variants={buttonBounce}
        initial="rest"
        whileHover={isDisabled ? "rest" : "hover"}
        whileTap={isDisabled ? "rest" : "tap"}
        transition={springSnappy}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={[
          "relative inline-flex items-center justify-center gap-2",
          "font-black select-none cursor-pointer",
          "transition-all duration-120",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          glow ? "animate-glow" : "",
          isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          icon && <span className="shrink-0 flex items-center">{icon}</span>
        )}
        {children && <span className="leading-none">{children as React.ReactNode}</span>}
        {!loading && iconRight && (
          <span className="shrink-0 flex items-center">{iconRight}</span>
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
export default AnimatedButton;
