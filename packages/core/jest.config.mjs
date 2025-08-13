import baseConfig from '@template/jest/base.mjs';

/** @type {import('jest').Config} */
export default {
  ...baseConfig,
  rootDir: 'src',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.m?[tj]s$': [
      'ts-jest',
      {
        tsconfig: {
          // To detect type error of zod // FIXME: Find better solution
          isolatedModules: false,
        }
      }
    ],
  },
  collectCoverageFrom: ['**/*.[tj]s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
