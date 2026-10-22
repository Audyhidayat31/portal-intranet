import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { MOCK_BERITA_6 } from '@/lib/mock-news';

function findMockNews(id: string) {
  return MOCK_BERITA_6.find((item) => item.id === id);
}

function formatMockNews(item: any) {
  return {
    ...item,
    coverImage: item.coverImage || '/images/logo-perpusnas.png',
    content: item.body || item.content || item.excerpt,
    body: item.body || item.content || item.excerpt,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const item = await prisma.content.findFirst({
        where: {
          type: 'NEWS',
          OR: [
            { id },
            { slug: id },
          ],
        },
        include: {
          author: {
            select: {
              name: true,
              nip: true,
              profile: {
                select: {
                  avatarUrl: true,
                  position: true,
                  unitKerja: true,
                },
              },
            },
          },
        },
      });

      if (item) {
        const isWaiting =
          item.status === 'MENUNGGU' ||
          item.status === 'Menunggu' ||
          item.status === 'DRAFT';

        if (isWaiting) {
          const session = await getCurrentUser();
          const isAdmin =
            session?.role?.toUpperCase() === 'ADMINISTRATOR' ||
            session?.role?.toUpperCase() === 'ADMIN';
          const isAuthor = Boolean(session?.userId && item.authorId === session.userId);

          if (!isAdmin && !isAuthor) {
            return NextResponse.json(
              { success: false, message: 'Anda tidak memiliki hak akses untuk melihat berita ini' },
              { status: 403 }
            );
          }
        }

        let editorName = null;
        try {
          const updateLog = await prisma.activityLog.findFirst({
            where: {
              targetId: item.id,
              action: { in: ['UPDATE', 'CHANGE_STATUS'] },
            },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } },
          });
          if (updateLog?.user?.name) {
            editorName = updateLog.user.name;
          }
        } catch (e) {
          // ignore
        }

        const mappedItem = {
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          body: item.body,
          content: item.body,
          coverImage: item.coverImage,
          publishedAt: item.publishedAt,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          status: item.status,
          source: item.source,
          attachmentUrl: item.attachmentUrl,
          attachmentName: item.attachmentName,
          isPinned: item.isPinned,
          viewCount: item.viewCount,
          author: item.author ? {
            name: item.author.name,
            profile: item.author.profile
          } : { name: 'Humas Perpusnas' },
          editor: editorName ? { name: editorName } : null,
          editorName: editorName || null,
        };
        return NextResponse.json({ success: true, data: mappedItem });
      }
    } catch (dbErr) {
      console.warn('Prisma findFirst error in news GET:', dbErr);
    }

    const mock = findMockNews(id);
    if (mock) {
      const isWaiting =
        mock.status === 'Menunggu' ||
        (mock.status as string) === 'MENUNGGU' ||
        (mock as any).status === 'DRAFT';

      if (isWaiting) {
        const session = await getCurrentUser();
        const isAdmin =
          session?.role?.toUpperCase() === 'ADMINISTRATOR' ||
          session?.role?.toUpperCase() === 'ADMIN';
        const isAuthor = Boolean(session?.name && mock.authorName === session.name);

        if (!isAdmin && !isAuthor) {
          return NextResponse.json(
            { success: false, message: 'Anda tidak memiliki hak akses untuk melihat berita ini' },
            { status: 403 }
          );
        }
      }

      return NextResponse.json({ success: true, data: formatMockNews(mock) });
    }

    return NextResponse.json(
      { success: false, message: 'Berita tidak ditemukan' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching news item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat berita' },
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
    const { title, excerpt, content, coverImage, coverImageName, publishedAt, status, attachmentName, attachmentUrl, source } = body;

    try {
      const existing = await prisma.content.findFirst({
        where: {
          type: 'NEWS',
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        const updated = await prisma.content.update({
          where: { id: existing.id },
          data: {
            ...(title && { title: title }),
            ...(excerpt !== undefined && { excerpt: excerpt }),
            ...(content && { body: content }),
            ...(coverImage !== undefined && { coverImage: coverImage }),
            ...(publishedAt && { publishedAt: new Date(publishedAt) }),
            ...(status && { status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT' }),
            ...(attachmentName !== undefined && { attachmentName: attachmentName }),
            ...(attachmentUrl !== undefined && { attachmentUrl: attachmentUrl }),
            ...(source !== undefined && { source: source }),
          },
        });

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
            label: 'Judul Berita',
            old: existing.title,
            new: title,
          });
        }

        if (content !== undefined && content !== existing.body) {
          changes.push({
            field: 'body',
            label: 'Isi Berita',
            old: 'Versi sebelumnya',
            new: 'Diperbarui',
          });
        }

        if (publishedAt) {
          changes.push({
            field: 'publishedAt',
            label: 'Tanggal Terbit',
            old: existing.publishedAt ? existing.publishedAt.toISOString() : '-',
            new: new Date(publishedAt).toISOString(),
          });
        }

        let logDesc = `Mengubah isi Berita: ${title || existing.title}`;
        let logAction: 'UPDATE' | 'CHANGE_STATUS' = 'UPDATE';

        const isOnlyStatusChange = changes.length === 1 && changes[0].field === 'status';
        if (isOnlyStatusChange) {
          logAction = 'CHANGE_STATUS';
          logDesc = `Mengubah status Berita "${existing.title}" menjadi ${newPostStatus === 'TERBIT' ? 'Terbit' : 'Menunggu'}`;
        } else if (changes.some((c) => c.field === 'status')) {
          logDesc = `Mengubah isi & status Berita: ${title || existing.title}`;
        }

        const session = await getCurrentUser();
        const actorId = session?.userId || existing.authorId;

        const finalSource = source !== undefined 
          ? (source?.trim() ? source.trim() : '-')
          : (existing.source?.trim() ? existing.source.trim() : '-');

        const activeCover = coverImage !== undefined ? coverImage : existing.coverImage;
        let finalCoverImageName: string | undefined = undefined;
        if (activeCover) {
          if (coverImageName && typeof coverImageName === 'string' && coverImageName.trim()) {
            finalCoverImageName = coverImageName.trim();
          } else if (!activeCover.startsWith('data:')) {
            const clean = activeCover.split('?')[0].split('#')[0];
            const segments = clean.split('/');
            finalCoverImageName = decodeURIComponent(segments[segments.length - 1]);
          } else {
            const slugName = (title || existing.title || 'sampul').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 35);
            finalCoverImageName = `${slugName}.jpg`;
          }
        }

        await logActivity({
          userId: actorId,
          action: logAction,
          module: 'NEWS',
          targetId: existing.id,
          description: logDesc,
          details: {
            title: title || existing.title,
            category: 'Berita',
            source: finalSource,
            tanggal: (publishedAt ? new Date(publishedAt) : existing.publishedAt || existing.createdAt).toISOString(),
            coverImage: activeCover || null,
            coverImageName: finalCoverImageName,
            attachmentUrl: attachmentUrl || existing.attachmentUrl || null,
            attachmentName: attachmentName || existing.attachmentName || null,
            status: newPostStatus === 'TERBIT' ? 'Terbit' : 'Menunggu',
            changes,
          },
        });

        const editorUser = actorId ? await prisma.user.findUnique({ where: { id: actorId }, select: { name: true } }) : null;
        const currentEditorName = editorUser?.name || session?.name || 'Administrator Perpusnas';

        return NextResponse.json({
          success: true,
          message: 'Berita berhasil diperbarui',
          data: {
            ...updated,
            editor: { name: currentEditorName },
            editorName: currentEditorName,
          },
        });
      }

      // If not existing, try creating it in DB
      const currentUser = await getCurrentUser();
      let authorId;
      if (currentUser) {
        authorId = currentUser.userId;
      } else {
        const defaultUser = await prisma.user.findFirst();
        if (defaultUser) authorId = defaultUser.id;
      }
      
      if (authorId) {
        const created = await prisma.content.create({
          data: {
            id,
            title: title || 'Berita Kedinasan',
            slug: id,
            excerpt: excerpt || '',
            body: content || '',
            coverImage: coverImage || null,
            type: 'NEWS',
            status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT',
            authorId: authorId,
            publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
            attachmentName: attachmentName || null,
            attachmentUrl: attachmentUrl || null,
            source: source || null,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Berita berhasil diperbarui',
          data: created,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma update/create failed in news PUT:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Berita berhasil diperbarui (Mock)' });
  } catch (error) {
    console.error('Error updating news item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui berita' },
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

    try {
      const existing = await prisma.content.findFirst({
        where: {
          type: 'NEWS',
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        await prisma.content.delete({
          where: { id: existing.id },
        });

        const session = await getCurrentUser();
        const actorId = session?.userId || existing.authorId;

        await logActivity({
          userId: actorId,
          action: 'DELETE',
          module: 'NEWS',
          targetId: existing.id,
          description: `Menghapus Berita: ${existing.title}`,
          details: {
            title: existing.title,
            category: 'Berita',
            source: existing.source?.trim() ? existing.source.trim() : '-',
            tanggal: (existing.publishedAt || existing.createdAt).toISOString(),
            coverImage: existing.coverImage || null,
            coverImageName: existing.coverImage
              ? `${existing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 35) || 'sampul'}.jpg`
              : undefined,
            attachmentUrl: existing.attachmentUrl || null,
            attachmentName: existing.attachmentName || null,
            status: existing.status === 'TERBIT' ? 'Terbit' : 'Menunggu',
            deletedAt: new Date().toISOString(),
          },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma delete error in news DELETE:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Berita berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting news item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus berita' },
      { status: 500 }
    );
  }
}
