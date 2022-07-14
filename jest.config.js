module.exports = {
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/src/components/**/*.js',
    '<rootDir>/src/pages/**/*.js',
    '<rootDir>/src/hooks/**/*.js',
    '<rootDir>/src/store/**/*.js',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
