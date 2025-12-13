"use client";

import React from "react";
import styles from "./styles.module.css";
import { InputHTMLAttributes } from "react";

export type CheckboxStatus = "unselected" | "selected" | "partial";
export type CheckboxState =
  | "default"
  | "hover"
  | "press"
  | "focus"
  | "disabled"
  | "error";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked"> {
  status?: CheckboxStatus;
  state?: CheckboxState;
  checked?: boolean;
  indeterminate?: boolean;
}

export default function Checkbox({
  status,
  state = "default",
  checked = false,
  indeterminate = false,
  className = "",
  disabled,
  ...props
}: CheckboxProps) {
  const isDisabled = disabled || state === "disabled";

  // status를 checked와 indeterminate로부터 결정
  const actualStatus: CheckboxStatus =
    status || (indeterminate ? "partial" : checked ? "selected" : "unselected");

  const checkboxClasses = [
    styles.checkbox,
    styles[`status-${actualStatus}`],
    styles[`state-${state}`],
    isDisabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={styles.label}>
      <input
        ref={inputRef}
        type="checkbox"
        className={styles.input}
        checked={checked}
        disabled={isDisabled}
        {...props}
      />
      <div
        className={`${styles.checkboxWrapper} ${
          state === "focus" &&
          (actualStatus === "selected" || actualStatus === "partial")
            ? styles.hasFocusRing
            : ""
        }`}>
        <span className={checkboxClasses}>
          {actualStatus === "selected" && (
            <svg
              className={styles.icon}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {actualStatus === "partial" && (
            <svg
              className={styles.icon}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 6H9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </div>
    </label>
  );
}
