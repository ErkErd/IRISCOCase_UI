import React from 'react';
import { ApiError } from '@/models';
import styles from './ErrorMessage.module.css';

export interface ErrorMessageProps {
  error: ApiError | string;
  onDismiss?: () => void;
}

/**
 * Maps API field names to user-friendly field names
 */
const getFieldLabel = (fieldName: string): string => {
  const fieldMap: Record<string, string> = {
    'DueDate': 'Due Date',
    'Title': 'Title',
    'Description': 'Description',
    'Status': 'Status',
  };
  return fieldMap[fieldName] || fieldName;
};

/**
 * Error Message Component
 * Displays API errors including validation errors
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onDismiss }) => {
  // Handle string errors (backward compatibility)
  if (typeof error === 'string') {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
        {onDismiss && (
          <button className={styles.dismissButton} onClick={onDismiss}>
            &times;
          </button>
        )}
      </div>
    );
  }

  const apiError = error as ApiError;
  const hasValidationErrors = apiError.errors && Object.keys(apiError.errors).length > 0;

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div className={styles.errorMessage}>
          <span>{apiError.message}</span>
          {hasValidationErrors && (
            <ul className={styles.validationErrors}>
              {Object.entries(apiError.errors!).map(([field, messages]) => (
                <li key={field}>
                  <strong>{getFieldLabel(field)}:</strong> {messages.join(', ')}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {onDismiss && (
        <button className={styles.dismissButton} onClick={onDismiss}>
          &times;
        </button>
      )}
    </div>
  );
};


