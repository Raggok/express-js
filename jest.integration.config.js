module.exports = {
  setupFiles: ['dotenv/config'],
  roots: ['<rootDir>/src/test-integration'],
  coveragePathIgnorePatterns: ['/ioc', 'exceptions'],
};
