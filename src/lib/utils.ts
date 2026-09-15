import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined, pattern: string = "d MMMM yyyy"): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, pattern, { locale: id });
  } catch {
    return "-";
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, "d MMMM yyyy, HH:mm 'WIB'", { locale: id });
  } catch {
    return "-";
  }
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true, locale: id });
  } catch {
    return "-";
  }
}

export function truncateText(text: string | null | undefined, maxLength: number = 100): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "PN";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function formatBirthDate(birthDate: string | Date | null | undefined, nip?: string | null): string {
  if (birthDate) {
    try {
      const d = typeof birthDate === "string" ? parseISO(birthDate) : birthDate;
      const formatted = format(d, "d MMMM yyyy", { locale: id });
      if (formatted !== "NaN" && formatted !== "-") return formatted;
    } catch {
      // fallback to NIP parsing
    }
  }

  if (nip && nip.length >= 8) {
    const cleaned = nip.replace(/\D/g, "");
    if (cleaned.length >= 8) {
      const year = parseInt(cleaned.substring(0, 4), 10);
      const month = parseInt(cleaned.substring(4, 6), 10);
      const day = parseInt(cleaned.substring(6, 8), 10);

      if (year >= 1930 && year <= 2026 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const d = new Date(year, month - 1, day);
        return format(d, "d MMMM yyyy", { locale: id });
      }
    }
  }

  return "-";
}

