import eslintPluginNode from 'eslint-plugin-n';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import baseConfig from './base.mjs';

export default tseslint.config(
  eslintPluginNode.configs['flat/recommended'],
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      /* Node */
      'n/no-missing-import': 'off', // Duplicates `import-x/no-unresolved`
      'n/no-missing-require': 'off', // Duplicates `import-x/no-unresolved`
    },
  },
);
