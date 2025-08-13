import tseslint from 'typescript-eslint';

import baseConfig from './base.mjs';
import nodeConfig from './node.mjs';

export default tseslint.config(...baseConfig, ...nodeConfig, {
  languageOptions: {
    sourceType: 'module',
  },
});
