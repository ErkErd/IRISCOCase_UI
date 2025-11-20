import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { TaskProvider, useTaskContext } from './';
import { TaskService } from '@/services';
import { TaskStatus } from '@/enums';
import { Task, TaskFormData } from '@/models';

// Mock TaskService
jest.mock('@/services', () => ({
  TaskService: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    updateTaskStatus: jest.fn(),
  },
}));

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    status: TaskStatus.TODO,
    dueDate: '2025-12-31',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    status: TaskStatus.IN_PROGRESS,
    dueDate: '2025-12-25',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
];

const mockTaskFormData: TaskFormData = {
  title: 'New Task',
  description: 'New task description',
  status: TaskStatus.TODO,
  dueDate: '2025-12-31',
};

describe('TaskContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TaskProvider>{children}</TaskProvider>
  );

  describe('Initial State', () => {
    it('should have empty tasks initially', () => {
      const { result } = renderHook(() => useTaskContext(), { wrapper });
      expect(result.current.tasks).toEqual([]);
    });

    it('should not be loading initially', () => {
      const { result } = renderHook(() => useTaskContext(), { wrapper });
      expect(result.current.loading).toBe(false);
    });

    it('should have no error initially', () => {
      const { result } = renderHook(() => useTaskContext(), { wrapper });
      expect(result.current.error).toBeNull();
    });

    it('should have default filter', () => {
      const { result } = renderHook(() => useTaskContext(), { wrapper });
      expect(result.current.filter).toEqual({ status: 'All' });
    });

    it('should have page 1 initially', () => {
      const { result } = renderHook(() => useTaskContext(), { wrapper });
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('fetchTasks', () => {
    it('should fetch tasks successfully', async () => {
      (TaskService.getTasks as jest.Mock).mockResolvedValue({
        data: mockTasks,
        totalPages: 1,
        totalCount: 2,
        page: 1,
        pageSize: 10,
      });

      const { result } = renderHook(() => useTaskContext(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      await waitFor(() => {
        expect(result.current.tasks).toEqual(mockTasks);
        expect(result.current.totalCount).toBe(2);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set loading state while fetching', async () => {
      (TaskService.getTasks as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          data: mockTasks,
          totalPages: 1,
          totalCount: 2,
          page: 1,
          pageSize: 10,
        }), 100))
      );

      const { result } = renderHook(() => useTaskContext(), { wrapper });

      act(() => {
        result.current.fetchTasks();
      });

      expect(result.current.loading).toBe(true);
    });

    it('should handle fetch error', async () => {
      const mockError = { message: 'Failed to fetch tasks' };
      (TaskService.getTasks as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useTaskContext(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const newTask: Task = {
        id: '3',
        ...mockTaskFormData,
        createdAt: '2024-01-03',
        updatedAt: '2024-01-03',
      };

      (TaskService.createTask as jest.Mock).mockResolvedValue(newTask);

      const { result } = renderHook(() => useTaskContext(), { wrapper });

      await act(async () => {
        await result.current.createTask(mockTaskFormData);
      });

      await waitFor(() => {
        expect(result.current.tasks).toContainEqual(newTask);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle create error', async () => {
      const mockError = { message: 'Failed to create task' };
      (TaskService.createTask as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useTaskContext(), { wrapper });

      await expect(async () => {
        await act(async () => {
          await result.current.createTask(mockTaskFormData);
        });
      }).rejects.toEqual(mockError);
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updatedTask: Task = {
        ...mockTasks[0],
        title: 'Updated Title',
      };

      (TaskService.getTasks as jest.Mock).mockResolvedValue({
        data: mockTasks,
        totalPages: 1,
        totalCount: 2,
        page: 1,
        pageSize: 10,
      });

      (TaskService.updateTask as jest.Mock).mockResolvedValue(updatedTask);

      const { result } = renderHook(() => useTaskContext(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      await act(async () => {
        await result.current.updateTask('1', {
          ...mockTaskFormData,
          title: 'Updated Title',
        });
      });

      await waitFor(() => {
        const task = result.current.tasks.find(t => t.id === '1');
        expect(task?.title).toBe('Updated Title');
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      (TaskService.getTasks as jest.Mock).mockResolvedValue({
        data: mockTasks,
        totalPages: 1,
        totalCount: 2,
        page: 1,
        pageSize: 10,
      });

      (TaskService.deleteTask as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useTaskContext(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(result.current.tasks).toHaveLength(2);

      await act(async () => {
        await result.current.deleteTask('1');
      });

      await waitFor(() => {
        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks.find(t => t.id === '1')).toBeUndefined();
      });
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status successfully', async () => {
      const updatedTask: Task = {
        ...mockTasks[0],
        status: TaskStatus.DONE,
      };

      (TaskService.getTasks as jest.Mock).mockResolvedValue({
        data: mockTasks,
        totalPages: 1,
        totalCount: 2,
        page: 1,
        pageSize: 10,
      });

      (TaskService.updateTaskStatus as jest.Mock).mockResolvedValue(updatedTask);

      const { result } = renderHook(() => useTaskContext(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      await act(async () => {
        await result.current.updateTaskStatus('1', TaskStatus.DONE);
      });

      await waitFor(() => {
        const task = result.current.tasks.find(t => t.id === '1');
        expect(task?.status).toBe(TaskStatus.DONE);
      });
    });
  });

  describe('setFilter', () => {
    it('should update filter', () => {
      const { result } = renderHook(() => useTaskContext(), { wrapper });

      act(() => {
        result.current.setFilter({ status: TaskStatus.TODO });
      });

      expect(result.current.filter).toEqual({ status: TaskStatus.TODO });
    });

    it('should reset page to 1 when filter changes', () => {
      const { result } = renderHook(() => useTaskContext(), { wrapper });

      act(() => {
        result.current.setPage(3);
      });

      expect(result.current.currentPage).toBe(3);

      act(() => {
        result.current.setFilter({ status: TaskStatus.DONE });
      });

      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('setPage', () => {
    it('should update current page', () => {
      const { result } = renderHook(() => useTaskContext(), { wrapper });

      act(() => {
        result.current.setPage(2);
      });

      expect(result.current.currentPage).toBe(2);
    });
  });

  describe('clearError', () => {
    it('should clear error', async () => {
      const mockError = { message: 'Test error' };
      (TaskService.getTasks as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useTaskContext(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      await waitFor(() => {
        expect(result.current.error).toEqual(mockError);
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('setSelectedTask', () => {
    it('should set selected task', () => {
      const { result } = renderHook(() => useTaskContext(), { wrapper });

      act(() => {
        result.current.setSelectedTask(mockTasks[0]);
      });

      expect(result.current.selectedTask).toEqual(mockTasks[0]);
    });

    it('should clear selected task', () => {
      const { result } = renderHook(() => useTaskContext(), { wrapper });

      act(() => {
        result.current.setSelectedTask(mockTasks[0]);
      });

      expect(result.current.selectedTask).toEqual(mockTasks[0]);

      act(() => {
        result.current.setSelectedTask(null);
      });

      expect(result.current.selectedTask).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useTaskContext());
      }).toThrow('useTaskContext must be used within a TaskProvider');

      consoleSpy.mockRestore();
    });
  });
});

