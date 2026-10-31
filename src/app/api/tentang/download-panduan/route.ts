import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const TENTANG_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'tentang-config.json');

export async function GET() {
  try {
    let fileName = 'Panduan Aplikasi - Cakrawala Portal Intranet_Manual Book.pdf';
    let fileUrl = '';

    if (fs.existsSync(TENTANG_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(TENTANG_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.panduanAplikasi) {
          fileName = parsed.panduanAplikasi;
        }
        if (parsed.panduanAplikasiUrl) {
          fileUrl = parsed.panduanAplikasiUrl;
        }
      } catch (e) {
        console.warn('Failed to parse tentang-config.json:', e);
      }
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    let targetFilePath = path.join(uploadsDir, fileName);

    // If specific file doesn't exist, check default manual book in uploads
    if (!fs.existsSync(targetFilePath)) {
      const defaultManualBookPath = path.join(uploadsDir, 'Panduan Aplikasi - Cakrawala Portal Intranet_Manual Book.pdf');
      if (fs.existsSync(defaultManualBookPath)) {
        targetFilePath = defaultManualBookPath;
      }
    }

    // If file exists on disk, send it as attachment download
    if (fs.existsSync(targetFilePath)) {
      const fileBuffer = fs.readFileSync(targetFilePath);
      const ext = path.extname(fileName).toLowerCase();
      let contentType = 'application/pdf';
      if (ext === '.docx') {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (ext === '.doc') {
        contentType = 'application/msword';
      }

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    // Fallback: create a dynamic basic PDF and return it
    const fallbackBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n188\n%%EOF');

    return new NextResponse(fallbackBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    console.error('Error downloading panduan aplikasi:', err);
    return NextResponse.json({ success: false, message: 'Gagal mendownload panduan aplikasi' }, { status: 500 });
  }
}
