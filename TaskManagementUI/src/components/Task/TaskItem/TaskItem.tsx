import React from 'react';
import { Task } from '@/models';
import { TaskStatus } from '@/enums';
import { Card, Button, Select } from '@/components/UI';
import { TASK_STATUS_OPTIONS } from '@/constants';
import { formatDate, isOverdue, isToday } from '@/utils';
import styles from './TaskItem.module.css';

export interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

/**
 * Task Item Component to display a single task
 */
export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as TaskStatus);
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return styles.statusTodo;
      case TaskStatus.IN_PROGRESS:
        return styles.statusInProgress;
      case TaskStatus.DONE:
        return styles.statusDone;
      default:
        return '';
    }
  };

  const getDueDateClass = (): string => {
    if (task.status === TaskStatus.DONE) return '';
    if (isOverdue(task.dueDate)) return styles.overdue;
    if (isToday(task.dueDate)) return styles.today;
    return '';
  };

  return (
    <Card className={styles.taskItem} hoverable>
      <div className={styles.taskHeader}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        <div className={`${styles.statusBadge} ${getStatusColor(task.status)}`}>
          {task.status}
        </div>
      </div>

      <p className={styles.taskDescription}>{task.description}</p>

      <div className={styles.taskMeta}>
        <div className={`${styles.dueDate} ${getDueDateClass()}`}>
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Due: {formatDate(task.dueDate)}</span>
          {isOverdue(task.dueDate) && task.status !== TaskStatus.DONE && (
            <span className={styles.overdueLabel}>Overdue!</span>
          )}
          {isToday(task.dueDate) && task.status !== TaskStatus.DONE && (
            <span className={styles.todayLabel}>Today</span>
          )}
        </div>
      </div>

      <div className={styles.taskActions}>
        <div className={styles.statusSelect}>
          <Select
            value={task.status}
            onChange={handleStatusChange}
            options={TASK_STATUS_OPTIONS}
            fullWidth
          />
        </div>
        <div className={styles.actionButtons}>
          <Button size="small" variant="secondary" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button size="small" variant="danger" onClick={() => onDelete(task)}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

