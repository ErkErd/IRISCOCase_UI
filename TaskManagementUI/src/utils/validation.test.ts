import { validateTaskForm, isValidForm } from './validation';
import { TaskFormData } from '@/models';
import { TaskStatus } from '@/enums';

describe('validateTaskForm', () => {
  const validFormData: TaskFormData = {
    title: 'Valid Task Title',
    description: 'This is a valid description with more than 10 characters',
    status: TaskStatus.TODO,
    dueDate: '2025-12-31',
  };

  describe('Title validation', () => {
    it('should return error when title is empty', () => {
      const formData = { ...validFormData, title: '' };
      const errors = validateTaskForm(formData);
      expect(errors.title).toBe('Title is required');
    });

    it('should return error when title is only whitespace', () => {
      const formData = { ...validFormData, title: '   ' };
      const errors = validateTaskForm(formData);
      expect(errors.title).toBe('Title is required');
    });

    it('should return error when title is less than 3 characters', () => {
      const formData = { ...validFormData, title: 'AB' };
      const errors = validateTaskForm(formData);
      expect(errors.title).toBe('Title must be at least 3 characters');
    });

    it('should return error when title exceeds 100 characters', () => {
      const formData = { ...validFormData, title: 'A'.repeat(101) };
      const errors = validateTaskForm(formData);
      expect(errors.title).toBe('Title must not exceed 100 characters');
    });

    it('should not return error for valid title', () => {
      const errors = validateTaskForm(validFormData);
      expect(errors.title).toBeUndefined();
    });
  });

  describe('Description validation', () => {
    it('should return error when description is empty', () => {
      const formData = { ...validFormData, description: '' };
      const errors = validateTaskForm(formData);
      expect(errors.description).toBe('Description is required');
    });

    it('should return error when description is only whitespace', () => {
      const formData = { ...validFormData, description: '   ' };
      const errors = validateTaskForm(formData);
      expect(errors.description).toBe('Description is required');
    });

    it('should return error when description is less than 10 characters', () => {
      const formData = { ...validFormData, description: 'Short' };
      const errors = validateTaskForm(formData);
      expect(errors.description).toBe('Description must be at least 10 characters');
    });

    it('should return error when description exceeds 500 characters', () => {
      const formData = { ...validFormData, description: 'A'.repeat(501) };
      const errors = validateTaskForm(formData);
      expect(errors.description).toBe('Description must not exceed 500 characters');
    });

    it('should not return error for valid description', () => {
      const errors = validateTaskForm(validFormData);
      expect(errors.description).toBeUndefined();
    });
  });

  describe('Due date validation', () => {
    it('should return error when due date is missing', () => {
      const formData = { ...validFormData, dueDate: '' };
      const errors = validateTaskForm(formData);
      expect(errors.dueDate).toBe('Due date is required');
    });

    it('should return error when due date is invalid format', () => {
      const formData = { ...validFormData, dueDate: 'invalid-date' };
      const errors = validateTaskForm(formData);
      expect(errors.dueDate).toBe('Invalid date format');
    });

    it('should return error when due date is in the past', () => {
      const pastDate = '2020-01-01';
      const formData = { ...validFormData, dueDate: pastDate };
      const errors = validateTaskForm(formData);
      expect(errors.dueDate).toBe('Due date cannot be in the past');
    });

    it('should not return error for today date', () => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const formData = { ...validFormData, dueDate: todayStr };
      const errors = validateTaskForm(formData);
      expect(errors.dueDate).toBeUndefined();
    });

    it('should not return error for future date', () => {
      const errors = validateTaskForm(validFormData);
      expect(errors.dueDate).toBeUndefined();
    });
  });

  describe('Complete form validation', () => {
    it('should return empty object for valid form data', () => {
      const errors = validateTaskForm(validFormData);
      expect(errors).toEqual({});
    });

    it('should return multiple errors for invalid form data', () => {
      const invalidFormData = {
        title: 'AB',
        description: 'Short',
        status: TaskStatus.TODO,
        dueDate: '2020-01-01',
      };
      const errors = validateTaskForm(invalidFormData);
      expect(errors.title).toBeDefined();
      expect(errors.description).toBeDefined();
      expect(errors.dueDate).toBeDefined();
    });
  });
});

describe('isValidForm', () => {
  it('should return true for empty errors object', () => {
    expect(isValidForm({})).toBe(true);
  });

  it('should return false for errors object with errors', () => {
    const errors = { title: 'Title is required' };
    expect(isValidForm(errors)).toBe(false);
  });

  it('should return false for errors object with multiple errors', () => {
    const errors = {
      title: 'Title is required',
      description: 'Description is required',
    };
    expect(isValidForm(errors)).toBe(false);
  });
});

