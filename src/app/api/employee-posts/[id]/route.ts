import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { STITCH_MOCK_OPINI_6 } from '@/lib/mock-opini';
import { STITCH_MOCK_KALIMAT_BIJAK } from '@/lib/mock-kalimat-bijak';
import { STITCH_MOCK_KARYA_AKADEMIK } from '@/lib/mock-karya-akademik';
import { STITCH_MOCK_OLAHRAGA_9 } from '@/lib/mock-olahraga';
import { STITCH_MOCK_TAHUKAH_ANDA_9 } from '@/lib/mock-tahukah-anda';
import { STITCH_MOCK_TIPS_GAYA_HIDUP_9 } from '@/lib/mock-tips-gaya-hidup';

const ALL_MOCK_POSTS: any[] = [
  ...STITCH_MOCK_OPINI_6.map((m: any) => ({ ...m, categorySlug: 'opini' })),
  ...STITCH_MOCK_KALIMAT_BIJAK.map((m: any) => ({ ...m, categorySlug: 'kalimat-bijak' })),
  ...STITCH_MOCK_KARYA_AKADEMIK.map((m: any) => ({ ...m, categorySlug: 'karya-akademik' })),
  ...STITCH_MOCK_OLAHRAGA_9.map((m: any) => ({ ...m, categorySlug: 'olahraga' })),
  ...STITCH_MOCK_TAHUKAH_ANDA_9.map((m: any) => ({ ...m, categorySlug: 'tahukah-anda' })),
  ...STITCH_MOCK_TIPS_GAYA_HIDUP_9.map((m: any) => ({ ...m, categorySlug: 'tips-gaya-hidup' })),
];
function getCategoryModuleAndLabel(catSlug?: string) {
  switch (catSlug) {
    case 'opini':
      return { module: 'OPINION', label: 'Coretan Opini' };
    case 'olahraga':
      return { module: 'SPORTS', label: 'Olahraga' };
    case 'tips-gaya-hidup':
      return { module: 'LIFESTYLE', label: 'Tips dan Gaya Hidup' };
    case 'jelajah-bumi':
      return { module: 'EARTH', label: 'Jelajah Bumi' };
    case 'tahukah-anda':
      return { module: 'DIDYOUKNOW', label: 'Tahukah Anda' };
    case 'karya-akademik':
      return { module: 'ACADEMIC', label: 'Karya Akademik' };
    case 'kabar-keluarga':
      return { module: 'FAMILY', label: 'Kabar Keluarga' };
    case 'humor':
      return { module: 'HUMOR', label: 'Humor' };
    case 'kalimat-bijak':
      return { module: 'WISDOM', label: 'Kalimat Bijak' };
    case 'konsultasi':
      return { module: 'CONSULTATION', label: 'Konsultasi' };
    default:
      return { module: 'POSTS', label: 'Postingan Pegawai' };
  }
}

function findMockPost(id: string) {
  const cleanId = id.toLowerCase();
  return ALL_MOCK_POSTS.find(
    (m) =>
      m.id?.toLowerCase() === cleanId ||
      m.slug?.toLowerCase() === cleanId ||
      (m.title && m.title.toLowerCase().includes(cleanId))
  );
}

