/**
 * Application configuration
 * 
 * This file contains application-wide configuration settings
 * that can be easily modified without changing code
 */

export const AppConfig = {
  /**
   * Application info
   */
  app: {
    name: 'Task Manager',
    version: '1.0.0',
    description: 'Task Management Application',
  },

  /**
   * API configuration
   * Development: http://localhost:5065 (via proxy)
   * Production: Set VITE_API_BASE_URL environment variable
   */
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
  },

  /**
   * Pagination settings
   */
  pagination: {
    defaultPage: 1,
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  },

  /**
   * Date settings
   */
  date: {
    format: 'YYYY-MM-DD',
    displayFormat: 'MMM DD, YYYY',
    locale: 'en-US',
  },

  /**
   * Validation rules
   */
  validation: {
    task: {
      title: {
        minLength: 3,
        maxLength: 100,
      },
      description: {
        minLength: 10,
        maxLength: 500,
      },
    },
  },

  /**
   * UI settings
   */
  ui: {
    theme: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
    },
    animation: {
      duration: 200, // ms
      easing: 'ease-in-out',
    },
  },

  /**
   * Feature flags
   */
  features: {
    enableDebugMode: import.meta.env.DEV,
    enableAnalytics: false,
    enableNotifications: false,
  },
} as const;

export type AppConfigType = typeof AppConfig;


