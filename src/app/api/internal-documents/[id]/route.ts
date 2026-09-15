import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID dokumen tidak valid' },
        { status: 400 }
      );
    }

    const item = await prisma.content.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        author: {
          select: {
            name: true,
            nip: true,
            profile: { select: { position: true, unitKerja: true } },
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Dokumen internal tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching internal document detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail dokumen internal' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;
    const body = await request.json();
    const { title, keterangan, attachmentName, status } = body;

    const existing = await prisma.content.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Dokumen internal tidak ditemukan' },
        { status: 404 }
      );
    }

    const updated = await prisma.content.update({
      where: { id: existing.id },
      data: {
        title: title !== undefined ? title : existing.title,
        excerpt: keterangan !== undefined ? keterangan : existing.excerpt,
        body: keterangan !== undefined ? keterangan : existing.body,
        attachmentName: attachmentName !== undefined ? attachmentName : existing.attachmentName,
        status:
          status !== undefined
            ? status === 'Menunggu' || status === 'DRAFT'
              ? 'DRAFT'
              : 'PUBLISHED'
            : existing.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Dokumen internal berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating internal document:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui dokumen internal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    const existing = await prisma.content.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Dokumen internal tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.content.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Dokumen internal berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting internal document:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus dokumen internal' },
      { status: 500 }
    );
  }
}
