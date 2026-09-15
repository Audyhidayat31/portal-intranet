import { prisma } from './prisma';

export interface LogParams {
  userId?: string | null;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'CHANGE_ROLE' | 'CHANGE_STATUS' | 'DOWNLOAD';
  module: 'AUTH' | 'USERS' | 'ROLES' | 'HOMEPAGE' | 'NEWS' | 'ANNOUNCEMENTS' | 'AGENDAS' | 'DOCUMENTS' | 'BUSINESS_TRIP' | 'POSTS' | 'FIGURE' | 'PERMISSIONS' | 'SYSTEM';
  targetId?: string | null;
  description: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function logActivity(params: LogParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        module: params.module,
        targetId: params.targetId || null,
        description: params.description,
        ipAddress: params.ipAddress || '127.0.0.1',
        userAgent: params.userAgent || null,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
