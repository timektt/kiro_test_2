// src/lib/format.ts
export function fmtNumber(
  v: number | bigint | string | null | undefined,
  locale: string = "th-TH"
): string {
  if (typeof v === "bigint") return v.toLocaleString(locale);
  const n = typeof v === "string" ? Number(v) : v ?? 0;
  const safe = Number.isFinite(Number(n)) ? Number(n) : 0;
  return safe.toLocaleString(locale);
}

export function fmtDateTime(
  v: Date | string | number | null | undefined,
  locale: string = "th-TH",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }
): string {
  if (!v) return "-";
  const d = v instanceof Date ? v : new Date(v);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString(locale, options);
}

export function fmtDate(
  v: Date | string | number | null | undefined,
  locale: string = "th-TH",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }
): string {
  if (!v) return "-";
  const d = v instanceof Date ? v : new Date(v);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(locale, options);
}

export function fmtTime(
  v: Date | string | number | null | undefined,
  locale: string = "th-TH",
  options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  }
): string {
  if (!v) return "-";
  const d = v instanceof Date ? v : new Date(v);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString(locale, options);
}