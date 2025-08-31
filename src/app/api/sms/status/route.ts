import { NextRequest, NextResponse } from "next/server";

const BASE =
  process.env.SONALI_SMS_BASE_URL || process.env.SONALI_SMS_FALLBACK_BASE_URL;
const FALLBACK = process.env.SONALI_SMS_FALLBACK_BASE_URL;
const API_KEY = process.env.SONALI_SMS_API_KEY!;
const SECRET_KEY = process.env.SONALI_SMS_SECRET_KEY!;
const PATH = "/getstatus";

async function hit(base: string, messageid: string) {
  const qs = new URLSearchParams({
    apikey: API_KEY,
    secretkey: SECRET_KEY,
    messageid,
  });
  const res = await fetch(`${base}${PATH}?${qs}`, { method: "GET" });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text };
}

export async function GET(req: NextRequest) {
  const messageid = req.nextUrl.searchParams.get("messageid") || "";
  if (!messageid)
    return NextResponse.json({ error: "messageid required" }, { status: 400 });

  const a = await hit(BASE!, messageid);
  if (a.ok) return NextResponse.json({ messageid, response: a.body });

  if (FALLBACK && BASE !== FALLBACK) {
    const b = await hit(FALLBACK, messageid);
    if (b.ok) return NextResponse.json({ messageid, response: b.body });
    return NextResponse.json({ error: "both endpoints failed", a, b }, { status: 502 });
  }
  return NextResponse.json({ error: "primary failed", a }, { status: 502 });
}
