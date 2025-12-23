'use client';

import React, { ReactNode } from 'react';
import styles from './styles.module.css';
import Button from '../button';

export type ModalVariant = 'single' | 'dual';

export interface ModalProps {
  variant?: ModalVariant;
  title?: string;
  description?: string;
  showDescription?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
}

export default function Modal({
  variant = 'single',
  title = '친구 추가',
  description = '게이머호랑이님을 친구로 추가하시겠습니까?',
  showDescription = true,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  children,
}: ModalProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.heading}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        {showDescription && (
          <div className={styles.descriptionWrapper}>
            <p className={styles.description}>{description}</p>
          </div>
        )}
        {children}
      </div>
      <div
        className={`${styles.buttonGroup} ${variant === 'dual' ? styles.dual : styles.single}`}
      >
        {variant === 'dual' ? (
          <>
            <Button
              variant="secondary"
              size="m"
              shape="rectangle"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button
              variant="primary"
              size="m"
              shape="rectangle"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            size="m"
            shape="rectangle"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        )}
      </div>
    </div>
  );
}
