"use client";
import React, { useRef, useState } from "react";

// Limits
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 100;
const MAX_AUDIO_MB = 50;

type FileCategory = "image" | "video" | "audio" | null;

interface SelectedFile {
  file: File;
  category: FileCategory;
  preview?: string;
}

function humanSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function validateFile(file: File, category: FileCategory): string | null {
  const mb = file.size / (1024 * 1024);
  if (category === "image" && mb > MAX_IMAGE_MB) return `Image trop lourde (max ${MAX_IMAGE_MB} Mo)`;
  if (category === "video" && mb > MAX_VIDEO_MB) return `Vidéo trop lourde (max ${MAX_VIDEO_MB} Mo)`;
  if (category === "audio" && mb > MAX_AUDIO_MB) return `Audio trop lourd (max ${MAX_AUDIO_MB} Mo)`;
  return null;
}

function getContextForCategory(category: FileCategory): string {
  if (category === "image") return "community_image";
  if (category === "video") return "community_video";
  if (category === "audio") return "community_song";
  return "community_image";
}

function getMediaTypeForCategory(category: FileCategory): string {
  if (category === "image") return "image";
  if (category === "video") return "video";
  if (category === "audio") return "song";
  return "image";
}

/**
 * Upload a file to Cloudinary via the signed upload flow.
 */
async function uploadToCloudinary(file: File, context: string): Promise<string> {
  const sigRes = await fetch('/api/media/upload-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context }),
  });

  if (!sigRes.ok) {
    const err = await sigRes.json().catch(() => ({}));
    throw new Error(err.detail || 'Impossible d\'obtenir la signature d\'upload');
  }

  const sig = await sigRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.api_key);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const uploadRes = await fetch(sig.upload_url, { method: "POST", body: form });
  const uploaded = await uploadRes.json();

  if (!uploadRes.ok) {
    throw new Error(uploaded.error?.message || 'Échec de l\'upload vers Cloudinary');
  }

  return uploaded.secure_url;
}

export default function SubmitTalentCard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "info">("info");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, category: FileCategory) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file, category);
    if (err) {
      setStatusMsg(err);
      setStatusType("error");
      return;
    }
    let preview: string | undefined;
    if (category === "image") preview = URL.createObjectURL(file);
    setSelected({ file, category, preview });
    setStatusMsg(`✓ ${file.name} (${humanSize(file.size)})`);
    setStatusType("info");
    e.target.value = "";
  };

  const removeFile = () => {
    if (selected?.preview) URL.revokeObjectURL(selected.preview);
    setSelected(null);
    setStatusMsg("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setStatusMsg("Veuillez entrer un titre.");
      setStatusType("error");
      return;
    }
    setUploading(true);
    setStatusMsg("Envoi en cours...");
    setStatusType("info");

    try {
      let mediaUrl = "";
      let mediaType = "";

      if (selected) {
        const context = getContextForCategory(selected.category);
        mediaType = getMediaTypeForCategory(selected.category);
        mediaUrl = await uploadToCloudinary(selected.file, context);
      }

      // Create the post with the Cloudinary URL as per FRONTEND_INTEGRATION.md
      const payload: any = {
        title: title.trim(),
      };
      if (description.trim()) payload.content = description.trim();
      if (mediaUrl && mediaType) {
        payload.media = [{ type: mediaType, url: mediaUrl }];
      }

      const response = await fetch(
        `/api/proxy?endpoint=${encodeURIComponent("/api/v1/community/posts/submit_talent/")}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || err.detail || `Erreur ${response.status}`);
      }

      setStatusMsg("🎉 Talent soumis avec succès !");
      setStatusType("success");
      setTitle("");
      setDescription("");
      removeFile();
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "Erreur lors de la soumission. Assurez-vous d'être connecté.");
      setStatusType("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="p-4 pt-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-dark to-black border border-white/10 p-5 shadow-lg">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Soumettre un Talent</h2>
              <p className="text-gray-400 text-sm mt-1">Montre ton talent au Kivu</p>
            </div>
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "32px" }}>
              graphic_eq
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <input
              className="w-full bg-black/40 border border-white/10 rounded-lg h-12 px-4 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              placeholder="Titre du morceau / de la création"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-lg h-20 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none"
              placeholder="Décris ton talent (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input ref={imageInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "image")} />
            <input ref={videoInputRef} type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, "video")} />
            <input ref={audioInputRef} type="file" className="hidden" accept="audio/*" onChange={(e) => handleFileChange(e, "audio")} />

            {selected && (
              <div className="rounded-lg overflow-hidden border border-white/10 relative">
                {selected.category === "image" && selected.preview && (
                  <img src={selected.preview} alt="preview" className="w-full max-h-40 object-cover" />
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
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-white text-sm">close</span>
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                title={`Photo/Image (max ${MAX_IMAGE_MB} Mo)`}
                className={`flex items-center justify-center h-12 w-14 rounded-lg bg-surface-dark border transition-colors ${selected?.category === "image" ? "border-primary text-primary" : "border-white/10 text-gray-300 hover:bg-white/5"}`}
              >
                <span className="material-symbols-outlined">add_a_photo</span>
              </button>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                title={`Vidéo (max ${MAX_VIDEO_MB} Mo)`}
                className={`flex items-center justify-center h-12 w-14 rounded-lg bg-surface-dark border transition-colors ${selected?.category === "video" ? "border-primary text-primary" : "border-white/10 text-gray-300 hover:bg-white/5"}`}
              >
                <span className="material-symbols-outlined">videocam</span>
              </button>
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                title={`Audio (max ${MAX_AUDIO_MB} Mo)`}
                className={`flex items-center justify-center h-12 w-14 rounded-lg bg-surface-dark border transition-colors ${selected?.category === "audio" ? "border-primary text-primary" : "border-white/10 text-gray-300 hover:bg-white/5"}`}
              >
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 h-12 rounded-lg bg-primary hover:bg-primary/90 text-background-dark font-bold text-base tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-55"
              >
                <span>{uploading ? "Envoi..." : "Envoyer"}</span>
                <span className="material-symbols-outlined text-[20px]">{uploading ? "hourglass_empty" : "send"}</span>
              </button>
            </div>

            <p className="text-[10px] text-gray-600">
              Image max {MAX_IMAGE_MB} Mo · Vidéo max {MAX_VIDEO_MB} Mo · Audio max {MAX_AUDIO_MB} Mo
            </p>

            {statusMsg && (
              <p className={`text-xs mt-1 font-medium ${statusType === "success" ? "text-green-400" : statusType === "error" ? "text-red-400" : "text-primary"}`}>
                {statusMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}