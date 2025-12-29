import { useState } from 'react';
import { SelectboxItem } from '@/commons/components/selectbox';

export const useMatchFilters = () => {
  const [selectedMatchRate, setSelectedMatchRate] = useState<string>('75');
  const [selectedStatus, setSelectedStatus] = useState<string>('online');

  const handleMatchRateChange = (item: SelectboxItem) => {
    setSelectedMatchRate(item.id);
  };

  const handleStatusChange = (item: SelectboxItem) => {
    setSelectedStatus(item.id);
  };

  const handleRefresh = () => {
    // TODO: 실제 데이터 갱신 로직 구현
  };

  return {
    selectedMatchRate,
    selectedStatus,
    handleMatchRateChange,
    handleStatusChange,
    handleRefresh,
  };
};
