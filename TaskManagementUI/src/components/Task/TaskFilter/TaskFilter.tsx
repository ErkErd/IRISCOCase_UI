import React from 'react';
import { TaskFilter as TaskFilterType } from '@/models';
import { Select, Input } from '@/components/UI';
import { FILTER_STATUS_OPTIONS } from '@/constants';
import styles from './TaskFilter.module.css';

export interface TaskFilterProps {
  filter: TaskFilterType;
  onFilterChange: (filter: TaskFilterType) => void;
}

/**
 * Task Filter Component for filtering tasks
 */
export const TaskFilter: React.FC<TaskFilterProps> = ({ filter, onFilterChange }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filter,
      status: e.target.value as TaskFilterType['status'],
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      search: e.target.value,
    });
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchInput}>
        <Input
          type="text"
          placeholder="Search tasks..."
          value={filter.search || ''}
          onChange={handleSearchChange}
          fullWidth
        />
      </div>
      <div className={styles.statusFilter}>
        <Select
          value={filter.status || 'All'}
          onChange={handleStatusChange}
          options={FILTER_STATUS_OPTIONS}
          fullWidth
        />
      </div>
    </div>
  );
};

