"use client";

import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { HTMLAttributes } from "react";
import { TierType, getTierTypeMeta } from "../../constants/tierType.enum";

export type TierTagTheme = "light" | "dark";

export interface TierTagProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  tier: TierType;
  theme?: TierTagTheme;
  className?: string;
}

export default function TierTag({
  tier,
  theme = "light",
  className = "",
  ...props
}: TierTagProps) {
  const tierMeta = getTierTypeMeta(tier);

  const tagClasses = [
    styles.tierTag,
    styles[`theme-${theme}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={tagClasses} {...props}>
      <div className={styles.iconWrapper}>
        <Image
          src={tierMeta.ui.iconM}
          alt={tierMeta.label}
          width={24}
          height={24}
          className={styles.icon}
        />
      </div>
      <span className={styles.label}>{tierMeta.label}</span>
    </div>
  );
}

