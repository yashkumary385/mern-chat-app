import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.node,   // ✅ enables `process`, `__dirname`, etc.
      },
    },
    rules: {
      // You can add custom rules here
    },
  },
  js.configs.recommended, // ✅ replaces `extends: ["eslint:recommended"]`
];
