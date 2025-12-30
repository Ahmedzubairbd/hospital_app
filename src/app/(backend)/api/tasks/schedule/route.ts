import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = String(
    ((session?.user as any)?.role as string | undefined) || "",
  ).toLowerCase();
  if (role !== "admin" && role !== "moderator")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = (await req.json().catch(() => null)) as {
    url?: string;
    cron?: string;
    name?: string;
  } | null;
  if (!body?.url || !body?.cron)
    return NextResponse.json(
      { error: "url and cron required" },
      { status: 400 },
    );

  const base = process.env.QSTASH_URL || "https://qstash.upstash.io";
  const token = process.env.QSTASH_TOKEN || "";
  if (!token)
    return NextResponse.json(
      { error: "QSTASH_TOKEN missing" },
      { status: 500 },
    );

  const secret = process.env.CRON_SECRET || token;
  const target = body.url;

  const res = await fetch(`${base}/v2/publish/${encodeURIComponent(target)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Upstash-Cron": body.cron,
      // Forward a simple header our handler checks
      "Upstash-Forward-Header-X-Task-Secret": secret,
    },
    body: JSON.stringify({ source: "schedule" }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    return NextResponse.json(
      { error: json.error || "schedule failed" },
      { status: 500 },
    );
  return NextResponse.json({ ok: true, schedule: json });
}
