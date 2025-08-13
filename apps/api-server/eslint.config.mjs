import tseslint from 'typescript-eslint';

import nestConfig from '@template/eslint/nest.mjs';

export default tseslint.config(...nestConfig, {
  languageOptions: {
    ecmaVersion: 2023,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
