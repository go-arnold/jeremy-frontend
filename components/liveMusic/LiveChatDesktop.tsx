import type { ChatMessage } from "@/types/liveMusic";

export default function LiveChatDesktop({ messages, listenerCount }: { messages: ChatMessage[]; listenerCount: number }) {
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
          <span className="text-[#8A8178] text-xs font-medium">{listenerCount} actifs</span>
        </div>
      </div>

      {/* Messages — hauteur fixe scrollable */}
      <div className="flex flex-col gap-3 px-5 py-4 overflow-y-auto" style={{ maxHeight: "400px" }}>
        {messages.map((msg) => (
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
              {msg.tag && <span className="text-[#00A896] text-xs">{msg.tag}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-5 pb-5 pt-3 border-t border-white/5">
        <div className="relative">
          <input
            className="w-full h-11 pl-4 pr-12 rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="Écrire un message..."
            type="text"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </div>
        <button className="w-full mt-3 py-2.5 rounded-xl border border-primary/20 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">forum</span>
          Rejoindre la conversation
        </button>
      </div>
    </div>
  );
}