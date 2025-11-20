import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants';
import { ApiError } from '@/models';
import { ApiValueToTaskStatus, TaskStatusToApiValue, TaskStatus } from '@/enums';
import { formatDateForApi } from '@/utils/date';

/**
 * Creates and configures an Axios instance for API calls
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  /**
   * Transforms Task data for API requests
   * - Converts status from TaskStatus enum to API numeric values (0, 1, 2)
   * - Converts dueDate from YYYY-MM-DD to ISO 8601 format with time (YYYY-MM-DDTHH:mm:ssZ)
   */
  private transformTaskStatusForRequest(data: unknown): void {
    if (data && typeof data === 'object') {
      // Handle single task object
      if ('status' in data) {
        const statusValue = (data as { status: unknown }).status;
        if (typeof statusValue === 'string') {
          // Convert TaskStatus enum string to numeric value
          if (Object.values(TaskStatus).includes(statusValue as TaskStatus)) {
            (data as { status: number }).status = TaskStatusToApiValue(statusValue as TaskStatus);
          }
        }
      }
      
      // Transform dueDate from YYYY-MM-DD to ISO 8601 format
      if ('dueDate' in data && typeof (data as { dueDate: unknown }).dueDate === 'string') {
        const dueDateValue = (data as { dueDate: string }).dueDate;
        // Check if it's in YYYY-MM-DD format (10 characters)
        if (dueDateValue.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(dueDateValue)) {
          (data as { dueDate: string }).dueDate = formatDateForApi(dueDateValue);
        }
      }
    }
  }

  /**
   * Transforms Task status from API numeric values to TaskStatus enum
   */
  private transformTaskStatus(data: unknown): void {
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item && typeof item === 'object' && 'status' in item && typeof item.status === 'number') {
          item.status = ApiValueToTaskStatus(item.status);
        }
      });
    } else if (data && typeof data === 'object') {
      // Handle single task object
      if ('status' in data && typeof (data as { status: unknown }).status === 'number') {
        (data as { status: number | TaskStatus }).status = ApiValueToTaskStatus((data as { status: number }).status);
      }
      // Handle paginated response with items array (API format)
      if ('items' in data && Array.isArray((data as { items: unknown[] }).items)) {
        (data as { items: unknown[] }).items.forEach((item) => {
          if (item && typeof item === 'object' && 'status' in item && typeof item.status === 'number') {
            (item as { status: number | TaskStatus }).status = ApiValueToTaskStatus((item as { status: number }).status);
          }
        });
      }
      // Handle paginated response with data array (transformed format)
      if ('data' in data && Array.isArray((data as { data: unknown[] }).data)) {
        (data as { data: unknown[] }).data.forEach((item) => {
          if (item && typeof item === 'object' && 'status' in item && typeof item.status === 'number') {
            (item as { status: number | TaskStatus }).status = ApiValueToTaskStatus((item as { status: number }).status);
          }
        });
      }
      // Handle data array in paginated response
      if ('data' in data && Array.isArray((data as { data: unknown[] }).data)) {
        (data as { data: unknown[] }).data.forEach((item) => {
          if (item && typeof item === 'object' && 'status' in item && typeof item.status === 'number') {
            (item as { status: number | TaskStatus }).status = ApiValueToTaskStatus((item as { status: number }).status);
          }
        });
      }
    }
  }

  /**
   * Sets up request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // You can add authentication tokens here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        
        // Transform Task status values from enum to numeric for API
        if (config.url?.includes('/Tasks') && config.data) {
          // Transform the data (status to number, dueDate to ISO 8601)
          this.transformTaskStatusForRequest(config.data);
          
          // ASP.NET Core model binding might expect 'request' wrapper
          // Wrap data in 'request' field for POST/PUT requests
          if ((config.method === 'post' || config.method === 'put') && 
              config.data && 
              typeof config.data === 'object' && 
              !('request' in config.data)) {
            // Wrap the transformed data
            config.data = { request: config.data };
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Transform Task status values from numeric to enum
        if (response.config.url?.includes('/Tasks')) {
          this.transformTaskStatus(response.data);
        }
        return response;
      },
      (error: AxiosError<ApiError>) => {
        let errorMessage = 'An unexpected error occurred';
        
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          errorMessage = 'Network error. Please check your connection and ensure the API server is running.';
        } else if (error.response) {
          // Server responded with error status
          const responseData = error.response.data;
          
          // If there are validation errors, use the title or a generic validation message
          if (responseData?.errors && Object.keys(responseData.errors).length > 0) {
            errorMessage = responseData.title || responseData.message || 'Validation errors occurred';
          } else {
            errorMessage = responseData?.message || responseData?.title || `Server error: ${error.response.status}`;
          }
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = 'No response from server. Please check if the API server is running.';
        } else {
          errorMessage = error.message || errorMessage;
        }
        
        const apiError: ApiError = {
          message: errorMessage,
          title: error.response?.data?.title,
          status: error.response?.status,
          errors: error.response?.data?.errors,
        };
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * GET request
   */
  public async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  /**
   * POST request
   */
  public async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  /**
   * PUT request
   */
  public async put<T, D = unknown>(url: string, data?: D): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  /**
   * DELETE request
   */
  public async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  /**
   * Get axios instance for custom requests
   */
  public getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export const axiosInstance = apiClient.getInstance();


