'use client';

import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import styles from './styles.module.css';
import {
  RadarTraitKey,
  radarTraitLabels,
} from '../../constants/animalType.enum';

// 점선 그리드를 위한 커스텀 플러그인
const dashedGridPlugin: Plugin<'radar'> = {
  id: 'dashedGrid',
  beforeDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const scale = scales.r as any; // RadialLinearScale 타입 캐스팅

    if (!scale || !chartArea) {
      return;
    }

    ctx.save();

    // 점선 스타일 설정
    ctx.strokeStyle = '#2D3561';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // 그리드 오각형 그리기
    const angleLines = scale.getDistanceFromCenterForValue(scale.max);
    const pointLabels = scale._pointLabels || [];
    const numTicks = 4; // 4개 레벨
    const numPoints = pointLabels.length; // 5개 축

    // 각 레벨의 오각형 그리기 (Chart.js의 getPointPosition 사용)
    for (let i = 1; i <= numTicks; i++) {
      const distance = (angleLines * i) / numTicks;

      ctx.beginPath();
      for (let index = 0; index < numPoints; index++) {
        // Chart.js의 getPointPosition으로 정확한 좌표 얻기
        const point = scale.getPointPosition(index, distance);

        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    // 각도 라인 그리기 (중앙에서 꼭지점으로, Chart.js의 getPointPosition 사용)
    for (let index = 0; index < numPoints; index++) {
      // Chart.js의 getPointPosition으로 정확한 좌표 얻기
      const point = scale.getPointPosition(index, angleLines);

      ctx.beginPath();
      ctx.moveTo(scale.xCenter, scale.yCenter);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }

    ctx.restore();
  },
};

// Chart.js 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  dashedGridPlugin
);

export type RadarChartSize = 's' | 'm' | 'l';

export interface RadarChartData {
  trait: RadarTraitKey;
  value: number; // 0-100
}

export type RadarChartVariant = 'my' | 'user';

export interface RadarChartProps {
  myData: RadarChartData[];
  userData?: RadarChartData[]; // 상대 프로필 데이터 (optional)
  size?: RadarChartSize;
  showLabels?: boolean;
  className?: string;
}

export default function RadarChart({
  myData,
  userData,
  size = 'm',
  showLabels = true,
  className = '',
}: RadarChartProps) {
  const chartRef = useRef<ChartJS<'radar'>>(null);

  // 5개 축 순서 고정 (Figma 디자인 기준: 정오각형 - 상단부터 시계방향)
  const orderedTraits: RadarTraitKey[] = [
    'social', // 교류성 (12시)
    'exploration', // 모험성 (약 2시)
    'cooperation', // 협동성 (약 5시)
    'strategy', // 전략성 (약 7시)
    'leadership', // 리더십 (약 10시)
  ];

  // 내 데이터를 순서에 맞게 정렬
  const orderedMyData = orderedTraits.map((trait) => {
    const found = myData.find((d) => d.trait === trait);
    return found ? found.value : 0;
  });

  // 상대 데이터를 순서에 맞게 정렬 (있는 경우)
  const orderedUserData = userData
    ? orderedTraits.map((trait) => {
        const found = userData.find((d) => d.trait === trait);
        return found ? found.value : 0;
      })
    : null;

  const orderedLabels = orderedTraits.map((trait) => radarTraitLabels[trait]);

  // 데이터셋 생성 (내 프로필은 항상 표시, 상대 프로필은 선택적)
  const datasets = [
    // 내 프로필 데이터셋
    {
      label: '내 프로필',
      data: orderedMyData,
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
          return 'rgba(95, 252, 226, 0.2)';
        }

        // 180deg 선형 그라디언트 (위에서 아래로)
        const gradient = ctx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom
        );
        gradient.addColorStop(0.05, 'rgba(95, 252, 226, 0.40)');
        gradient.addColorStop(0.95, 'rgba(95, 252, 226, 0.10)');
        return gradient;
      },
      borderColor: '#5FFCE2',
      borderWidth: 3,
      pointBackgroundColor: '#5FFCE2',
      pointBorderColor: '#5FFCE2',
      pointBorderWidth: 0,
      pointHoverBackgroundColor: '#94FDEC',
      pointHoverBorderColor: '#94FDEC',
      pointHoverBorderWidth: 0,
      pointRadius: 4, // 8px 크기 점 (반지름 4px)
      pointHoverRadius: 4, // 호버 시 크기 유지
    },
  ];

  // 상대 프로필 데이터셋 추가 (있는 경우)
  if (orderedUserData) {
    datasets.push({
      label: '상대 프로필',
      data: orderedUserData,
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
          return 'rgba(98, 155, 248, 0.2)';
        }

        // 180deg 선형 그라디언트 (위에서 아래로) - 파란색 계열
        const gradient = ctx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom
        );
        gradient.addColorStop(0.05, 'rgba(98, 155, 248, 0.40)');
        gradient.addColorStop(0.95, 'rgba(98, 155, 248, 0.10)');
        return gradient;
      },
      borderColor: '#629BF8',
      borderWidth: 3,
      pointBackgroundColor: '#629BF8',
      pointBorderColor: '#629BF8',
      pointBorderWidth: 0,
      pointHoverBackgroundColor: '#A5C6FB',
      pointHoverBorderColor: '#A5C6FB',
      pointHoverBorderWidth: 0,
      pointRadius: 4,
      pointHoverRadius: 4,
    });
  }

  const chartData = {
    labels: orderedLabels,
    datasets,
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false,
          stepSize: 25,
        },
        grid: {
          display: false, // 커스텀 플러그인으로 점선 그리드 그림
        },
        angleLines: {
          display: false, // 커스텀 플러그인으로 점선 각도 라인 그림
        },
        pointLabels: {
          display: showLabels,
          font: {
            size: 12,
            family: 'Pretendard',
            weight: 400, // Regular
            lineHeight: 1.33, // 16px / 12px
          },
          color: '#9CA3AF',
          padding: 3,
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
  };

  const containerClasses = [styles.container, styles[`size-${size}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.chart}>
        <Radar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}
