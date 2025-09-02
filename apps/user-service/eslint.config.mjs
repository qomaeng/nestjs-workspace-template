import globals from 'globals';
import tseslint from 'typescript-eslint';

import nestConfig from '@template/eslint-config/nest';

export default tseslint.config(
  /* NestJS */
  ...nestConfig,

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
