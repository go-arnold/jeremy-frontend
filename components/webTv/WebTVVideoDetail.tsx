"use client";

import { useState } from "react";
import Link from "next/link";
import VideoPlayer from "@/components/media/VideoPlayer";
import LiveStreamPlayer from "@/components/media/LiveStreamPlayer";
import EngagementBar from "@/components/ui/EngagementBar";
import { useAuth } from "@/providers/AuthProvider";
import { useLiveRoom } from "@/hooks/useLiveRoom";
import { useConsumptionHeartbeat } from "@/hooks/useConsumptionHeartbeat";

// Past this length, the description gets truncated on mobile with a "Voir plus" toggle instead
// of pushing the player/engagement bar far below the fold.
const DESCRIPTION_TRUNCATE_LENGTH = 160;

interface WebTVVideo {
  id: string;
  numericId?: number | null;
  slug: string;
  title: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  playbackHlsUrl?: string;
  isLive?: boolean;
  likeCount?: number;
  commentCount?: number;
  publishedAt?: string;
}

async function sendChatMessage(slug: string, message: string) {
  const response = await fetch(
    `/api/proxy?endpoint=${encodeURIComponent(`/api/v1/webtv/videos/${slug}/chat/`)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.detail || "Envoi impossible");
  return data;
}

export default function WebTVVideoDetail({ video }: { video: WebTVVideo }) {
  const [playing, setPlaying] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  useConsumptionHeartbeat(playing, "webtv", video.numericId, video.title, video.thumbnail);

  const isLongDescription = (video.description?.length || 0) > DESCRIPTION_TRUNCATE_LENGTH;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 lg:px-8 max-w-5xl mx-auto flex flex-col gap-6">
      <Link
        href="/web-tv"
        className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-bold text-sm"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Web TV
      </Link>

      {video.isLive ? (
        <LiveStreamPlayer
          hlsUrl={video.playbackHlsUrl || ""}
          title={video.title}
          status="live"
          thumbnail={video.thumbnail}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          hideTitleBar
        />
      ) : (
        <VideoPlayer
          src={video.videoUrl || ""}
          title={video.title}
          thumbnail={video.thumbnail}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          hideTitleBar
        />
      )}

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-[#F0EDE8]">{video.title}</h1>
        {video.description && (
          <>
            <p
              className={`text-[#8A8178] text-sm leading-relaxed ${
                !descExpanded && isLongDescription ? "line-clamp-3 lg:line-clamp-none" : ""
              }`}
            >
              {video.description}
            </p>
            {isLongDescription && (
              <button
                onClick={() => setDescExpanded((v) => !v)}
                className="lg:hidden text-primary text-xs font-bold self-start"
              >
                {descExpanded ? "Voir moins" : "Voir plus"}
              </button>
            )}
          </>
        )}
        {video.publishedAt && <p className="text-[#4A443E] text-xs">{video.publishedAt}</p>}
      </div>

      <EngagementBar
        resourceType="webtv/videos"
        id={video.slug}
        initialLikeCount={video.likeCount}
        initialCommentCount={video.commentCount}
      />

      {video.isLive && <LiveChatPanel slug={video.slug} />}
    </div>
  );
}

function LiveChatPanel({ slug }: { slug: string }) {
  const { isAuthenticated } = useAuth();
  const { onlineCount, messages, setMessages } = useLiveRoom("webtv", slug);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!draft.trim() || !isAuthenticated) return;
    setSending(true);
    try {
      const created = await sendChatMessage(slug, draft.trim());
      setMessages((prev) => [...prev, created]);
      setDraft("");
    } catch {
      // best-effort — the WS broadcast (if it arrives) is the source of truth for other viewers
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl p-4 border border-white/5" style={{ background: "rgba(18,34,60,0.5)" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-wider text-[#F0EDE8]">Chat en direct</h2>
        <span className="text-xs text-[#8A8178]">{onlineCount} en ligne</span>
      </div>

      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto no-scrollbar">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4">Aucun message pour l&apos;instant.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex gap-2">
              <span className="text-white text-xs font-bold">{m.username}</span>
              <span className="text-gray-300 text-xs">{m.message}</span>
            </div>
          ))
        )}
      </div>

      {isAuthenticated ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Votre message..."
            className="flex-1 bg-black/40 border border-white/10 rounded-lg h-9 px-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            className="h-9 px-3 rounded-lg bg-primary/80 hover:bg-primary text-white transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      ) : (
        <p className="text-xs text-[#8A8178] text-center">Connectez-vous pour participer au chat.</p>
      )}
    </div>
  );
}
