import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    const where: any = {};
    if (search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { position: { contains: search } },
        { quote: { contains: search } },
        { fullStory: { contains: search } },
        { deskripsi: { contains: search } },
        { unitKerja: { contains: search } },
      ];
    }

    const figures = await prisma.figureProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    let rawMap = new Map<string, any>();
    try {
      const rawFigures: any = await prisma.$queryRawUnsafe(
        'SELECT id, attachmentUrl, attachmentName, coverImageName, status FROM `profil_tokoh`'
      );
      if (Array.isArray(rawFigures)) {
        rawMap = new Map(rawFigures.map((r: any) => [r.id, r]));
      }
    } catch (e) {
      console.warn('Failed to fetch raw profil_tokoh columns in GET list:', e);
    }

    const mapped = figures.map((f) => ({
      ...f,
      ...(rawMap.get(f.id) || {}),
      deskripsi: f.deskripsi || f.fullStory || f.quote || '',
      nama_tokoh: f.name,
    }));
    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat kupas sosok' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      deskripsi,
      position,
      unitKerja,
      quote,
      fullStory,
      photoUrl,
      coverImageName,
      attachmentName,
      attachmentUrl,
      status,
      isSpotlight,
    } = body;

    const descContent = deskripsi || fullStory || quote || '';

    if (!name || (!fullStory && !deskripsi)) {
      return NextResponse.json(
        { success: false, message: 'Nama dan deskripsi wajib diisi' },
        { status: 400 }
      );
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const user = await getCurrentUser();
    const finalPhoto = photoUrl?.trim() && !photoUrl.includes('logo-perpusnas') ? photoUrl : null;
    const authorId = user?.userId || null;
    const authorName = user?.name || 'Administrator Perpusnas';

    const newFigure = await prisma.figureProfile.create({
      data: {
        name,
        slug,
        deskripsi: descContent,
        position: position?.trim() || null,
        unitKerja: unitKerja?.trim() || null,
        quote: (quote && quote !== 'Mendedikasikan karya untuk kemajuan literasi bangsa.') ? quote : (descContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().slice(0, 160) || null),
        fullStory: descContent,
        photoUrl: finalPhoto && finalPhoto.length < 50000 ? finalPhoto : null,
        isSpotlight: Boolean(isSpotlight),
      },
    });

    try {
      await prisma.$executeRawUnsafe(
        `UPDATE \`profil_tokoh\` SET \`photoUrl\` = ?, \`coverImageName\` = ?, \`attachmentName\` = ?, \`attachmentUrl\` = ?, \`status\` = ?, \`authorId\` = ?, \`authorName\` = ?, \`editorId\` = ?, \`editorName\` = ? WHERE \`id\` = ?`,
        finalPhoto,
        coverImageName || null,
        attachmentName || null,
        attachmentUrl || null,
        status || 'TERBIT',
        authorId,
        authorName,
        authorId,
        authorName,
        newFigure.id
      );
    } catch (updateErr) {
      console.warn('Gagal update photoUrl/author profil_tokoh:', updateErr);
    }

    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO \`kupas_sosok\` (\`id\`, \`nama_tokoh\`, \`slug\`, \`deskripsi\`, \`foto_url\`, \`jabatan\`, \`unit_kerja\`, \`lampiran_url\`, \`lampiran_nama\`, \`attachmentUrl\`, \`attachmentName\`, \`created_at\`, \`updated_at\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))
         ON DUPLICATE KEY UPDATE \`nama_tokoh\` = VALUES(\`nama_tokoh\`), \`deskripsi\` = VALUES(\`deskripsi\`), \`foto_url\` = VALUES(\`foto_url\`), \`jabatan\` = VALUES(\`jabatan\`), \`unit_kerja\` = VALUES(\`unit_kerja\`), \`lampiran_url\` = VALUES(\`lampiran_url\`), \`lampiran_nama\` = VALUES(\`lampiran_nama\`), \`attachmentUrl\` = VALUES(\`attachmentUrl\`), \`attachmentName\` = VALUES(\`attachmentName\`)`,
        newFigure.id,
        name,
        slug,
        descContent,
        finalPhoto,
        position?.trim() || null,
        unitKerja?.trim() || null,
        attachmentUrl || null,
        attachmentName || null,
        attachmentUrl || null,
        attachmentName || null
      );
    } catch (err) {
      console.warn('Gagal sinkronisasi kupas_sosok:', err);
    }

    if (user) {
      await logActivity({
        userId: user.userId,
        action: 'CREATE',
        module: 'FIGURE',
        targetId: newFigure.id,
        description: `Menambahkan profil Kupas Sosok baru: ${name}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Profil sosok berhasil ditambahkan!',
      data: {
        ...newFigure,
        photoUrl: finalPhoto,
        authorId,
        authorName,
        editorId: authorId,
        editorName: authorName,
      },
    });
  } catch (error) {
    console.error('Error creating figure profile:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan profil sosok', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
