import type { Challenge } from "@/types/communaute";
import Avatar from "@/components/ui/Avatar";

export default function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <article className="relative overflow-hidden rounded-xl bg-[#2a2a1a] border border-accent-yellow/30 p-5">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, #E6E633 10px, #E6E633 20px)",
        }}
      />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            {challenge.isLive && (
              <span className="inline-block bg-accent-yellow text-black text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded mb-2">
                En direct
              </span>
            )}
            <h3 className="text-2xl font-black italic text-white leading-none uppercase tracking-wide font-display">
              Défis
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-white">
                Freestyle
              </span>
            </h3>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Se termine dans</div>
            <div className="text-xl font-mono text-white font-bold">{challenge.endsIn}</div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-3 border border-white/5">
          <p className="text-gray-300 text-sm mb-1">
            <span className="text-accent-yellow font-bold">Thème:</span> {challenge.theme}
          </p>
          <div className="flex -space-x-2 mt-2">
            {challenge.participants.avatars.map((src, i) => (
              <Avatar
                key={i}
                src={src}
                alt={`Participant ${i + 1}`}
                size="sm"
                className="border-2 border-[#2a2a1a]"
              />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#2a2a1a] bg-surface-dark flex items-center justify-center text-[10px] text-white font-bold">
              +{challenge.participants.extraCount}
            </div>
          </div>
        </div>

        <button className="w-full py-3 bg-accent-yellow text-black font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
          <span>Participer</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </article>
  );
}
