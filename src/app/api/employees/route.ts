import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_EMPLOYEES } from '@/lib/mock-employees';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const unit = searchParams.get('unit') || '';

    // 1. Fetch DB employees if possible
    let dbEmployees: any[] = [];
    try {
      const where: any = {
        status: 'ACTIVE',
        role: {
          name: {
            not: 'ADMINISTRATOR'
          }
        }
      };

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { nip: { contains: search } },
          { profile: { position: { contains: search } } },
        ];
      }

      if (unit && unit !== 'Semua Unit Kerja') {
        where.profile = {
          ...where.profile,
          unitKerja: { contains: unit },
        };
      }

      dbEmployees = await prisma.user.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          role: true,
          profile: true,
        },
      });
    } catch (e) {
      console.warn('Prisma fetch failed:', e);
    }

    // 2. Format DB employees
    const formattedDb = dbEmployees.map((u) => ({
      id: u.id,
      nip: u.nip || u.profile?.nip || '-',
      name: u.name,
      fullName: u.profile?.fullName || u.name,
      position: u.profile?.position && u.profile.position.trim() ? u.profile.position.trim() : '-',
      unitKerja: u.profile?.unitKerja && u.profile.unitKerja.trim() ? u.profile.unitKerja.trim() : '-',
      golRuang: u.profile?.golRuang && u.profile.golRuang.trim() ? u.profile.golRuang.trim() : '-',
      email: u.email || '-',
      phone: u.profile?.phone && u.profile.phone.trim() ? u.profile.phone.trim() : '-',
      avatarUrl: u.profile?.avatarUrl || '',
      birthDate: u.profile?.birthDate ? u.profile.birthDate.toISOString() : undefined,
      education: u.profile?.education || '-',
      careerHistory: u.profile?.careerHistory || '-',
      achievements: u.profile?.achievements || '-',
      bio: u.profile?.bio || '-',
    }));

    const combined = formattedDb;

    return NextResponse.json({
      success: true,
      data: combined,
      total: combined.length,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat direktori pegawai' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      nip,
      position,
      unitKerja,
      golRuang,
      email,
      phone,
      avatarUrl,
      education,
      careerHistory,
      achievements,
      bio,
    } = body;

    if (!name || !nip) {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap dan NIP wajib diisi' },
        { status: 400 }
      );
    }

    // Find default role PEGAWAI
    let roleId = '';
    try {
      const pegawaiRole = await prisma.role.findFirst({
        where: { name: 'PEGAWAI' },
      });
      if (pegawaiRole) {
        roleId = pegawaiRole.id;
      }
    } catch (e) {
      console.warn('Could not find role:', e);
    }

    let newUser: any = null;
    if (roleId) {
      try {
        const userEmail = email || `${nip}@perpusnas.go.id`;
        newUser = await prisma.user.create({
          data: {
            nip,
            name,
            email: userEmail,
            password: 'password123',
            roleId,
            status: 'ACTIVE',
            profile: {
              create: {
                nip,
                fullName: name,
                position: position && position.trim() ? position.trim() : '',
                unitKerja: unitKerja && unitKerja.trim() ? unitKerja.trim() : '',
                golRuang: golRuang && golRuang.trim() ? golRuang.trim() : null,
                phone: phone && phone.trim() ? phone.trim() : null,
                avatarUrl: avatarUrl || '',
                education: education || '',
                careerHistory: careerHistory || '',
                achievements: achievements || '',
                bio: bio || '',
              },
            },
          },
          include: {
            profile: true,
            role: true,
          },
        });
      } catch (dbErr) {
        console.warn('Failed to insert in DB, will return client object:', dbErr);
      }
    }

    const createdData = newUser
      ? {
          id: newUser.id,
          nip: newUser.nip,
          name: newUser.name,
          fullName: newUser.profile?.fullName || newUser.name,
          position: newUser.profile?.position || position || '-',
          unitKerja: newUser.profile?.unitKerja || unitKerja || '-',
          golRuang: newUser.profile?.golRuang || golRuang || '-',
          email: newUser.email,
          phone: newUser.profile?.phone || phone || '-',
          avatarUrl: newUser.profile?.avatarUrl || avatarUrl,
          education: newUser.profile?.education || education,
          careerHistory: newUser.profile?.careerHistory || careerHistory,
          achievements: newUser.profile?.achievements || achievements,
          bio: newUser.profile?.bio || bio,
        }
      : {
          id: `emp-local-${Date.now()}`,
          nip,
          name,
          fullName: name,
          position: position && position.trim() ? position.trim() : '-',
          unitKerja: unitKerja && unitKerja.trim() ? unitKerja.trim() : '-',
          golRuang: golRuang && golRuang.trim() ? golRuang.trim() : '-',
          email: email || `${nip}@perpusnas.go.id`,
          phone: phone && phone.trim() ? phone.trim() : '-',
          avatarUrl: avatarUrl || '',
          education: education || '',
          careerHistory: careerHistory || '',
          achievements: achievements || '',
          bio: bio || '',
        };

    return NextResponse.json({
      success: true,
      message: 'Pegawai berhasil didaftarkan!',
      data: createdData,
    });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menambahkan pegawai' },
      { status: 500 }
    );
  }
}
