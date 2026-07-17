"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { updateProfile } from "@/lib/services/profile";

interface Props {
  open: boolean;
  onClose: () => void;
  currentUsername: string;
  currentBio: string;
  currentAvatar: string;
  currentCover: string;
}

async function uploadToCloudinary(file: File, context: string): Promise<string> {
  const sigRes = await fetch("/api/media/upload-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context }),
  });
  if (!sigRes.ok) {
    const err = await sigRes.json().catch(() => ({}));
    throw new Error(err.detail || "Impossible d'obtenir la signature d'envoi.");
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
  if (!uploadRes.ok) throw new Error(uploaded.error?.message || "Échec de l'envoi de l'image.");
  return uploaded.secure_url;
}

export default function EditProfileModal({
  open,
  onClose,
  currentUsername,
  currentBio,
  currentAvatar,
  currentCover,
}: Props) {
  const { refreshUser } = useAuth();
  const [username, setUsername] = useState(currentUsername);
  const [bio, setBio] = useState(currentBio);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(currentAvatar);
  const [coverPreview, setCoverPreview] = useState(currentCover);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload: { username?: string; bio?: string; avatar?: string; cover_image?: string } = {
        username: username.trim(),
        bio: bio.trim(),
      };
      if (avatarFile) payload.avatar = await uploadToCloudinary(avatarFile, "user_avatar");
      if (coverFile) payload.cover_image = await uploadToCloudinary(coverFile, "user_cover");
      await updateProfile(payload);
      await refreshUser();
      onClose();
    } catch (err: any) {
      setError(err.message || "Échec de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        style={{ background: "#12100F", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white uppercase tracking-wide">Éditer mon profil</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Cover */}
        <div className="relative w-full h-28 rounded-2xl overflow-hidden bg-white/5">
          {coverPreview && <img src={coverPreview} alt="" className="w-full h-full object-cover" />}
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined text-white">photo_camera</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </label>
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-14">
          <label className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#12100F] bg-white/10 cursor-pointer group">
            {avatarPreview && <img src={avatarPreview} alt="" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white">photo_camera</span>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#8A8178]">
            Nom affiché
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 bg-black/30 border border-white/10 rounded-xl px-3 text-white text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#8A8178]">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-primary resize-none"
          />
        </div>

        {error && <p className="text-primary text-xs font-bold">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="h-12 bg-primary hover:bg-[#B8240C] text-white font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Enregistrer"
          )}
        </button>
      </div>
    </div>
  );
}
