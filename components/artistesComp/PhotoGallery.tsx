import type { GalleryPhoto } from "@/types/artistes";

interface Props {
  photos: GalleryPhoto[];
}

export default function PhotoGallery({ photos }: Props) {
  return (
    <section className="flex flex-col px-5 py-5 m-4 bg-[#12223ce6] rounded-xl">
      <h3 className="font-display text-xl font-bold text-white tracking-tight mb-4">
        Gallery
      </h3>
      {/* Grille masonry 2 colonnes */}
      <div className="columns-2 gap-4 space-y-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid relative rounded-xl overflow-hidden group"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </section>
  );
}
