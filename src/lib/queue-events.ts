type QueueListener = (data: any) => void;

class QueueEventManager {
  private listeners: Set<QueueListener> = new Set();

  subscribe(listener: QueueListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify(data: any) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error("Error in queue listener:", err);
      }
    });
  }
}

// Global singleton
const globalForQueue = globalThis as unknown as {
  queueEvents: QueueEventManager | undefined;
};

export const queueEvents = globalForQueue.queueEvents ?? new QueueEventManager();

if (process.env.NODE_ENV !== "production") {
  globalForQueue.queueEvents = queueEvents;
}
