import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        __DEV__: "readonly",
        console: "readonly",
        require: "readonly",
        process: "readonly",
        Buffer: "readonly",
        global: "readonly",
        structuredClone: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        Response: "readonly",
        Request: "readonly",
        Headers: "readonly",
        React: "readonly",
        JSX: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "no-undef": "off"
    }
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },
  {
    ignores: ["node_modules/**", "build/**", "dist/**"]
  }
];
