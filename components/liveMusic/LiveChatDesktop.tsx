"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types/liveMusic";
import { useAuth } from "@/providers/AuthProvider";
import { useLiveRoom } from "@/hooks/useLiveRoom";
import { postLiveMusicChatMessage, mapChatMessage } from "@/lib/services/liveMusic";

interface Props {
  slug: string;
  messages: ChatMessage[];
  listenerCount: number;
}

export default function LiveChatDesktop({ slug, messages: initialMessages, listenerCount }: Props) {
  const { isAuthenticated } = useAuth();
  const { onlineCount, messages: liveMessages } = useLiveRoom("live_music", slug);
  const [sentMessages, setSentMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const messages: ChatMessage[] = [
    ...initialMessages,
    ...sentMessages,
    ...liveMessages.map(mapChatMessage),
  ];

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft("");
    try {
      const sent = await postLiveMusicChatMessage(slug, text);
      setSentMessages((prev) => [...prev, sent]);
    } catch {
      // best-effort — the WS broadcast (if it arrives) is the source of truth for other viewers
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="rounded-2xl flex flex-col gap-0 overflow-hidden"
      style={{ background: "rgba(18,34,60,0.6)", border: "1px solid rgba(230,48,18,0.1)" }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wide">
            <span className="material-symbols-outlined text-green-500 text-lg">forum</span>
            Chat en direct
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          </h3>
          <span className="text-[#8A8178] text-xs font-medium">{onlineCount || listenerCount} actifs</span>
        </div>
      </div>

      {/* Messages — hauteur fixe scrollable */}
      <div className="flex flex-col gap-3 px-5 py-4 overflow-y-auto" style={{ maxHeight: "400px" }}>
        {messages.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4">Aucun message pour l&apos;instant.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-full bg-cover bg-center shrink-0 ring-2 ring-white/5"
                style={{ backgroundImage: `url('${msg.avatar}')` }}
              />
              <div
                className="flex-1 min-w-0 p-3 rounded-2xl rounded-tl-sm"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[#00A896] text-xs font-bold">{msg.username}</span>
                  <span className="text-[10px] text-white/20">{msg.timeAgo}</span>
                </div>
                <p className="text-white text-sm leading-snug">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="px-5 pb-5 pt-3 border-t border-white/5">
        {isAuthenticated ? (
          <div className="relative">
            <input
              className="w-full h-11 pl-4 pr-12 rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
              placeholder="Écrire un message..."
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={sending}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <button
              onClick={handleSend}
              disabled={sending || !draft.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-[#8A8178] text-center">Connectez-vous pour participer au chat.</p>
        )}
      </div>
    </div>
  );
}
