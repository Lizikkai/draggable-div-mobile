module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    // 基础规则 - 不太严格
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-unused-vars': 'off', // 关闭基础规则，使用 TypeScript 版本
    '@typescript-eslint/no-unused-vars': 'warn',
    
    // Vue 规则 - 基础配置
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    
    // TypeScript 规则
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    
    // 代码风格
    'indent': ['warn', 2],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'never'],
    'comma-dangle': ['warn', 'always-multiline'],
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.d.ts',
  ],
}