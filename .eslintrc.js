module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
  ],
  plugins: [
    'react',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'max-len': ['warn', { code: 120 }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    indent: ['warn', 2],
  },
};
