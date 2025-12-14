"use client";

import React from "react";
import styles from "./styles.module.css";

export type AvatarSize = "s" | "m" | "L";
export type AvatarStatus = "online" | "away" | "ban" | "offline";
export type AvatarTheme = "light" | "dark";

export interface AvatarProps {
  size?: AvatarSize;
  status?: AvatarStatus;
  theme?: AvatarTheme;
  src?: string;
  alt?: string;
  className?: string;
}

export default function Avatar({
  size = "m",
  status = "offline",
  theme = "light",
  src = "/images/bird.svg",
  alt = "Avatar",
  className = "",
}: AvatarProps) {
  const avatarClasses = [
    styles.avatar,
    styles[`size-${size}`],
    styles[`status-${status}`],
    styles[`theme-${theme}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={avatarClasses}>
      <img src={src} alt={alt} className={styles.image} />
      {status !== "offline" && (
        <span className={styles[`status-${status}`]}></span>
      )}
    </div>
  );
}
