import { TaskStatus } from '@/enums';

/**
 * Task interface representing a task entity
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create/Update task DTO (Data Transfer Object)
 */
export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}

/**
 * Task filter criteria
 */
export interface TaskFilter {
  status?: TaskStatus | 'All';
  search?: string;
}


