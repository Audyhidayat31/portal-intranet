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
        { success: false, message: 'ID postingan tidak valid' },
        { status: 400 }
      );
    }

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

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Postingan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
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
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;
    const body = await request.json();
    const { title, body: contentBody, coverImage, status } = body;

    const existing = await prisma.employeePost.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Postingan tidak ditemukan' },
        { status: 404 }
      );
    }

    const updated = await prisma.employeePost.update({
      where: { id: existing.id },
      data: {
        title: title !== undefined ? title : existing.title,
        body: contentBody !== undefined ? contentBody : existing.body,
        coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
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
      message: 'Postingan berhasil diperbarui',
      data: updated,
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
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    const existing = await prisma.employeePost.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Postingan tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.employeePost.delete({
      where: { id: existing.id },
    });

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
