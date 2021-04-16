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
    'prefer-promise-reject-errors': [
      'off',
    ],
    'indent': [
      'warn',
      2,
      {
        SwitchCase: 1,
      }
    ],
    'vue/html-indent': [
        'warn',
        2,
    ],
    'linebreak-style': [
        'warn',
        'unix',
    ],
    'quotes': [
        'warn',
        'single',
    ],
    'semi': [
      'warn',
      'never',
    ],
    'comma-dangle': [
      'warn',
      'always-multiline',
    ],
    'space-before-function-paren': [
      'warn',
      'always',
    ],
    'keyword-spacing': [
        'warn',
    ],
    'no-trailing-spaces': [
        'warn',
    ],
    'vue/max-attributes-per-line': [
      'warn',
      {
        'singleline': 1,
        'multiline': {
            'max': 1,
            'allowFirstLine': false,
        },
      },
    ],
    "vue/html-closing-bracket-newline": [
      "warn", {
        "singleline": "never",
        "multiline": "always"
      },
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
}
