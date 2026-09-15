import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
        email: {
          equals: cleanEmail,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        nip: true,
      },
    });

    // Generate mock reset token
    const token = Buffer.from(`${cleanEmail}:${Date.now()}`).toString('base64');
    const userName = user ? user.name : 'Budi Sujatmiko';
    const resetUrl = `/ganti-kata-sandi?email=${encodeURIComponent(cleanEmail)}&token=${token}`;
    const confirmationUrl = `/email-konfirmasi?email=${encodeURIComponent(cleanEmail)}&name=${encodeURIComponent(userName)}&token=${token}`;

    return NextResponse.json({
      success: true,
      message: `Tautan pemulihan kata sandi telah dikirim ke ${cleanEmail}.`,
      data: {
        email: cleanEmail,
        userName,
        resetUrl,
        confirmationUrl,
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
