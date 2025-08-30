import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // React rules first
  pluginReact.configs.flat.recommended,

  // Your custom project rules
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
        "react/prop-types": "off", 
          "react/no-unescaped-entities": "off"// 👈 now this will override
    },
    settings: {
  react: {
    version: "detect",
  },
}

  },
]);
