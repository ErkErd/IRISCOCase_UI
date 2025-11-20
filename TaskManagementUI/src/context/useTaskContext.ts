import { useContext } from 'react';
import { TaskContext, TaskContextType } from './TaskContext';

/**
 * Custom hook to use task context
 */
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

