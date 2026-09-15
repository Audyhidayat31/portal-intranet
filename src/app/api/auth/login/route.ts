import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { z } from 'zod';

const loginSchema = z.object({
  nip: z.string().min(1, 'NIP wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { nip, password } = result.data;

    // Find user by NIP with auto-retry for cold starts
    const user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { nip: nip.trim() },
        include: {
          role: true,
          profile: true,
        },
      })
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'NIP atau password yang Anda masukkan tidak sesuai.' },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, message: 'Akun Anda saat ini tidak aktif atau ditangguhkan. Silakan hubungi Administrator.' },
        { status: 403 }
      );
    }

    // Verify Password
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'NIP atau password yang Anda masukkan tidak sesuai.' },
        { status: 401 }
      );
    }

    // Generate Token
    const token = signToken({
      userId: user.id,
      nip: user.nip,
      name: user.name,
      email: user.email,
      role: user.role.name,
    });

    // Log Activity
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser';
    await logActivity({
      userId: user.id,
      action: 'LOGIN',
      module: 'AUTH',
      description: `User ${user.name} (${user.nip}) berhasil login ke sistem.`,
      ipAddress: ip,
      userAgent: userAgent,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil! Mengalihkan ke halaman portal...',
      data: {
        user: {
          id: user.id,
          nip: user.nip,
          name: user.name,
          email: user.email,
          role: user.role.name,
          position: user.profile?.position,
          unitKerja: user.profile?.unitKerja,
          avatarUrl: user.profile?.avatarUrl,
        },
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    const isConnError =
      error?.code === 'P1001' ||
      error?.message?.includes("Can't reach database server") ||
      error?.message?.includes('database server is running') ||
      error?.message?.includes('connection closed') ||
      error?.message?.includes('timed out');

    const message = isConnError
      ? 'Server database sedang aktif kembali dari status siaga atau koneksi terputus. Silakan klik tombol Masuk kembali.'
      : 'Terjadi kesalahan pada server saat memproses login. Silakan coba beberapa saat lagi.';

    return NextResponse.json(
      { success: false, message },
      { status: isConnError ? 503 : 500 }
    );
  }
}

