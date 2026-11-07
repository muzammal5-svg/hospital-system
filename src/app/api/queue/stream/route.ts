import { NextRequest } from "next/server";
import { queueEvents } from "@/lib/queue-events";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection packet
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "CONNECTED", timestamp: Date.now() })}\n\n`)
      );

      // Subscribe to queue events
      const unsubscribe = queueEvents.subscribe((data) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch (err) {
          console.error("Failed to enqueue event:", err);
        }
      });

      // Heartbeat every 15s to prevent browser timeout
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch (err) {
          clearInterval(interval);
        }
      }, 15000);

      req.signal.addEventListener("abort", () => {
        unsubscribe();
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
