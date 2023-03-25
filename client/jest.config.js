/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['components', 'api', 'src', 'node_modules'],
  testEnvironment: 'jsdom'
};