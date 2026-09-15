import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_EMPLOYEES, MockEmployee } from '@/lib/mock-employees';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    // 1. Check in Database first
    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findFirst({
        where: {
          OR: [{ id: decodedId }, { nip: decodedId }],
        },
        include: {
          profile: true,
          role: true,
        },
      });
    } catch (e) {
      console.warn('DB lookup failed in single employee:', e);
    }

    if (dbUser) {
      const p = dbUser.profile;
      const formatted: MockEmployee = {
        id: dbUser.id,
        nip: dbUser.nip || p?.nip || '-',
        name: dbUser.name,
        fullName: p?.fullName || dbUser.name,
        position: p?.position || 'Pegawai Perpusnas RI',
        unitKerja: p?.unitKerja || 'Perpustakaan Nasional RI',
        golRuang: p?.golRuang || 'III/a',
        email: dbUser.email,
        phone: p?.phone || '+62 812 1714 0352',
        avatarUrl: p?.avatarUrl || '',
        birthDate: p?.birthDate ? p.birthDate.toISOString() : undefined,
        education: p?.education || '-',
        careerHistory: p?.careerHistory || '-',
        achievements: p?.achievements || '-',
        bio: p?.bio || '-',
        alamatDomisili:
          'Jalan Imam Bonjol Nomor 1, RT 5/RW 4, Menteng, Kecamatan Menteng, Kota Jakarta Pusat',
        tanggalLahir: p?.birthDate
          ? new Date(p.birthDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : '27 November 1986',
        satuanKerja: p?.position || 'Sistem Informasi',
        eselon2: p?.unitKerja || 'Pusat Sistem Informasi',
        eselon3: 'Bidang Layanan Sistem Informasi',
        lokasiKerja: 'Jl. Medan Merdeka Selatan No. 11, Jakarta 10110',
      };

      return NextResponse.json({ success: true, data: formatted });
    }

    // 2. Lookup in Mock Employees
    const foundMock = MOCK_EMPLOYEES.find(
      (m) =>
        m.id.toLowerCase() === decodedId.toLowerCase() ||
        m.nip.toLowerCase() === decodedId.toLowerCase()
    );

    if (foundMock) {
      const fullData: MockEmployee = {
        ...foundMock,
        alamatDomisili:
          foundMock.alamatDomisili ||
          'Jalan Imam Bonjol Nomor 1, RT 5/RW 4, Menteng, Kecamatan Menteng, Kota Jakarta Pusat',
        tanggalLahir: foundMock.tanggalLahir || '27 November 1986',
        satuanKerja: foundMock.satuanKerja || foundMock.position,
        eselon2: foundMock.eselon2 || foundMock.unitKerja,
        eselon3: foundMock.eselon3 || 'Bidang Layanan ' + foundMock.unitKerja,
        lokasiKerja:
          foundMock.lokasiKerja ||
          'Jl. Medan Merdeka Selatan No. 11, Jakarta 10110',
      };
      return NextResponse.json({ success: true, data: fullData });
    }

    // Default fallback to first mock (Budi Sujatmiko) if id is 'emp-1' or not found
    const defaultEmployee = MOCK_EMPLOYEES[0];
    return NextResponse.json({ success: true, data: defaultEmployee });
  } catch (error: any) {
    console.error('Error fetching single employee:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pegawai' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Attempt update in Prisma
    try {
      const user = await prisma.user.findFirst({
        where: { OR: [{ id }, { nip: id }] },
        include: { profile: true },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: body.fullName || body.name || user.name,
            email: body.email || user.email,
            profile: {
              upsert: {
                create: {
                  nip: body.nip || user.nip,
                  fullName: body.fullName || body.name || user.name,
                  position: body.position || 'Pegawai',
                  unitKerja: body.unitKerja || 'Perpusnas',
                  phone: body.phone,
                  avatarUrl: body.avatarUrl,
                },
                update: {
                  fullName: body.fullName || body.name,
                  position: body.position,
                  unitKerja: body.unitKerja,
                  phone: body.phone,
                  avatarUrl: body.avatarUrl,
                },
              },
            },
          },
        });
      }
    } catch (e) {
      console.warn('DB update failed, returning body:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Data pegawai berhasil diperbarui!',
      data: body,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memperbarui pegawai' },
      { status: 500 }
    );
  }
}
