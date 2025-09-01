import { PrismaClient } from "@prisma/client";

// Avoid creating many Prisma clients in development (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const logLevel =
  process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

// Provide a sensible default to avoid runtime crashes when DATABASE_URL is missing
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/postgres";

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: { db: { url: connectionString } },
    log: logLevel as any, // keeps performance tight in prod (no 'query' logs)
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
