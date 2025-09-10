import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { verifyJwt } from "@/lib/auth";
import { chatStore } from "@/lib/chat/store";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getServerSession(authOptions).catch(() => null);

  // Check patient JWT cookie as fallback for portal
  const token = cookieStore.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;

  let userId: string | undefined;
  let userName: string | undefined;
  if (session?.user) {
    userId = session.user.id as string | undefined;
    userName = session.user.name ?? undefined;
  } else if (payload?.sub) {
    userId = payload.sub;
  }

  // Require auth to create or return a chat thread.
  if (!userId) {
    return NextResponse.json({ auth: false, threadId: null, userId: null }, { status: 200 });
  }

  // Reuse existing thread for this user, or create if missing
  const existingTid = cookieStore.get("chat_tid")?.value;
  const thread = chatStore.getOrCreateThread({ userId, userName, preferredId: existingTid });
  const res = NextResponse.json({ auth: true, threadId: thread.id, userId, userName });
  if (!existingTid) {
    res.cookies.set("chat_tid", thread.id, { path: "/", httpOnly: false, sameSite: "lax", maxAge: 60 * 60 * 24 * 30 });
  }
  return res;
}
