import {
  formatDate,
  formatDateForInput,
  getTodayDate,
  isOverdue,
  isToday,
  formatDateForApi,
} from './date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format ISO date string to readable format', () => {
      const result = formatDate('2024-12-25');
      expect(result).toBe('Dec 25, 2024');
    });

    it('should handle ISO datetime strings', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      expect(result).toMatch(/Jan 15, 2024/);
    });
  });

  describe('formatDateForInput', () => {
    it('should format Date object to YYYY-MM-DD', () => {
      const date = new Date('2024-12-25T10:30:00Z');
      const result = formatDateForInput(date);
      expect(result).toMatch(/2024-12-2[45]/); // Account for timezone differences
    });

    it('should format date string to YYYY-MM-DD', () => {
      const result = formatDateForInput('2024-12-25');
      expect(result).toMatch(/2024-12-2[45]/);
    });

    it('should return valid date format', () => {
      const result = formatDateForInput(new Date());
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('getTodayDate', () => {
    it('should return today date in YYYY-MM-DD format', () => {
      const result = getTodayDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return current date', () => {
      const result = getTodayDate();
      const today = new Date().toISOString().split('T')[0];
      expect(result).toBe(today);
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const pastDate = '2020-01-01';
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(isOverdue(todayStr)).toBe(false);
    });

    it('should return false for future dates', () => {
      const futureDate = '2030-12-31';
      expect(isOverdue(futureDate)).toBe(false);
    });

    it('should handle ISO datetime strings', () => {
      const pastDateTime = '2020-01-01T10:30:00Z';
      expect(isOverdue(pastDateTime)).toBe(true);
    });
  });

  describe('isToday', () => {
    it('should return true for today date', () => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(isToday(todayStr)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = '2020-01-01';
      expect(isToday(pastDate)).toBe(false);
    });

    it('should return false for future dates', () => {
      const futureDate = '2030-12-31';
      expect(isToday(futureDate)).toBe(false);
    });

    it('should handle different times on same day', () => {
      const todayMorning = new Date();
      todayMorning.setHours(8, 0, 0, 0);
      expect(isToday(todayMorning.toISOString())).toBe(true);

      const todayEvening = new Date();
      todayEvening.setHours(20, 0, 0, 0);
      expect(isToday(todayEvening.toISOString())).toBe(true);
    });
  });

  describe('formatDateForApi', () => {
    it('should convert YYYY-MM-DD to ISO 8601 format', () => {
      const result = formatDateForApi('2024-12-25');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should set time to noon UTC', () => {
      const result = formatDateForApi('2024-12-25');
      expect(result).toContain('T12:00:00');
    });

    it('should maintain correct date', () => {
      const result = formatDateForApi('2024-12-25');
      expect(result).toContain('2024-12-25');
    });

    it('should handle different months', () => {
      const result = formatDateForApi('2024-01-15');
      expect(result).toContain('2024-01-15');
    });
  });
});

