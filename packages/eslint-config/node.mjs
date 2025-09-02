import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver } from 'eslint-plugin-import-x/node-resolver';
import eslintPluginNode from 'eslint-plugin-n';
import tseslint from 'typescript-eslint';

import baseConfig from './base.mjs';

export default tseslint.config(
  /* Base */
  ...baseConfig,

  /* Node */
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    extends: [eslintPluginNode.configs['flat/recommended']],
  },

  /* Override */
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver(), createNodeResolver()],
    },
    rules: {
      /* Node */
      'n/no-missing-import': 'off', // Duplicates `import-x/no-unresolved`
      'n/no-missing-require': 'off', // Duplicates `import-x/no-unresolved`
    },
  },
);
