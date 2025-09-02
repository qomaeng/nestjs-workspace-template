import tseslint from 'typescript-eslint';

import nodeConfig from './node.mjs';

export default tseslint.config(
  /* Node */
  ...nodeConfig,

  /* Override */
  {},
);
