import { apiClient } from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Task, TaskFormData, PaginatedResponse, PaginationParams } from '@/models';
import { TaskStatus, TaskStatusToApiValue } from '@/enums';

/**
 * Task service for all task-related API calls
 */
export class TaskService {
  /**
   * Fetches paginated tasks with optional filtering
   */
  static async getTasks(
    params: PaginationParams & { status?: TaskStatus; dueDateFrom?: string; dueDateTo?: string }
  ): Promise<PaginatedResponse<Task>> {
    const queryParams: Record<string, unknown> = {
      page: params.page,
      pageSize: params.pageSize,
    };

    if (params.status !== undefined) {
      queryParams.Status = TaskStatusToApiValue(params.status);
    }

    if (params.dueDateFrom) {
      queryParams.dueDateFrom = params.dueDateFrom;
    }

    if (params.dueDateTo) {
      queryParams.dueDateTo = params.dueDateTo;
    }

    // API returns { items, totalCount, pageNumber, pageSize }
    // We need to transform it to { data, totalCount, page, pageSize, totalPages }
    const apiResponse = await apiClient.get<{
      items: Task[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
    }>(API_ENDPOINTS.TASKS.BASE, queryParams);

    // Calculate totalPages
    const totalPages = Math.ceil(apiResponse.totalCount / apiResponse.pageSize);

    // Transform to expected format
    return {
      data: apiResponse.items || [],
      totalCount: apiResponse.totalCount,
      page: apiResponse.pageNumber,
      pageSize: apiResponse.pageSize,
      totalPages: totalPages,
    };
  }

  /**
   * Fetches a single task by ID
   */
  static async getTaskById(id: string): Promise<Task> {
    return apiClient.get<Task>(API_ENDPOINTS.TASKS.BY_ID(id));
  }

  /**
   * Creates a new task
   */
  static async createTask(data: TaskFormData): Promise<Task> {
    return apiClient.post<Task, TaskFormData>(API_ENDPOINTS.TASKS.BASE, data);
  }

  /**
   * Updates an existing task
   */
  static async updateTask(id: string, data: TaskFormData): Promise<Task> {
    return apiClient.put<Task, TaskFormData>(API_ENDPOINTS.TASKS.BY_ID(id), data);
  }

  /**
   * Deletes a task
   */
  static async deleteTask(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.TASKS.BY_ID(id));
  }

  /**
   * Updates task status only
   * First fetches the task, then updates it with the new status
   */
  static async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    // First get the current task
    const currentTask = await this.getTaskById(id);
    
    // Prepare the update data with all required fields
    const updateData: TaskFormData = {
      title: currentTask.title,
      description: currentTask.description,
      status: status,
      dueDate: currentTask.dueDate,
    };
    
    // Update the task using the main update endpoint
    return this.updateTask(id, updateData);
  }
}

