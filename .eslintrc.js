module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  env: {
    browser: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'prettier',
  ],

  plugins: [
    'vue',
    'only-warn',
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly',
  },

  rules: {
    'array-bracket-spacing': ['error'],
    'array-bracket-newline': ['error', 'consistent'],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': ['error'],
    'brace-style': ['error'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error'],
    'curly': ['error'],
    'block-spacing': ['error'],
    'indent': ['error', 2, { SwitchCase: 1 }],
    'keyword-spacing': ['error'],
    'linebreak-style': ['error'],
    "lines-between-class-members": ['error'],
    'newline-per-chained-call': ['error'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-trailing-spaces': ['error'],
    'object-curly-newline': ['error', { 'consistent': true }],
    'object-curly-spacing': ['error', 'always'],
    'prefer-promise-reject-errors': ['off'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'space-before-blocks': ['error'],
    'space-before-function-paren': ['error'],
    'space-infix-ops': ['error'],
    "template-curly-spacing": ["error"],
    "vue/html-closing-bracket-newline": ["error", { "singleline": "never", "multiline": "always" }],
    'vue/html-indent': ['error', 2],
    'vue/max-attributes-per-line': ['error', { 'singleline': 1, 'multiline': { 'max': 1, 'allowFirstLine': false } }],
  },
}
