import { NextRequest } from "next/server";

// Keep SSE stable in serverless
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;
import { chatStore } from "@/lib/chat/store";

function sseHeaders() {
  return new Headers({
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream; charset=utf-8",
    "X-Accel-Buffering": "no",
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const { threadId } = await params;
  // eslint-disable-next-line no-console
  console.log("[chat] SSE connect", threadId);

  const te = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(te.encode(`event: ${event}\n`));
        controller.enqueue(te.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      // initial hello
      send("hello", { threadId });
      // recent messages snapshot
      const recent = chatStore.listMessages(threadId, 50);
      recent.forEach((m) => send("message", m));

      const unsubscribe = chatStore.subscribe(threadId, (ev) => {
        send(ev.type, ev.data);
      });

      const ping = setInterval(() => {
        controller.enqueue(te.encode(": ping\n\n"));
      }, 20000);

      return () => {
        clearInterval(ping);
        unsubscribe();
      };
    },
    cancel() {
      // noop
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}
