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
      let p: any = dbUser.profile;
      try {
        const rawProfiles: any[] = await prisma.$queryRawUnsafe(
          'SELECT * FROM profil_pegawai WHERE userId = ? OR nip = ? LIMIT 1',
          dbUser.id,
          dbUser.nip
        );
        if (rawProfiles && rawProfiles.length > 0) {
          p = { ...dbUser.profile, ...rawProfiles[0] };
        }
      } catch (rawErr) {
        console.warn('Raw query fallback in GET employee failed:', rawErr);
      }

      const formatted: MockEmployee = {
        id: dbUser.id,
        nip: dbUser.nip || p?.nip || '-',
        name: dbUser.name,
        fullName: p?.fullName || dbUser.name,
        position: p?.position && p.position.trim() ? p.position.trim() : '-',
        unitKerja: p?.unitKerja && p.unitKerja.trim() ? p.unitKerja.trim() : '-',
        golRuang: p?.golRuang && p.golRuang.trim() ? p.golRuang.trim() : '-',
        email: dbUser.email || '-',
        phone: p?.phone && p.phone.trim() ? p.phone.trim() : '-',
        avatarUrl: p?.avatarUrl || '',
        birthDate: p?.birthDate ? p.birthDate.toISOString() : undefined,
        education: p?.education || '-',
        careerHistory: p?.careerHistory || '-',
        achievements: p?.achievements || '-',
        bio: p?.bio || '-',
        alamatDomisili: p?.bio && p.bio.trim() ? p.bio.trim() : '-',
        tanggalLahir: p?.birthDate
          ? new Date(p.birthDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : '-',
        satuanKerja: p?.unitKerja && p.unitKerja.trim() ? p.unitKerja.trim() : '-',
        eselon2: p?.eselon2 && p.eselon2.trim() ? p.eselon2.trim() : '-',
        eselon3: p?.eselon3 && p.eselon3.trim() ? p.eselon3.trim() : '-',
        lokasiKerja: p?.lokasiKerja && p.lokasiKerja.trim() ? p.lokasiKerja.trim() : '-',
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
        alamatDomisili: foundMock.alamatDomisili || foundMock.bio || '-',
        tanggalLahir: foundMock.tanggalLahir || '-',
        satuanKerja: foundMock.satuanKerja || foundMock.unitKerja || '-',
        eselon2: foundMock.eselon2 || '-',
        eselon3: foundMock.eselon3 || '-',
        lokasiKerja: foundMock.lokasiKerja || '-',
      };
      return NextResponse.json({ success: true, data: fullData });
    }

    // Default fallback to first mock (Ahmad Fauzi) if id is 'emp-1' or not found
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
        const valEselon2 = body.eselon2 !== undefined ? (body.eselon2 && body.eselon2.trim() ? body.eselon2.trim() : null) : undefined;
        const valEselon3 = body.eselon3 !== undefined ? (body.eselon3 && body.eselon3.trim() ? body.eselon3.trim() : null) : undefined;
        const valLokasiKerja = body.lokasiKerja !== undefined ? (body.lokasiKerja && body.lokasiKerja.trim() ? body.lokasiKerja.trim() : null) : undefined;

        try {
          await (prisma.user as any).update({
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
                    eselon2: valEselon2 ?? null,
                    eselon3: valEselon3 ?? null,
                    lokasiKerja: valLokasiKerja ?? null,
                  },
                  update: {
                    fullName: body.fullName || body.name,
                    position: body.position,
                    unitKerja: body.unitKerja,
                    phone: body.phone,
                    avatarUrl: body.avatarUrl !== undefined ? (body.avatarUrl ? body.avatarUrl : null) : undefined,
                    eselon2: valEselon2,
                    eselon3: valEselon3,
                    lokasiKerja: valLokasiKerja,
                  },
                },
              },
            },
          });
        } catch (updateErr: any) {
          if (updateErr?.message?.includes('Unknown argument')) {
            await (prisma.user as any).update({
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
                      avatarUrl: body.avatarUrl !== undefined ? (body.avatarUrl ? body.avatarUrl : null) : undefined,
                    },
                  },
                },
              },
            });

            await prisma.$executeRawUnsafe(
              'UPDATE profil_pegawai SET eselon2 = ?, eselon3 = ?, lokasiKerja = ?, updatedAt = NOW() WHERE userId = ?',
              valEselon2 !== undefined ? valEselon2 : null,
              valEselon3 !== undefined ? valEselon3 : null,
              valLokasiKerja !== undefined ? valLokasiKerja : null,
              user.id
            );
          } else {
            throw updateErr;
          }
        }
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
