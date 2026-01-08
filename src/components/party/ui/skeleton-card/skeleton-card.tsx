'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import styles from './styles.module.css';

export interface SkeletonCardProps {
  /**
   * 추가 클래스명
   */
  className?: string;
}

export default function SkeletonCard({ className = '' }: SkeletonCardProps) {
  const containerClasses = [styles.skeletonCard, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {/* Title 영역 */}
      <div className={styles.cardTitleMemberWrapper}>
        <div className={styles.titleSection}>
          <div className={styles.titleTagWrapper}>
            <Skeleton className={styles.titleSkeleton} />
            <Skeleton className={styles.tagSkeleton} />
          </div>
          <Skeleton className={styles.descriptionSkeleton} />
        </div>

        {/* Party Member 영역 */}
        <div className={styles.partyMemberSection}>
          <div className={styles.avatarGroup}>
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className={styles.avatarWrapper}>
                <Skeleton className={styles.avatarSkeleton} />
              </div>
            ))}
          </div>
          <Skeleton className={styles.memberCountSkeleton} />
        </div>
      </div>

      {/* Category 영역 */}
      <div className={styles.cardCategoryButtonWrapper}>
        <div className={styles.categoryGrid}>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className={styles.categoryItem}>
              <div className={styles.categoryIconLabelWrapper}>
                <Skeleton className={styles.categoryIconSkeleton} />
                <Skeleton className={styles.categoryLabelSkeleton} />
              </div>
              <Skeleton className={styles.categoryValueSkeleton} />
            </div>
          ))}
        </div>

        {/* Button 영역 */}
        <Skeleton className={styles.joinButtonSkeleton} />
      </div>
    </div>
  );
}
