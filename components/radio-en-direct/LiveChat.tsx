"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types/radio";
import Avatar from "@/components/ui/Avatar";
// NOTE: LiveChatDesktop est re-exporté en bas de ce fichier (inchangé)

interface Props {
  messages: ChatMessage[];
}

export default function LiveChat({ messages }: Props) {
  const [message, setMessage] = useState("");

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
        <button
          className="text-xs font-bold px-3 py-1 rounded-xl transition-all"
          style={{
            background: "rgba(230,48,18,0.12)",
            border: "1px solid rgba(230,48,18,0.25)",
            color: "#E63012",
          }}
        >
          Rejoindre
        </button>
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
            placeholder="Join conversation..."
            className="flex-1 text-xs text-white placeholder:text-white/25 bg-transparent outline-none"
          />

          {/* Emoji */}
          <button className="text-white/25 hover:text-white/50 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              mood
            </span>
          </button>

          {/* Envoyer */}
          <button
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-all active:scale-90"
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


// ══════════════════════════════════════════════════════════════════════════════════════════════════
//  LiveChatDesktop — inchangé (export préservé pour LiveChatDesktop.tsx), version Destokp variantes
// ══════════════════════════════════════════════════════════════════════════════════════════════════

export function LiveChatDesktop({ messages }: { messages: ChatMessage[] }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "rgba(13, 35, 76, 0.6)", border: "1px solid rgba(230,48,18,0.12)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[#F0EDE8] text-base font-black tracking-tight uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-green-500 text-lg">forum</span>
          Chat en direct
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        </h3>
        <span className="text-[#8A8178] text-xs">245 actifs</span>
      </div>

      <div className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <Avatar
              src={msg.avatarUrl}
              alt={msg.username}
              size="sm"
              className="border border-white/10"
            />
            <div className="flex flex-col">
              <p className="text-[11px] font-bold text-[#00A896]">
                {msg.username}
                <span className="text-[#8A8178] font-normal ml-2">{msg.timeLabel}</span>
              </p>
              <p className="text-sm text-[#F0EDE8]/90 leading-snug">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <input
          className="w-full h-10 pl-4 pr-10 rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#E63012] transition-all"
          placeholder="Rejoindre la conversation..."
          type="text"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E63012] hover:text-[#F0EDE8] transition-colors">
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>
    </div>
  );
}
