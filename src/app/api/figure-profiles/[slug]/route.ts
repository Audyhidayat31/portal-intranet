import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const figure = await prisma.figureProfile.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!figure) {
      return NextResponse.json({ success: false, message: 'Sosok tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: figure });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat profil sosok' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const body = await request.json();
    const { name, position, unitKerja, quote, fullStory, photoUrl, isSpotlight } = body;

    const existing = await prisma.figureProfile.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Sosok tidak ditemukan' }, { status: 404 });
    }

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
  } catch (error) {
    console.error('Error updating figure:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui profil sosok' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const existing = await prisma.figureProfile.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Sosok tidak ditemukan' }, { status: 404 });
    }

    await prisma.figureProfile.delete({ where: { id: existing.id } });

    const user = await getCurrentUser();
    if (user) {
      await logActivity({
        userId: user.userId,
        action: 'DELETE',
        module: 'FIGURE',
        targetId: existing.id,
        description: `Menghapus figur Kupas Sosok: ${existing.name}`,
      });
    }

    return NextResponse.json({ success: true, message: 'Sosok berhasil dihapus!' });
  } catch (error) {
    console.error('Error deleting figure:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus profil sosok' }, { status: 500 });
  }
}
