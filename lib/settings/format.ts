import { DAYS, type Day, type DayHours } from "./types";

/**
 * Rendering helpers for `settings/store.hours`.
 *
 * CLAUDE.md §3: store hours are never hardcoded in a page — they live in
 * settings and are edited from the admin panel. These turn that record into the
 * strings the storefront shows, so changing hours in one place changes them
 * everywhere.
 *
 * No Node imports here, matching ./types, so client components can use it too.
 */

const DAY_LABEL: Record<Day, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

/** "09:00" → "9 am"; "21:30" → "9:30 pm". */
export function formatTime(hhmm: string): string {
  const [rawHour, rawMinute] = hhmm.split(":").map(Number);
  const hour = Number.isFinite(rawHour) ? rawHour : 0;
  const minute = Number.isFinite(rawMinute) ? rawMinute : 0;

  const suffix = hour < 12 ? "am" : "pm";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return minute === 0
    ? `${hour12} ${suffix}`
    : `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export type HoursGroup = { days: string; hours: string };

/**
 * Collapse the week into the fewest readable rows, merging runs of days that
 * share the same hours: `[{ days: "Mon-Sat", hours: "9 am to 9:30 pm" },
 * { days: "Sun", hours: "9 am to 8:30 pm" }]`.
 */
export function summariseHours(hours: Record<Day, DayHours>): HoursGroup[] {
  const label = (day: DayHours) =>
    day.closed ? "Closed" : `${formatTime(day.open)} to ${formatTime(day.close)}`;

  const runs: { start: Day; end: Day; hours: string }[] = [];
  for (const day of DAYS) {
    const text = label(hours[day]);
    const last = runs[runs.length - 1];
    if (last && last.hours === text) last.end = day;
    else runs.push({ start: day, end: day, hours: text });
  }

  return runs.map((run) => ({
    days:
      run.start === run.end
        ? DAY_LABEL[run.start]
        : `${DAY_LABEL[run.start]}-${DAY_LABEL[run.end]}`,
    hours: run.hours,
  }));
}

/** One-line form for inline chrome: "Mon-Sat 9 am to 9:30 pm · Sun 9 am to 8:30 pm". */
export function formatHoursLine(hours: Record<Day, DayHours>): string {
  return summariseHours(hours)
    .map((group) => `${group.days} ${group.hours}`)
    .join(" · ");
}
