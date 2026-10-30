import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { getInfoPentingConfig, saveInfoPentingConfig } from '@/lib/info-penting';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET() {
  const config = getInfoPentingConfig();
  return NextResponse.json(
    {
      success: true,
      data: config,
    },
    {
      headers: NO_CACHE_HEADERS,
    }
  );
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { headline, subheadline, status, imageUrl, imageName } = body;

    if (!headline || !headline.trim()) {
      return NextResponse.json({ success: false, message: 'Headline pemberitahuan wajib diisi.' }, { status: 400 });
    }

    const currentConfig = getInfoPentingConfig();
    const updatedConfig = {
      ...currentConfig,
      headline: headline.trim(),
      subheadline: (subheadline || '').trim(),
      imageUrl: imageUrl !== undefined ? imageUrl : (currentConfig.imageUrl || '/images/logo-perpusnas.png'),
      imageName: imageName !== undefined ? imageName : currentConfig.imageName,
      status: status === 'MENUNGGU' ? 'MENUNGGU' : 'AKTIF',
      updatedAt: new Date().toISOString(),
      updatedBy: user.name || 'Administrator',
    };

    const saved = saveInfoPentingConfig(updatedConfig);
    if (!saved) {
      return NextResponse.json({ success: false, message: 'Gagal menyimpan konfigurasi ke berkas server.' }, { status: 500 });
    }

    await logActivity({
      userId: user.userId,
      action: 'UPDATE',
      module: 'HOMEPAGE',
      description: `Administrator memperbarui Pemberitahuan: "${headline}" [${updatedConfig.status}]`,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Pemberitahuan berhasil diperbarui!',
        data: updatedConfig,
      },
      {
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error: any) {
    console.error('Error updating info penting:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
