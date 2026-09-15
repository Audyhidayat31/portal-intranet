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

    if (!nip || !name || !email || !password || !roleId) {
      return NextResponse.json({ success: false, message: 'Semua field wajib diisi' }, { status: 400 });
    }

    // Check unique NIP
    const existingNip = await prisma.user.findUnique({ where: { nip: nip.trim() } });
    if (existingNip) {
      return NextResponse.json({ success: false, message: 'NIP sudah terdaftar dalam sistem' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const effectiveUnitKerja = satuanKerja ? (unitKerja ? `${satuanKerja} - ${unitKerja}` : satuanKerja) : (unitKerja || 'Perpusnas RI');

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
            position: position || 'Aparatur Sipil Negara',
            unitKerja: effectiveUnitKerja,
            golRuang: golRuang || 'III/a - Penata Muda',
            phone: phone || null,
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
    const { id, name, email, roleId, status, position, unitKerja, satuanKerja, golRuang, phone, resetPassword } = body;

    const dataToUpdate: any = {
      name: name !== undefined ? name : undefined,
      email: email !== undefined ? email : undefined,
      roleId: roleId !== undefined ? roleId : undefined,
      status: status !== undefined ? status : undefined,
    };

    if (resetPassword) {
      dataToUpdate.password = await hashPassword(resetPassword);
    }

    const effectiveUnitKerja = satuanKerja ? (unitKerja ? `${satuanKerja} - ${unitKerja}` : satuanKerja) : unitKerja;
    const hasProfileData = name !== undefined || position !== undefined || effectiveUnitKerja !== undefined || golRuang !== undefined || phone !== undefined;

    const profileUpsert = hasProfileData
      ? {
          profile: {
            upsert: {
              create: {
                nip: (await prisma.user.findUnique({ where: { id } }))?.nip || '0000',
                fullName: name || 'Pengguna',
                position: position || 'Aparatur Perpusnas',
                unitKerja: effectiveUnitKerja || 'Perpusnas RI',
                golRuang,
                phone,
              },
              update: {
                ...(name !== undefined && { fullName: name }),
                ...(position !== undefined && { position }),
                ...(effectiveUnitKerja !== undefined && { unitKerja: effectiveUnitKerja }),
                ...(golRuang !== undefined && { golRuang }),
                ...(phone !== undefined && { phone }),
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

    await prisma.user.delete({ where: { id } });

    await logActivity({
      userId: currentUser.userId,
      action: 'DELETE',
      module: 'USERS',
      targetId: id,
      description: `Administrator menghapus pengguna: ${userToDelete.name} (NIP: ${userToDelete.nip}).`,
    });

    return NextResponse.json({ success: true, message: 'Pengguna berhasil dihapus!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}
