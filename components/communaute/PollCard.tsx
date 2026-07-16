import type { Poll } from "@/types/communaute";
import Avatar from "@/components/ui/Avatar";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function PollCard({ poll }: { poll: Poll }) {
  return (
    <article className="bg-surface-dark rounded-xl p-5 border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">bar_chart</span>
          <span className="text-xs font-bold uppercase tracking-wider">Sondage</span>
        </div>
        <span className="text-gray-500 text-xs">{formatCount(poll.totalVotes)} votes</span>
      </div>

      <h4 className="text-white font-bold text-lg mb-4">{poll.question}</h4>

      <div className="space-y-3">
        {poll.options.map((option) => (
          <div key={option.id} className="relative">
            <div className="flex items-center justify-between mb-1 text-sm z-10 relative px-1">
              <span className="text-white font-medium">{option.label}</span>
              <span className={`font-bold ${option.isLeading ? "text-primary" : "text-gray-400"}`}>
                {option.percentage}%
              </span>
            </div>
            <div className="h-10 w-full bg-black/50 rounded-lg overflow-hidden relative">
              <div
                className={`absolute top-0 left-0 h-full rounded-lg ${
                  option.isLeading ? "bg-primary/20 border-r-2 border-primary" : "bg-white/5"
                }`}
                style={{ width: `${option.percentage}%` }}
              />
              <button className="absolute inset-0 w-full h-full flex items-center px-4 text-left focus:outline-none" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-1">
          {poll.voterAvatars.map((src, i) => (
            <Avatar
              key={i}
              src={src}
              alt={`Votant ${i + 1}`}
              size="xs"
              className="border border-surface-dark"
            />
          ))}
        </div>
        <p className="text-xs text-gray-500">Votez pour voir les résultats</p>
      </div>
    </article>
  );
}
