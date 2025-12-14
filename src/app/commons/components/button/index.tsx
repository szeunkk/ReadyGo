"use client";

import React from "react";
import styles from "./styles.module.css";
import { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "s" | "m";
export type ButtonState = "default" | "hover" | "disabled";
export type ButtonShape = "round" | "rectangle";
export type ButtonTheme = "light" | "dark";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  shape?: ButtonShape;
  theme?: ButtonTheme;
  children?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "m",
  state = "default",
  shape = "round",
  theme = "light",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || state === "disabled";

  const buttonClasses = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`state-${state}`],
    styles[`shape-${shape}`],
    styles[`theme-${theme}`],
    isDisabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} disabled={isDisabled} {...props}>
      <span className={styles.content}>{children}</span>
    </button>
  );
}

