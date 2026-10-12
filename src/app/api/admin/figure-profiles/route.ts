import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const figures = await prisma.figureProfile.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const mapped = figures.map((f) => ({
      ...f,
      deskripsi: f.deskripsi || f.fullStory || f.quote || '',
      nama_tokoh: f.name,
    }));
    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat figur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, deskripsi, position, unitKerja, quote, fullStory, photoUrl, isSpotlight } = body;
    const descContent = deskripsi || fullStory || quote || '';
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const newFigure = await prisma.figureProfile.create({
      data: {
        name,
        slug,
        deskripsi: descContent,
        position: position || 'Insan Perpusnas RI',
        unitKerja: unitKerja || 'Perpustakaan Nasional RI',
        quote: quote || (descContent.length > 120 ? descContent.slice(0, 120) + '...' : descContent),
        fullStory: descContent,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
        isSpotlight: Boolean(isSpotlight),
      },
    });

    // Sinkronisasi ke tabel dedicated kupas_sosok
    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO \`kupas_sosok\` (\`id\`, \`nama_tokoh\`, \`slug\`, \`deskripsi\`, \`created_at\`, \`updated_at\`)
         VALUES (?, ?, ?, ?, NOW(3), NOW(3))
         ON DUPLICATE KEY UPDATE \`nama_tokoh\` = VALUES(\`nama_tokoh\`), \`deskripsi\` = VALUES(\`deskripsi\`)`,
        newFigure.id,
        name,
        slug,
        descContent
      );
    } catch (err) {
      console.warn('Gagal sinkronisasi kupas_sosok:', err);
    }

    await logActivity({
      userId: user.userId,
      action: 'CREATE',
      module: 'FIGURE',
      targetId: newFigure.id,
      description: `Administrator menambahkan figur Kupas Sosok: ${name}`,
    });

    return NextResponse.json({ success: true, message: 'Profil sosok berhasil ditambahkan!', data: newFigure });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menambahkan sosok' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    const deleted = await prisma.figureProfile.delete({ where: { id } });

    try {
      await prisma.$executeRawUnsafe('DELETE FROM `kupas_sosok` WHERE `id` = ?', id);
    } catch (err) {
      console.warn('Gagal menghapus dari kupas_sosok:', err);
    }

    await logActivity({
      userId: user.userId,
      action: 'DELETE',
      module: 'FIGURE',
      targetId: id,
      description: `Administrator menghapus figur Kupas Sosok: ${deleted.name}`,
    });

    return NextResponse.json({ success: true, message: 'Sosok berhasil dihapus!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus sosok' }, { status: 500 });
  }
}
