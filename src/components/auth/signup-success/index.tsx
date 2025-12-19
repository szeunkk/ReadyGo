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
        <div className={styles.titleSection}>
          <h1 className={styles.title}>재빠른팬더76님, 환영합니다!</h1>
          <p className={styles.subtitle}>
            이제 나에게 딱 맞는 게임 친구를 찾아보세요
          </p>
        </div>

        <div className={styles.textGroup}>
          <p className={styles.descriptionTitle}>
            정확한 게임 타입 분석과 매칭을 위해
          </p>

          <p className={styles.description}>
            게임 성향 테스트로 나의 플레이 스타일을 파악하거나, {'\n'}스팀
            계정을 연동해 실제 플레이 데이터로 정확한 매칭을 받아보세요!
          </p>
        </div>

        <div className={styles.buttons}>
          <Button
            variant="primary"
            shape="rectangle"
            size="m"
            className={styles.fullWidth}
          >
            <Icon name="gaming" size={20} className={styles.icon} />
            게임 성향 분석 테스트하기
          </Button>

          <Button
            variant="outline"
            shape="rectangle"
            size="m"
            className={styles.fullWidth}
          >
            <Icon name="steam" size={20} className={styles.icon} />
            스팀 계정 연동하기
          </Button>
        </div>

        <div className={styles.laterWrapper}>
          <button type="button" className={styles.laterButton}>
            나중에 할게요
          </button>
          <ul className={styles.laterList}>
            <li>스팀 계정은 게임 플레이 데이터 기반 매칭에 사용됩니다.</li>
            <li>
              게임 성향 분석 테스트와 스팀 계정 연동을 하지 않으면 일부 기능을
              사용할 수 없습니다.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
