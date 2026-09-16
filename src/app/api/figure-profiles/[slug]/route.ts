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
      const figure = await prisma.figureProfile.findFirst({
        where: {
          OR: [{ slug }, { id: slug }],
        },
      });

      if (figure) {
        return NextResponse.json({ success: true, data: figure });
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

    try {
      const existing = await prisma.figureProfile.findFirst({
        where: {
          OR: [{ slug }, { id: slug }],
        },
      });

      if (existing) {
        const updated = await prisma.figureProfile.update({
          where: { id: existing.id },
          data: {
            name: name !== undefined ? name : existing.name,
            position: position !== undefined ? position : existing.position,
            unitKerja: unitKerja !== undefined ? unitKerja : existing.unitKerja,
            quote: quote !== undefined ? quote : existing.quote,
            fullStory: fullStory !== undefined ? fullStory : existing.fullStory,
            photoUrl: photoUrl !== undefined ? photoUrl : existing.photoUrl,
            isSpotlight: isSpotlight !== undefined ? Boolean(isSpotlight) : existing.isSpotlight,
          },
        });

        const user = await getCurrentUser();
        if (user) {
          await logActivity({
            userId: user.userId,
            action: 'UPDATE',
            module: 'FIGURE',
            targetId: existing.id,
            description: `Memperbarui profil Kupas Sosok: ${updated.name}`,
          });
        }

        return NextResponse.json({ success: true, message: 'Profil sosok berhasil diperbarui!', data: updated });
      }

      // Upsert mock figure into DB
      const created = await prisma.figureProfile.create({
        data: {
          name: name || 'Profil Sosok',
          slug,
          position: position || 'Pustakawan & Insan Berprestasi',
          unitKerja: unitKerja || 'Perpustakaan Nasional RI',
          quote: quote || 'Mendedikasikan karya untuk kemajuan literasi bangsa.',
          fullStory: fullStory || name || '',
          photoUrl: photoUrl || null,
          isSpotlight: Boolean(isSpotlight),
        },
      });

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
