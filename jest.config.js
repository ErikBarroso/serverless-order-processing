/** @type {import('jest').Config} */
export default {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'text', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'main',
    'entities',
    'env',
    'server.ts',
  ],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
  