import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/nextauth";
import {
  importTestPricesFromCsv,
  readDefaultTestPriceCsv,
} from "@/lib/test-price-csv";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Staff-only
  const session = await getServerSession(authOptions).catch(() => null);
  const sessionUser = session?.user as { role?: string | null } | undefined;
  const role = String(sessionUser?.role ?? "").toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  let csv: string | null = null;
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "file field required" },
        { status: 400 }
      );
    }
    csv = await file.text();
  } else {
    try {
      csv = await readDefaultTestPriceCsv();
    } catch (_error) {
      const csvPath = path.join(
        process.cwd(),
        "public",
        "assets",
        "medical_test_prices",
        "Medical_Test_Price.csv"
      );
      csv = await fs.readFile(csvPath, "utf8");
    }
  }
  const result = await importTestPricesFromCsv(prisma, {
    csv: csv ?? undefined,
  });

  return NextResponse.json({ ok: true, ...result });
}
