import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

// Avoid creating many Prisma clients in development (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const logLevel: Prisma.LogLevel[] =
  process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

// Prefer the DATABASE_URL from the environment but fall back to a dummy
// connection string so that the project can build without a real database
// connection.  Vercel injects the real connection string at runtime.
const PLACEHOLDER_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/placeholder";

function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "DATABASE_URL is not set. Using a placeholder connection string instead.",
      );
    }
    return PLACEHOLDER_DATABASE_URL;
  }

  try {
    // Validate that the URL is well-formed; fall back if it's not
    new URL(url);
    return url;
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      "DATABASE_URL is malformed. Using a placeholder connection string instead.",
    );
    return PLACEHOLDER_DATABASE_URL;
  }
}

const connectionString = resolveDatabaseUrl();

/* biome-ignore lint/suspicious/noRedeclare: reuse single Prisma client */
export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: { db: { url: connectionString } },
    log: logLevel, // keeps performance tight in prod (no 'query' logs)
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
