import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import fs from 'fs';
import path from 'path';

const INFO_PENTING_FILE = path.join(process.cwd(), 'src', 'lib', 'info-penting-config.json');

const DEFAULT_CONFIG = {
  headline: 'Pemberitahuan',
  subheadline: 'Gunakan Nomor Induk Pegawai (NIP) resmi dan kata sandi kedinasan Anda. Jangan pernah membagikan kata sandi kepada siapapun demi menjaga integritas data kepegawaian Perpusnas RI.',
  status: 'AKTIF',
  updatedAt: new Date().toISOString(),
  updatedBy: 'Administrator',
};

function getInfoPentingConfig() {
  try {
    if (fs.existsSync(INFO_PENTING_FILE)) {
      const content = fs.readFileSync(INFO_PENTING_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading info penting config:', err);
  }
  return DEFAULT_CONFIG;
}

function saveInfoPentingConfig(data: any) {
  try {
    fs.writeFileSync(INFO_PENTING_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving info penting config:', err);
    return false;
  }
}

export async function GET() {
  const config = getInfoPentingConfig();
  return NextResponse.json({
    success: true,
    data: config,
  });
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { headline, subheadline, status } = body;

    if (!headline || !headline.trim()) {
      return NextResponse.json({ success: false, message: 'Headline pemberitahuan wajib diisi.' }, { status: 400 });
    }

    const currentConfig = getInfoPentingConfig();
    const updatedConfig = {
      ...currentConfig,
      headline: headline.trim(),
      subheadline: (subheadline || '').trim(),
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

    return NextResponse.json({
      success: true,
      message: 'Pemberitahuan berhasil diperbarui!',
      data: updatedConfig,
    });
  } catch (error: any) {
    console.error('Error updating info penting:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
