'use client';

import styles from './styles.module.css';
import Button from '@/commons/components/button';
import Avatar from '@/commons/components/avatar';

export default function ReviewReceived() {
  const reviewPoints = [
    '매칭 과정에서 예의 바르고 편안한 태도로 대화했어요.',
    '불쾌한 말투 · 언행 없이 매너 있게 응대했어요.',
    '약속한 시간·게임 목표 등에 대해 성실하게 협력 의사를 보여줬어요.',
    '게임 시작 전 필요한 정보나 약속을 명확하게 주고 받았어요.',
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div className={styles.headerContent}>
          <div className={styles.indicator}>
            <div className={styles.indicatorDot} />
            <div className={styles.indicatorDot} />
            <div className={styles.indicatorDot} />
          </div>
          <div className={styles.headerText}>review</div>
        </div>
      </div>
      <div className={styles.mainArea}>
        <div className={styles.contentWrapper}>
          <div className={styles.titleSection}>
            <Avatar size="L" showStatus={false} />
            <div className={styles.titleTextSection}>
              <h2 className={styles.title}>
                까칠한까마귀님이 보낸 후기가 도착했어요.
              </h2>
              <p className={styles.description}>
                까칠한까마귀님과 2025.12.25에 함께 게임했어요.
              </p>
            </div>
          </div>

          <div className={styles.reviewSection}>
            <div className={styles.reviewBox}>
              <div className={styles.quoteBox}>
                <p className={styles.quoteText}>
                  &ldquo;게임을 너무 잘하시고 유쾌하셔요!! 재밌게 게임할 수
                  있었습니다 :)&rdquo;
                </p>
              </div>
              <div className={styles.pointsList}>
                {reviewPoints.map((point, index) => (
                  <div key={index} className={styles.pointItem}>
                    <div className={styles.pointDot} />
                    <span className={styles.pointText}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttonArea}>
        <Button
          variant="primary"
          size="m"
          shape="rectangle"
          className={styles.confirmButton}
        >
          확인
        </Button>
      </div>
    </div>
  );
}
