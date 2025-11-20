import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from './TaskItem';
import { Task } from '@/models';
import { TaskStatus } from '@/enums';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'This is a test task description',
  status: TaskStatus.TODO,
  dueDate: '2025-12-31',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const mockHandlers = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onStatusChange: jest.fn(),
};

describe('TaskItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task title', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task description', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
  });

  it('should render task status', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    expect(screen.getByText(TaskStatus.TODO)).toBeInTheDocument();
  });

  it('should render due date', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  it('should call onEdit when Edit button is clicked', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when Delete button is clicked', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTask);
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
  });

  it('should call onStatusChange when status is changed', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: TaskStatus.IN_PROGRESS } });
    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith(mockTask.id, TaskStatus.IN_PROGRESS);
  });

  it('should display different status badge colors for different statuses', () => {
    const { rerender, container } = render(<TaskItem task={mockTask} {...mockHandlers} />);
    expect(screen.getByText(TaskStatus.TODO)).toBeInTheDocument();

    const inProgressTask = { ...mockTask, status: TaskStatus.IN_PROGRESS };
    rerender(<TaskItem task={inProgressTask} {...mockHandlers} />);
    expect(screen.getByText(TaskStatus.IN_PROGRESS)).toBeInTheDocument();

    const doneTask = { ...mockTask, status: TaskStatus.DONE };
    rerender(<TaskItem task={doneTask} {...mockHandlers} />);
    const statusBadge = container.querySelector('.statusBadge');
    expect(statusBadge).toHaveTextContent(TaskStatus.DONE);
  });

  it('should show overdue label for past due dates', () => {
    const overdueTask = { ...mockTask, dueDate: '2020-01-01' };
    render(<TaskItem task={overdueTask} {...mockHandlers} />);
    expect(screen.getByText('Overdue!')).toBeInTheDocument();
  });

  it('should show today label for today due dates', () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayTask = { ...mockTask, dueDate: todayStr };
    render(<TaskItem task={todayTask} {...mockHandlers} />);
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should not show overdue label for completed tasks', () => {
    const overdueCompletedTask = {
      ...mockTask,
      dueDate: '2020-01-01',
      status: TaskStatus.DONE,
    };
    render(<TaskItem task={overdueCompletedTask} {...mockHandlers} />);
    expect(screen.queryByText('Overdue!')).not.toBeInTheDocument();
  });

  it('should not show today label for completed tasks', () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayCompletedTask = {
      ...mockTask,
      dueDate: todayStr,
      status: TaskStatus.DONE,
    };
    render(<TaskItem task={todayCompletedTask} {...mockHandlers} />);
    expect(screen.queryByText('Today')).not.toBeInTheDocument();
  });

  it('should render Edit and Delete buttons', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should have status dropdown with current status selected', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    const statusSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(statusSelect.value).toBe(TaskStatus.TODO);
  });
});

