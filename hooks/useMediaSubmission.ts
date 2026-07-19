"use client";
import { useState } from "react";
import { uploadToCloudinaryWithProgress } from "@/lib/cloudinaryUpload";

const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 100;
const MAX_AUDIO_MB = 50;

export type MediaCategory = "image" | "video" | "audio";

interface SelectedFile {
  file: File;
  category: MediaCategory;
  preview?: string;
}

export function humanSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function validateFile(file: File, category: MediaCategory): string | null {
  const mb = file.size / (1024 * 1024);
  if (category === "image" && mb > MAX_IMAGE_MB) return `Image trop lourde (max ${MAX_IMAGE_MB} Mo)`;
  if (category === "video" && mb > MAX_VIDEO_MB) return `Vidéo trop lourde (max ${MAX_VIDEO_MB} Mo)`;
  if (category === "audio" && mb > MAX_AUDIO_MB) return `Audio trop lourd (max ${MAX_AUDIO_MB} Mo)`;
  return null;
}

function getContextForCategory(category: MediaCategory): string {
  if (category === "video") return "community_video";
  if (category === "audio") return "community_song";
  return "community_image";
}

function getMediaTypeForCategory(category: MediaCategory): string {
  if (category === "video") return "video";
  if (category === "audio") return "song";
  return "image";
}

export const MEDIA_LIMITS = { MAX_IMAGE_MB, MAX_VIDEO_MB, MAX_AUDIO_MB };

interface UseMediaSubmissionOptions {
  /** Backend path (not the proxy wrapper), e.g. "/api/v1/community/posts/submit_talent/". */
  endpoint: string;
  onSubmitted?: () => void;
  /** Shown instead of the raw HTTP error when the backend returns 404 — used for endpoints
   * proposed in docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md that don't exist yet. */
  notAvailableMessage?: string;
}

/** Shared upload+submit logic behind "Soumettre un talent" (mobile/desktop) and "Je réponds au
 * défi" — same fields (titre, description, un média image/vidéo/audio), same Cloudinary upload
 * flow, same `{title, content, media}` POST shape, only the target endpoint differs. */
export function useMediaSubmission({ endpoint, onSubmitted, notAvailableMessage }: UseMediaSubmissionOptions) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "info">("info");

  const selectFile = (file: File, category: MediaCategory) => {
    const err = validateFile(file, category);
    if (err) {
      setStatusMsg(err);
      setStatusType("error");
      return;
    }
    if (selected?.preview) URL.revokeObjectURL(selected.preview);
    const preview = category === "image" ? URL.createObjectURL(file) : undefined;
    setSelected({ file, category, preview });
    setStatusMsg(`✓ ${file.name} (${humanSize(file.size)})`);
    setStatusType("info");
  };

  const removeFile = () => {
    if (selected?.preview) URL.revokeObjectURL(selected.preview);
    setSelected(null);
    setStatusMsg("");
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    removeFile();
  };

  const submit = async (): Promise<boolean> => {
    if (!title.trim() || !description.trim() || !selected) {
      setStatusMsg("Titre, description et média (photo, audio ou vidéo) sont tous obligatoires.");
      setStatusType("error");
      return false;
    }
    setUploading(true);
    setUploadProgress(0);
    setStatusMsg("");
    try {
      const context = getContextForCategory(selected.category);
      const mediaType = getMediaTypeForCategory(selected.category);
      const mediaUrl = await uploadToCloudinaryWithProgress(selected.file, context, setUploadProgress);

      const response = await fetch(`/api/proxy?endpoint=${encodeURIComponent(endpoint)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: description.trim(),
          media: [{ type: mediaType, url: mediaUrl }],
        }),
      });

      if (!response.ok) {
        if (response.status === 404 && notAvailableMessage) {
          throw new Error(notAvailableMessage);
        }
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || err.detail || `Erreur ${response.status}`);
      }

      setStatusMsg("🎉 Envoyé avec succès !");
      setStatusType("success");
      reset();
      onSubmitted?.();
      return true;
    } catch (err) {
      console.error(err);
      setStatusMsg((err instanceof Error ? err.message : null) || "Erreur lors de l'envoi. Assurez-vous d'être connecté.");
      setStatusType("error");
      return false;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    selected,
    selectFile,
    removeFile,
    uploading,
    uploadProgress,
    statusMsg,
    statusType,
    submit,
  };
}
