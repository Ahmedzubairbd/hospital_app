"use client";

import * as React from "react";
import {
  Badge,
  Box,
  Paper,
  IconButton,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { ChatMessage } from "@/lib/chat/types";

type SessionInfo = { threadId: string; userId?: string; userName?: string };

export default function SupportChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [threadId, setThreadId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [text, setText] = React.useState("");
  const [unread, setUnread] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const openRef = React.useRef(open);
  React.useEffect(() => {
    openRef.current = open;
  }, [open]);

  React.useEffect(() => {
    let stopped = false;
    const init = async () => {
      try {
        const res = await fetch("/api/chat/session");
        const data = (await res.json()) as SessionInfo;
        if (stopped) return;
        setThreadId(data.threadId);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    init();
    return () => {
      stopped = true;
    };
  }, []);

  React.useEffect(() => {
    if (!threadId) return;
    const es = new EventSource(`/api/chat/events/${threadId}`);
    es.addEventListener("message", (ev) => {
      try {
        const m = JSON.parse((ev as MessageEvent).data) as ChatMessage;
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        if (!openRef.current) setUnread((u) => u + 1);
        queueMicrotask(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }));
      } catch {}
    });
    es.addEventListener("hello", () => {
      // no-op
    });
    es.onerror = () => {
      // auto-reconnect handled by browser
    };
    return () => es.close();
  }, [threadId]);

  const send = async () => {
    if (!text.trim() || !threadId) return;
    const t = text;
    setText("");
    await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, text: t }),
    });
  };

  const toggleOpen = () => {
    setOpen((o) => !o);
    setUnread(0);
    queueMicrotask(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }));
  };

  return (
    <Box sx={{ position: "fixed", right: 16, bottom: 16, zIndex: 1300 }}>
      <IconButton color="primary" onClick={toggleOpen} size="large">
        <Badge color="error" badgeContent={unread} invisible={unread === 0}>
          <ChatBubbleIcon />
        </Badge>
      </IconButton>
      {open ? (
        <Paper elevation={8} sx={{ width: 360, height: 440, p: 1.5, mt: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700}>Support</Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ flex: 1, minHeight: 240 }}>
              <CircularProgress size={24} />
            </Stack>
          ) : (
            <>
              <Box ref={listRef} sx={{ flex: 1, overflowY: "auto", height: 320, px: 0.5 }}>
                {messages.map((m) => {
                  const mine = m.senderRole === "guest" || m.senderRole === "patient";
                  return (
                    <Box key={m.id} sx={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", my: 0.5 }}>
                      <Box
                        sx={{
                          maxWidth: "80%",
                          px: 1.25,
                          py: 0.75,
                          borderRadius: 2,
                          bgcolor: mine ? "primary.main" : "action.hover",
                          color: mine ? "primary.contrastText" : "text.primary",
                        }}
                      >
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{m.text}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
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
                  placeholder="Type a message"
                />
                <Button variant="contained" endIcon={<SendIcon />} onClick={send} disabled={!threadId || !text.trim()}>
                  Send
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      ) : null}
    </Box>
  );
}
