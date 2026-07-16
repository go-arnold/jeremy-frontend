"use client";

import { useState } from "react";
import type { CalendarMonth, CalendarDay } from "@/types/sortiesPremieres";

const WEEK_HEADERS = ["D", "L", "M", "M", "J", "V", "S"];

function CalendarDayCell({ day }: { day: CalendarDay }) {
  const base = "h-10 flex items-center justify-center text-sm rounded-full relative";

  if (day.isToday) {
    return (
      <button
        className={`${base} font-bold bg-primary text-white`}
        style={day.colStart ? { gridColumnStart: day.colStart } : undefined}
      >
        {day.day}
      </button>
    );
  }

  if (day.isPast) {
    return (
      <div
        className={`${base} font-medium opacity-20`}
        style={day.colStart ? { gridColumnStart: day.colStart } : undefined}
      >
        {day.day}
      </div>
    );
  }

  return (
    <button
      className={`${base} font-medium hover:bg-white/5 transition-colors`}
      style={day.colStart ? { gridColumnStart: day.colStart } : undefined}
    >
      {day.day}
      {day.hasEvent && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
      )}
    </button>
  );
}

export default function ReleaseCalendar({ calendar }: { calendar: CalendarMonth }) {
  const [month, setMonth] = useState(calendar.label);

  return (
    <section className="mb-10 bg-deep-slate p-6 rounded-xl border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">calendar_month</span>
          {month}
        </h2>
        <div className="flex gap-2">
          <button className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Week headers */}
      <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] font-bold text-slate-500 mb-2">
        {WEEK_HEADERS.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendar.days.map((day) => (
          <CalendarDayCell key={day.day} day={day} />
        ))}
      </div>
    </section>
  );
}
