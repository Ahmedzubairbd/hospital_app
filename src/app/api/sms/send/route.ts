import { NextRequest, NextResponse } from "next/server";

const BASE =
  process.env.SONALI_SMS_BASE_URL || process.env.SONALI_SMS_FALLBACK_BASE_URL;
const FALLBACK = process.env.SONALI_SMS_FALLBACK_BASE_URL;

const API_KEY = process.env.SONALI_SMS_API_KEY!;
const SECRET_KEY = process.env.SONALI_SMS_SECRET_KEY!;
const SENDER_ID = process.env.SONALI_SMS_SENDER_ID!;
const PATH = "/sendtext"; // single-SMS endpoint

function normalizeBangladesh(msisdnRaw: string): string {
  // digits only
  let d = (msisdnRaw || "").replace(/\D+/g, "");

  // Cases:
  // "015..." -> "88015..."
  if (d.length === 11 && d.startsWith("01")) return "880" + d.slice(1);

  // "15..." (user typed without 0) -> "88015..."
  if (d.length === 10 && d.startsWith("1")) return "8801" + d;

  // "+88015..." or "88015..." -> "88015..."
  if (d.startsWith("880")) return d;
  if (d.startsWith("0880")) return d.slice(1);

  // "0..." -> "880..." (drop leading 0)
  if (d.length === 11 && d.startsWith("0")) return "880" + d.slice(1);

  // Fallback: if it looks like a local 11-digit but missing 880
  if (d.length === 11) return "880" + d.slice(1);

  // Last resort, if already 880XXXXXXXXXX keep it, else return as-is
  return d;
}

async function hitSendText(base: string, toUser: string, message: string) {
  const qs = new URLSearchParams({
    apikey: API_KEY,
    secretkey: SECRET_KEY,
    callerID: SENDER_ID,
    toUser,
    messageContent: message, // URLSearchParams encodes for us
  });

  const url = `${base}${PATH}?${qs.toString()}`;
  const res = await fetch(url, { method: "GET", next: { revalidate: 0 } });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text };
}

export async function POST(req: NextRequest) {
  try {
    const { phone, message } = await req.json();

    if (!phone || !message) {
      return NextResponse.json(
        { error: "phone and message are required" },
        { status: 400 },
      );
    }

    const toUser = normalizeBangladesh(phone);
    if (!/^\d{13}$/.test(toUser) || !toUser.startsWith("8801")) {
      // BD mobile should be 8801XXXXXXXXX (13 digits)
      return NextResponse.json(
        { error: `Invalid BD number after normalization: ${toUser}` },
        { status: 400 },
      );
    }

    // Try primary host first, then fallback IP
    const first = await hitSendText(BASE!, toUser, message);
    if (first.ok) return NextResponse.json({ toUser, response: first.body });

    if (FALLBACK && BASE !== FALLBACK) {
      const second = await hitSendText(FALLBACK, toUser, message);
      if (second.ok) return NextResponse.json({ toUser, response: second.body });
      return NextResponse.json(
        {
          toUser,
          error: "Both primary and fallback endpoints failed",
          primary: { status: first.status, body: first.body },
          fallback: { status: second.status, body: second.body },
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        toUser,
        error: "Primary endpoint failed",
        primary: { status: first.status, body: first.body },
      },
      { status: 502 },
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 },
    );
  }
}

