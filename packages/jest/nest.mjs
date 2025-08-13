import baseConfig from './base.mjs';

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  rootDir: 'src',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.m?[tj]s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.[tj]s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
