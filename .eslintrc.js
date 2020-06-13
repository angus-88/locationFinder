module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    "plugin:react/recommended",
  ],
  plugins: [
    "react",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'max-len': ['warn', {code: 120 }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true}],
    'indent': ['error', 2],
  },
};