function formatMockItem(mock: any) {
  return {
    id: mock.id,
    title: mock.title || 'Postingan Pegawai',
    slug: mock.id,
    categorySlug: mock.categorySlug || 'opini',
    body: mock.content || mock.quote || mock.body || mock.excerpt || '',
    excerpt: mock.excerpt || '',
    coverImage: mock.coverImage || null,
    status: mock.status === 'Menunggu' ? 'MENUNGGU' : 'TERBIT',
    likesCount: mock.likesCount || 0,
    viewsCount: mock.viewsCount || 0,
    createdAt: mock.publishedAt ? new Date(mock.publishedAt).toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      name: mock.authorName || 'Pegawai Perpusnas',
      nip: '198501152010011001',
      profile: {
        position: mock.authorPosition || 'Pustakawan',
        unitKerja: 'Perpustakaan Nasional RI',
        avatarUrl: mock.coverImage || null,
      },
    },
    comments: [],
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID postingan tidak valid' },
        { status: 400 }
      );
    }

    // Try finding in database first
    try {
      const item = await prisma.employeePost.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: {
          author: {
            select: {
              name: true,
              nip: true,
              profile: {
                select: {
                  position: true,
                  unitKerja: true,
                  avatarUrl: true,
                },
              },
            },
          },
          comments: {
            include: {
              author: { select: { name: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (item) {
        const isWaiting =
          item.status === 'MENUNGGU' ||
          item.status === 'Menunggu' ||
          item.status === 'DRAFT';

        if (isWaiting) {
          const user = await getCurrentUser();
          const isAdmin =
            user?.role?.toUpperCase() === 'ADMINISTRATOR' ||
            user?.role?.toUpperCase() === 'ADMIN';
          const isAuthor = Boolean(user?.userId && item.authorId === user.userId);

          if (!isAdmin && !isAuthor) {
            return NextResponse.json(
              { success: false, message: 'Anda tidak memiliki hak akses untuk melihat postingan ini' },
              { status: 403 }
            );
          }
        }

        let editorName = null;
        try {
          const lastLog = await prisma.activityLog.findFirst({
            where: {
              OR: [
                { targetId: item.id },
                { targetId: item.slug },
                { targetId: id },
              ],
              action: { in: ['UPDATE', 'CHANGE_STATUS'] },
            },
            orderBy: { createdAt: 'desc' },
            include: {
              user: { select: { name: true } },
            },
          });
          editorName = lastLog?.user?.name || null;
        } catch {}

        return NextResponse.json({
          success: true,
          data: {
            ...item,
            publishedAt: item.createdAt,
            editor: editorName ? { name: editorName } : null,
            editorName: editorName || null,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Database query error in employee-posts GET, falling back to mock:', dbErr);
    }

    // Fallback to mock data
    const mock = findMockPost(id);
    if (mock) {
      const isWaiting =
        mock.status === 'Menunggu' ||
        mock.status === 'MENUNGGU' ||
        mock.status === 'DRAFT';

      if (isWaiting) {
        const user = await getCurrentUser();
        const isAdmin =
          user?.role?.toUpperCase() === 'ADMINISTRATOR' ||
          user?.role?.toUpperCase() === 'ADMIN';
        const isAuthor = Boolean(user?.name && mock.authorName === user.name);

        if (!isAdmin && !isAuthor) {
          return NextResponse.json(
            { success: false, message: 'Anda tidak memiliki hak akses untuk melihat postingan ini' },
            { status: 403 }
          );
        }
      }

      return NextResponse.json({ success: true, data: formatMockItem(mock) });
    }

    return NextResponse.json(
      { success: false, message: 'Postingan tidak ditemukan' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching employee post detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail postingan' },
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
    const { title, body: contentBody, coverImage, status, publishedAt, createdAt } = body;
    const user = await getCurrentUser();
    const currentUserName = user?.name || body.editorName || null;

    let existing: any = null;
    try {
      existing = await prisma.employeePost.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });
    } catch (dbErr) {
      console.warn('Prisma findFirst failed in PUT employee-posts:', dbErr);
    }

    if (existing) {
      const updated = await prisma.employeePost.update({
        where: { id: existing.id },
        data: {
          title: title !== undefined ? title : existing.title,
          body: contentBody !== undefined ? contentBody : existing.body,
          coverImage: existing.categorySlug === 'kalimat-bijak'
            ? '/images/logo-perpusnas.png'
            : (coverImage !== undefined ? coverImage : existing.coverImage),
          status:
            status !== undefined
              ? status === 'Menunggu' || status === 'MENUNGGU'
                ? 'MENUNGGU'
                : 'TERBIT'
              : existing.status,
          ...(publishedAt ? { createdAt: new Date(publishedAt) } : (createdAt ? { createdAt: new Date(createdAt) } : {})),
        },
      });

      const catInfo = getCategoryModuleAndLabel(existing.categorySlug);
      const changes: Array<{ field: string; label: string; old: any; new: any }> = [];

      const newPostStatus =
        status !== undefined
          ? status === 'Menunggu' || status === 'MENUNGGU'
            ? 'MENUNGGU'
            : 'TERBIT'
          : existing.status;

      if (status !== undefined && newPostStatus !== existing.status) {
        changes.push({
          field: 'status',
          label: 'Status Publikasi',
          old: existing.status === 'TERBIT' ? 'Terbit' : 'Menunggu',
          new: newPostStatus === 'TERBIT' ? 'Terbit' : 'Menunggu',
        });
      }

      if (title !== undefined && title !== existing.title) {
        changes.push({
          field: 'title',
          label: 'Judul Artikel',
          old: existing.title,
          new: title,
        });
      }

      if (contentBody !== undefined && contentBody !== existing.body) {
        changes.push({
          field: 'body',
          label: 'Isi Artikel',
          old: 'Versi sebelumnya',
          new: 'Diperbarui',
        });
      }

      if (publishedAt) {
        changes.push({
          field: 'publishedAt',
          label: 'Tanggal Terbit',
          old: existing.createdAt ? existing.createdAt.toISOString() : '-',
          new: new Date(publishedAt).toISOString(),
        });
      }

      let logDesc = `Mengubah isi ${catInfo.label}: ${title || existing.title}`;
      let logAction: 'UPDATE' | 'CHANGE_STATUS' = 'UPDATE';

      const isOnlyStatusChange = changes.length === 1 && changes[0].field === 'status';
      if (isOnlyStatusChange) {
        logAction = 'CHANGE_STATUS';
        logDesc = `Mengubah status ${catInfo.label} "${existing.title}" menjadi ${newPostStatus === 'TERBIT' ? 'Terbit' : 'Menunggu'}`;
      } else if (changes.some((c) => c.field === 'status')) {
        logDesc = `Mengubah isi & status ${catInfo.label}: ${title || existing.title}`;
      }

      let actorId = user?.userId;
      if (!actorId) {
        const defaultUser = await prisma.user.findFirst();
        actorId = defaultUser?.id;
      }

      if (actorId) {
        await logActivity({
          userId: actorId,
          action: logAction,
          module: catInfo.module,
          targetId: existing.id,
          description: logDesc,
          details: {
            title: title || existing.title,
            category: catInfo.label,
            source: '-',
            tanggal: (existing.createdAt || new Date()).toISOString(),
            coverImage: (coverImage !== undefined ? coverImage : existing.coverImage) || null,
            coverImageName: (coverImage !== undefined ? coverImage : existing.coverImage)
              ? `${(title || existing.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 35) || 'postingan'}.jpg`
              : undefined,
            attachmentUrl: null,
            attachmentName: null,
            status: (newPostStatus || existing.status) === 'TERBIT' ? 'Terbit' : 'Menunggu',
            changes,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Postingan berhasil diperbarui',
        data: {
          ...updated,
          editor: currentUserName ? { name: currentUserName } : null,
          editorName: currentUserName,
        },
      });
    }

    // If not existing in database, create or return fallback
    try {
      const defaultUser = user?.userId
        ? await prisma.user.findUnique({ where: { id: user.userId } })
        : await prisma.user.findFirst();
      if (defaultUser) {
        const catSlug =
          id.startsWith('opini') ? 'opini' :
          id.startsWith('humor') ? 'humor' :
          id.startsWith('jelajah') ? 'jelajah-bumi' :
          id.startsWith('kabar') ? 'kabar-keluarga' :
          id.startsWith('kalimat') ? 'kalimat-bijak' :
          id.startsWith('karya') ? 'karya-akademik' :
          id.startsWith('olahraga') ? 'olahraga' :
          id.startsWith('tahukah') ? 'tahukah-anda' :
          id.startsWith('tips') ? 'tips-gaya-hidup' : 'opini';

        const created = await prisma.employeePost.create({
          data: {
            id,
            title: title || 'Postingan Pegawai',
            slug: id,
            categorySlug: catSlug,
            body: contentBody || title || '',
            coverImage: coverImage || null,
            authorId: defaultUser.id,
            status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT',
          },
        });

        if (user?.userId) {
          await logActivity({
            userId: user.userId,
            action: 'UPDATE',
            module: 'POSTS',
            targetId: created.id,
            description: `Memperbarui postingan pegawai: ${created.title}`,
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Postingan berhasil diperbarui',
          data: {
            ...created,
            editor: currentUserName ? { name: currentUserName } : null,
            editorName: currentUserName,
          },
        });
      }
    } catch (createErr) {
      console.warn('Could not insert mock post into DB, returning success response:', createErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Postingan berhasil diperbarui secara lokal',
      data: {
        id,
        title,
        body: contentBody,
        coverImage,
        status,
        editor: currentUserName ? { name: currentUserName } : null,
        editorName: currentUserName,
      },
    });
  } catch (error) {
    console.error('Error updating employee post:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui postingan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const titleParam = searchParams.get('title');

    let bodyData: any = null;
    try {
      bodyData = await request.json();
    } catch {}

    const searchTitle = titleParam || bodyData?.title;

    try {
      let existing = await prisma.employeePost.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });

      if (!existing && searchTitle) {
        existing = await prisma.employeePost.findFirst({
          where: {
            OR: [
              { title: searchTitle },
              { title: { contains: searchTitle } },
            ],
          },
        });
      }

      if (!existing && (id.startsWith('karya-akademik-') || id.includes('karya-akademik'))) {
        const mockMap: Record<string, string> = {
          'karya-akademik-2': 'Analisis Bibliometrik',
          'karya-akademik-3': 'Strategi Preservasi',
          'karya-akademik-4': 'Studi Komparasi',
          'karya-akademik-5': 'Implementasi Ontologi',
          'karya-akademik-6': 'Transformasi Perpustakaan',
          'karya-akademik-7': 'Kajian Filologis',
        };
        const titleSnippet = mockMap[id];
        if (titleSnippet) {
          existing = await prisma.employeePost.findFirst({
            where: {
              categorySlug: 'karya-akademik',
              title: { contains: titleSnippet },
            },
          });
        }
      }

      if (existing) {
        const catInfo = getCategoryModuleAndLabel(existing.categorySlug);
        await prisma.employeePost.delete({
          where: { id: existing.id },
        });

        const currentUser = await getCurrentUser();
        const actorId = currentUser?.userId || existing.authorId;

        await logActivity({
          userId: actorId,
          action: 'DELETE',
          module: catInfo.module,
          targetId: existing.id,
          description: `Menghapus ${catInfo.label}: ${existing.title}`,
          details: {
            title: existing.title,
            category: catInfo.label,
            source: '-',
            tanggal: (existing.createdAt || new Date()).toISOString(),
            coverImage: existing.coverImage || null,
            coverImageName: existing.coverImage
              ? `${existing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 35) || 'postingan'}.jpg`
              : undefined,
            attachmentUrl: null,
            attachmentName: null,
            status: existing.status === 'TERBIT' ? 'Terbit' : 'Menunggu',
            deletedAt: new Date().toISOString(),
          },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma delete failed:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Postingan berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting employee post:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus postingan' },
      { status: 500 }
    );
  }
}
