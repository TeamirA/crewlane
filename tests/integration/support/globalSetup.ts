import { execSync } from "node:child_process";

import { PrismaClient } from "@prisma/client";

const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/crewlane_test";

async function truncateApplicationTables() {
  const prisma = new PrismaClient({ datasourceUrl: testDatabaseUrl });
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  const tableList = tables.map(({ tablename }) => `"public"."${tablename}"`).join(", ");
  if (tableList) await prisma.$executeRawUnsafe(`TRUNCATE ${tableList} CASCADE`);
  await prisma.$disconnect();
}

// Applies migrations to the dedicated test database and starts every run from empty tables.
export default async function setupTestDatabase() {
  execSync("npx prisma migrate deploy", {
    stdio: "pipe",
    env: { ...process.env, DATABASE_URL: testDatabaseUrl, DIRECT_URL: testDatabaseUrl },
  });
  await truncateApplicationTables();
}
