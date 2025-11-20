import React from 'react';
import { render, screen } from '@testing-library/react';
import { TaskList } from './TaskList';
import { Task } from '@/models';
import { TaskStatus } from '@/enums';

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
  {
    id: '3',
    title: 'Task 3',
    description: 'Description 3',
    status: TaskStatus.DONE,
    dueDate: '2025-12-20',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
];

const mockHandlers = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onStatusChange: jest.fn(),
};

describe('TaskList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    render(<TaskList tasks={[]} loading={true} {...mockHandlers} />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('should render empty state when no tasks', () => {
    render(<TaskList tasks={[]} loading={false} {...mockHandlers} />);
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(screen.getByText('Create your first task to get started!')).toBeInTheDocument();
  });

  it('should render all tasks', () => {
    render(<TaskList tasks={mockTasks} loading={false} {...mockHandlers} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('should render correct number of tasks', () => {
    render(<TaskList tasks={mockTasks} loading={false} {...mockHandlers} />);
    const taskElements = screen.getAllByText(/Task \d/);
    expect(taskElements).toHaveLength(mockTasks.length);
  });

  it('should not render tasks when loading', () => {
    render(<TaskList tasks={mockTasks} loading={true} {...mockHandlers} />);
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  it('should not show loading state when tasks are loaded', () => {
    render(<TaskList tasks={mockTasks} loading={false} {...mockHandlers} />);
    expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
  });

  it('should not show empty state when tasks exist', () => {
    render(<TaskList tasks={mockTasks} loading={false} {...mockHandlers} />);
    expect(screen.queryByText('No tasks found')).not.toBeInTheDocument();
  });

  it('should pass handlers to TaskItem components', () => {
    render(<TaskList tasks={[mockTasks[0]]} loading={false} {...mockHandlers} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should render tasks with different statuses', () => {
    const { container } = render(<TaskList tasks={mockTasks} loading={false} {...mockHandlers} />);
    const statusBadges = container.querySelectorAll('.statusBadge');
    expect(statusBadges[0]).toHaveTextContent(TaskStatus.TODO);
    expect(statusBadges[1]).toHaveTextContent(TaskStatus.IN_PROGRESS);
    expect(statusBadges[2]).toHaveTextContent(TaskStatus.DONE);
  });

  it('should handle single task', () => {
    render(<TaskList tasks={[mockTasks[0]]} loading={false} {...mockHandlers} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('should show loading spinner when loading', () => {
    const { container } = render(<TaskList tasks={[]} loading={true} {...mockHandlers} />);
    const spinner = container.querySelector('[class*="spinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should show empty icon when no tasks', () => {
    const { container } = render(<TaskList tasks={[]} loading={false} {...mockHandlers} />);
    const emptyIcon = container.querySelector('svg');
    expect(emptyIcon).toBeInTheDocument();
  });
});

