import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { parseLogDescription } from '@/lib/audit';
import { STITCH_MOCK_BUSINESS_TRIPS_5 } from '@/lib/mock-business-trips';
import { STITCH_MOCK_INTERNAL_DOCS_5 } from '@/lib/mock-internal-documents';

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
      take: 150,
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
        details: {
          title: 'Peluncuran Gerakan Literasi Nasional 2026',
          category: 'Berita',
          source: 'www.perpusnas.go.id',
          tanggal: '2026-09-03T11:00:00+07:00',
          coverImage: '/images/hero-banner.jpg',
          coverImageName: 'literasi-nasional-2026.jpg',
          attachmentUrl: '/files/pedoman-literasi.pdf',
          attachmentName: 'Panduan_Gerakan_Literasi_2026.pdf',
          status: 'Terbit',
          publishedAt: '03/09/2026 11:00',
          contentExcerpt: 'Perpustakaan Nasional RI meresmikan program akselerasi literasi berbasis masyarakat...',
        },
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
        details: {
          title: 'Jadwal Pemeliharaan Server Cloud Perpusnas',
          category: 'Pengumuman',
          source: 'Biro SDM dan Umum',
          tanggal: '2026-09-03T12:00:00+07:00',
          coverImage: '/images/logo-perpusnas.png',
          coverImageName: 'pengumuman-server.png',
          attachmentUrl: '/files/edaran-pemeliharaan.pdf',
          attachmentName: 'Surat_Edaran_Pemeliharaan_Server.pdf',
          status: 'Terbit',
          changes: [
            { field: 'Status', label: 'Status Publikasi', old: 'Menunggu', new: 'Terbit' },
            { field: 'Content', label: 'Isi Pengumuman', old: 'Versi draf awal', new: 'Pemberitahuan resmi pemeliharaan terjadwal sistem' },
          ]
        },
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
        description: 'Menghapus Coretan Opini Ahmad Fauzi',
        details: {
          title: 'Transformasi Digital dan Minat Baca Era Modern',
          category: 'Coretan Opini',
          source: '-',
          tanggal: '2026-09-03T13:00:00+07:00',
          coverImage: '/images/avatar-default.png',
          coverImageName: 'ilustrasi-opini-digital.png',
          attachmentUrl: '/files/draf-lengkap-opini.pdf',
          attachmentName: 'Draf_Lengkap_Opini_Ahmad_Fauzi.pdf',
          status: 'Menunggu',
          authorName: 'Ahmad Fauzi, S.Kom.',
        },
        createdAt: new Date('2026-09-03T13:00:00+07:00').toISOString(),
        user: {
          name: 'Ahmad Fauzi',
          nip: '199003202015022003',
          role: { name: 'PEGAWAI' }
        }
      },
      {
        id: 'wf-log-4',
        action: 'CREATE',
        module: 'SPORTS',
        description: 'Menambah Artikel Olahraga',
        details: {
          title: 'Turnamen Tenis Meja Antar-Biro Perpusnas 2026',
          category: 'Olahraga',
          source: 'BAPOR Perpusnas',
          tanggal: '2026-09-03T14:00:00+07:00',
          coverImage: '/images/logo-perpusnas.png',
          coverImageName: 'foto-turnamen-tenis.png',
          attachmentUrl: null,
          attachmentName: null,
          status: 'Terbit',
          publishedAt: '03/09/2026 14:00',
          contentExcerpt: 'Pertandingan persahabatan tenis meja berlangsung meriah mempererat silaturahmi...',
        },
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
        details: {
          title: 'Menjaga Postur Ergonomis Saat Membaca Lama',
          category: 'Tips dan Gaya Hidup',
          source: 'Tim Medis Perpusnas',
          tanggal: '2026-09-03T15:00:00+07:00',
          coverImage: '/images/avatar-default.png',
          coverImageName: 'panduan-ergonomis.png',
          attachmentUrl: null,
          attachmentName: null,
          status: 'Terbit',
          changes: [
            { field: 'Content', label: 'Uraian Artikel', old: 'Tips dasar posisi duduk', new: 'Penambahan panduan peregangan 15 menit dan pencahayaan optimal' }
          ]
        },
        createdAt: new Date('2026-09-03T15:00:00+07:00').toISOString(),
        user: {
          name: 'Slamet Riyadi',
          nip: '198302182008011002',
          role: { name: 'ADMINISTRATOR' }
        }
      }
    ];

    // Synchronize latest attributes (such as source and full body) from live content records
    const targetIds = logs.map((l: any) => l.targetId).filter(Boolean);
    const contentMap = new Map<string, any>();
    const fullContentMap = new Map<string, string>();
    if (targetIds.length > 0) {
      try {
        const [posts, contents, beritas, pengumumans, figures] = await Promise.all([
          prisma.employeePost.findMany({
            where: { id: { in: targetIds } },
            select: {
              id: true,
              body: true,
              title: true,
              coverImage: true,
              categorySlug: true,
              status: true,
              author: { select: { name: true, nip: true } }
            }
          }).catch(() => []),
          prisma.content.findMany({
            where: { id: { in: targetIds } },
            select: {
              id: true,
              body: true,
              source: true,
              title: true,
              coverImage: true,
              attachmentUrl: true,
              attachmentName: true,
              destinationCity: true,
              eventStartDate: true,
              eventEndDate: true,
              eventLocation: true,
              type: true,
              status: true,
              publishedAt: true,
              author: { select: { name: true, nip: true } },
              category: { select: { name: true, slug: true } }
            }
          }).catch(() => []),
          (prisma as any).berita?.findMany({
            where: { id: { in: targetIds } },
            select: { id: true, isi: true, sumber: true, judul: true, gambarSampul: true, fileLampiran: true, namaLampiran: true }
          }).catch(() => []),
          (prisma as any).pengumuman?.findMany({
            where: { id: { in: targetIds } },
            select: { id: true, isi: true, judul: true, fileLampiran: true, namaLampiran: true }
          }).catch(() => []),
          prisma.figureProfile.findMany({
            where: { id: { in: targetIds } },
            select: {
              id: true,
              deskripsi: true,
              fullStory: true,
              quote: true,
              photoUrl: true,
              attachmentUrl: true,
              attachmentName: true,
              name: true,
              position: true,
              unitKerja: true,
            }
          }).catch(() => []),
        ]);

        posts.forEach((p: any) => {
          contentMap.set(p.id, {
            ...p,
            authorName: p.author?.name || null,
          });
          if (p.body) fullContentMap.set(p.id, p.body);
        });
        contents.forEach((c: any) => {
          contentMap.set(c.id, {
            ...c,
            authorName: c.author?.name || null,
            authorNip: c.author?.nip || null,
            categoryName: c.category?.name || null,
          });
          if (c.body) fullContentMap.set(c.id, c.body);
        });
        (beritas || []).forEach((b: any) => {
          contentMap.set(b.id, {
            id: b.id,
            title: b.judul,
            source: b.sumber,
            coverImage: b.gambarSampul,
            attachmentUrl: b.fileLampiran,
            attachmentName: b.namaLampiran,
          });
          if (b.isi) fullContentMap.set(b.id, b.isi);
        });
        (pengumumans || []).forEach((p: any) => {
          contentMap.set(p.id, {
            id: p.id,
            title: p.judul,
            coverImage: null,
            attachmentUrl: p.fileLampiran,
            attachmentName: p.namaLampiran,
          });
          if (p.isi) fullContentMap.set(p.id, p.isi);
        });
        (figures || []).forEach((f: any) => {
          contentMap.set(f.id, {
            id: f.id,
            title: f.name,
            name: f.name,
            position: f.position,
            unitKerja: f.unitKerja,
            quote: f.quote,
            coverImage: f.photoUrl,
            attachmentUrl: f.attachmentUrl,
            attachmentName: f.attachmentName,
          });
          if (f.deskripsi || f.fullStory) fullContentMap.set(f.id, f.deskripsi || f.fullStory);
        });

        // Enrich from mock data if targetId starts with trip- or doc-
        STITCH_MOCK_BUSINESS_TRIPS_5.forEach((t: any) => {
          if (targetIds.includes(t.id)) {
            contentMap.set(t.id, {
              id: t.id,
              title: t.title,
              destinationCity: t.destinationCity,
              source: t.destinationCity?.includes(',') ? t.destinationCity.split(',')[1].trim() : 'Indonesia',
              authorName: t.author?.name,
              attachmentName: t.attachmentName,
              body: t.content || t.body,
              publishedAt: t.publishedAt,
            });
            if (t.content || t.body) fullContentMap.set(t.id, t.content || t.body);
          }
        });

        STITCH_MOCK_INTERNAL_DOCS_5.forEach((d: any) => {
          if (targetIds.includes(d.id)) {
            contentMap.set(d.id, {
              id: d.id,
              title: d.title,
              documentNumber: d.documentNumber,
              categoryName: d.category,
              attachmentName: d.attachmentName,
              body: d.keterangan,
              publishedAt: d.publishedAt,
            });
            if (d.keterangan) fullContentMap.set(d.id, d.keterangan);
          }
        });
      } catch (err) {
        console.warn('Failed to fetch live contents for activity logs sync:', err);
      }
    }

    // Map database logs with synchronized details
    const mappedDbLogs = logs.map((log: any) => {
      const { summary, details } = parseLogDescription(log.description);
      const live = log.targetId ? contentMap.get(log.targetId) : null;

      const finalDetails = details ? { ...details } : {};
      if (finalDetails) {
        if (live) {
          if (live.title && (!finalDetails.title || finalDetails.title === log.description)) finalDetails.title = live.title;
          if (live.destinationCity && !finalDetails.destinationCity) finalDetails.destinationCity = live.destinationCity;
          if (live.kotaTujuan && !finalDetails.kotaTujuan) finalDetails.kotaTujuan = live.kotaTujuan;
          if (live.source && (!finalDetails.source || finalDetails.source === '-')) finalDetails.source = live.source;
          if (live.negaraTujuan && !finalDetails.negaraTujuan) finalDetails.negaraTujuan = live.negaraTujuan;
          if (live.eventStartDate && !finalDetails.eventStartDate) finalDetails.eventStartDate = live.eventStartDate;
          if (live.eventEndDate && !finalDetails.eventEndDate) finalDetails.eventEndDate = live.eventEndDate;
          if (live.eventLocation && !finalDetails.eventLocation) finalDetails.eventLocation = live.eventLocation;
          if (live.authorName && !finalDetails.authorName) finalDetails.authorName = live.authorName;
          if (live.documentNumber && !finalDetails.documentNumber) finalDetails.documentNumber = live.documentNumber;
          if (live.nomorDokumen && !finalDetails.nomorDokumen) finalDetails.nomorDokumen = live.nomorDokumen;
          if (live.categoryName && !finalDetails.categoryName) finalDetails.categoryName = live.categoryName;
          if (live.categorySlug && !finalDetails.categorySlug) finalDetails.categorySlug = live.categorySlug;
          if (live.position && !finalDetails.position) finalDetails.position = live.position;
          if (live.unitKerja && !finalDetails.unitKerja) finalDetails.unitKerja = live.unitKerja;
          if (live.quote && !finalDetails.quote) finalDetails.quote = live.quote;
          if (live.photoUrl && !finalDetails.coverImage) finalDetails.coverImage = live.photoUrl;
          if (live.status && (!finalDetails.status || finalDetails.status === 'TERBIT')) {
            finalDetails.status = live.status === 'MENUNGGU' ? 'Menunggu' : 'Terbit';
          }
        }
        if (live && live.source !== undefined) {
          finalDetails.source = live.source?.trim() ? live.source.trim() : '-';
        } else if (!finalDetails.source || finalDetails.source === 'www.perpusnas.go.id') {
          // If log recorded the old hardcoded default, recheck against live or clean it up
          if (live && !live.source?.trim()) {
            finalDetails.source = '-';
          }
        }

        // Sinkronisasi coverImage dan normalisasi nama berkas gambar agar sesuai
        const effectiveCover = finalDetails.coverImage || live?.coverImage;
        if (effectiveCover) {
          finalDetails.coverImage = effectiveCover;
          const currentImgName = finalDetails.coverImageName?.trim();
          const isGeneric = !currentImgName ||
            currentImgName === 'gambar-sampul-berita.png' ||
            currentImgName === 'gambar-postingan.png' ||
            currentImgName === 'gambar.png' ||
            currentImgName === 'sampul.jpg';

          if (isGeneric) {
            if (!effectiveCover.startsWith('data:')) {
              try {
                const clean = effectiveCover.split('?')[0].split('#')[0];
                const parts = clean.split('/');
                const last = decodeURIComponent(parts[parts.length - 1]);
                if (last && last.length > 2) {
                  finalDetails.coverImageName = last;
                }
              } catch {}
            }
            if (!finalDetails.coverImageName || isGeneric) {
              const itemTitle = finalDetails.title || live?.title || log.description || 'berkas';
              const cleanSlug = itemTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .slice(0, 35) || 'gambar-sampul';
              const ext = effectiveCover.startsWith('data:image/png') ? 'png' : 'jpg';
              finalDetails.coverImageName = `${cleanSlug}.${ext}`;
            }
          }
        }

        // Sinkronisasi lampiran dari live content
        if (live) {
          if (live.attachmentName && (!finalDetails.attachmentName || finalDetails.attachmentName === '-' || finalDetails.attachmentName.startsWith('lampiran-'))) {
            finalDetails.attachmentName = live.attachmentName;
          }
          if (live.attachmentUrl && (!finalDetails.attachmentUrl || finalDetails.attachmentUrl === '-' || finalDetails.attachmentUrl === '#')) {
            finalDetails.attachmentUrl = live.attachmentUrl;
          }
        }

        // Sinkronisasi teks lengkap uraian / deskripsi dari entitas langsung
        const liveFullBody = log.targetId ? fullContentMap.get(log.targetId) : null;
        if (liveFullBody) {
          finalDetails.fullContent = liveFullBody;
          finalDetails.contentExcerpt = liveFullBody;
        }
      }

      return {
        ...log,
        description: summary,
        rawDescription: log.description,
        details: finalDetails,
      };
    });

    const existingDescriptions = new Set(mappedDbLogs.map((l: any) => l.description));
    const combinedLogs = [
      ...mappedDbLogs,
      ...WIREFRAME_SAMPLE_LOGS.filter((w) => !existingDescriptions.has(w.description))
    ];

    return NextResponse.json({ success: true, data: combinedLogs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat log aktivitas' }, { status: 500 });
  }
}
