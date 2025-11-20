import React from 'react';
import { Modal, Button } from '@/components/UI';
import { Task } from '@/models';
import styles from './DeleteConfirmation.module.css';

export interface DeleteConfirmationProps {
  isOpen: boolean;
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * Delete Confirmation Component
 */
export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  task,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete Task" size="small">
      <div className={styles.content}>
        <p className={styles.message}>
          Are you sure you want to delete the task{' '}
          <strong>"{task?.title}"</strong>? This action cannot be undone.
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

