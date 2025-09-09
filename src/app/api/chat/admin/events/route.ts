import { NextRequest } from "next/server";
// Keep SSE stable in serverless
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;
import { chatStore } from "@/lib/chat/store";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

function sseHeaders() {
  return new Headers({
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream; charset=utf-8",
    "X-Accel-Buffering": "no",
  });
}

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = (session?.user as any)?.role as string | undefined;
  if (!session?.user || (role !== "ADMIN" && role !== "MODERATOR")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const te = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(te.encode(`event: ${event}\n`));
        controller.enqueue(te.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      // snapshot of current threads
      const threads = chatStore.listThreads();
      threads.forEach((t) => send("thread", t));

      const unsubscribe = chatStore.subscribeAdmin((ev) => {
        if (ev.type === "thread:new") send("thread", ev.thread);
        if (ev.type === "message:new") send("message", ev.message);
      });

      const ping = setInterval(() => {
        controller.enqueue(te.encode(": ping\n\n"));
      }, 20000);

      return () => {
        clearInterval(ping);
        unsubscribe();
      };
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}
