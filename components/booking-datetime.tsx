"use client";

import { useEffect, useState } from "react";
import { TIME_SLOTS, MAX_DAYS_AHEAD } from "@/lib/leads/validation";
import { cn } from "@/lib/cn";

/**
 * Date + time-slot picker for "Book an assessment". Renders a native date input
 * (a real calendar on every device) limited to today → +90 days, and four
 * 3-hour slots from 8am to 8pm. When the chosen date is today, slots whose start
 * time has already passed are disabled.
 *
 * The slot labels come from `lib/leads/validation` — the same list the API
 * route validates against — so the buttons and the server's allow-list can't
 * drift apart. The label text is exact, en dash included.
 *
 * The selected values are mirrored into hidden inputs so the parent <form>'s
 * FormData captures them (name="preferred_date" / "preferred_time") with no
 * extra wiring.
 */

/** Local YYYY-MM-DD (not UTC — avoids the date shifting across timezones). */
function toLocalISODate(d: Date): string {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function BookingDateTime({
  dateError,
  timeError,
}: {
  dateError?: string;
  timeError?: string;
}) {
  // Computed on the client to reflect the visitor's own clock. Set after mount
  // to avoid an SSR/hydration mismatch.
  const [today, setToday] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [nowHour, setNowHour] = useState(0);

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  useEffect(() => {
    const now = new Date();
    setToday(toLocalISODate(now));
    const max = new Date(now);
    max.setDate(max.getDate() + MAX_DAYS_AHEAD);
    setMaxDate(toLocalISODate(max));
    setNowHour(now.getHours());
  }, []);

  const isToday = date !== "" && date === today;

  const isSlotDisabled = (startHour: number) => isToday && nowHour >= startHour;

  // If the date changes to today and the current slot is now in the past, clear it.
  useEffect(() => {
    if (!slot) return;
    const chosen = TIME_SLOTS.find((s) => s.label === slot);
    if (chosen && isToday && nowHour >= chosen.startHour) setSlot("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const allTodayGone = isToday && TIME_SLOTS.every((s) => nowHour >= s.startHour);

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-1.5 block text-sm font-medium text-ink">
        Preferred date
      </legend>
      <input
        type="date"
        name="preferred_date"
        value={date}
        min={today || undefined}
        max={maxDate || undefined}
        onChange={(e) => setDate(e.target.value)}
        aria-invalid={dateError ? "true" : undefined}
        aria-describedby={dateError ? "lf-preferred-date-err" : undefined}
        className={cn(
          "w-full max-w-[16rem] rounded-xl border bg-surface px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-brand/40",
          dateError ? "border-danger" : "border-hairline",
        )}
      />
      {dateError && (
        <p id="lf-preferred-date-err" className="mt-1.5 text-sm text-danger">
          {dateError}
        </p>
      )}

      <p className="mt-5 mb-1.5 block text-sm font-medium text-ink">
        Preferred time
      </p>
      {allTodayGone && (
        <p className="mb-2 text-sm text-text-muted">
          No time slots left today. Please pick another date.
        </p>
      )}
      <div className="grid grid-cols-2 gap-2.5">
        {TIME_SLOTS.map((s) => {
          const disabled = isSlotDisabled(s.startHour);
          const active = slot === s.label;
          return (
            <button
              key={s.label}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => setSlot(s.label)}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                disabled
                  ? "cursor-not-allowed border-hairline text-text-muted/40 line-through"
                  : active
                    ? "border-brand bg-brand-tint text-ink"
                    : timeError
                      ? "border-danger text-ink hover:border-text-muted/40"
                      : "border-hairline text-ink hover:border-text-muted/40",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      {timeError && <p className="mt-2 text-sm text-danger">{timeError}</p>}

      {/* Mirror the slot into the form payload (the date input already submits). */}
      <input type="hidden" name="preferred_time" value={slot} />
    </fieldset>
  );
}
