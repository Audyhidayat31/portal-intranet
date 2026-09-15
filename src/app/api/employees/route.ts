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
      console.warn('Prisma fetch failed, using fallback:', e);
    }

    // 2. Format DB employees
    const formattedDb = dbEmployees.map((u) => ({
      id: u.id,
      nip: u.nip || u.profile?.nip || '-',
      name: u.name,
      fullName: u.profile?.fullName || u.name,
      position: u.profile?.position || 'Pegawai Perpusnas RI',
      unitKerja: u.profile?.unitKerja || 'Perpustakaan Nasional RI',
      golRuang: u.profile?.golRuang || 'III/a',
      email: u.email,
      phone: u.profile?.phone || '-',
      avatarUrl: u.profile?.avatarUrl || '',
      birthDate: u.profile?.birthDate ? u.profile.birthDate.toISOString() : undefined,
      education: u.profile?.education || '-',
      careerHistory: u.profile?.careerHistory || '-',
      achievements: u.profile?.achievements || '-',
      bio: u.profile?.bio || '-',
    }));

    // 3. Filter mock employees
    let filteredMock = MOCK_EMPLOYEES;
    if (search) {
      const q = search.toLowerCase();
      filteredMock = filteredMock.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.nip.toLowerCase().includes(q) ||
          m.position.toLowerCase().includes(q) ||
          m.unitKerja.toLowerCase().includes(q)
      );
    }

    if (unit && unit !== 'Semua Unit Kerja') {
      filteredMock = filteredMock.filter((m) =>
        m.unitKerja.toLowerCase().includes(unit.toLowerCase())
      );
    }

    // Merge DB & Mock without duplicating NIPs
    const dbNips = new Set(formattedDb.map((e) => e.nip));
    const combined = [
      ...formattedDb,
      ...filteredMock.filter((m) => !dbNips.has(m.nip)),
    ];

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
                position: position || 'Pegawai Perpusnas RI',
                unitKerja: unitKerja || 'Pusat Data dan Informasi',
                golRuang: golRuang || 'III/a',
                phone: phone || '',
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
          position: newUser.profile?.position || position,
          unitKerja: newUser.profile?.unitKerja || unitKerja,
          golRuang: newUser.profile?.golRuang || golRuang,
          email: newUser.email,
          phone: newUser.profile?.phone || phone,
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
          position: position || 'Pegawai Perpusnas RI',
          unitKerja: unitKerja || 'Pusat Data dan Informasi',
          golRuang: golRuang || 'III/a',
          email: email || `${nip}@perpusnas.go.id`,
          phone: phone || '',
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
