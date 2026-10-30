import fs from 'fs';
import path from 'path';

export interface InfoPentingConfig {
  headline: string;
  subheadline: string;
  imageUrl?: string;
  imageName?: string;
  status: string;
  updatedAt?: string;
  updatedBy?: string;
}

const INFO_PENTING_FILE = path.join(process.cwd(), 'src', 'lib', 'info-penting-config.json');

export const DEFAULT_INFO_PENTING: InfoPentingConfig = {
  headline: 'Pemberitahuan',
  subheadline:
    'Diberitahukan kepada seluruh pegawai bahwa sistem portal intranet akan menjalani sinkronisasi berkala setiap hari Jumat pukul 17.00 WIB. Pastikan pekerjaan Anda telah tersimpan.',
  imageUrl: '/images/logo-perpusnas.png',
  imageName: 'logo-perpusnas.png',
  status: 'AKTIF',
  updatedAt: new Date().toISOString(),
  updatedBy: 'Administrator',
};

export function getInfoPentingConfig(): InfoPentingConfig {
  try {
    if (fs.existsSync(INFO_PENTING_FILE)) {
      const content = fs.readFileSync(INFO_PENTING_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        ...DEFAULT_INFO_PENTING,
        ...parsed,
      };
    }
  } catch (err) {
    console.error('Error reading info penting config:', err);
  }
  return DEFAULT_INFO_PENTING;
}

export function saveInfoPentingConfig(data: Partial<InfoPentingConfig>): boolean {
  try {
    const current = getInfoPentingConfig();
    const updated = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(INFO_PENTING_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving info penting config:', err);
    return false;
  }
}
