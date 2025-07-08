import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "build/",
      "node_modules/",
      "playwright/.cache/",
      "playwright-report/",
      "test-results/",
      ".vscode/",
      "coverage/",
      "*.tsbuildinfo",
      "eslint.config.js", 
    ],
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.{ts,tsx}"], 
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.app.json"], 
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },

  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react": pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    languageOptions: {
      globals: { ...globals.browser },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        { "allowConstantExport": true },
      ],
    },
  },
  
  pluginJsxRuntime,

  {
    files: ["**/*.test.tsx", "**/*.spec.tsx", "**/*.spec.ts", "**/*.ct.spec.tsx"],
    rules: {
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-empty-function": "off",
    },
  }
);