import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { STITCH_MOCK_FIGURES_6 } from '@/lib/mock-kupas-sosok';

function findMockFigure(slug: string) {
  const cleanSlug = slug.toLowerCase();
  return STITCH_MOCK_FIGURES_6.find(
    (m) =>
      m.slug?.toLowerCase() === cleanSlug ||
      m.id?.toLowerCase() === cleanSlug ||
      m.name.toLowerCase().includes(cleanSlug)
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    try {
      let figure = await prisma.figureProfile.findFirst({
        where: {
          OR: [{ slug }, { id: slug }],
        },
      });

      if (!figure) {
        const normalized = slug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const allFigures = await prisma.figureProfile.findMany();
        figure =
          allFigures.find((f) => {
            const fSlugNorm = f.slug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const fNameNorm = f.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return fSlugNorm === normalized || fNameNorm.includes(normalized) || normalized.includes(fSlugNorm);
          }) || null;
      }

      if (figure) {
        let authorName = figure.authorName;
        let editorName = figure.editorName || figure.authorName;

        if (!authorName) {
          const createLog = await prisma.activityLog.findFirst({
            where: { module: 'FIGURE', targetId: figure.id, action: 'CREATE' },
            include: { user: true },
            orderBy: { createdAt: 'asc' },
          });
          if (createLog?.user?.name) {
            authorName = createLog.user.name;
          }
        }

        if (!editorName) {
          const updateLog = await prisma.activityLog.findFirst({
            where: { module: 'FIGURE', targetId: figure.id, action: 'UPDATE' },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
          });
          if (updateLog?.user?.name) {
            editorName = updateLog.user.name;
          } else {
            editorName = authorName;
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            ...figure,
            authorName: authorName || figure.authorName || 'Administrator Perpusnas',
            editorName: editorName || authorName || figure.editorName || 'Administrator Perpusnas',
          },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma findFirst error in figure-profiles GET:', dbErr);
    }

    const mock = findMockFigure(slug);
    if (mock) {
      return NextResponse.json({
        success: true,
        data: {
          id: mock.id,
          name: mock.name,
          slug: mock.slug,
          position: mock.position,
          unitKerja: mock.unitKerja,
          quote: mock.quote,
          fullStory: mock.fullStory,
          photoUrl: mock.photoUrl,
          authorName: mock.authorName || 'Administrator Perpusnas',
          editorName: mock.editorName || mock.authorName || 'Administrator Perpusnas',
          achievements: JSON.stringify(mock.achievements || []),
          careerHistory: JSON.stringify(mock.careerHistory || []),
          isSpotlight: Boolean(mock.isSpotlight),
          createdAt: mock.publishedAt ? new Date(mock.publishedAt).toISOString() : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: false, message: 'Sosok tidak ditemukan' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat profil sosok' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, position, unitKerja, quote, fullStory, photoUrl, isSpotlight } = body;
    const user = await getCurrentUser();

    try {
      const existing = await prisma.figureProfile.findFirst({
        where: {
          OR: [{ slug }, { id: slug }],
        },
      });

      if (existing) {
        const finalPhoto = photoUrl !== undefined ? photoUrl : existing.photoUrl;
        const editorId = user?.userId || existing.editorId || null;
        const editorName = user?.name || existing.editorName || 'Administrator Perpusnas';

        const updated = await prisma.figureProfile.update({
          where: { id: existing.id },
          data: {
            name: name !== undefined ? name : existing.name,
            position: position !== undefined ? position : existing.position,
            unitKerja: unitKerja !== undefined ? unitKerja : existing.unitKerja,
            quote: quote !== undefined ? quote : existing.quote,
            fullStory: fullStory !== undefined ? fullStory : existing.fullStory,
            isSpotlight: isSpotlight !== undefined ? Boolean(isSpotlight) : existing.isSpotlight,
          },
        });

        try {
          await prisma.$executeRawUnsafe(
            `UPDATE \`profil_tokoh\` SET \`photoUrl\` = ?, \`editorId\` = ?, \`editorName\` = ? WHERE \`id\` = ?`,
            finalPhoto,
            editorId,
            editorName,
            existing.id
          );
        } catch (rawErr) {
          console.warn('Raw update in PUT figure failed:', rawErr);
        }

        try {
          await prisma.$executeRawUnsafe(
            `UPDATE \`kupas_sosok\` SET \`nama_tokoh\` = ?, \`foto_url\` = ?, \`jabatan\` = ?, \`unit_kerja\` = ?, \`deskripsi\` = ? WHERE \`id\` = ? OR \`slug\` = ?`,
            name || existing.name,
            finalPhoto,
            position !== undefined ? position : existing.position,
            unitKerja !== undefined ? unitKerja : existing.unitKerja,
            fullStory || existing.fullStory,
            existing.id,
            existing.slug
          );
        } catch (kupasErr) {
          console.warn('Kupas sosok update failed:', kupasErr);
        }

        if (user) {
          await logActivity({
            userId: user.userId,
            action: 'UPDATE',
            module: 'FIGURE',
            targetId: existing.id,
            description: `Memperbarui profil Kupas Sosok: ${updated.name}`,
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Profil sosok berhasil diperbarui!',
          data: {
            ...updated,
            photoUrl: finalPhoto,
            editorId,
            editorName,
          },
        });
      }

      // Upsert mock figure into DB
      const finalPhoto = photoUrl || null;
      const created = await prisma.figureProfile.create({
        data: {
          name: name || 'Profil Sosok',
          slug,
          position: position?.trim() || null,
          unitKerja: unitKerja?.trim() || null,
          quote: (quote && quote !== 'Mendedikasikan karya untuk kemajuan literasi bangsa.') ? quote : ((fullStory || name || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().slice(0, 160) || null),
          fullStory: fullStory || name || '',
          photoUrl: finalPhoto && finalPhoto.length < 50000 ? finalPhoto : null,
          isSpotlight: Boolean(isSpotlight),
        },
      });

      try {
        await prisma.$executeRawUnsafe(
          `UPDATE \`profil_tokoh\` SET \`photoUrl\` = ?, \`authorId\` = ?, \`authorName\` = ?, \`editorId\` = ?, \`editorName\` = ? WHERE \`id\` = ?`,
          finalPhoto,
          user?.userId || null,
          user?.name || 'Administrator Perpusnas',
          user?.userId || null,
          user?.name || 'Administrator Perpusnas',
          created.id
        );
      } catch (rawCreateErr) {
        console.warn('Raw update on mock create failed:', rawCreateErr);
      }

      return NextResponse.json({ success: true, message: 'Profil sosok berhasil diperbarui!', data: created });
    } catch (dbErr) {
      console.warn('Prisma update/create failed in figure-profiles PUT:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Profil sosok berhasil diperbarui',
      data: { slug, name, position, unitKerja, quote, fullStory, photoUrl, isSpotlight },
    });
  } catch (error) {
    console.error('Error updating figure:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui profil sosok' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    try {
      const existing = await prisma.figureProfile.findFirst({
        where: {
          OR: [{ slug }, { id: slug }],
        },
      });

      if (existing) {
        await prisma.figureProfile.delete({ where: { id: existing.id } });

        const user = await getCurrentUser();
        if (user) {
          await logActivity({
            userId: user.userId,
            action: 'DELETE',
            module: 'FIGURE',
            targetId: existing.id,
            description: `Menghapus profil Kupas Sosok: ${existing.name}`,
          });
        }
      }
    } catch (dbErr) {
      console.warn('Prisma delete failed in figure-profiles DELETE:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Profil sosok berhasil dihapus!' });
  } catch (error) {
    console.error('Error deleting figure:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus profil sosok' }, { status: 500 });
  }
}
