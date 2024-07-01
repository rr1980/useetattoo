import deprecation from "eslint-plugin-deprecation";
import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/environment.prod.ts",
      "**/dummy.component.ts",
      "**/private-protected-start-with-underscore.js",
    ],
  },
  {
    plugins: {
      deprecation: fixupPluginRules(deprecation),
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.app.json",
      },
    },
  },
  ...compat
    .extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@angular-eslint/recommended",
      "plugin:@angular-eslint/template/process-inline-templates"
    )
    .map((config) => ({
      ...config,
      files: ["**/*.ts"],
    })),
  {
    files: ["**/*.ts"],

    rules: {
      "@angular-eslint/directive-selector": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@angular-eslint/no-output-on-prefix": "off",
      "@angular-eslint/component-selector": "off",
      "typescript-config/consistent-casing": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-namespace": "off",
      "@angular-eslint/no-host-metadata-property": "off",
      "no-useless-escape": "off",
      "deprecation/deprecation": "error",

      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
        },
      ],

      quotes: [
        2,
        "single",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],

      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          ignoredMethodNames: ["constructor"],
        },
      ],

      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "memberLike",
          modifiers: ["private"],
          format: null,
          leadingUnderscore: "require",
        },
        {
          selector: "memberLike",
          modifiers: ["protected"],
          format: null,
          leadingUnderscore: "require",
        },
      ],
    },
  },
  ...compat
    .extends("plugin:@angular-eslint/template/recommended")
    .map((config) => ({
      ...config,
      files: ["**/*.html"],
    })),
  {
    files: ["**/*.html"],

    rules: {
      "@typescript-eslint/ban-ts-ignore": "off",
    },
  },
];
