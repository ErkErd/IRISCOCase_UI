import { TaskStatus } from '@/enums';

/**
 * API configuration
 * Development: Uses proxy from vite.config.ts (http://localhost:5065)
 * Production: Can be overridden with VITE_API_BASE_URL environment variable
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Task status options for dropdowns
 */
export const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
] as const;

/**
 * Filter options including 'All'
 */
export const FILTER_STATUS_OPTIONS = [
  { value: 'All', label: 'All Tasks' },
  ...TASK_STATUS_OPTIONS,
] as const;

/**
 * Pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 10,
} as const;

/**
 * Date format
 */
export const DATE_FORMAT = 'YYYY-MM-DD';
