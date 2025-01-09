module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "middleware/**/*.js",
    "models/**/*.js",
    "routes/**/*.js",
    "services/**/*.js",
    "!**/node_modules/**",
  ],
  testTimeout: 30000,
  setupFilesAfterEnv: ["./__tests__/setup.js"],
  testEnvironmentOptions: {
    NODE_ENV: "test",
  },
  verbose: true,
};
