import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

estlintConflig.push({
  rules: {
    "react-hooks/exhaustive-deps": "false",
    "react/jsx-key": "off",
    "typescript-eslint/no-explicit-any": "false",
    "@typescript-eslint/no-unsued-vars": "false",
  },
});

export default eslintConfig;
