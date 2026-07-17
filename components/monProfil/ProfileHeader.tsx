import type { UserProfile } from "@/types/monProfil";
import Avatar from "@/components/ui/Avatar";

interface Props {
  profile: UserProfile;
  onEdit: () => void;
  onShare: () => void;
}

export default function ProfileHeader({ profile, onEdit, onShare }: Props) {
  return (
    <section className="flex flex-col items-center gap-4">
      {/* Avatar */}
      <div className="relative group">
        <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary to-transparent">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-background-dark relative flex items-center justify-center">
            <Avatar
              src={profile.avatar}
              alt={profile.displayName}
              size="custom"
              className="w-full h-full"
            />
          </div>
        </div>
        {profile.isOnline && (
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-primary rounded-full border-2 border-background-dark shadow-glow" />
        )}
      </div>

      {/* Name & handle */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{profile.displayName}</h1>
        <p className="text-primary font-medium">{profile.handle}</p>
        <p className="text-text-secondary text-sm">{profile.bio}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-xs mt-2">
        <button
          onClick={onEdit}
          className="flex-1 h-11 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition-colors shadow-glow flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          <span>Éditer</span>
        </button>
        <button
          onClick={onShare}
          className="h-11 w-11 glass-card rounded-xl flex items-center justify-center text-white hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
        </button>
      </div>
    </section>
  );
}
