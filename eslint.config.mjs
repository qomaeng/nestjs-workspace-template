import tseslint from 'typescript-eslint';

import node_config from '@template/eslint/node.mjs';

export default tseslint.config(
  {
    ignores: ['apps/**', 'packages/**'],
  },
  ...node_config,
);
