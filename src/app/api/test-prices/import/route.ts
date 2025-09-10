import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

function parseCsv(content: string): string[][] {
  // Robust-enough CSV parser with quotes and newlines
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
        if (next === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += ch; i++; continue;
    }
    if (ch === '"') { inQuotes = true; i++; continue; }
    if (ch === ',') { row.push(field); field = ""; i++; continue; }
    if (ch === '\r') { i++; continue; }
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += ch; i++;
  }
  row.push(field); rows.push(row);
  return rows;
}

function toCents(rate: string): number {
  const cleaned = rate.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const num = Number.parseFloat(cleaned);
  return Math.round(num * 100);
}

export async function POST(req: Request) {
  // Staff-only
  const session = await getServerSession(authOptions).catch(() => null);
  const role = String(((session?.user as any)?.role as string | undefined) || '').toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  let csv: string | null = null;
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file field required" }, { status: 400 });
    }
    csv = await file.text();
  } else {
    const csvPath = path.join(process.cwd(), "public", "assets", "medical_test_prices", "Medical_Test_Price.csv");
    csv = await fs.readFile(csvPath, "utf8");
  }
  const rows = parseCsv(csv);
  if (rows.length === 0) return NextResponse.json({ imported: 0, updated: 0 });
  const header = rows[0].map((h) => h.trim());
  const col = (name: string) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());
  const idx = {
    examType: col("Exam Type"),
    department: col("Department Name"),
    sl: col("Sl. No"),
    examNo: col("Exam No"),
    examName: col("Exam Name"),
    shortName: col("Short Name"),
    active: col("Active Status"),
    rate: col("Rate"),
    deliveryType: col("Delivery Type"),
    deliveryHour: col("Delivery Hour"),
  } as const;

  let imported = 0; let updated = 0;
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const code = ((row[idx.examNo] || "") + "").replace(/\s+/g, "").trim();
    const name = ((row[idx.examName] || "") + "").replace(/\s+/g, " ").trim();
    if (!code || !name) continue;
    const activeRaw = (row[idx.active] || "").trim().toLowerCase();
    const active = activeRaw.startsWith("y");
    const priceCents = toCents(String(row[idx.rate] || "0"));
    const data: any = {
      code,
      name,
      description: null,
      priceCents,
      active,
      examType: (row[idx.examType] || null) as any,
      department: (row[idx.department] || null) as any,
      serialNo: (row[idx.sl] || null) as any,
      shortName: (row[idx.shortName] || null) as any,
      deliveryType: (row[idx.deliveryType] || null) as any,
      deliveryHour: null as number | null,
    };
    const dhRaw = (row[idx.deliveryHour] || "").toString().trim();
    if (dhRaw) {
      const n = Number.parseInt(dhRaw, 10);
      if (Number.isFinite(n)) data.deliveryHour = n;
    }

    try {
      const existing = await prisma.testPrice.findUnique({ where: { code } });
      await prisma.testPrice.upsert({
        where: { code },
        create: data,
        update: data,
      });
      if (existing) updated++; else imported++;
    } catch {
      // skip bad rows
    }
  }

  return NextResponse.json({ ok: true, imported, updated });
}
