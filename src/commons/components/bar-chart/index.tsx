'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from './styles.module.css';

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export type BarChartSize = 's' | 'm';

export interface BarChartDataItem {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarChartDataItem[];
  size?: BarChartSize;
  className?: string;
  showValues?: boolean;
}

export default function BarChart({
  data,
  size = 's',
  showValues = true,
  className = '',
}: BarChartProps) {
  // CSS 변수로 색상 정의
  const defaultColorVars = [
    'var(--bar-color-primary)', // FPS
    'var(--bar-color-secondary)', // 생존
    'var(--bar-color-tertiary)', // 모험
    'var(--bar-color-quaternary)', // 캐주얼
  ];

  // 데이터 값 배열
  const values = data.map((item) => item.value);
  const labels = data.map((item) => item.label);
  const colors = data.map(
    (item, index) =>
      item.color || defaultColorVars[index % defaultColorVars.length]
  );

  // 최대값 계산 (막대 길이 정규화용)
  const maxValue = Math.max(...values);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderRadius: 999, // 완전히 둥근 모서리
        barThickness: size === 's' ? 16 : 38,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const, // 가로 막대 차트
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
        max: maxValue * 1.1, // 여유 공간 추가
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    layout: {
      padding: 0,
    },
  };

  // 값을 시간 형식으로 변환 (예: 23.6h)
  const formatValue = (value: number): string => {
    return `${value.toFixed(1)}h`;
  };

  const containerClasses = [styles.container, styles[`size-${size}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {data.map((item, index) => (
        <div key={index} className={styles.barItem}>
          <div className={styles.label}>{item.label}</div>
          <div className={styles.barWrapper}>
            <div className={styles.barBackground}>
              <div
                className={styles.barFill}
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: colors[index],
                }}
              />
            </div>
          </div>
          {showValues && (
            <div className={styles.value}>{formatValue(item.value)}</div>
          )}
        </div>
      ))}
    </div>
  );
}
