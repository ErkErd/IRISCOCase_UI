/**
 * API Endpoints configuration
 */

export const API_ENDPOINTS = {
  // Task endpoints
  TASKS: {
    BASE: '/Task',
    BY_ID: (id: string) => `/Task/${id}`,
    STATUS: (id: string) => `/Task/${id}/status`,
  },
  
  // Add more endpoint groups as needed
  // USERS: {
  //   BASE: '/users',
  //   BY_ID: (id: string) => `/users/${id}`,
  // },
} as const;


