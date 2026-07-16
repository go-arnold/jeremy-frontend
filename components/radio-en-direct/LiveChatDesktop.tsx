import type { ChatMessage } from "@/types/radio";

export default function LiveChatDesktop({ messages }: { messages: ChatMessage[] }) {
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

      {/* Messages */}
      <div className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div
              className="w-8 h-8 shrink-0 rounded-full bg-cover border border-white/10"
              style={{ backgroundImage: `url('${msg.avatarUrl}')` }}
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

      {/* Input */}
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
