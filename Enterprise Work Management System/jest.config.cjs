module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^../api/axios$': '<rootDir>/src/__mocks__/axios.js',
    '^../../api/axios$': '<rootDir>/src/__mocks__/axios.js',
    '^./axios$': '<rootDir>/src/__mocks__/axios.js',
    // Mock MainLayout to avoid import.meta.env for WebSocket URL
    '^../layouts/MainLayout$': '<rootDir>/src/__mocks__/MainLayout.js',
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx}',
    'src/pages/**/*.{js,jsx}',
    'src/store/**/*.{js,jsx}',
    'src/theme/**/*.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx}',
  ],
};
