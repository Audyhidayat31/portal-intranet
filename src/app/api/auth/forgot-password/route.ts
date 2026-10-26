import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendPasswordResetEmail } from '@/lib/gmail';

const forgotPasswordSchema = z.object({
  email: z.string().email('Format alamat email tidak valid'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists in database
    const user = await prisma.user.findFirst({
      where: {
        email: cleanEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
        nip: true,
      },
    });

    // Generate reset token
    const token = Buffer.from(`${cleanEmail}:${Date.now()}`).toString('base64');
    const userName = user ? user.name : (cleanEmail.split('@')[0] || 'Pengguna');

    // Base URL for email link
    const origin = request.nextUrl.origin || process.env.APP_BASE_URL || 'http://localhost:3000';
    const fullResetUrl = `${origin}/ganti-kata-sandi?email=${encodeURIComponent(cleanEmail)}&token=${token}`;
    const relativeResetUrl = `/ganti-kata-sandi?email=${encodeURIComponent(cleanEmail)}&token=${token}`;
    const confirmationUrl = `/email-konfirmasi?email=${encodeURIComponent(cleanEmail)}&name=${encodeURIComponent(userName)}&token=${token}`;

    // Send email using Gmail API
    const emailResult = await sendPasswordResetEmail({
      toEmail: cleanEmail,
      recipientName: userName,
      resetUrl: fullResetUrl,
    });

    if (!emailResult.success || emailResult.simulated) {
      return NextResponse.json(
        {
          success: false,
          message: emailResult.error || 'Gmail API belum diotorisasi. Hubungkan akun Google melalui /api/auth/google/authorize.',
          authorizeUrl: '/api/auth/google/authorize',
          statusUrl: '/api/auth/google/status',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Tautan pemulihan kata sandi telah dikirim ke ${cleanEmail}.`,
      data: {
        email: cleanEmail,
        userName,
        resetUrl: relativeResetUrl,
        fullResetUrl,
        confirmationUrl,
        emailSent: true,
        emailDetails: emailResult,
      },
    });
  } catch (error: any) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server saat memproses permintaan.' },
      { status: 500 }
    );
  }
}
