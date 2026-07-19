"use client";
import { useState } from "react";
import type { PodcastEpisode } from "@/types/podcasts";
import GuestFollowButton from "./GuestFollowButton";
import ContentImage from "@/components/ui/ContentImage";

type Tab = "Infos" | "Invité" | "Transcription";

export default function EpisodeTabs({ episode }: { episode: PodcastEpisode }) {
  const [active, setActive] = useState<Tab>("Infos");
  const guests = episode.guests && episode.guests.length > 0 ? episode.guests : (episode.guest ? [episode.guest] : []);

  return (
    <>
      {/* Onglets */}
      <div className="flex border-b border-white/10 mb-6">
        {(["Infos", "Invité", "Transcription"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3 px-1 mr-6 text-sm transition ${
              active === tab
                ? "font-bold text-primary border-b-2 border-primary"
                : "font-medium text-text-muted hover:text-white"
            }`}
          >
            {tab === "Invité" && guests.length > 1 ? "Invités" : tab}
          </button>
        ))}
      </div>

      {/* Contenu Infos */}
      {active === "Infos" && (
        <div className="mb-8">
          {episode.description.split("\n\n").map((para, i) => (
            <p
              key={i}
              className={`text-gray-300 text-[15px] leading-relaxed font-light ${
                i > 0 ? "italic text-gray-400 mt-4" : ""
              }`}
            >
              {para}
            </p>
          ))}
        </div>
      )}

      {/* Contenu Invité(s) */}
      {active === "Invité" && (
        <div className="flex flex-col gap-4 mb-8">
          {guests.map((guest, i) => (
            <div key={`${guest.name}-${i}`} className="bg-surface-dark rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-white/10 bg-gray-700">
                  <ContentImage src={guest.avatar} alt={guest.name} className="absolute inset-0" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold text-base">{guest.name}</h3>
                      <p className="text-accent-gold text-xs font-medium uppercase tracking-wider mt-0.5">
                        {guest.title}
                      </p>
                    </div>
                    <GuestFollowButton
                      guestName={guest.name}
                      className="text-primary text-xs font-bold border border-primary/30 px-3 py-1 rounded-full hover:bg-primary/10 transition disabled:opacity-50"
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed line-clamp-2">
                    {guest.bio}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
                {guest.website && (
                  <a className="flex items-center gap-2 text-gray-400 hover:text-white text-xs transition" href={guest.website}>
                    <span className="material-symbols-outlined text-base">language</span>
                    Site Web
                  </a>
                )}
                {guest.twitter && (
                  <a className="flex items-center gap-2 text-gray-400 hover:text-white text-xs transition" href="#">
                    <span className="material-symbols-outlined text-base">alternate_email</span>
                    {guest.twitter}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transcription */}
      {active === "Transcription" && (
        <div className="mb-8">
          {episode.transcript ? (
            episode.transcript.split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-300 text-[15px] leading-relaxed font-light mt-3 first:mt-0">
                {para}
              </p>
            ))
          ) : (
            <div className="text-gray-500 text-sm italic text-center py-8">
              Transcription non disponible pour cet épisode.
            </div>
          )}
        </div>
      )}
    </>
  );
}
