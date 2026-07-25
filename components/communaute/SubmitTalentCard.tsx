"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import CircularProgress from "@/components/ui/CircularProgress";
import AuthPromptModal from "@/components/ui/AuthPromptModal";
import { useAuth } from "@/providers/AuthProvider";
import { useMediaSubmission, humanSize, MEDIA_LIMITS, type MediaCategory } from "@/hooks/useMediaSubmission";

export default function SubmitTalentCard({ onSubmitted }: { onSubmitted?: () => void }) {
  const { isAuthenticated } = useAuth();
  const [authPrompt, setAuthPrompt] = useState(false);
  const {
    title, setTitle,
    description, setDescription,
    selected, selectFile, removeFile,
    uploading, uploadProgress,
    statusMsg, statusType,
    submit,
  } = useMediaSubmission({ endpoint: "/api/v1/community/posts/submit_talent/", onSubmitted });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, category: MediaCategory) => {
    const file = e.target.files?.[0];
    if (!file) return;
    selectFile(file, category);
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      setAuthPrompt(true);
      return;
    }
    submit();
  };

  return (
    <section className="p-4 pt-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-dark to-black border border-white/10 p-4 sm:p-5 shadow-lg card-glow">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-2xl font-bold text-white tracking-tight">Soumettre un Talent</h2>
              <p className="text-gray-400 text-[11px] sm:text-sm mt-1">Montre ton talent au Kivu</p>
            </div>
            <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
              graphic_eq
            </span>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            <input
              className="w-full bg-black/40 border border-white/10 rounded-lg h-10 sm:h-12 px-4 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs sm:text-sm"
              placeholder="Titre du morceau / de la création"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-lg h-16 sm:h-20 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs sm:text-sm resize-none"
              placeholder="Décris ton talent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input ref={imageInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "image")} />
            <input ref={videoInputRef} type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, "video")} />
            <input ref={audioInputRef} type="file" className="hidden" accept="audio/*" onChange={(e) => handleFileChange(e, "audio")} />

            {selected && (
              <div className="rounded-lg overflow-hidden border border-white/10 relative">
                {selected.category === "image" && selected.preview && (
                  // blob: object URL from the local file picker — can't go through the Next.js
                  // image optimizer, which needs a fetchable http(s) URL.
                  <div className="relative w-full aspect-[4/3] max-h-40">
                    <Image src={selected.preview} alt="Aperçu de l'image sélectionnée" fill unoptimized className="object-cover" />
                  </div>
                )}
                {selected.category === "video" && (
                  <div className="flex items-center gap-2 bg-black/40 p-3">
                    <span className="material-symbols-outlined text-primary text-2xl">videocam</span>
                    <span className="text-white text-sm truncate">{selected.file.name}</span>
                    <span className="text-gray-400 text-xs ml-auto">{humanSize(selected.file.size)}</span>
                  </div>
                )}
                {selected.category === "audio" && (
                  <div className="flex items-center gap-2 bg-black/40 p-3">
                    <span className="material-symbols-outlined text-primary text-2xl">music_note</span>
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
                className={`flex items-center justify-center h-9 w-9 sm:h-12 sm:w-14 rounded-lg bg-surface-dark border transition-colors disabled:opacity-50 ${selected?.category === "image" ? "border-primary text-primary" : "border-white/10 text-gray-300 hover:bg-white/5"}`}
              >
                <span className="material-symbols-outlined text-base sm:text-xl">add_a_photo</span>
              </button>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading}
                title={`Vidéo (max ${MEDIA_LIMITS.MAX_VIDEO_MB} Mo)`}
                className={`flex items-center justify-center h-9 w-9 sm:h-12 sm:w-14 rounded-lg bg-surface-dark border transition-colors disabled:opacity-50 ${selected?.category === "video" ? "border-primary text-primary" : "border-white/10 text-gray-300 hover:bg-white/5"}`}
              >
                <span className="material-symbols-outlined text-base sm:text-xl">videocam</span>
              </button>
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                disabled={uploading}
                title={`Audio (max ${MEDIA_LIMITS.MAX_AUDIO_MB} Mo)`}
                className={`flex items-center justify-center h-9 w-9 sm:h-12 sm:w-14 rounded-lg bg-surface-dark border transition-colors disabled:opacity-50 ${selected?.category === "audio" ? "border-primary text-primary" : "border-white/10 text-gray-300 hover:bg-white/5"}`}
              >
                <span className="material-symbols-outlined text-base sm:text-xl">mic</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 h-9 sm:h-12 px-4 rounded-lg bg-primary hover:bg-primary/90 text-background-dark font-bold text-xs sm:text-base tracking-wide transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-90"
              >
                {uploading ? (
                  <CircularProgress percent={uploadProgress} size={22} strokeWidth={3} className="text-background-dark" />
                ) : (
                  <>
                    <span>Envoyer</span>
                    <span className="material-symbols-outlined text-base sm:text-[20px]">send</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-gray-600">
              Image max {MEDIA_LIMITS.MAX_IMAGE_MB} Mo · Vidéo max {MEDIA_LIMITS.MAX_VIDEO_MB} Mo · Audio max {MEDIA_LIMITS.MAX_AUDIO_MB} Mo
            </p>

            {statusMsg && (
              <p className={`text-xs mt-1 font-medium ${statusType === "success" ? "text-green-400" : statusType === "error" ? "text-red-400" : "text-primary"}`}>
                {statusMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      <AuthPromptModal
        open={authPrompt}
        onClose={() => setAuthPrompt(false)}
        redirectTo="/communaute"
        message="Connectez-vous ou créez un compte pour soumettre votre talent : ça ne prend que 2 secondes !"
      />
    </section>
  );
}
