import { ChatMessage, ChatThread, AdminEvent } from "./types";

type Subscriber = (ev: { type: "message"; data: ChatMessage }) => void;
type AdminSubscriber = (ev: AdminEvent) => void;

type ChatStore = {
  threads: Map<string, ChatThread>;
  messages: Map<string, ChatMessage[]>;
  subs: Map<string, Set<Subscriber>>; // per threadId
  adminSubs: Set<AdminSubscriber>;
  getOrCreateThread: (opts?: {
    userId?: string;
    userName?: string;
    preferredId?: string;
  }) => ChatThread;
  postMessage: (
    msg: Omit<ChatMessage, "id" | "createdAt"> & { id?: string },
  ) => ChatMessage;
  subscribe: (threadId: string, cb: Subscriber) => () => void;
  subscribeAdmin: (cb: AdminSubscriber) => () => void;
  listThreads: () => ChatThread[];
  listMessages: (threadId: string, limit?: number) => ChatMessage[];
};

declare global {
  // eslint-disable-next-line no-var
  var __chatStore: ChatStore | undefined;
}

function createStore(): ChatStore {
  const threads = new Map<string, ChatThread>();
  const messages = new Map<string, ChatMessage[]>();
  const subs = new Map<string, Set<Subscriber>>();
  const adminSubs = new Set<AdminSubscriber>();

  function ensureThread(id: string) {
    if (!threads.has(id)) {
      const now = Date.now();
      const th: ChatThread = { id, createdAt: now, lastActivityAt: now };
      threads.set(id, th);
      adminSubs.forEach((cb) => cb({ type: "thread:new", thread: th }));
    }
  }

  const store: ChatStore = {
    threads,
    messages,
    subs,
    adminSubs,
    getOrCreateThread(opts) {
      if (opts?.preferredId) {
        ensureThread(opts.preferredId);
        const t = threads.get(opts.preferredId)!;
        if (opts.userId) t.userId = opts.userId;
        if (opts.userName) t.userName = opts.userName;
        return t;
      }
      // Reuse by userId when present
      if (opts?.userId) {
        const existing = Array.from(threads.values()).find(
          (t) => t.userId === opts.userId,
        );
        if (existing) return existing;
      }
      const id =
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const now = Date.now();
      const thread: ChatThread = {
        id,
        createdAt: now,
        lastActivityAt: now,
        userId: opts?.userId,
        userName: opts?.userName,
      };
      threads.set(id, thread);
      adminSubs.forEach((cb) => cb({ type: "thread:new", thread }));
      return thread;
    },
    postMessage(msgIn) {
      const id =
        msgIn.id ??
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const createdAt = Date.now();
      ensureThread(msgIn.threadId);
      const t = threads.get(msgIn.threadId)!;
      t.lastActivityAt = createdAt;
      const msg: ChatMessage = { ...msgIn, id, createdAt };
      const arr = messages.get(msg.threadId) ?? [];
      arr.push(msg);
      messages.set(msg.threadId, arr);
      // Notify thread subscribers
      const s = subs.get(msg.threadId);
      if (s) s.forEach((cb) => cb({ type: "message", data: msg }));
      // Notify admins
      adminSubs.forEach((cb) =>
        cb({ type: "message:new", message: msg, thread: t }),
      );
      return msg;
    },
    subscribe(threadId, cb) {
      const set = subs.get(threadId) ?? new Set<Subscriber>();
      set.add(cb);
      subs.set(threadId, set);
      return () => {
        const s = subs.get(threadId);
        if (!s) return;
        s.delete(cb);
        if (s.size === 0) subs.delete(threadId);
      };
    },
    subscribeAdmin(cb) {
      adminSubs.add(cb);
      return () => adminSubs.delete(cb);
    },
    listThreads() {
      return Array.from(threads.values())
        .filter((t) => !t.archivedAt)
        .sort((a, b) => b.lastActivityAt - a.lastActivityAt);
    },
    listMessages(threadId, limit = 50) {
      const arr = messages.get(threadId) ?? [];
      return arr.slice(Math.max(0, arr.length - limit));
    },
  };

  return store;
}

export const chatStore: ChatStore =
  globalThis.__chatStore ?? (globalThis.__chatStore = createStore());

// Auto-archive inactive threads to keep memory small
if (!(globalThis as any).__chatArchiveTimer) {
  (globalThis as any).__chatArchiveTimer = setInterval(
    () => {
      try {
        const now = Date.now();
        const cutoff = now - 1000 * 60 * 60 * 24 * 7; // 7 days
        for (const t of chatStore.threads.values()) {
          if (!t.archivedAt && t.lastActivityAt < cutoff) t.archivedAt = now;
        }
      } catch {
        // ignore
      }
    },
    1000 * 60 * 10,
  ); // check every 10 minutes
}
