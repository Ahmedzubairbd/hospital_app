import fs from "node:fs/promises";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const MEDICAL_TEST_PRICE_CSV_PATH = path.join(
  process.cwd(),
  "public",
  "assets",
  "medical_test_prices",
  "Medical_Test_Price.csv",
);

export type TestPriceCsvRecord = {
  code: string;
  name: string;
  priceCents: number;
  active: boolean;
  description: string | null;
  examType: string | null;
  department: string | null;
  serialNo: string | null;
  shortName: string | null;
  deliveryType: string | null;
  deliveryHour: number | null;
};

let cachedSupportsExtended: boolean | null = null;

function isMissingColumnError(error: unknown): boolean {
  return (
    error instanceof PrismaClientKnownRequestError && error.code === "P2022"
  );
}

export async function supportsTestPriceExtendedColumns(
  prisma: PrismaClient,
): Promise<boolean> {
  if (cachedSupportsExtended !== null) return cachedSupportsExtended;
  try {
    await prisma.testPrice.findFirst({
      select: { examType: true },
      take: 1,
    });
    cachedSupportsExtended = true;
  } catch (error: unknown) {
    if (isMissingColumnError(error)) {
      cachedSupportsExtended = false;
    } else {
      throw error;
    }
  }
  return cachedSupportsExtended;
}

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let i = 0;
  const n = content.length;
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  while (i < n) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"') {
        const next = content[i + 1];
        if (next === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (ch === "\r") {
      i++;
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += ch;
    i++;
  }

  row.push(field);
  rows.push(row);
  return rows;
}

function toCents(rate: string): number {
  const cleaned = rate.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const num = Number.parseFloat(cleaned);
  if (!Number.isFinite(num)) return 0;
  return Math.round(num * 100);
}

function indexFor(header: string[], name: string): number {
  return header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase());
}

export function parseTestPriceCsv(content: string): TestPriceCsvRecord[] {
  const rows = parseCsv(content);
  if (!rows.length) return [];

  const header = rows[0] ?? [];
  const idx = {
    examType: indexFor(header, "Exam Type"),
    department: indexFor(header, "Department Name"),
    serialNo: indexFor(header, "Sl. No"),
    code: indexFor(header, "Exam No"),
    name: indexFor(header, "Exam Name"),
    shortName: indexFor(header, "Short Name"),
    active: indexFor(header, "Active Status"),
    rate: indexFor(header, "Rate"),
    deliveryType: indexFor(header, "Delivery Type"),
    deliveryHour: indexFor(header, "Delivery Hour"),
  } as const;

  const records: TestPriceCsvRecord[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const code = `${row[idx.code] || ""}`.replace(/\s+/g, "").trim();
    const name = `${row[idx.name] || ""}`.replace(/\s+/g, " ").trim();
    if (!code || !name) continue;

    const activeRaw = (row[idx.active] || "").toString().trim().toLowerCase();
    const active = activeRaw.startsWith("y");
    const deliveryHourRaw = (row[idx.deliveryHour] || "").toString().trim();
    let deliveryHour: number | null = null;
    if (deliveryHourRaw) {
      const parsed = Number.parseInt(deliveryHourRaw, 10);
      if (Number.isFinite(parsed)) deliveryHour = parsed;
    }

    records.push({
      code,
      name,
      description: null,
      priceCents: toCents(String(row[idx.rate] || "0")),
      active,
      examType: (row[idx.examType] || null) as string | null,
      department: (row[idx.department] || null) as string | null,
      serialNo: (row[idx.serialNo] || null) as string | null,
      shortName: (row[idx.shortName] || null) as string | null,
      deliveryType: (row[idx.deliveryType] || null) as string | null,
      deliveryHour,
    });
  }

  return records;
}

export async function readDefaultTestPriceCsv(): Promise<string> {
  return fs.readFile(MEDICAL_TEST_PRICE_CSV_PATH, "utf8");
}

export async function importTestPricesFromCsv(
  prisma: PrismaClient,
  options: { csv?: string } = {},
): Promise<{ imported: number; updated: number }> {
  const csv = options.csv ?? (await readDefaultTestPriceCsv());
  const records = parseTestPriceCsv(csv);
  if (!records.length) return { imported: 0, updated: 0 };

  let imported = 0;
  let updated = 0;
  const supportsExtended = await supportsTestPriceExtendedColumns(prisma);

  for (const record of records) {
    try {
      const existing = await prisma.testPrice.findUnique({
        where: { code: record.code },
        select: { id: true },
      });
      const baseData = {
        code: record.code,
        name: record.name,
        description: record.description,
        priceCents: record.priceCents,
        active: record.active,
      };
      const extendedData = supportsExtended
        ? {
            examType: record.examType,
            department: record.department,
            serialNo: record.serialNo,
            shortName: record.shortName,
            deliveryType: record.deliveryType,
            deliveryHour: record.deliveryHour,
          }
        : {};
      await prisma.testPrice.upsert({
        where: { code: record.code },
        create: { ...baseData, ...extendedData },
        update: { ...baseData, ...extendedData },
      });
      if (existing) updated += 1;
      else imported += 1;
    } catch (error) {
      // ignore bad rows but continue processing others
      console.warn("Failed to import test price", record.code, error);
    }
  }

  return { imported, updated };
}

export async function ensureTestPricesSeeded(prisma: PrismaClient) {
  const count = await prisma.testPrice.count();
  if (count > 0) return null;

  try {
    // Reset detection cache to avoid stale negative in long-lived processes
    cachedSupportsExtended = null;
    return await importTestPricesFromCsv(prisma);
  } catch (error) {
    console.error("Failed to seed test prices from CSV", error);
    return null;
  }
}
