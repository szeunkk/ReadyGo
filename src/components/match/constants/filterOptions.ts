import { SelectboxItem } from '@/commons/components/selectbox';

// 매치률 필터 옵션
export const matchRateOptions: SelectboxItem[] = [
  { id: 'all', value: '전체' },
  { id: '50', value: '매칭률 50% 이상' },
  { id: '75', value: '매칭률 75% 이상' },
  { id: '90', value: '매칭률 90% 이상' },
];

// 온라인 상태 필터 옵션
export const statusOptions: SelectboxItem[] = [
  { id: 'all', value: '전체' },
  { id: 'online', value: '온라인' },
  { id: 'away', value: '자리비움' },
  { id: 'offline', value: '오프라인' },
];

