'use client';

import styles from './styles.module.css';
import Button from '@/commons/components/button';
import Icon from '@/commons/components/icon';

export default function SteamLink() {
  const features = [
    '게임 라이브러리 기반 친구 매칭',
    '플레이 스타일 분석 및 성향 테스트',
    '플레이 시간대 기반 파티 추천',
    '실시간 게임 세션 공유',
  ];

  return (
    <div className={styles.container}>
      <div className={styles.infoSection}>
        <p className={styles.infoTitle}>정확한 게임 타입 분석과 매칭을 위해</p>
        <div className={styles.infoDescription}>
          <p>게임 성향 테스트로 나의 플레이 스타일을 파악하거나,</p>
          <p>
            스팀 계정을 연동해 실제 플레이 데이터로 더 정확한 매칭을 받아보세요
          </p>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <h3 className={styles.featuresTitle}>연결 후 사용 가능한 기능</h3>
        <div className={styles.featuresList}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Icon name="check" size={12} />
              </div>
              <p className={styles.featureText}>{feature}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.buttonsSection}>
        <Button variant="primary" size="m" shape="rectangle">
          <Icon name="gaming" size={20} />
          게임 성향 분석 테스트하기
        </Button>
        <Button variant="outline" size="m" shape="rectangle">
          <Icon name="steam" size={20} />
          스팀 계정 연동하기
        </Button>
      </div>

      <ul className={styles.disclaimerList}>
        <li>스팀 계정은 게임 플레이 데이터 기반 매칭에 사용됩니다.</li>
        <li>
          게임 성향 분석 테스트와 스팀 계정 연동을 하지 않으면 일부 기능을
          사용할 수 없습니다.
        </li>
      </ul>
    </div>
  );
}
