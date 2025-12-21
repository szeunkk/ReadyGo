'use client';

import React from 'react';
import Image from 'next/image';
import RadarChart, { RadarChartData } from '@/commons/components/radar-chart';
import Icon from '@/commons/components/icon';
import Button from '@/commons/components/button';
import {
  AnimalType,
  animalTypeMeta,
  RadarTraitKey,
} from '@/commons/constants/animalType.enum';
import styles from './styles.module.css';

export interface ResultProps {
  animalType: AnimalType;
  nickname: string;
  radarData: RadarChartData[];
  mainRole: {
    label: string;
    description: string;
  };
  subRole: {
    label: string;
    description: string;
  };
  matchTypes: string[];
  characteristics: string[];
  onPrevious: () => void;
  onComplete: () => void;
}

export default function Result({
  animalType,
  nickname,
  radarData,
  mainRole,
  subRole,
  matchTypes,
  characteristics,
  onPrevious,
  onComplete,
}: ResultProps) {
  const animalMeta = animalTypeMeta[animalType];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>당신의 게임 타입은?</h1>
      </div>

      <div className={styles.content}>
        {/* Main Card */}
        <div className={styles.mainCard}>
          <div className={styles.mainCardHeader}>
            <div className={styles.nicknameSection}>
              <p className={styles.nickname}>{nickname}</p>
            </div>
          </div>

          <div className={styles.mainCardContent}>
            {/* Animal Image */}
            <div className={styles.animalImageWrapper}>
              <div className={styles.backgroundImage}>
                <Image
                  src="/images/background.png"
                  alt=""
                  fill
                  className={styles.backgroundImg}
                />
              </div>
              <div className={styles.animalImage}>
                <Image
                  src={animalMeta.ui.imageM}
                  alt={animalMeta.label}
                  width={222}
                  height={222}
                  className={styles.animalImg}
                />
              </div>
            </div>

            {/* Description Section */}
            <div className={styles.descriptionSection}>
              <div className={styles.descriptionHeader}>
                <div className={styles.descriptionLabel}>
                  <p className={styles.animalLabel}>
                    {animalMeta.description[0]}, {animalMeta.label}
                  </p>
                </div>
                <div className={styles.descriptionSubtitle}>
                  <p className={styles.subtitle}>{animalMeta.description[1]}</p>
                </div>
              </div>

              <div className={styles.descriptionBody}>
                <p className={styles.extendedDescription}>
                  {animalMeta.extendedDescription}
                </p>
              </div>

              {/* Characteristics */}
              <div className={styles.characteristicsList}>
                {characteristics.map((char, index) => (
                  <div key={index} className={styles.characteristicItem}>
                    <div className={styles.checkIcon}>
                      <Icon name="check" size={16} />
                    </div>
                    <div className={styles.characteristicText}>
                      <p>{char}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Match Types */}
              <div className={styles.matchTypesSection}>
                <div className={styles.matchTypesHeader}>
                  <div className={styles.cloverIcon}>
                    <Icon name="clover" size={20} />
                  </div>
                  <div className={styles.matchTypesLabel}>
                    <p>천생연분 타입</p>
                  </div>
                </div>
                <div className={styles.matchTypesList}>
                  {matchTypes.map((type, index) => (
                    <React.Fragment key={index}>
                      <div className={styles.matchType}>
                        <p>{type}</p>
                      </div>
                      {index < matchTypes.length - 1 && (
                        <div className={styles.matchTypeSeparator}>
                          <p>·</p>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className={styles.bottomCards}>
          {/* Radar Chart Card */}
          <div className={styles.radarCard}>
            <div className={styles.radarCardHeader}>
              <p className={styles.radarCardTitle}>플레이스타일</p>
            </div>
            <div className={styles.radarChartWrapper}>
              <RadarChart myData={radarData} size="m" showLabels={true} />
            </div>
          </div>

          {/* Role Card */}
          <div className={styles.roleCard}>
            <div className={styles.roleCardHeader}>
              <p className={styles.roleCardTitle}>파티에서의 내 역할</p>
            </div>
            <div className={styles.roleCardContent}>
              {/* Main Role */}
              <div className={styles.roleSection}>
                <div className={styles.roleLabelSection}>
                  <p className={styles.roleTypeLabel}>메인역할</p>
                  <p className={styles.roleLabel}>{mainRole.label}</p>
                </div>
                <div className={styles.roleDescription}>
                  <p>{mainRole.description}</p>
                </div>
              </div>

              {/* Sub Role */}
              <div className={styles.roleSection}>
                <div className={styles.subRoleLabelSection}>
                  <p className={styles.subRoleTypeLabel}>보조역할</p>
                  <p className={styles.subRoleLabel}>{subRole.label}</p>
                </div>
                <div className={styles.subRoleDescription}>
                  <p>{subRole.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <Button
          variant="outline"
          size="m"
          shape="rectangle"
          onClick={onPrevious}
          className={styles.previousButton}
        >
          이전으로
        </Button>
        <Button
          variant="primary"
          size="m"
          shape="rectangle"
          onClick={onComplete}
          className={styles.completeButton}
        >
          완료하고 홈으로 가기
          <Icon name="arrow-right" size={20} />
        </Button>
      </div>
    </div>
  );
}
