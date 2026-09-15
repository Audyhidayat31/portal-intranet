import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const topic = await withDbRetry(() =>
      prisma.consultationTopic.findUnique({
        where: { id },
        include: {
          author: { select: { name: true, nip: true } },
          replies: {
            include: {
              author: { select: { name: true, role: { select: { name: true } } } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      })
    );

    if (!topic) {
      return NextResponse.json(
        { success: false, message: 'Konsultasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: topic });
  } catch (error) {
    console.error('Error fetching consultation detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail konsultasi' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { title, question, description, category, status } = body;

    const dataToUpdate: any = {};
    if (title) dataToUpdate.title = title.trim();
    if (question || description)
      dataToUpdate.question = (question || description).trim();
    if (category) {
      dataToUpdate.category =
        category.toUpperCase() === 'PEGAWAI' ? 'KEPEGAWAIAN' : category.toUpperCase();
    }
    if (status) {
      dataToUpdate.status = status === 'Menunggu' ? 'OPEN' : 'ANSWERED';
    }

    const updated = await withDbRetry(() =>
      prisma.consultationTopic.update({
        where: { id },
        data: dataToUpdate,
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Konsultasi berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui konsultasi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await withDbRetry(() =>
      prisma.consultationTopic.delete({
        where: { id },
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Konsultasi berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus konsultasi' },
      { status: 500 }
    );
  }
}
