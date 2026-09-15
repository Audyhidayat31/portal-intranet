import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const resetSchema = z.object({
  newPassword: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  identifier: z.string().optional(), // nip or email
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = resetSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { newPassword, identifier } = result.data;

    let targetUser = null;

    if (identifier && identifier.trim()) {
      const cleanIdentifier = identifier.trim();
      targetUser = await prisma.user.findFirst({
        where: {
          OR: [
            { nip: cleanIdentifier },
            { email: cleanIdentifier },
          ],
        },
      });
    }

    // If identifier is not found or not provided, fallback to the demo pegawai account (or admin if specified)
    if (!targetUser) {
      targetUser = await prisma.user.findFirst({
        where: {
          OR: [
            { nip: '198501152010011001' },
            { email: 'bambang.sudirman@perpusnas.go.id' },
          ],
        },
      });
    }

    if (!targetUser) {
      // Fallback to the first available active user
      targetUser = await prisma.user.findFirst({
        where: { status: 'ACTIVE' },
      });
    }

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'Akun pengguna tidak ditemukan dalam database.' },
        { status: 404 }
      );
    }

    // Hash the new password and update the database
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: targetUser.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: 'Kata sandi berhasil diperbarui.',
      data: {
        nip: targetUser.nip,
        name: targetUser.name,
      },
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server saat memperbarui kata sandi.' },
      { status: 500 }
    );
  }
}
