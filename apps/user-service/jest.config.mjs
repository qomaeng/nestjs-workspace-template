import nestConfig from '@template/jest/nest.mjs';

/** @type {import('jest').Config} */
export default {
  ...nestConfig,
  transform: {
    '^.+\\.m?[tj]s$': 'ts-jest',
  },
};
