module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off', // Запрет использования any
        '@typescript-eslint/no-unused-vars': 'warn', // Предупреждение о неиспользуемых переменных
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/ban-ts-comment': 'error',
        'no-async-promise-executor': 'error', // Запрет использования в new Promise() в качестве обратной функции async то есть new Promise(async ()) нельзя
        'no-const-assign': 'error', // Переопределение констант запрещено
        'no-debugger': 'error', // Запрет использования debugger
        'no-self-assign': 'error', // Нет самоназначения, то есть когда левая сторона выражения равна правой при присвоении
        'no-sparse-arrays': 'error', // Запрет на разряженные массивы [1, , 2]
        'no-unreachable': 'error', // Запрет на недоступный код после return throw continue break
        'use-isnan': 'error', // Использование isNaN никаких сравнений NaN
        'valid-typeof': ['error', { requireStringLiterals: true }], // Валидные типы для typeof
        'no-console': 'error', // Предупреждение использования консоли
  },
};
