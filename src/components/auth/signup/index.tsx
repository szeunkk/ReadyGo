'use client';

import React from 'react';
import styles from './styles.module.css';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';

export default function Signup() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>
            입력하신 정보로 회원님의 계정이 생성됩니다.
          </p>
        </div>

        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              size="m"
              label="이메일"
              placeholder="이메일을 입력하세요"
              required
              iconLeft="envelope"
              iconSize={20}
              iconLeftColor="var(--color-icon-interactive-secondary)"
              gap={8}
              className={styles.input}
            />
            <Input
              variant="primary"
              size="m"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              required
              iconLeft="lock"
              iconRight="eye"
              iconSize={20}
              iconLeftColor="var(--color-icon-interactive-secondary)"
              iconRightColor="var(--color-icon-interactive-secondary)"
              gap={8}
              className={styles.input}
            />
            <Input
              variant="primary"
              size="m"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              required
              iconLeft="lock"
              iconRight="eye"
              iconSize={20}
              iconLeftColor="var(--color-icon-interactive-secondary)"
              iconRightColor="var(--color-icon-interactive-secondary)"
              gap={8}
              className={styles.input}
            />
          </div>

          <Button
            variant="primary"
            size="m"
            shape="rectangle"
            className={styles.signupButton}
          >
            회원가입
          </Button>
        </div>

        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerText}>또는</span>
          <div className={styles.dividerLine}></div>
        </div>

        <div className={styles.socialLoginGroup}>
          <button className={styles.socialButton} type="button">
            <div className={styles.socialButtonContent}>
              <div className={styles.socialIcon}>
                {/* Google Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.6 10.2273C19.6 9.51818 19.5364 8.83636 19.4182 8.18182H10V12.05H15.3818C15.15 13.3 14.4455 14.3591 13.3864 15.0682V17.5773H16.6182C18.5091 15.8364 19.6 13.2727 19.6 10.2273Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10 20C12.7 20 14.9636 19.1045 16.6182 17.5773L13.3864 15.0682C12.4909 15.6682 11.3455 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H1.06364V14.4909C2.70909 17.7591 6.09091 20 10 20Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.06364C0.386364 6.85909 0 8.38636 0 10C0 11.6136 0.386364 13.1409 1.06364 14.4909L4.40455 11.9Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10 3.97727C11.4682 3.97727 12.7864 4.48182 13.8227 5.47273L16.6909 2.60455C14.9591 0.990909 12.6955 0 10 0C6.09091 0 2.70909 2.24091 1.06364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <span className={styles.socialButtonText}>Google로 시작하기</span>
            </div>
          </button>

          <button className={styles.kakaoButton} type="button">
            <div className={styles.socialButtonContent}>
              <div className={styles.socialIcon}>
                {/* Kakao Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 0C4.477 0 0 3.8 0 8.5C0 11.4 2.1 13.9 5.1 15.3L4 19.5L8.4 17.1C8.9 17.2 9.4 17.2 10 17.2C15.523 17.2 20 13.4 20 8.7C20 3.9 15.523 0 10 0Z"
                    fill="#3C1E1E"
                  />
                </svg>
              </div>
              <span className={styles.kakaoButtonText}>Kakao로 시작하기</span>
            </div>
          </button>
        </div>

        <div className={styles.loginLink}>
          <span className={styles.loginText}>이미 계정이 있다면?</span>
          <button className={styles.loginButtonLink} type="button">
            로그인 하기
          </button>
        </div>
      </div>
    </div>
  );
}
