// https://jestjs.io/docs/en/configuration
module.exports = {
  // collectCoverage: true,
  collectCoverageFrom: ['*.js', '!*.config.js', '!.*'],
  coverageDirectory: 'reports',
  coveragePathIgnorePatterns: ['<rootDir>/index', 'reports', 'test'],
  coverageProvider: 'babel',
  verbose: true
}
