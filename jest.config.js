const path = require('path')

module.exports = {
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', path.join(__dirname, 'src'), 'shared'],
  moduleNameMapper: {
    '\\.module\\.css$': '<rootDir>/test/__mocks__/style-mock.js',
    '\\.css$': '<rootDir>/test/__mocks__/style-mock.js',
  },
}
