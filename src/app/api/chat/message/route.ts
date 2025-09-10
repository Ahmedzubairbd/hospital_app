import { NextRequest, NextResponse } from "next/server";
import { chatStore } from "@/lib/chat/store";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { verifyJwt } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const cookieHeader = req.headers.get("cookie") ?? undefined;
  const payload = cookieHeader ? verifyJwt(cookieHeader.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1] ?? "") : null;

  const body = (await req.json().catch(() => null)) as { threadId?: string; text?: string } | null;
  if (!body?.threadId || !body?.text) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  let senderRole: "guest" | "patient" | "moderator" | "admin" = "guest";
  let senderId: string | undefined;
  const role = String(((session?.user as any)?.role as string | undefined) || '').toLowerCase();
  if (role === "admin" || role === "moderator") {
    senderRole = role;
    senderId = (session?.user as any)?.id as string | undefined;
  } else if (payload?.sub) {
    senderRole = "patient";
    senderId = payload.sub;
  }

  if (senderRole === "guest") {
    return NextResponse.json({ error: "authentication required" }, { status: 401 });
  }

  const msg = chatStore.postMessage({ threadId: body.threadId, text: String(body.text).slice(0, 4000), senderRole, senderId });

  return NextResponse.json({ ok: true, message: msg });
}
