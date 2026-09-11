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
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      // next.config.ts documents NEXT_DIST_DIR=.next-build for building while a
      // dev server holds .next. .gitignore already covers it; without this line
      // linting a repo that has been built that way reports the build output.
      ".next-build/**",
      // The e2e suite builds here, for the same reason.
      ".next-e2e/**",
      "out/**",
      "build/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
