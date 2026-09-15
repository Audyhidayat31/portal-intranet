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
        { success: false, message: 'ID agenda tidak valid' },
        { status: 400 }
      );
    }

    const item = await prisma.content.findFirst({
      where: {
        type: 'AGENDA',
        OR: [{ id }, { slug: id }],
      },
      include: {
        author: { select: { name: true, nip: true } },
      },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Agenda kegiatan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching agenda detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail agenda' },
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
    const { title, content, body: contentBody, eventLocation, eventStartDate, status } = body;

    const existing = await prisma.content.findFirst({
      where: {
        type: 'AGENDA',
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Agenda kegiatan tidak ditemukan' },
        { status: 404 }
      );
    }

    const updated = await prisma.content.update({
      where: { id: existing.id },
      data: {
        title: title || existing.title,
        body: content || contentBody || existing.body,
        excerpt: (content || contentBody || existing.body).slice(0, 150),
        eventLocation: eventLocation !== undefined ? eventLocation : existing.eventLocation,
        eventStartDate: eventStartDate ? new Date(eventStartDate) : existing.eventStartDate,
        status: status || existing.status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Agenda kegiatan berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating agenda:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui agenda kegiatan' },
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
        type: 'AGENDA',
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Agenda kegiatan tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.content.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Agenda kegiatan berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting agenda:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus agenda kegiatan' },
      { status: 500 }
    );
  }
}
