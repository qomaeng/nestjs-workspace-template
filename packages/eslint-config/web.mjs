import tseslint from 'typescript-eslint';
import globals from 'globals';

import baseConfig from './base.mjs';

export default tseslint.config(
  /* Base */
  ...baseConfig,

  /* Override */
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
);
