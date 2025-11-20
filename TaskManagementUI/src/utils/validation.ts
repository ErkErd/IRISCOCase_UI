import { TaskFormData } from '@/models';

/**
 * Validation error type
 */
export interface ValidationErrors {
  [key: string]: string | undefined;
  title?: string;
  description?: string;
  dueDate?: string;
}

/**
 * Validates task form data
 * @param data - Task form data to validate
 * @returns Object containing validation errors, or empty object if valid
 */
export const validateTaskForm = (data: Partial<TaskFormData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (data.title.trim().length > 100) {
    errors.title = 'Title must not exceed 100 characters';
  }

  // Description validation
  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (data.description.trim().length > 500) {
    errors.description = 'Description must not exceed 500 characters';
  }

  // Due date validation
  if (!data.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    const selectedDate = new Date(data.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      errors.dueDate = 'Invalid date format';
    } else if (selectedDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
    }
  }

  return errors;
};

/**
 * Checks if validation errors object is empty
 * @param errors - Validation errors object
 * @returns True if there are no errors
 */
export const isValidForm = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};
