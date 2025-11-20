/**
 * Formats a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date for input[type="date"]
 * @param date - Date object or date string
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export const getTodayDate = (): string => {
  return formatDateForInput(new Date());
};

/**
 * Checks if a date is overdue
 * @param dateString - ISO date string
 * @returns True if the date is in the past
 */
export const isOverdue = (dateString: string): boolean => {
  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

/**
 * Checks if a date is today
 * @param dateString - ISO date string
 * @returns True if the date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Converts a date string (YYYY-MM-DD) to ISO 8601 format with time (YYYY-MM-DDTHH:mm:ssZ)
 * Sets time to noon (12:00:00) UTC to ensure the date is in the future
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns ISO 8601 formatted date string with UTC timezone
 */
export const formatDateForApi = (dateString: string): string => {
  // Parse the date string (YYYY-MM-DD)
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Create a date object at noon UTC to ensure it's in the future
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  
  // Return ISO 8601 format with Z (UTC)
  return date.toISOString();
};


