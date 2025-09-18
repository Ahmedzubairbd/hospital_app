import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { chatStore } from "@/lib/chat/store";
import { rateLimitAsync } from "@/lib/rate-limit";

// Keep SSE stable in serverless
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

function sseHeaders() {
  return new Headers({
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream; charset=utf-8",
    "X-Accel-Buffering": "no",
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  if (!(await rateLimitAsync(req as unknown as Request, "chat:sse:thread"))) {
    return new Response("Too many requests", { status: 429 });
  }
  const { threadId } = await params;
  // AuthZ: admin/moderator via NextAuth OR patient token matching thread.userId
  const session = await getServerSession(authOptions).catch(() => null);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;
  const role = String(
    ((session?.user as any)?.role as string | undefined) || "",
  ).toLowerCase();

  const thread = chatStore.listThreads().find((t) => t.id === threadId);
  const isStaff = role === "admin" || role === "moderator";
  const isPatientOwner = !!(payload?.sub && thread?.userId === payload.sub);
  if (!isStaff && !isPatientOwner) {
    return new Response("Unauthorized", { status: 401 });
  }
  // eslint-disable-next-line no-console
  console.log("[chat] SSE connect", threadId);

  const te = new TextEncoder();
  let cleanup: (() => void) | undefined;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let active = true;
      let unsubscribe: (() => void) | undefined;
      let ping: NodeJS.Timeout | undefined;

      const cleanupResources = () => {
        if (!active) {
          return;
        }
        active = false;
        if (ping) {
          clearInterval(ping);
        }
        if (unsubscribe) {
          unsubscribe();
        }
        req.signal.removeEventListener("abort", cleanupResources);
      };

      const safeEnqueue = (chunk: Uint8Array) => {
        if (!active) {
          return;
        }
        try {
          controller.enqueue(chunk);
        } catch (err) {
          cleanupResources();
        }
      };

      const send = (event: string, data: unknown) => {
        safeEnqueue(te.encode(`event: ${event}\n`));
        safeEnqueue(te.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      cleanup = cleanupResources;
      if (req.signal.aborted) {
        cleanupResources();
        return;
      }
      req.signal.addEventListener("abort", cleanupResources);

      // initial hello
      send("hello", { threadId });
      // recent messages snapshot
      const recent = chatStore.listMessages(threadId, 50);
      recent.forEach((m) => send("message", m));

      unsubscribe = chatStore.subscribe(threadId, (ev) => {
        send(ev.type, ev.data);
      });

      ping = setInterval(() => {
        safeEnqueue(te.encode(": ping\n\n"));
      }, 20000);
    },
    cancel() {
      cleanup?.();
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}
