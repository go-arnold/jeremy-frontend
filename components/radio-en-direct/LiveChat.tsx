"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/radio";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/providers/AuthProvider";
import { fetchRadioChat, postRadioChatMessage } from "@/lib/services/radio";

const POLL_INTERVAL_MS = 8000;

interface Props {
  messages: ChatMessage[];
}

export default function LiveChat({ messages: initialMessages }: Props) {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const knownIds = useRef(new Set(initialMessages.map((m) => m.id)));

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const latest = await fetchRadioChat();
        const fresh = latest.filter((m) => !knownIds.current.has(m.id));
        if (fresh.length > 0) {
          fresh.forEach((m) => knownIds.current.add(m.id));
          setMessages((prev) => [...prev, ...fresh]);
        }
      } catch {
        // ignore transient poll failures
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    const text = message.trim();
    if (!text || sending) return;
    setSending(true);
    setMessage("");
    try {
      const sent = await postRadioChatMessage(text);
      knownIds.current.add(sent.id);
      setMessages((prev) => [...prev, sent]);
    } catch {
      // message failed to send — silently drop, input already cleared
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-black text-sm uppercase tracking-wider">
            Chat en direct
          </h3>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
        </div>
      </div>

      {/* ── Bloc messages + input ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(13,23,47,0.65)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Zone messages scrollable */}
        <div className="relative">
          <div
            className="overflow-y-auto flex flex-col gap-2.5 px-3 pt-3 pb-1"
            style={{ maxHeight: "200px" }}
          >
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2.5">
                <Avatar
                  src={msg.avatarUrl}
                  alt={msg.username}
                  size="xs"
                  className="ring-1 ring-white/10"
                />
                {/* Bulle */}
                <div
                  className="flex-1 min-w-0 px-3 py-2 rounded-2xl rounded-tl-sm"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-baseline gap-1.5 mb-0.5 flex-wrap">
                    <span className="text-[11px] font-black text-[#00A896]">
                      {msg.username}
                    </span>
                    <span className="text-[10px] text-white/25">{msg.timeLabel}</span>
                  </div>
                  <p className="text-white/85 text-xs leading-snug">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fade bas */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(13,23,47,0.85), transparent)",
            }}
          />
        </div>

        {/* ── Input envoi ── */}
        <div
          className="flex items-center gap-2 px-3 py-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Avatar src="" alt="Votre avatar" size="custom" className="w-7 h-7" />

          {/* Input */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={isAuthenticated ? "Rejoindre la conversation..." : "Connectez-vous pour écrire..."}
            disabled={!isAuthenticated || sending}
            className="flex-1 text-xs text-white placeholder:text-white/25 bg-transparent outline-none disabled:opacity-50"
          />

          {/* Envoyer */}
          <button
            onClick={handleSend}
            disabled={!isAuthenticated || !message.trim() || sending}
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
            style={{
              background: message.trim() ? "#E63012" : "rgba(255,255,255,0.07)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "15px", fontVariationSettings: "'FILL' 1" }}
            >
              send
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
