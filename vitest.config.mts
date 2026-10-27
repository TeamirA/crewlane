import path from "node:path";
import { defineConfig } from "vitest/config";

const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/crewlane_test";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "server-only": path.resolve(__dirname, "tests/integration/support/emptyModule.ts"),
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/core/**", "src/infrastructure/**", "src/lib/**"],
    },
    projects: [
      { extends: true, test: { name: "unit", include: ["tests/unit/**/*.test.ts"] } },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
          globalSetup: ["tests/integration/support/globalSetup.ts"],
          fileParallelism: false,
          env: {
            DATABASE_URL: testDatabaseUrl,
            DIRECT_URL: testDatabaseUrl,
            JWT_ACCESS_SECRET: "integration-test-access-secret-0123456789",
            JWT_REFRESH_SECRET: "integration-test-refresh-secret-0123456789",
          },
        },
      },
    ],
  },
});
