import React, { useState, useEffect } from 'react';
import { Task, TaskFormData, ApiError } from '@/models';
import { TaskStatus } from '@/enums';
import { Button, Input, Textarea, Select } from '@/components/UI';
import { TASK_STATUS_OPTIONS } from '@/constants';
import { validateTaskForm, isValidForm, getTodayDate, ValidationErrors } from '@/utils';
import styles from './TaskForm.module.css';

export interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

/**
 * Task Form Component for creating and editing tasks
 */
export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    dueDate: getTodayDate(),
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateTaskForm(formData);
    if (!isValidForm(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear previous errors
    try {
      await onSubmit(formData);
      // Reset form on success
      if (!task) {
        setFormData({
          title: '',
          description: '',
          status: TaskStatus.TODO,
          dueDate: getTodayDate(),
        });
      }
      setErrors({}); // Clear errors on success
    } catch (error) {
      // Map API validation errors to form fields
      const apiError = error as ApiError;
      if (apiError.errors) {
        const apiValidationErrors: ValidationErrors = {};
        
        // Map API field names to form field names
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          // Convert API field names to form field names (e.g., "DueDate" -> "dueDate")
          const formFieldName = field.charAt(0).toLowerCase() + field.slice(1);
          apiValidationErrors[formFieldName] = messages.join(', ');
        });
        
        setErrors(apiValidationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        id="title"
        name="title"
        label="Title"
        placeholder="Enter task title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        fullWidth
        disabled={isSubmitting}
      />

      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="Enter task description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        required
        fullWidth
        disabled={isSubmitting}
        rows={4}
      />

      <Select
        id="status"
        name="status"
        label="Status"
        value={formData.status}
        onChange={handleChange}
        options={TASK_STATUS_OPTIONS}
        required
        fullWidth
        disabled={isSubmitting}
      />

      <Input
        id="dueDate"
        name="dueDate"
        type="date"
        label="Due Date"
        value={formData.dueDate}
        onChange={handleChange}
        error={errors.dueDate}
        required
        fullWidth
        disabled={isSubmitting}
        min={getTodayDate()}
      />

      <div className={styles.formActions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

