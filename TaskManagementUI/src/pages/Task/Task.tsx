import React, { useEffect, useState } from 'react';
import { Task, TaskFormData } from '@/models';
import { TaskStatus } from '@/enums';
import { useTaskContext } from '@/context';
import { Container } from '@/components/Layout';
import { TaskFilter, TaskList } from '@/components/Task';
import { TaskForm } from '@/components/Task/TaskForm/TaskForm';
import { Modal } from '@/components/UI';
import { DeleteConfirmation } from '@/components/DeleteConfirmation/DeleteConfirmation';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { Pagination } from '@/components/Pagination/Pagination';
import styles from './Task.module.css';

export interface TaskPageProps {
  isCreateModalOpen?: boolean;
}

/**
 * Task Page Component
 * Main page for task management operations
 */
export const TaskPage: React.FC<TaskPageProps> = ({ isCreateModalOpen = false }) => {
  const {
    tasks,
    loading,
    error,
    filter,
    currentPage,
    totalPages,
    fetchTasks,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilter,
    setPage,
    clearError,
  } = useTaskContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch tasks on mount and when filter/page changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle edit task
  const handleEditTask = async (data: TaskFormData) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, data);
      setIsEditModalOpen(false);
      setSelectedTask(null);
    }
  };

  // Handle delete task
  const handleDeleteTask = async () => {
    if (selectedTask) {
      setIsDeleting(true);
      try {
        await deleteTask(selectedTask.id);
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
      } catch (err) {
        // Error handled by context
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await updateTaskStatus(taskId, status);
  };

  // Open edit modal
  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
    clearError(); // Clear error when opening modal
  };

  // Open delete modal
  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  // Close modals
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className={styles.taskPage}>
      <Container>
        <div className={styles.content}>
          {error && !isEditModalOpen && !isCreateModalOpen && <ErrorMessage error={error} onDismiss={clearError} />}

          <TaskFilter filter={filter} onFilterChange={setFilter} />

          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onStatusChange={handleStatusChange}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </Container>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Task"
        size="medium"
      >
        <TaskForm
          task={selectedTask}
          onSubmit={handleEditTask}
          onCancel={closeEditModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        task={selectedTask}
        onConfirm={handleDeleteTask}
        onCancel={closeDeleteModal}
        loading={isDeleting}
      />
    </div>
  );
};


