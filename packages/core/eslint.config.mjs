import globals from 'globals';
import tseslint from 'typescript-eslint';

import base_config from '@template/eslint-config/base';

export default tseslint.config(
  /* Base */
  ...base_config,

  /* Jest */
  {
    files: [
      'src/**/*.{test,spec}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
      'test/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  /* Override */
  {},
);
