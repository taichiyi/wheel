// const OFF = 0;
// const WARNNING = 2;
const ERROR = 2;

module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended'],
  plugins: ['prettier'],
  root: true,
  rules: {
    'no-empty': [ERROR, { allowEmptyCatch: true }],
    'prettier/prettier': [
      ERROR,
      {
        jsxBracketSameLine: true,
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 80,
        proseWrap: 'never',
      },
    ],
  },
  env: {
    browser: true,
    amd: true,
    commonjs: true,
    node: true,
    es6: true,
  },
};
