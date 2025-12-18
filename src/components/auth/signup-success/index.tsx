'use client';

import Image from 'next/image';
import styles from './styles.module.css';
import Button from '@/commons/components/button';
import Icon from '@/commons/components/icon';

export default function SignupSuccess() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <Image
          src="/images/celebrate.svg"
          alt="회원가입 축하"
          width={80}
          height={80}
          priority
        />
        <h1 className={styles.title}>회원가입이 완료되었어요!</h1>

        <div className={styles.textGroup}>
          <p className={styles.subtitle}>
            이제 ReadyGo 의 모든 기능을 사용하실 수 있습니다.
          </p>

          <p className={styles.description}>
            게임 성향 분석을 통해 나에게 맞는 장르를 알아보고, 스팀 계정을
            연동하여 더 맞춤화된 추천을 받아보세요!
          </p>
        </div>

        <div className={styles.buttons}>
          <Button
            variant="primary"
            shape="rectangle"
            size="m"
            className={styles.fullWidth}
          >
            <Icon name="gamepad" size={16} className={styles.icon} />
            게임 성향 분석 테스트하기
          </Button>

          <Button
            variant="secondary"
            shape="rectangle"
            size="m"
            className={styles.fullWidth}
          >
            <Icon name="steam" size={16} className={styles.icon} />
            스팀 계정 연동하기
          </Button>
        </div>
      </div>
    </section>
  );
}
