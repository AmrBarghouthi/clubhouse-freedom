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
    'array-bracket-spacing': ['warn'],
    'array-bracket-newline': ['warn', 'consistent'],
    'brace-style': ['warn'],
    'comma-dangle': ['warn', 'always-multiline'],
    'comma-spacing': ['warn'],
    'curly': ['warn'],
    'block-spacing': ['warn'],
    'indent': ['warn', 2, { SwitchCase: 1 }],
    'keyword-spacing': ['warn'],
    'linebreak-style': ['warn'],
    "lines-between-class-members": ['warn'],
    'newline-per-chained-call': ['warn'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-trailing-spaces': ['warn'],
    'object-curly-newline': ['warn', { 'consistent': true }],
    'object-curly-spacing': ['warn', 'always'],
    'prefer-promise-reject-errors': ['off'],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'never'],
    'space-before-blocks': ['warn'],
    'space-before-function-paren': ['warn'],
    "template-curly-spacing": ["warn"],
    "vue/html-closing-bracket-newline": ["warn", { "singleline": "never", "multiline": "always" }],
    'vue/html-indent': ['warn', 2],
    'vue/max-attributes-per-line': ['warn', { 'singleline': 1, 'multiline': { 'max': 1, 'allowFirstLine': false } }],
  },
}
