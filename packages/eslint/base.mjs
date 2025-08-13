import eslint from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import-x';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginPromise from 'eslint-plugin-promise';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,
  eslintPluginJest.configs['flat/recommended'],
  eslintPluginPromise.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    ignores: [
      '.git/',
      '**/dist/',
      '**/coverage/',
      '**/node_modules/',
      '**/eslint.config.m?(j|t)s',
      '**/jest.config.m?(j|t)s',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      /* Javascript */
      'array-callback-return': ['error', { checkForEach: true }],
      'no-duplicate-imports': ['error', { includeExports: true }],
      'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
      'no-fallthrough': [
        'error',
        {
          commentPattern: 'break[\\s\\w]*omitted',
          allowEmptyCase: true,
          reportUnusedFallthroughComment: true,
        },
      ],
      'no-inner-declarations': ['error', 'both', { blockScopedFunctions: 'allow' }],
      'no-promise-executor-return': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-undef': ['error', { typeof: true }],
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-negation': ['error', { enforceForOrderingRelations: true }],
      'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],
      'no-unused-vars': 'off', // Handled by typescript-eslint
      'no-use-before-define': 'off', // Handled by typescript-eslint
      'no-useless-assignment': 'error',
      'require-atomic-updates': 'error',
      'use-isnan': ['error', { enforceForSwitchCase: true, enforceForIndexOf: true }],
      'valid-typeof': ['error', { requireStringLiterals: true }],
      'arrow-body-style': ['error', 'as-needed'],
      camelcase: 'off',
      'consistent-return': 'error',
      curly: 'error',
      'default-case': 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      eqeqeq: ['error', 'always'],
      'func-names': ['error', 'as-needed'],
      'guard-for-in': 'error',
      'new-cap': [
        'error',
        {
          newIsCap: true,
          capIsNew: false,
        },
      ],
      'no-alert': 'error',
      'no-array-constructor': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-div-regex': 'error',
      'no-empty-function': 'error',
      'no-eq-null': 'error',
      'no-eval': 'error',
      'no-implicit-coercion': [
        'error',
        { disallowTemplateShorthand: true, allow: ['!!'] },
      ],
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',

      /* Typescript */
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-namespace': 'off',

      /* Import */
      'import-x/no-unresolved': 'off', // Handled by typescript-eslint
      'import-x/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      /* Jest */
      'jest/expect-expect': [
        'error',
        {
          assertFunctionNames: [
            'expect',
            'request.**.expect', // Supertest
            'util.assertEqual', // Zod
          ],
        },
      ],
    },
  },
);
