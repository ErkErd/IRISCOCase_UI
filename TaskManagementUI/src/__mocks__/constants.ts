import { TaskStatus } from '../enums';

export const API_BASE_URL = '/api';

export const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
] as const;

export const FILTER_STATUS_OPTIONS = [
  { value: 'All', label: 'All Tasks' },
  ...TASK_STATUS_OPTIONS,
] as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 10,
} as const;

export const DATE_FORMAT = 'YYYY-MM-DD';

