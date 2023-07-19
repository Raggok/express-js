module.exports = {
  roots: ['<rootDir>/src/test-unit'],
  coveragePathIgnorePatterns: [
    'app.ts',
    'index.ts',
    '/services',
    '/routes',
    '/exceptions',
    '/repository',
    '/utils',
  ],
};
