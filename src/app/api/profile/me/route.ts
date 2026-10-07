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
    const { name, nip, email, phone, bio, education, birthDate, avatarUrl, position, satuanKerja, currentPassword, newPassword } = body;

    // Password change check
    if (newPassword) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
      if (!passwordRegex.test(newPassword)) {
        return NextResponse.json({ success: false, message: 'Sandi baru minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.' }, { status: 400 });
      }
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
        avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
        fullName: name !== undefined ? name : undefined,
        nip: nip !== undefined ? nip : undefined,
        position: position !== undefined ? position : undefined,
        unitKerja: satuanKerja !== undefined ? satuanKerja : undefined,
      },
    });

    if (name !== undefined || nip !== undefined) {
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          name: name !== undefined ? name : undefined,
          nip: nip !== undefined ? nip : undefined,
        },
      });
    }

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
