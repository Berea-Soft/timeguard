import { defineConfig } from "vitest/config";

export default defineConfig({
  // test/frameworks.test.ts imports src/angular.ts directly, which uses
  // legacy TypeScript decorators (@Pipe/@Injectable). Vitest 4 (Vite 8)
  // transforms via oxc by default, not esbuild — oxc only parses that
  // syntax with typescript.experimentalDecorators explicitly enabled,
  // since it's not in the root tsconfig.json (only vite.config.ts's
  // Angular build mode had this, and only for esbuild).
  oxc: {
    typescript: {
      experimentalDecorators: true,
    },
    decorator: {
      legacy: true,
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.ts"],
    setupFiles: ["test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        statements: 78,
        branches: 67,
        functions: 80,
        lines: 80,
      },
    },
    server: {
      deps: {},
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
});
