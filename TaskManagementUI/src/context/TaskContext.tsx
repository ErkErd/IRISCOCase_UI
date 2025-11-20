import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import { Task, TaskFormData, TaskFilter, ApiError } from '@/models';
import { TaskStatus } from '@/enums';
import { TaskService } from '@/services';
import { PAGINATION_DEFAULTS } from '@/constants';

/**
 * Task state interface
 */
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: ApiError | null;
  filter: TaskFilter;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  selectedTask: Task | null;
}

/**
 * Task actions
 */
type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: ApiError | null }
  | { type: 'SET_TASKS'; payload: { tasks: Task[]; totalPages: number; totalCount: number } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: TaskFilter }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SELECTED_TASK'; payload: Task | null };

/**
 * Task context type
 */
export interface TaskContextType extends TaskState {
  fetchTasks: () => Promise<void>;
  createTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: string, data: TaskFormData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  setFilter: (filter: TaskFilter) => void;
  setPage: (page: number) => void;
  setSelectedTask: (task: Task | null) => void;
  clearError: () => void;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filter: { status: 'All' },
  currentPage: PAGINATION_DEFAULTS.PAGE,
  totalPages: 0,
  totalCount: 0,
  selectedTask: null,
};

// Create context
export const TaskContext = createContext<TaskContextType | undefined>(undefined);

/**
 * Task reducer
 */
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload.tasks,
        totalPages: action.payload.totalPages,
        totalCount: action.payload.totalCount,
        loading: false,
        error: null,
      };

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        totalCount: state.totalCount + 1,
        loading: false,
        error: null,
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        loading: false,
        error: null,
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        totalCount: state.totalCount - 1,
        loading: false,
        error: null,
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
        currentPage: PAGINATION_DEFAULTS.PAGE,
      };

    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };

    case 'SET_SELECTED_TASK':
      return { ...state, selectedTask: action.payload };

    default:
      return state;
  }
};

/**
 * Task Provider Props
 */
interface TaskProviderProps {
  children: ReactNode;
}

/**
 * Task Provider Component
 */
export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  /**
   * Fetches tasks from API
   */
  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params: {
        page: number;
        pageSize: number;
        status?: TaskStatus;
      } = {
        page: state.currentPage,
        pageSize: PAGINATION_DEFAULTS.PAGE_SIZE,
      };

      if (state.filter.status && state.filter.status !== 'All') {
        params.status = state.filter.status as TaskStatus;
      }

      const response = await TaskService.getTasks(params);

      // Apply client-side search filter if needed
      let filteredTasks = response.data;
      if (state.filter.search) {
        const searchLower = state.filter.search.toLowerCase();
        filteredTasks = filteredTasks.filter(
          (task: Task) =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
        );
      }

      dispatch({
        type: 'SET_TASKS',
        payload: {
          tasks: filteredTasks,
          totalPages: response.totalPages,
          totalCount: response.totalCount,
        },
      });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'SET_ERROR', payload: apiError });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentPage, state.filter]);

  /**
   * Creates a new task
   */
  const createTask = useCallback(async (data: TaskFormData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newTask = await TaskService.createTask(data);
      dispatch({ type: 'ADD_TASK', payload: newTask });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'SET_ERROR', payload: apiError });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  /**
   * Updates an existing task
   */
  const updateTask = useCallback(async (id: string, data: TaskFormData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedTask = await TaskService.updateTask(id, data);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'SET_ERROR', payload: apiError });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  /**
   * Deletes a task
   */
  const deleteTask = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await TaskService.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'SET_ERROR', payload: apiError });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  /**
   * Updates task status
   */
  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedTask = await TaskService.updateTaskStatus(id, status);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'SET_ERROR', payload: apiError });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  /**
   * Sets filter
   */
  const setFilter = useCallback((filter: TaskFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  /**
   * Sets current page
   */
  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  /**
   * Sets selected task
   */
  const setSelectedTask = useCallback((task: Task | null) => {
    dispatch({ type: 'SET_SELECTED_TASK', payload: task });
  }, []);

  /**
   * Clears error
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const value: TaskContextType = {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilter,
    setPage,
    setSelectedTask,
    clearError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

