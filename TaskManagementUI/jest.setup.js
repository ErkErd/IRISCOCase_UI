require('@testing-library/jest-dom');

// Mock constants to avoid import.meta.env issues
jest.mock('./src/constants', () => require('./src/__mocks__/constants'));

