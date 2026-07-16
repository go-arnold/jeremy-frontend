"use client";

interface Props {
  price: string;
  eventTitle: string;
}

export default function BookingButton({ price, eventTitle }: Props) {
  function handleBooking() {
    alert(`Réservation pour : ${eventTitle}\n${price}`);
  }

  return (
    <section className="px-4 mt-8">
      <button
        onClick={handleBooking}
        className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(41,163,163,0.4)]"
      >
        <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
        Réserver un billet
      </button>
    </section>
  );
}