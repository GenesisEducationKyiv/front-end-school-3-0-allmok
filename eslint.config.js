import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [

  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".vscode/**",
      "coverage/**",
      "*.tsbuildinfo",
      "vite.config.ts",
      "postcss.config.js",
      "tailwind.config.js", 
      "dist/",
      "build/",
      "node_modules/",
      "playwright/.cache/",
      "playwright-report/",
      "test-results/"
    ],
  },

  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ...pluginJs.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"], 
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...(tseslint.configs.recommended.reduce((acc, config) => ({ ...acc, ...config.rules }), {})),
      ...(tseslint.configs.recommendedTypeChecked.reduce((acc, config) => ({ ...acc, ...config.rules }), {})),
      ...(tseslint.configs.stylisticTypeChecked.reduce((acc, config) => ({ ...acc, ...config.rules }), {})),

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...pluginReactConfig, 
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
    },
  },

  pluginReactJsxRuntime, 
];