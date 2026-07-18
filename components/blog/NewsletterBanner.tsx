export default function NewsletterBanner() {
  return (
    <div className="px-4 py-8">
      <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-surface-card p-6 border border-primary/20 text-center">
        <span
          className="material-symbols-outlined text-primary mb-2 block"
          style={{ fontSize: "32px" }}
        >
          mail
        </span>
        <h3 className="text-white font-display font-bold text-lg mb-2">
          Restez Connecté
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          L&apos;actualité culturelle du Kivu, directement dans votre boîte.
        </p>
        <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-sm transition-colors shadow-lg">
          S&apos;abonner
        </button>
      </div>
    </div>
  );
}
