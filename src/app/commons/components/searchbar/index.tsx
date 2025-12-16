"use client";

import React from "react";
import styles from "./styles.module.css";
import { InputHTMLAttributes } from "react";
import Image from "next/image";

export type SearchbarTheme = "light" | "dark";

export interface SearchbarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  theme?: SearchbarTheme;
  children?: React.ReactNode;
  iconLeft?: boolean;
  iconRight?: boolean;
  iconSize?: 14 | 16 | 20 | 24 | 32 | 40;
  gap?: number;
  onIconLeftClick?: () => void;
  onIconRightClick?: () => void;
}

export default function Searchbar({
  theme = "light",
  children,
  iconLeft,
  iconRight,
  iconSize = 20,
  gap = 4,
  onIconLeftClick,
  onIconRightClick,
  className = "",
  ...props
}: SearchbarProps) {
  const searchbarClasses = [
    styles.searchbar,
    styles[`theme-${theme}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={searchbarClasses}>
      <div className={styles.searchbarContent} style={{ gap: `${gap}px` }}>
        {iconLeft && (
          <button
            type="button"
            className={styles.iconButton}
            onClick={onIconLeftClick}
            aria-label="Search icon">
            <Image
              src={`/icons/size=${iconSize}.svg`}
              alt=""
              width={iconSize}
              height={iconSize}
              className={styles.icon}
            />
          </button>
        )}
        <div className={styles.inputContainer}>
          {children ? (
            <div className={styles.childrenContainer}>{children}</div>
          ) : (
            <input type="text" className={styles.inputField} {...props} />
          )}
        </div>
        {iconRight && (
          <button
            type="button"
            className={styles.iconButton}
            onClick={onIconRightClick}
            aria-label="Clear icon">
            <Image
              src={`/icons/size=${iconSize}.svg`}
              alt=""
              width={iconSize}
              height={iconSize}
              className={styles.icon}
            />
          </button>
        )}
      </div>
    </div>
  );
}








