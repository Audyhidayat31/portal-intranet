import { NextRequest, NextResponse } from 'next/server';
import { getGmailCredentials, sendPasswordResetEmail, getGoogleOAuthUrl } from '@/lib/gmail';

export async function GET() {
  const { clientId, clientSecret, refreshToken, senderEmail } = getGmailCredentials();
  const isConfigured = Boolean(clientId && clientSecret && refreshToken);

  let isTokenValid = false;
  let testError = '';

  if (isConfigured) {
    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });
      const data = await tokenRes.json();
      if (tokenRes.ok && data.access_token) {
        isTokenValid = true;
      } else {
        testError = data.error_description || data.error || 'Token tidak valid';
      }
    } catch (e: any) {
      testError = e.message;
    }
  }

  const authUrl = getGoogleOAuthUrl();

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Status Integrasi Gmail API - Cakrawala</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; padding: 24px 16px; margin: 0; }
    .card { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; }
    .badge-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-error { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    h1 { font-size: 20px; font-weight: 800; margin: 12px 0 6px; color: #0f172a; }
    p { color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 20px; }
    .info-list { background: #f1f5f9; border-radius: 10px; padding: 16px; font-size: 13px; margin-bottom: 24px; text-align: left; }
    .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #475569; }
    .info-val { font-family: monospace; color: #0f172a; word-break: break-all; max-width: 320px; }
    .btn { display: inline-block; background: #007BFF; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: background 0.15s; }
    .btn:hover { background: #0056b3; }
    .btn-outline { background: white; color: #0f172a; border: 1px solid #cbd5e1; margin-left: 8px; }
    .btn-outline:hover { background: #f1f5f9; }
    .test-box { border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px; text-align: left; }
    .input-text { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 13px; box-sizing: border-box; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div>
      ${
        isTokenValid
          ? '<span class="badge badge-success">✓ GMAIL API TERHUBUNG & AKTIF</span>'
          : '<span class="badge badge-error">✕ GMAIL API BELUM TERHUBUNG</span>'
      }
    </div>
    <h1>Status Integrasi Gmail API</h1>
    <p>
      ${
        isTokenValid
          ? 'Gmail API telah siap digunakan untuk mengirimkan email otomatis reset kata sandi ke kotak masuk pengguna.'
          : 'Gmail API memerlukan otorisasi akun Google pengirim agar dapat mengirimkan email tautan secara resmi.'
      }
    </p>

    <div class="info-list">
      <div class="info-row">
        <span class="info-label">Client ID:</span>
        <span class="info-val">${clientId ? clientId.substring(0, 20) + '...' : '(Belum diatur)'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Client Secret:</span>
        <span class="info-val">${clientSecret ? '••••••••' + clientSecret.slice(-4) : '(Belum diatur)'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email Pengirim:</span>
        <span class="info-val">${senderEmail || '(Otomatis mengikuti akun Google pengotorisasi)'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Refresh Token:</span>
        <span class="info-val">${refreshToken ? '✓ Tersimpan di .env' : '✕ Kosong (Perlu Otorisasi)'}</span>
      </div>
      ${testError ? `<div class="info-row"><span class="info-label" style="color:#b91c1c;">Catatan:</span><span class="info-val" style="color:#b91c1c;">${testError}</span></div>` : ''}
    </div>

    <div>
      <a href="${authUrl}" class="btn">
        ${isTokenValid ? 'Hubungkan Ulang Akun Google' : 'Hubungkan Akun Google Pengirim (1-Klik)'}
      </a>
      <a href="/lupa-kata-sandi" class="btn btn-outline">
        Halaman Lupa Kata Sandi
      </a>
    </div>

    ${
      isTokenValid
        ? `
    <div class="test-box">
      <h3 style="font-size: 15px; margin: 0 0 8px;">Kirim Email Percobaan (Uji Coba Pengiriman)</h3>
      <p style="margin-bottom: 12px; font-size: 13px;">Kirim email reset kata sandi uji coba langsung ke email Anda untuk memastikan email masuk ke Inbox Gmail:</p>
      <form action="/api/auth/google/status" method="POST">
        <input type="email" name="testEmail" class="input-text" placeholder="Masukkan alamat email Anda (contoh: budiarga21@gmail.com)" required value="${senderEmail || ''}" />
        <button type="submit" class="btn" style="background:#15803d;">Kirim Email Uji Coba Sekarang</button>
      </form>
    </div>
    `
        : ''
    }
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function POST(request: NextRequest) {
  try {
    let testEmail = '';
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      testEmail = body.testEmail;
    } else {
      const formData = await request.formData();
      testEmail = formData.get('testEmail') as string;
    }

    if (!testEmail || !testEmail.includes('@')) {
      return new NextResponse(
        `<html><body style="font-family:sans-serif;padding:40px;text-align:center;">
          <h2 style="color:#dc2626;">Email Tidak Valid</h2>
          <p>Harap masukkan alamat email yang valid.</p>
          <a href="/api/auth/google/status">Kembali</a>
        </body></html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 400 }
      );
    }

    const origin = request.nextUrl.origin || 'http://localhost:3000';
    const testResetUrl = `${origin}/ganti-kata-sandi?email=${encodeURIComponent(testEmail)}&token=TEST_TOKEN_${Date.now()}`;

    const res = await sendPasswordResetEmail({
      toEmail: testEmail.trim(),
      recipientName: 'Pegawai Penguji',
      resetUrl: testResetUrl,
    });

    if (res.success && !res.simulated) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="utf-8">
          <title>Email Berhasil Terkirim</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 40px; text-align: center; }
            .card { max-width: 500px; margin: 40px auto; background: white; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0; }
            h2 { color: #15803d; margin-top: 0; }
            .btn { display: inline-block; background: #007BFF; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>✓ Email Berhasil Terkirim!</h2>
            <p>Email uji coba telah dikirim ke <strong>${testEmail}</strong> melalui Gmail API.</p>
            <p style="font-size:12px;color:#64748b;">ID Pesan Google: ${res.messageId || '-'}</p>
            <p style="font-size:13px;color:#475569;">Silakan cek kotak masuk (Inbox) atau folder Spam pada akun Gmail Anda.</p>
            <a href="/lupa-kata-sandi" class="btn">Kembali ke Lupa Kata Sandi</a>
          </div>
        </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    } else {
      return new NextResponse(
        `<html><body style="font-family:sans-serif;padding:40px;text-align:center;">
          <h2 style="color:#dc2626;">Gagal Mengirim Email</h2>
          <p>${res.error || 'Terjadi kendala pada Gmail API'}</p>
          <a href="/api/auth/google/status">Kembali ke Status</a>
        </body></html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 500 }
      );
    }
  } catch (error: any) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;text-align:center;">
        <h2 style="color:#dc2626;">Kesalahan Sistem</h2>
        <p>${error.message}</p>
        <a href="/api/auth/google/status">Kembali</a>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 500 }
    );
  }
}
