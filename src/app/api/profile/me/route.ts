import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword, verifyPassword, signToken, setAuthCookie } from '@/lib/auth';
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

    if (!fullUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    let profileData: any = fullUser.profile;
    try {
      const rawProfiles: any[] = await prisma.$queryRawUnsafe(
        'SELECT * FROM profil_pegawai WHERE userId = ? LIMIT 1',
        fullUser.id
      );
      if (rawProfiles && rawProfiles.length > 0) {
        profileData = {
          ...fullUser.profile,
          ...rawProfiles[0],
        };
      }
    } catch (rawErr) {
      console.warn('Raw profile query fallback error:', rawErr);
    }

    const roleName = fullUser.role?.name || user.role;
    const isAdmin =
      roleName?.toUpperCase() === 'ADMINISTRATOR' ||
      roleName?.toUpperCase() === 'ADMIN';

    return NextResponse.json({
      success: true,
      data: {
        ...fullUser,
        profile: profileData,
        roleName,
        isAdmin,
      },
    });
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
    const { name, nip, email, phone, bio, education, birthDate, avatarUrl, position, satuanKerja, eselon2, eselon3, lokasiKerja, currentPassword, newPassword } = body;

    // Password change check
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: 'Masukkan sandi lama untuk mengubah kata sandi' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { id: user.userId } });
      if (!existingUser) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

      const isMatch = await verifyPassword(currentPassword, existingUser.password);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: 'Sandi lama tidak sesuai' }, { status: 400 });
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return NextResponse.json({ success: false, message: 'Sandi baru minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.' }, { status: 400 });
      }

      const newHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.userId },
        data: { password: newHash },
      });
    }

    let parsedBirthDate: Date | null | undefined = undefined;
    if (birthDate !== undefined) {
      if (!birthDate || birthDate === '') {
        parsedBirthDate = null;
      } else {
        const d = new Date(birthDate);
        parsedBirthDate = isNaN(d.getTime()) ? null : d;
      }
    }

    const cleanNip = nip !== undefined && nip.trim() ? nip.trim() : undefined;
    const cleanName = name !== undefined && name.trim() ? name.trim() : undefined;
    const cleanEmail = email !== undefined ? (email && email.trim() ? email.trim() : null) : undefined;
    const valEselon2 = eselon2 !== undefined ? (eselon2 && eselon2.trim() ? eselon2.trim() : null) : undefined;
    const valEselon3 = eselon3 !== undefined ? (eselon3 && eselon3.trim() ? eselon3.trim() : null) : undefined;
    const valLokasiKerja = lokasiKerja !== undefined ? (lokasiKerja && lokasiKerja.trim() ? lokasiKerja.trim() : null) : undefined;

    // Validasi email agar tidak duplikat dengan akun lain
    if (cleanEmail) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: cleanEmail,
          id: { not: user.userId },
        },
      });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: 'Email kedinasan sudah digunakan oleh pengguna lain.' },
          { status: 400 }
        );
      }
    }

    // Validasi NIP agar tidak duplikat dengan akun lain
    if (cleanNip !== undefined) {
      const existingNip = await prisma.user.findFirst({
        where: {
          nip: cleanNip,
          id: { not: user.userId },
        },
      });
      if (existingNip) {
        return NextResponse.json(
          { success: false, message: 'Nomor Induk Pegawai (NIP) sudah terdaftar pada pengguna lain.' },
          { status: 400 }
        );
      }
    }

    // Update profile info
    try {
      await (prisma.employeeProfile as any).upsert({
        where: { userId: user.userId },
        create: {
          userId: user.userId,
          nip: cleanNip || user.nip,
          fullName: cleanName || user.name,
          position: (position && position.trim()) || '',
          unitKerja: (satuanKerja && satuanKerja.trim()) || '',
          phone: phone && phone.trim() ? phone.trim() : null,
          bio: bio && bio.trim() ? bio.trim() : null,
          education: education && education.trim() ? education.trim() : null,
          birthDate: parsedBirthDate ?? null,
          avatarUrl: avatarUrl !== undefined ? avatarUrl : null,
          eselon2: valEselon2 ?? null,
          eselon3: valEselon3 ?? null,
          lokasiKerja: valLokasiKerja ?? null,
        },
        update: {
          phone: phone !== undefined ? (phone && phone.trim() ? phone.trim() : null) : undefined,
          bio: bio !== undefined ? (bio && bio.trim() ? bio.trim() : null) : undefined,
          education: education !== undefined ? (education && education.trim() ? education.trim() : null) : undefined,
          birthDate: parsedBirthDate !== undefined ? parsedBirthDate : undefined,
          avatarUrl: avatarUrl !== undefined ? (avatarUrl ? avatarUrl : null) : undefined,
          fullName: cleanName,
          nip: cleanNip,
          position: position !== undefined ? (position && position.trim() ? position.trim() : '') : undefined,
          unitKerja: satuanKerja !== undefined ? (satuanKerja && satuanKerja.trim() ? satuanKerja.trim() : '') : undefined,
          eselon2: valEselon2,
          eselon3: valEselon3,
          lokasiKerja: valLokasiKerja,
        },
      });
    } catch (upsertErr: any) {
      if (upsertErr?.message?.includes('Unknown argument')) {
        // Fallback jika instance runtime Prisma di dev server belum reload skema baru
        await (prisma.employeeProfile as any).upsert({
          where: { userId: user.userId },
          create: {
            userId: user.userId,
            nip: cleanNip || user.nip,
            fullName: cleanName || user.name,
            position: (position && position.trim()) || '',
            unitKerja: (satuanKerja && satuanKerja.trim()) || '',
            phone: phone && phone.trim() ? phone.trim() : null,
            bio: bio && bio.trim() ? bio.trim() : null,
            education: education && education.trim() ? education.trim() : null,
            birthDate: parsedBirthDate ?? null,
            avatarUrl: avatarUrl !== undefined ? avatarUrl : null,
          },
          update: {
            phone: phone !== undefined ? (phone && phone.trim() ? phone.trim() : null) : undefined,
            bio: bio !== undefined ? (bio && bio.trim() ? bio.trim() : null) : undefined,
            education: education !== undefined ? (education && education.trim() ? education.trim() : null) : undefined,
            birthDate: parsedBirthDate !== undefined ? parsedBirthDate : undefined,
            avatarUrl: avatarUrl !== undefined ? (avatarUrl ? avatarUrl : null) : undefined,
            fullName: cleanName,
            nip: cleanNip,
            position: position !== undefined ? (position && position.trim() ? position.trim() : '') : undefined,
            unitKerja: satuanKerja !== undefined ? (satuanKerja && satuanKerja.trim() ? satuanKerja.trim() : '') : undefined,
          },
        });

        // Simpan eselon2, eselon3, lokasiKerja langsung ke database MySQL
        await prisma.$executeRawUnsafe(
          'UPDATE profil_pegawai SET eselon2 = ?, eselon3 = ?, lokasiKerja = ?, updatedAt = NOW() WHERE userId = ?',
          valEselon2 !== undefined ? valEselon2 : null,
          valEselon3 !== undefined ? valEselon3 : null,
          valLokasiKerja !== undefined ? valLokasiKerja : null,
          user.userId
        );
      } else {
        throw upsertErr;
      }
    }

    // Update data utama pada tabel User (Nama, NIP, Email Kedinasan)
    const userUpdateData: any = {};
    if (cleanName !== undefined) userUpdateData.name = cleanName;
    if (cleanNip !== undefined) userUpdateData.nip = cleanNip;

    if (cleanEmail !== undefined) {
      if (cleanEmail === null) {
        // Kosongkan email kedinasan langsung ke MySQL untuk mencegah PrismaClientValidationError pada runtime
        await prisma.$executeRawUnsafe(
          'UPDATE pengguna SET email = NULL, updatedAt = NOW() WHERE id = ?',
          user.userId
        );
      } else {
        userUpdateData.email = cleanEmail;
      }
    }

    if (Object.keys(userUpdateData).length > 0) {
      try {
        await prisma.user.update({
          where: { id: user.userId },
          data: userUpdateData,
        });
      } catch (userErr: any) {
        // Fallback jika Prisma Client runtime di dev server menolak argument email null
        if (userErr?.message?.includes('email') || userErr?.message?.includes('must not be null')) {
          delete userUpdateData.email;
          if (Object.keys(userUpdateData).length > 0) {
            await prisma.user.update({
              where: { id: user.userId },
              data: userUpdateData,
            });
          }
          if (cleanEmail !== undefined) {
            await prisma.$executeRawUnsafe(
              'UPDATE pengguna SET email = ?, updatedAt = NOW() WHERE id = ?',
              cleanEmail,
              user.userId
            );
          }
        } else {
          throw userErr;
        }
      }
    }

    try {
      await logActivity({
        userId: user.userId,
        action: 'UPDATE',
        module: 'USERS',
        description: `Pegawai ${cleanName || user.name} memperbarui data profil akun pribadinya.`,
      });
    } catch (logErr) {
      console.warn('Gagal mencatat log aktivitas profil:', logErr);
    }

    // Muat ulang data user untuk memperbarui token autentikasi sesi bila diperlukan
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { role: true },
    });

    const response = NextResponse.json({ success: true, message: 'Profil berhasil diperbarui!' });

    if (updatedUser) {
      const newToken = signToken({
        userId: updatedUser.id,
        nip: updatedUser.nip,
        name: updatedUser.name,
        email: updatedUser.email || '',
        role: updatedUser.role.name,
      });
      setAuthCookie(response, newToken);
    }

    return response;
  } catch (error: any) {
    console.error('API profile me error:', error);
    return NextResponse.json({
      success: false,
      message: error?.message || 'Gagal memperbarui profil'
    }, { status: 500 });
  }
}
