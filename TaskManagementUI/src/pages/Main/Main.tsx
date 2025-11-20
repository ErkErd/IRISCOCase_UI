import React, { useState } from 'react';
import { Header } from '@/components/Layout';
import { Modal } from '@/components/UI';
import { TaskForm } from '@/components/Task';
import { TaskPage } from '../Task/Task';
import { TaskFormData } from '@/models';
import { useTaskContext } from '@/context';
import styles from './Main.module.css';

/**
 * Main Page Component
 * Parent page that contains header and task page
 */
export const MainPage: React.FC = () => {
  const { createTask, clearError } = useTaskContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateTask = async (data: TaskFormData) => {
    await createTask(data);
    setIsCreateModalOpen(false);
  };

  const handleOpenCreateModal = () => {
    clearError(); // Clear error when opening modal
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className={styles.mainPage}>
      <Header onCreateTask={handleOpenCreateModal} />
      
      <TaskPage isCreateModalOpen={isCreateModalOpen} />

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Create New Task"
        size="medium"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={handleCloseCreateModal}
        />
      </Modal>
    </div>
  );
};

