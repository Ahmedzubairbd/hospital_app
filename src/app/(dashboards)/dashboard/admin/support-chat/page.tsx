"use client";

import * as React from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import { ChatMessage, ChatThread } from "@/lib/chat/types";

export default function SupportChatAdminPage() {
  const [threads, setThreads] = React.useState<ChatThread[]>([]);
  const [selected, setSelected] = React.useState<ChatThread | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    const es = new EventSource("/api/chat/admin/events");
    es.addEventListener("thread", (ev) => {
      const t = JSON.parse((ev as MessageEvent).data) as ChatThread;
      setThreads((prev) => {
        const map = new Map(prev.map((i) => [i.id, i]));
        map.set(t.id, t);
        return Array.from(map.values()).sort(
          (a, b) => b.lastActivityAt - a.lastActivityAt,
        );
      });
    });
    es.addEventListener("message", (ev) => {
      const m = JSON.parse((ev as MessageEvent).data) as ChatMessage;
      // Update thread activity; do not push into messages here to avoid duplicates
      setThreads((prev) =>
        prev
          .map((t) =>
            t.id === m.threadId ? { ...t, lastActivityAt: m.createdAt } : t,
          )
          .sort((a, b) => b.lastActivityAt - a.lastActivityAt),
      );
    });
    es.onerror = () => {
      // errors handled by browser
    };
    return () => es.close();
  }, []);

  React.useEffect(() => {
    if (!selected) return;
    const es = new EventSource(`/api/chat/events/${selected.id}`);
    const ids = new Set<string>();
    const list: ChatMessage[] = [];
    es.addEventListener("message", (ev) => {
      const m = JSON.parse((ev as MessageEvent).data) as ChatMessage;
      if (ids.has(m.id)) return;
      ids.add(m.id);
      list.push(m);
      setMessages([...list]);
    });
    return () => es.close();
  }, [selected?.id]);

  const send = async () => {
    if (!text.trim() || !selected) return;
    const t = text;
    setText("");
    await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId: selected.id, text: t }),
    });
  };

  return (
    <Box sx={{ display: "flex", gap: 2, height: "calc(100dvh - 120px)" }}>
      <Paper
        sx={{
          width: 320,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ px: 2, py: 1.5, fontWeight: 700 }}
        >
          Conversations
        </Typography>
        <Divider />
        <List dense sx={{ overflowY: "auto" }}>
          {threads.map((t) => (
            <ListItemButton
              key={t.id}
              selected={t.id === selected?.id}
              onClick={() => setSelected(t)}
            >
              <ListItemText
                primary={
                  t.userName
                    ? t.userName
                    : t.userId
                      ? `User ${t.userId.slice(0, 6)}`
                      : `Guest ${t.id.slice(0, 6)}`
                }
                secondary={new Date(t.lastActivityAt).toLocaleString()}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>
      <Paper
        sx={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ px: 2, py: 1.5, fontWeight: 700 }}
        >
          {selected
            ? `Thread ${selected.id.slice(0, 8)}`
            : "Select a conversation"}
        </Typography>
        <Divider />
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {selected ? (
            messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    m.senderRole === "admin" || m.senderRole === "moderator"
                      ? "flex-end"
                      : "flex-start",
                  my: 0.5,
                }}
              >
                <Box
                  sx={{
                    maxWidth: 640,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor:
                      m.senderRole === "admin" || m.senderRole === "moderator"
                        ? "primary.main"
                        : "action.hover",
                    color:
                      m.senderRole === "admin" || m.senderRole === "moderator"
                        ? "primary.contrastText"
                        : "text.primary",
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {m.text}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No conversation selected.
            </Typography>
          )}
        </Box>
        <Divider />
        <Stack direction="row" spacing={1} sx={{ p: 1.5 }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            size="small"
            fullWidth
            placeholder={
              selected ? "Type a reply" : "Select a conversation to reply"
            }
            disabled={!selected}
          />
          <Button
            variant="contained"
            onClick={send}
            disabled={!selected || !text.trim()}
          >
            Send
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
