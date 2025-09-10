import { NextRequest, NextResponse } from "next/server";
import { chatStore } from "@/lib/chat/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET || process.env.QSTASH_TOKEN || "";
  const provided = req.headers.get("x-task-secret") || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Example: prune archived chat threads older than 30 days to keep memory tiny
  try {
    const now = Date.now();
    const cutoff = now - 1000 * 60 * 60 * 24 * 30;
    for (const [id, t] of chatStore.threads.entries()) {
      if (t.archivedAt && t.archivedAt < cutoff) {
        chatStore.threads.delete(id);
        chatStore.messages.delete(id);
      }
    }
  } catch {}

  return NextResponse.json({ ok: true, pruned: true });
}

