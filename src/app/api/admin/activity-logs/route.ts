import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const module = searchParams.get('module');

    const where: any = {};
    if (action && action !== 'ALL') where.action = action;
    if (module && module !== 'ALL') where.module = module;

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { 
          select: { 
            name: true, 
            nip: true,
            role: { select: { name: true } }
          } 
        },
      },
    });

    const WIREFRAME_SAMPLE_LOGS = [
      {
        id: 'wf-log-1',
        action: 'CREATE',
        module: 'NEWS',
        description: 'Menambah Berita',
        createdAt: new Date('2026-09-03T11:00:00+07:00').toISOString(),
        user: {
          name: 'Siti Almira',
          nip: '198501152010011001',
          role: { name: 'ADMINISTRATOR' }
        }
      },
      {
        id: 'wf-log-2',
        action: 'UPDATE',
        module: 'ANNOUNCEMENTS',
        description: 'Mengubah isi Pengumuman',
        createdAt: new Date('2026-09-03T12:00:00+07:00').toISOString(),
        user: {
          name: 'Fatimah Azzahra',
          nip: '198704222011012002',
          role: { name: 'ADMINISTRATOR' }
        }
      },
      {
        id: 'wf-log-3',
        action: 'DELETE',
        module: 'OPINION',
        description: 'Menghapus Coretan Opini Budi Sujatmiko',
        createdAt: new Date('2026-09-03T13:00:00+07:00').toISOString(),
        user: {
          name: 'Budi Sujatmiko',
          nip: '199003202015022003',
          role: { name: 'PEGAWAI' }
        }
      },
      {
        id: 'wf-log-4',
        action: 'CREATE',
        module: 'SPORTS',
        description: 'Menambah Artikel Olahraga',
        createdAt: new Date('2026-09-03T14:00:00+07:00').toISOString(),
        user: {
          name: 'Ahmad Maulana',
          nip: '198906142012011005',
          role: { name: 'ADMINISTRATOR' }
        }
      },
      {
        id: 'wf-log-5',
        action: 'UPDATE',
        module: 'LIFESTYLE',
        description: 'Mengubah isi Artikel Tips dan Gaya Hidup',
        createdAt: new Date('2026-09-03T15:00:00+07:00').toISOString(),
        user: {
          name: 'Slamet Riyadi',
          nip: '198302182008011002',
          role: { name: 'ADMINISTRATOR' }
        }
      }
    ];

    // Combine database logs with wireframe logs (avoiding duplicates)
    const existingDescriptions = new Set(logs.map((l: any) => l.description));
    const combinedLogs = [
      ...logs,
      ...WIREFRAME_SAMPLE_LOGS.filter((w) => !existingDescriptions.has(w.description))
    ];

    return NextResponse.json({ success: true, data: combinedLogs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat log aktivitas' }, { status: 500 });
  }
}
