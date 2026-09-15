import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, getSessionUserFromRequest } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUserFromRequest(request);
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser';

    if (session) {
      await logActivity({
        userId: session.userId,
        action: 'LOGOUT',
        module: 'AUTH',
        description: `User ${session.name} (${session.nip}) telah logout dari sistem.`,
        ipAddress: ip,
        userAgent: userAgent,
      });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logout berhasil. Anda telah keluar dari sesi.',
    });

    clearAuthCookie(response);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    const response = NextResponse.json(
      { success: true, message: 'Logout berhasil' },
      { status: 200 }
    );
    clearAuthCookie(response);
    return response;
  }
}
