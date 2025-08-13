import tseslint from 'typescript-eslint';

import base_config from '@template/eslint/base.mjs';

export default tseslint.config(...base_config, {
  languageOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
