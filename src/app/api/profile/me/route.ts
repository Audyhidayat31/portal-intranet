import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        role: true,
        profile: true,
      },
    });

    return NextResponse.json({ success: true, data: fullUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat profil' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { phone, bio, education, birthDate, currentPassword, newPassword } = body;

    // Password change check
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: 'Masukkan password lama untuk mengubah password' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { id: user.userId } });
      if (!existingUser) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

      const isMatch = await verifyPassword(currentPassword, existingUser.password);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: 'Password lama tidak sesuai' }, { status: 400 });
      }

      const newHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.userId },
        data: { password: newHash },
      });
    }

    // Update profile info
    await prisma.employeeProfile.update({
      where: { userId: user.userId },
      data: {
        phone: phone !== undefined ? phone : undefined,
        bio: bio !== undefined ? bio : undefined,
        education: education !== undefined ? education : undefined,
        birthDate: birthDate ? new Date(birthDate) : undefined,
      },
    });

    await logActivity({
      userId: user.userId,
      action: 'UPDATE',
      module: 'USERS',
      description: `Pegawai ${user.name} memperbarui data profil akun pribadinya.`,
    });

    return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
