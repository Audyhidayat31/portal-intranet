import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, updateEnvTokens } from '@/lib/gmail';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;text-align:center;">
        <h2 style="color:#dc2626;">Otorisasi Ditolak</h2>
        <p>Google mengembalikan error: ${error}</p>
        <a href="/login">Kembali ke Halaman Utama</a>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 400 }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;text-align:center;">
        <h2 style="color:#dc2626;">Kode Otorisasi Tidak Ditemukan</h2>
        <a href="/api/auth/google/authorize">Coba Lagi</a>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 400 }
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    if (tokens.refreshToken) {
      updateEnvTokens(tokens.refreshToken, tokens.email);
    }

    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>Koneksi Gmail Berhasil</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; padding: 40px; text-align: center; }
          .card { max-width: 540px; margin: 40px auto; background: #ffffff; padding: 36px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .icon { width: 56px; height: 56px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; }
          h2 { margin: 0 0 10px; color: #0f172a; }
          p { color: #64748b; font-size: 14px; line-height: 1.6; }
          .info-box { background: #f1f5f9; padding: 12px 16px; border-radius: 8px; font-size: 13px; text-align: left; margin: 20px 0; word-break: break-all; }
          .btn { display: inline-block; background: #007BFF; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✓</div>
          <h2>Gmail API Berhasil Terhubung!</h2>
          <p>Aplikasi Cakrawala sekarang dapat mengirimkan email tautan atur ulang kata sandi secara otomatis.</p>
          
          <div class="info-box">
            <strong>Email Pengirim:</strong> ${tokens.email || 'Akun Google Terhubung'}<br/>
            <strong>Refresh Token:</strong> ${tokens.refreshToken ? 'Tersimpan otomatis ke .env' : 'Sudah terotorisasi sebelumnya'}
          </div>

          <a href="/lupa-kata-sandi" class="btn">Uji Coba Lupa Kata Sandi</a>
        </div>
      </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('Google callback error:', err);
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;text-align:center;">
        <h2 style="color:#dc2626;">Gagal Menghubungkan Gmail</h2>
        <p>${err.message}</p>
        <a href="/api/auth/google/authorize">Coba Lagi Otorisasi</a>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 500 }
    );
  }
}
