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
    if (typeof date === "string") {
      const trimmed = date.trim();
      if (!trimmed || trimmed === "-") return "-";
      if (/^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/.test(trimmed)) {
        return trimmed;
      }
      let d = parseISO(trimmed);
      if (isNaN(d.getTime())) {
        d = new Date(trimmed);
      }
      if (!isNaN(d.getTime())) {
        return format(d, pattern, { locale: id });
      }
      return trimmed;
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return format(date, pattern, { locale: id });
    }
    return "-";
  } catch {
    return typeof date === "string" && date.trim() ? date.trim() : "-";
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

/**
 * Mendeteksi apakah pegawai berulang tahun pada hari ini
 * Mendukung zona waktu WIB (Asia/Jakarta, UTC+7), input string ISO, objek Date, serta fallback NIP standar PNS (YYYYMMDD...).
 */
export function isBirthdayToday(
  birthDate: string | Date | null | undefined,
  nip?: string | null,
  referenceDate: Date = new Date()
): boolean {
  // Ambil tanggal hari ini dalam zona waktu Indonesia Barat (WIB, Asia/Jakarta, UTC+7)
  const jakartaTodayParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(referenceDate);

  const todayMonth = parseInt(jakartaTodayParts.find(p => p.type === 'month')?.value || '0', 10);
  const todayDay = parseInt(jakartaTodayParts.find(p => p.type === 'day')?.value || '0', 10);

  if (!todayMonth || !todayDay) return false;

  // 1. Periksa dari birthDate jika ada
  if (birthDate) {
    // Jika string memiliki format ISO atau YYYY-MM-DD
    if (typeof birthDate === 'string') {
      const match = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const strMonth = parseInt(match[2], 10);
        const strDay = parseInt(match[3], 10);
        if (strMonth === todayMonth && strDay === todayDay) {
          return true;
        }
      }
    }

    const d = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    if (!isNaN(d.getTime())) {
      // Evaluasi dalam zona waktu Asia/Jakarta
      const bJakartaParts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        month: 'numeric',
        day: 'numeric',
      }).formatToParts(d);

      const bMonthJakarta = parseInt(bJakartaParts.find(p => p.type === 'month')?.value || '0', 10);
      const bDayJakarta = parseInt(bJakartaParts.find(p => p.type === 'day')?.value || '0', 10);

      if (bMonthJakarta === todayMonth && bDayJakarta === todayDay) {
        return true;
      }

      // Fallback periksa nilai UTC jika birthDate disimpan dalam UTC
      const bMonthUTC = d.getUTCMonth() + 1;
      const bDayUTC = d.getUTCDate();
      if (bMonthUTC === todayMonth && bDayUTC === todayDay) {
        return true;
      }
    }
  }

  // 2. Fallback periksa dari NIP (Format standar PNS: YYYYMMDD...)
  if (nip && nip.length >= 8) {
    const cleaned = nip.replace(/\D/g, '');
    if (cleaned.length >= 8) {
      const nipMonth = parseInt(cleaned.substring(4, 6), 10);
      const nipDay = parseInt(cleaned.substring(6, 8), 10);
      if (nipMonth === todayMonth && nipDay === todayDay) {
        return true;
      }
    }
  }

  return false;
}

export function isUserAdmin(user: any): boolean {
  if (!user) return false;
  if (user.isAdmin === true) return true;
  const roleName = typeof user.role === 'string' ? user.role : user.role?.name || user.roleName || user.roleString;
  if (!roleName) return false;
  const upper = String(roleName).toUpperCase();
  return upper === 'ADMINISTRATOR' || upper === 'ADMIN';
}

function cleanPersonName(name?: string | null): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/(drs\.|dr\.|prof\.|s\.kom\.|m\.kom\.|s\.sos\.|m\.si\.|m\.hum\.|s\.pd\.|m\.pd\.|s\.e\.|m\.m\.|s\.t\.|m\.t\.)/gi, '')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function canManageContent(user: any, content: any): boolean {
  if (!user) return false;
  if (isUserAdmin(user)) return true;

  const authorId = content?.authorId || content?.penulisId || content?.author?.id || content?.userId;
  const currentUserId = user.id || user.userId;

  if (authorId && currentUserId && String(authorId) === String(currentUserId)) return true;

  const authorNip = content?.author?.nip || content?.authorNip;
  if (authorNip && user.nip && String(authorNip).trim() === String(user.nip).trim()) return true;

  const authorName = content?.authorName || content?.namaPenulis || content?.author?.name || content?.name;
  if (authorName && user.name) {
    const rawAuthor = String(authorName).trim().toLowerCase();
    const rawUser = String(user.name).trim().toLowerCase();
    if (rawAuthor === rawUser) return true;

    const normAuthor = cleanPersonName(authorName);
    const normUser = cleanPersonName(user.name);
    if (normAuthor && normUser) {
      if (normAuthor === normUser) return true;
      if (normAuthor.includes(normUser) || normUser.includes(normAuthor)) return true;
    }
  }

  return false;
}

