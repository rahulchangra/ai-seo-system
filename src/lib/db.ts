import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Detect serverless environment (Vercel, AWS Lambda, Netlify)
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY
  );

  if (isServerless) {
    const tmpDbPath = path.join("/tmp", "dev.db");
    const seedDbPath = path.join(process.cwd(), "prisma", "seed.db");
    const devDbPath = path.join(process.cwd(), "prisma", "dev.db");

    // Seed /tmp/dev.db if it doesn't exist
    if (!fs.existsSync(tmpDbPath)) {
      const sourceDb = fs.existsSync(seedDbPath)
        ? seedDbPath
        : fs.existsSync(devDbPath)
        ? devDbPath
        : null;

      if (sourceDb) {
        try {
          fs.copyFileSync(sourceDb, tmpDbPath);
        } catch (err) {
          console.warn("[Prisma] Could not copy seed DB to /tmp:", err);
        }
      }
    }

    const finalUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = finalUrl;
    return finalUrl;
  }

  const defaultUrl = "file:./dev.db";
  process.env.DATABASE_URL = defaultUrl;
  return defaultUrl;
}

const resolvedDbUrl = resolveDatabaseUrl();

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedDbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}
