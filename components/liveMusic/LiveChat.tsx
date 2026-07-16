import type { ChatMessage } from "@/types/liveMusic";

export default function LiveChat({
  messages,
  listenerCount,
}: {
  messages: ChatMessage[];
  listenerCount: number;
}) {
  return (
    <div className="px-6 py-6">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Chat en direct
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          </h3>
          <p className="text-text-secondary text-sm">{listenerCount} auditeurs écrivent...</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
          <span className="material-symbols-outlined text-[18px]">forum</span>
          <span>Rejoindre</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 relative">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-start gap-3 bg-[#19223ce6] p-3.5 rounded-2xl border border-white/5"
          >
            <div
              className="w-9 h-9 rounded-full bg-cover bg-center shrink-0 ring-2 ring-white/5"
              style={{ backgroundImage: `url('${msg.avatar}')` }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-text-secondary text-xs font-bold">{msg.username}</span>
                <span className="text-[10px] text-white/20">{msg.timeAgo}</span>
              </div>
              <p className="text-white text-sm leading-snug">
                {msg.message}{" "}
                {msg.tag && <span className="text-accent-blue">{msg.tag}</span>}
              </p>
            </div>
          </div>
        ))}
        {/* Fade out */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#1c1214] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
