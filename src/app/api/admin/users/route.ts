import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        role: true,
        profile: true,
      },
    });

    const roles = await prisma.role.findMany();

    return NextResponse.json({ success: true, data: users, roles });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat pengguna' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { nip, name, email, password, roleId, position, unitKerja, satuanKerja, golRuang, phone, address, bio, birthDate } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Nama Lengkap wajib diisi' }, { status: 400 });
    }
    if (!nip || !nip.trim()) {
      return NextResponse.json({ success: false, message: 'Nomor Induk Pegawai wajib diisi' }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, message: 'Email Kedinasan wajib diisi' }, { status: 400 });
    }
    if (!birthDate) {
      return NextResponse.json({ success: false, message: 'Tanggal Lahir wajib diisi' }, { status: 400 });
    }
    if (!satuanKerja || !satuanKerja.trim()) {
      return NextResponse.json({ success: false, message: 'Pilihan Satuan Kerja wajib dipilih' }, { status: 400 });
    }
    if (!roleId || !roleId.trim()) {
      return NextResponse.json({ success: false, message: 'Peran wajib dipilih' }, { status: 400 });
    }
    if (!password || !password.trim()) {
      return NextResponse.json({ success: false, message: 'Kata Sandi wajib diisi' }, { status: 400 });
    }

    // Check unique NIP
    const existingNip = await prisma.user.findUnique({ where: { nip: nip.trim() } });
    if (existingNip) {
      return NextResponse.json({ success: false, message: 'NIP sudah terdaftar dalam sistem' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const effectiveUnitKerja = satuanKerja ? (unitKerja ? `${satuanKerja} - ${unitKerja}` : satuanKerja) : (unitKerja || '');

    const newUser = await prisma.user.create({
      data: {
        nip: nip.trim(),
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        roleId,
        status: 'ACTIVE',
        profile: {
          create: {
            nip: nip.trim(),
            fullName: name.trim(),
            position: position && position.trim() ? position.trim() : '',
            unitKerja: effectiveUnitKerja,
            golRuang: golRuang && golRuang.trim() ? golRuang.trim() : null,
            phone: phone && phone.trim() ? phone.trim() : null,
            bio: address || bio || null,
            birthDate: birthDate ? new Date(birthDate) : null,
          },
        },
      },
    });

    await logActivity({
      userId: currentUser.userId,
      action: 'CREATE',
      module: 'USERS',
      targetId: newUser.id,
      description: `Administrator menambahkan pengguna baru: ${name} (NIP: ${nip}).`,
    });

    return NextResponse.json({ success: true, message: 'Pengguna berhasil ditambahkan!', data: newUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Gagal menambahkan pengguna' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, email, roleId, status, position, unitKerja, satuanKerja, golRuang, phone, resetPassword, nip, bio, birthDate } = body;

    if (name !== undefined && (!name || !name.trim())) {
      return NextResponse.json({ success: false, message: 'Nama Lengkap wajib diisi' }, { status: 400 });
    }
    if (nip !== undefined && (!nip || !nip.trim())) {
      return NextResponse.json({ success: false, message: 'Nomor Induk Pegawai wajib diisi' }, { status: 400 });
    }
    if (email !== undefined && (!email || !email.trim())) {
      return NextResponse.json({ success: false, message: 'Email Kedinasan wajib diisi' }, { status: 400 });
    }
    if (birthDate !== undefined && !birthDate) {
      return NextResponse.json({ success: false, message: 'Tanggal Lahir wajib diisi' }, { status: 400 });
    }
    if (satuanKerja !== undefined && (!satuanKerja || !satuanKerja.trim())) {
      return NextResponse.json({ success: false, message: 'Pilihan Satuan Kerja wajib dipilih' }, { status: 400 });
    }
    if (roleId !== undefined && (!roleId || !roleId.trim())) {
      return NextResponse.json({ success: false, message: 'Peran wajib dipilih' }, { status: 400 });
    }

    const dataToUpdate: any = {
      name: name !== undefined ? name.trim() : undefined,
      email: email !== undefined ? email.trim() : undefined,
      roleId: roleId !== undefined ? roleId : undefined,
      status: status !== undefined ? status : undefined,
    };
    
    if (nip !== undefined) {
      dataToUpdate.nip = nip.trim();
    }

    if (resetPassword) {
      dataToUpdate.password = await hashPassword(resetPassword);
    }

    const effectiveUnitKerja = satuanKerja ? (unitKerja ? `${satuanKerja} - ${unitKerja}` : satuanKerja) : unitKerja;
    const hasProfileData = name !== undefined || position !== undefined || effectiveUnitKerja !== undefined || golRuang !== undefined || phone !== undefined || bio !== undefined || birthDate !== undefined || nip !== undefined;

    const profileUpsert = hasProfileData
      ? {
          profile: {
            upsert: {
              create: {
                nip: nip ? nip.trim() : ((await prisma.user.findUnique({ where: { id } }))?.nip || '0000'),
                fullName: name ? name.trim() : 'Pengguna',
                position: position && position.trim() ? position.trim() : '',
                unitKerja: effectiveUnitKerja || '',
                golRuang: golRuang && golRuang.trim() ? golRuang.trim() : null,
                phone: phone && phone.trim() ? phone.trim() : null,
                bio: bio || null,
                birthDate: birthDate ? new Date(birthDate) : null,
              },
              update: {
                ...(name !== undefined && { fullName: name.trim() }),
                ...(nip !== undefined && { nip: nip.trim() }),
                ...(position !== undefined && { position: position.trim() ? position.trim() : '' }),
                ...(effectiveUnitKerja !== undefined && { unitKerja: effectiveUnitKerja }),
                ...(golRuang !== undefined && { golRuang: golRuang && golRuang.trim() ? golRuang.trim() : null }),
                ...(phone !== undefined && { phone: phone && phone.trim() ? phone.trim() : null }),
                ...(bio !== undefined && { bio }),
                ...(birthDate !== undefined && { birthDate: birthDate ? new Date(birthDate) : null }),
              },
            },
          },
        }
      : {};

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...dataToUpdate,
        ...profileUpsert,
      },
    });

    await logActivity({
      userId: currentUser.userId,
      action: 'UPDATE',
      module: 'USERS',
      targetId: id,
      description: `Administrator memperbarui data/status pengguna: ${name || id}.`,
    });

    return NextResponse.json({ success: true, message: 'Data pengguna berhasil diperbarui!', data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui pengguna' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID pengguna tidak valid' }, { status: 400 });
    }

    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    if (userToDelete.id === currentUser.userId) {
      return NextResponse.json({ success: false, message: 'Anda tidak dapat menghapus akun Anda sendiri' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // Nonaktifkan pemeriksaan foreign key sementara untuk memastikan cascade delete berjalan aman
      await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

      // Hapus data relasi terkait
      await tx.employeeProfile.deleteMany({ where: { userId: id } });
      await tx.postComment.deleteMany({ where: { authorId: id } });
      await tx.employeePost.deleteMany({ where: { authorId: id } });
      await tx.content.deleteMany({ where: { authorId: id } });
      await tx.consultationReply.deleteMany({ where: { authorId: id } });
      await tx.consultationTopic.deleteMany({ where: { authorId: id } });
      await tx.activityLog.deleteMany({ where: { userId: id } });

      // Hapus entri tabel rubrik spesifik jika ada
      try { await tx.berita.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.pengumuman.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.agendaKegiatan.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.laporanPerjalananDinas.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.dokumenIntern.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.coretanOpini.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.humorPegawai.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.jelajahBumi.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.kabarKeluarga.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.kalimatBijak.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.karyaAkademik.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.tipsGayaHidup.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.olahraga.deleteMany({ where: { penulisId: id } }); } catch {}
      try { await tx.tahukahAnda.deleteMany({ where: { penulisId: id } }); } catch {}

      // Hapus user utama
      await tx.user.delete({ where: { id } });

      // Kembalikan pemeriksaan foreign key
      await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    });

    await logActivity({
      userId: currentUser.userId,
      action: 'DELETE',
      module: 'USERS',
      targetId: id,
      description: `Administrator menghapus pengguna: ${userToDelete.name} (NIP: ${userToDelete.nip}).`,
    });

    return NextResponse.json({ success: true, message: 'Pengguna berhasil dihapus!' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}
