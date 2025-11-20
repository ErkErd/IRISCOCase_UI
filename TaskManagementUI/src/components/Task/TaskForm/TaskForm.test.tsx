import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from './TaskForm';
import { Task } from '@/models';
import { TaskStatus } from '@/enums';

const mockTask: Task = {
  id: '1',
  title: 'Existing Task',
  description: 'Existing task description for testing',
  status: TaskStatus.IN_PROGRESS,
  dueDate: '2025-12-31',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('should render all form fields', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    });

    it('should render Create Task button', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByText('Create Task')).toBeInTheDocument();
    });

    it('should have empty form fields initially', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(/Description/i) as HTMLTextAreaElement;
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });

    it('should have default status as TODO', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const statusSelect = screen.getByLabelText(/Status/i) as HTMLSelectElement;
      expect(statusSelect.value).toBe(TaskStatus.TODO);
    });
  });

  describe('Edit Mode', () => {
    it('should populate form with task data', () => {
      render(<TaskForm task={mockTask} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(/Description/i) as HTMLTextAreaElement;
      const statusSelect = screen.getByLabelText(/Status/i) as HTMLSelectElement;
      
      expect(titleInput.value).toBe(mockTask.title);
      expect(descriptionInput.value).toBe(mockTask.description);
      expect(statusSelect.value).toBe(mockTask.status);
    });

    it('should render Update Task button', () => {
      render(<TaskForm task={mockTask} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByText('Update Task')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should not call onSubmit when validation fails', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // Try to submit empty form
      fireEvent.submit(screen.getByRole('button', { name: /Create Task/i }).closest('form')!);
      
      // Validation should prevent submission
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should show error when description is too short', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const titleInput = screen.getByLabelText(/Title/i);
      const descriptionInput = screen.getByLabelText(/Description/i);
      const dueDateInput = screen.getByLabelText(/Due Date/i);
      
      fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Short' } });
      fireEvent.change(dueDateInput, { target: { value: '2025-12-31' } });
      fireEvent.click(screen.getByText('Create Task'));
      
      await waitFor(() => {
        expect(screen.getByText('Description must be at least 10 characters')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with valid data', async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const titleInput = screen.getByLabelText(/Title/i);
      const descriptionInput = screen.getByLabelText(/Description/i);
      const dueDateInput = screen.getByLabelText(/Due Date/i);
      
      fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'This is a valid description with enough characters' } });
      fireEvent.change(dueDateInput, { target: { value: '2025-12-31' } });
      
      fireEvent.click(screen.getByText('Create Task'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'New Task Title',
          description: 'This is a valid description with enough characters',
          status: TaskStatus.TODO,
          dueDate: '2025-12-31',
        });
      });
    });

    it('should disable form during submission', async () => {
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const titleInput = screen.getByLabelText(/Title/i);
      const descriptionInput = screen.getByLabelText(/Description/i);
      const dueDateInput = screen.getByLabelText(/Due Date/i);
      
      fireEvent.change(titleInput, { target: { value: 'Task Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Valid description text' } });
      fireEvent.change(dueDateInput, { target: { value: '2025-12-31' } });
      
      fireEvent.click(screen.getByText('Create Task'));
      
      await waitFor(() => {
        expect(titleInput).toBeDisabled();
        expect(descriptionInput).toBeDisabled();
      });
    });

    it('should show loading state on submit button', async () => {
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const titleInput = screen.getByLabelText(/Title/i);
      const descriptionInput = screen.getByLabelText(/Description/i);
      const dueDateInput = screen.getByLabelText(/Due Date/i);
      
      fireEvent.change(titleInput, { target: { value: 'Task Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Valid description text' } });
      fireEvent.change(dueDateInput, { target: { value: '2025-12-31' } });
      
      fireEvent.click(screen.getByText('Create Task'));
      
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });
  });

  describe('Cancel Action', () => {
    it('should call onCancel when Cancel button is clicked', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      fireEvent.click(screen.getByText('Cancel'));
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should not submit form when Cancel is clicked', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      fireEvent.click(screen.getByText('Cancel'));
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Interactions', () => {
    it('should allow typing in title field', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      expect(titleInput.value).toBe('New Title');
    });

    it('should allow typing in description field', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const descriptionInput = screen.getByLabelText(/Description/i) as HTMLTextAreaElement;
      fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
      expect(descriptionInput.value).toBe('New Description');
    });

    it('should allow changing status', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const statusSelect = screen.getByLabelText(/Status/i) as HTMLSelectElement;
      fireEvent.change(statusSelect, { target: { value: TaskStatus.IN_PROGRESS } });
      expect(statusSelect.value).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should allow changing due date', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const dueDateInput = screen.getByLabelText(/Due Date/i) as HTMLInputElement;
      fireEvent.change(dueDateInput, { target: { value: '2025-12-25' } });
      expect(dueDateInput.value).toBe('2025-12-25');
    });
  });
});

