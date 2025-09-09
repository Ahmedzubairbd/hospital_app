export type ChatRole = "guest" | "patient" | "moderator" | "admin";

export type ChatMessage = {
  id: string;
  threadId: string;
  text: string;
  senderRole: ChatRole;
  senderId?: string;
  createdAt: number; // epoch ms
};

export type ChatThread = {
  id: string;
  createdAt: number;
  lastActivityAt: number;
  // Optional association to a logged in user
  userId?: string;
  userName?: string;
};

export type AdminEvent =
  | { type: "thread:new"; thread: ChatThread }
  | { type: "message:new"; message: ChatMessage; thread: ChatThread };

