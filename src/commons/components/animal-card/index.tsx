'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { HTMLAttributes } from 'react';
import TierTag from '../tier-tag';
import Icon from '../icon';
import { TierType } from '../../constants/tierType.enum';
import { AnimalType, getAnimalTypeMeta } from '../../constants/animal';

export type AnimalCardProperty = 'my' | 'user';

export interface AnimalCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style'
> {
  property?: AnimalCardProperty;
  nickname: string;
  tier: TierType;
  animal: AnimalType;
  favoriteGenre?: string;
  activeTime?: string;
  gameStyle?: string;
  weeklyAverage?: string;
  perfectMatchTypes?: AnimalType[];
  matchPercentage?: number;
  matchReasons?: string[];
  className?: string;
}

export default function AnimalCard({
  property = 'my',
  nickname,
  tier,
  animal,
  favoriteGenre = 'FPS',
  activeTime = '20 - 24시',
  gameStyle = '경쟁적',
  weeklyAverage = '5.4 시간',
  perfectMatchTypes,
  matchPercentage,
  matchReasons,
  className = '',
  ...props
}: AnimalCardProps) {
  const animalMeta = getAnimalTypeMeta(animal);

  const cardClasses = [styles.animalCard, className].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {/* Header: Nickname + Tier Tag */}
      <div className={styles.header}>
        <div className={styles.nicknameWrapper}>
          <p className={styles.nickname}>{nickname}</p>
        </div>
        <TierTag tier={tier} />
      </div>

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

      {/* Animal Description + User Info */}
      <div className={styles.contentWrapper}>
        <div className={styles.descriptionSection}>
          {/* Animal Description */}
          <div className={styles.animalDescription}>
            <div className={styles.descriptionLabel}>
              <p className={styles.descriptionTitle}>
                {animalMeta.description[0]}, {animalMeta.label}
              </p>
            </div>
            <div className={styles.descriptionText}>
              <p className={styles.descriptionSubtitle}>
                {animalMeta.description[1]}
              </p>
            </div>
          </div>

          {/* User Info Grid */}
          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <div className={styles.infoIconLabel}>
                  <Icon name="gaming" size={20} className={styles.icon} />
                  <p className={styles.infoLabel}>선호 장르</p>
                </div>
                <p className={styles.infoValue}>{favoriteGenre}</p>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIconLabel}>
                  <Icon name="time" size={20} className={styles.icon} />
                  <p className={styles.infoLabel}>활동 시간</p>
                </div>
                <p className={styles.infoValue}>{activeTime}</p>
              </div>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <div className={styles.infoIconLabel}>
                  <Icon name="sword-alt" size={20} className={styles.icon} />
                  <p className={styles.infoLabel}>게임 성향</p>
                </div>
                <p className={styles.infoValue}>{gameStyle}</p>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIconLabel}>
                  <Icon
                    name="bar-chart-square"
                    size={20}
                    className={styles.icon}
                  />
                  <p className={styles.infoLabel}>주간 평균</p>
                </div>
                <p className={styles.infoValue}>{weeklyAverage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Perfect Match Section */}
        {property === 'my' && perfectMatchTypes && (
          <div className={styles.perfectMatchMy}>
            <div className={styles.perfectMatchHeader}>
              <Icon name="clover" size={20} className={styles.icon} />
              <p className={styles.perfectMatchLabel}>천생연분 타입</p>
            </div>
            <div className={styles.perfectMatchTypes}>
              {perfectMatchTypes.map((type, index) => (
                <React.Fragment key={type}>
                  {index > 0 && <span className={styles.separator}>·</span>}
                  <span className={styles.matchType}>
                    {getAnimalTypeMeta(type).label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {property === 'user' && matchPercentage !== undefined && (
          <div className={styles.perfectMatchUser}>
            <div className={styles.matchPercentageRow}>
              <p className={styles.matchTitle}>천생연분</p>
              <p className={styles.matchPercentage}>{matchPercentage}%</p>
            </div>
            {matchReasons && (
              <div className={styles.matchReasons}>
                {matchReasons.map((reason, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <span className={styles.separator}>·</span>}
                    <span className={styles.matchReason}>{reason}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
