import { prisma } from './prisma';

export interface LogChangeItem {
  field: string;
  label?: string;
  old?: any;
  new?: any;
}

export interface ActivityDetails {
  title?: string;
  category?: string;
  status?: string;
  publishedAt?: string;
  tanggal?: string;
  source?: string | null;
  coverImage?: string | null;
  coverImageName?: string | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  authorName?: string;
  changes?: LogChangeItem[];
  contentExcerpt?: string;
  [key: string]: any;
}

export interface LogParams {
  userId?: string | null;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'CHANGE_ROLE' | 'CHANGE_STATUS' | 'DOWNLOAD';
  module:
    | 'AUTH'
    | 'USERS'
    | 'ROLES'
    | 'HOMEPAGE'
    | 'NEWS'
    | 'ANNOUNCEMENTS'
    | 'AGENDAS'
    | 'DOCUMENTS'
    | 'BUSINESS_TRIP'
    | 'POSTS'
    | 'OPINION'
    | 'SPORTS'
    | 'LIFESTYLE'
    | 'EARTH'
    | 'DIDYOUKNOW'
    | 'ACADEMIC'
    | 'WISDOM'
    | 'HUMOR'
    | 'FAMILY'
    | 'CONSULTATION'
    | 'FIGURE'
    | 'PERMISSIONS'
    | 'SYSTEM'
    | string;
  targetId?: string | null;
  description: string;
  details?: ActivityDetails | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function logActivity(params: LogParams): Promise<void> {
  try {
    let finalDescription = params.description;
    if (params.details && Object.keys(params.details).length > 0) {
      finalDescription = `${params.description}|||DETAILS|||${JSON.stringify(params.details)}`;
    }

    await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        module: params.module,
        targetId: params.targetId || null,
        description: finalDescription,
        ipAddress: params.ipAddress || '127.0.0.1',
        userAgent: params.userAgent || null,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export function parseLogDescription(rawDescription: string): {
  summary: string;
  details: ActivityDetails | null;
} {
  if (!rawDescription) {
    return { summary: '', details: null };
  }

  const separator = '|||DETAILS|||';
  const sepIndex = rawDescription.indexOf(separator);
  if (sepIndex === -1) {
    return { summary: rawDescription, details: null };
  }

  const summary = rawDescription.slice(0, sepIndex).trim();
  const rawDetails = rawDescription.slice(sepIndex + separator.length).trim();

  try {
    const parsed = JSON.parse(rawDetails);
    return { summary, details: parsed };
  } catch (e) {
    return { summary, details: null };
  }
}
