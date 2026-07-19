"use client";
import { useRef } from "react";
import Image from "next/image";
import CircularProgress from "@/components/ui/CircularProgress";
import { useMediaSubmission, humanSize, MEDIA_LIMITS, type MediaCategory } from "@/hooks/useMediaSubmission";

interface Props {
  challengeSlug: string;
  challengeTitle: string;
  onCancel: () => void;
  onSubmitted?: () => void;
}

/** "Je réponds au défi" — renders inline, taking over the ChallengeCard's own slot (not a modal)
 * once an authenticated user clicks "Participer", until the form is submitted. Same fields/upload
 * flow as SubmitTalentCard (titre + description + un média image/vidéo/audio), targeting the
 * challenge-participation endpoint proposed in docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md §3.1 (not
 * live yet — shows a clear message on 404 instead of a raw error). */
export default function ChallengeResponseForm({ challengeSlug, challengeTitle, onCancel, onSubmitted }: Props) {
  const {
    title, setTitle,
    description, setDescription,
    selected, selectFile, removeFile,
    uploading, uploadProgress,
    statusMsg, statusType,
    submit,
  } = useMediaSubmission({
    endpoint: `/api/v1/community/challenges/${challengeSlug}/participate/`,
    onSubmitted,
    notAvailableMessage:
      "La soumission des réponses aux défis arrive très bientôt — cette fonctionnalité est en cours d'intégration côté serveur.",
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, category: MediaCategory) => {
    const file = e.target.files?.[0];
    if (!file) return;
    selectFile(file, category);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) onSubmitted?.();
  };

  return (
    <article className="relative overflow-hidden rounded-xl bg-[#2a2a1a] border border-accent-yellow/30 p-4 sm:p-5">
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-accent-yellow text-[10px] font-black uppercase tracking-[0.2em]">
              {challengeTitle}
            </p>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">Je réponds au défi</h3>
          </div>
          <button onClick={onCancel} disabled={uploading} className="text-gray-400 hover:text-white shrink-0 disabled:opacity-40">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            className="w-full bg-black/40 border border-white/10 rounded-lg h-11 px-4 text-white placeholder:text-gray-500 focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow outline-none transition-all text-sm"
            placeholder="Titre de ta participation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full bg-black/40 border border-white/10 rounded-lg h-20 px-4 py-3 text-white placeholder:text-gray-500 focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow outline-none transition-all text-sm resize-none"
            placeholder="Décris ta participation au défi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input ref={imageInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "image")} />
          <input ref={videoInputRef} type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, "video")} />
          <input ref={audioInputRef} type="file" className="hidden" accept="audio/*" onChange={(e) => handleFileChange(e, "audio")} />

          {selected && (
            <div className="rounded-lg overflow-hidden border border-white/10 relative">
              {selected.category === "image" && selected.preview && (
                <div className="relative w-full aspect-[4/3] max-h-40">
                  <Image src={selected.preview} alt="Aperçu de l'image sélectionnée" fill unoptimized className="object-cover" />
                </div>
              )}
              {selected.category === "video" && (
                <div className="flex items-center gap-2 bg-black/40 p-3">
                  <span className="material-symbols-outlined text-accent-yellow text-2xl">videocam</span>
                  <span className="text-white text-sm truncate">{selected.file.name}</span>
                  <span className="text-gray-400 text-xs ml-auto">{humanSize(selected.file.size)}</span>
                </div>
              )}
              {selected.category === "audio" && (
                <div className="flex items-center gap-2 bg-black/40 p-3">
                  <span className="material-symbols-outlined text-accent-yellow text-2xl">music_note</span>
                  <span className="text-white text-sm truncate">{selected.file.name}</span>
                  <span className="text-gray-400 text-xs ml-auto">{humanSize(selected.file.size)}</span>
                </div>
              )}
              {!uploading && (
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-white text-sm">close</span>
                </button>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              title={`Photo/Image (max ${MEDIA_LIMITS.MAX_IMAGE_MB} Mo)`}
              className={`flex items-center justify-center h-11 w-12 rounded-lg bg-black/30 border transition-colors disabled:opacity-50 ${selected?.category === "image" ? "border-accent-yellow text-accent-yellow" : "border-white/10 text-gray-300 hover:bg-white/5"}`}
            >
              <span className="material-symbols-outlined text-lg">add_a_photo</span>
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploading}
              title={`Vidéo (max ${MEDIA_LIMITS.MAX_VIDEO_MB} Mo)`}
              className={`flex items-center justify-center h-11 w-12 rounded-lg bg-black/30 border transition-colors disabled:opacity-50 ${selected?.category === "video" ? "border-accent-yellow text-accent-yellow" : "border-white/10 text-gray-300 hover:bg-white/5"}`}
            >
              <span className="material-symbols-outlined text-lg">videocam</span>
            </button>
            <button
              type="button"
              onClick={() => audioInputRef.current?.click()}
              disabled={uploading}
              title={`Audio (max ${MEDIA_LIMITS.MAX_AUDIO_MB} Mo)`}
              className={`flex items-center justify-center h-11 w-12 rounded-lg bg-black/30 border transition-colors disabled:opacity-50 ${selected?.category === "audio" ? "border-accent-yellow text-accent-yellow" : "border-white/10 text-gray-300 hover:bg-white/5"}`}
            >
              <span className="material-symbols-outlined text-lg">mic</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 h-11 rounded-lg bg-accent-yellow hover:bg-yellow-400 text-black font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-90"
            >
              {uploading ? (
                <CircularProgress percent={uploadProgress} size={26} strokeWidth={3} className="text-black" />
              ) : (
                <span>Envoyer</span>
              )}
            </button>
          </div>

          {statusMsg && (
            <p className={`text-xs font-medium ${statusType === "success" ? "text-green-400" : statusType === "error" ? "text-red-400" : "text-accent-yellow"}`}>
              {statusMsg}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
