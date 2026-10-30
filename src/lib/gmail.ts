import fs from 'fs';
import path from 'path';
import nodemailer, { type Transporter } from 'nodemailer';

export interface SendPasswordResetEmailParams {
  toEmail: string;
  recipientName: string;
  resetUrl: string;
}

export function generatePasswordResetHtml({ recipientName, resetUrl }: { recipientName: string; resetUrl: string }): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Atur Ulang Kata Sandi - Cakrawala</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #191c1d;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #3898ec;
      padding: 24px 20px;
      text-align: center;
    }
    .logo-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .logo-img {
      height: 44px;
      width: auto;
      vertical-align: middle;
    }
    .logo-text {
      font-size: 28px;
      font-weight: 700;
      color: #000000;
      letter-spacing: -0.5px;
      margin-left: 10px;
      vertical-align: middle;
    }
    .content {
      padding: 48px 32px;
      text-align: center;
      color: #111111;
    }
    .salutation {
      font-size: 15px;
      color: #111111;
      margin-bottom: 24px;
      font-weight: 400;
    }
    .message {
      font-size: 15px;
      line-height: 1.6;
      color: #111111;
      max-width: 480px;
      margin: 0 auto 36px auto;
    }
    .button-container {
      margin: 32px 0;
    }
    .btn-reset {
      display: inline-block;
      background-color: #007BFF;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      padding: 12px 30px;
      border-radius: 8px;
    }
    .disclaimer {
      font-size: 13px;
      line-height: 1.6;
      color: #111111;
      max-width: 460px;
      margin: 32px auto 0 auto;
    }
    .disclaimer a {
      color: #007BFF;
      text-decoration: underline;
    }
    .footer {
      background-color: #f4f5f7;
      border-top: 1px solid #e2e8f0;
      padding: 16px 20px;
      text-align: center;
      font-size: 12px;
      color: #444444;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo-container">
        <!-- Logo Star Perpusnas SVG / Image -->
        <span class="logo-text">★ Cakrawala</span>
      </div>
    </div>
    
    <div class="content">
      <p class="salutation">Hai ${recipientName || 'Budi Sujatmiko'},</p>
      
      <p class="message">
        Kami telah menerima permintaan Anda untuk mengatur ulang kata sandi akun Cakrawala Portal Intranet anda. Silahkan konfirmasi dengan klik tombol di bawah ini:
      </p>
      
      <div class="button-container">
        <a href="${resetUrl}" class="btn-reset" target="_blank">Atur Ulang Kata Sandi</a>
      </div>
      
      <p class="disclaimer">
        Abaikan email ini jika anda tidak pernah meminta untuk atur ulang kata sandi. Untuk pertanyaan, silakan hubungi kami di <a href="mailto:persuratan@perpusnas.go.id">persuratan@perpusnas.go.id</a>
      </p>
    </div>
    
    <div class="footer">
      © Copyright 2026, All Rights Reserved | Perpustakaan Nasional RI.
    </div>
  </div>
</body>
</html>`;
}

/**
 * Safely get Gmail credentials from environment or fallback to reading .env directly
 */
export function getGmailCredentials() {
  let clientId = process.env.GMAIL_CLIENT_ID || '';
  let clientSecret = process.env.GMAIL_CLIENT_SECRET || '';
  let refreshToken = process.env.GMAIL_REFRESH_TOKEN || '';
  let senderEmail = process.env.GMAIL_SENDER_EMAIL || '';
  let redirectUri = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

  // If any critical key is missing in process.env, read directly from .env file
  if (!refreshToken || !senderEmail || !clientId) {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const matchClientId = envContent.match(/GMAIL_CLIENT_ID=["']?([^"'\r\n]+)["']?/);
        const matchSecret = envContent.match(/GMAIL_CLIENT_SECRET=["']?([^"'\r\n]+)["']?/);
        const matchRefresh = envContent.match(/GMAIL_REFRESH_TOKEN=["']?([^"'\r\n]+)["']?/);
        const matchSender = envContent.match(/GMAIL_SENDER_EMAIL=["']?([^"'\r\n]+)["']?/);
        const matchRedirect = envContent.match(/GMAIL_REDIRECT_URI=["']?([^"'\r\n]+)["']?/);

        if (matchClientId?.[1]) clientId = matchClientId[1];
        if (matchSecret?.[1]) clientSecret = matchSecret[1];
        if (matchRefresh?.[1]) refreshToken = matchRefresh[1];
        if (matchSender?.[1]) senderEmail = matchSender[1];
        if (matchRedirect?.[1]) redirectUri = matchRedirect[1];
      }
    } catch (e) {
      // Ignore read error
    }
  }

  return { clientId, clientSecret, refreshToken, senderEmail, redirectUri };
}

/**
 * Safely get SMTP credentials from environment or fallback to reading .env directly
 */
export function getSmtpCredentials() {
  let host = process.env.SMTP_HOST || '';
  let port = Number(process.env.SMTP_PORT) || 587;
  let user = process.env.SMTP_USER || '';
  let pass = process.env.SMTP_PASS || '';
  let from = process.env.SMTP_FROM || (user ? `Cakrawala Portal Intranet <${user}>` : '');

  // Read directly from .env file if any key is missing
  if (!host || !user || !pass) {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const matchHost = envContent.match(/SMTP_HOST=["']?([^"'\r\n]+)["']?/);
        const matchPort = envContent.match(/SMTP_PORT=["']?([^"'\r\n]+)["']?/);
        const matchUser = envContent.match(/SMTP_USER=["']?([^"'\r\n]+)["']?/);
        const matchPass = envContent.match(/SMTP_PASS=["']?([^"'\r\n]+)["']?/);
        const matchFrom = envContent.match(/SMTP_FROM=["']?([^"'\r\n]+)["']?/);

        if (matchHost?.[1]) host = matchHost[1];
        if (matchPort?.[1]) port = Number(matchPort[1]) || 587;
        if (matchUser?.[1]) user = matchUser[1];
        if (matchPass?.[1]) pass = matchPass[1];
        if (matchFrom?.[1]) from = matchFrom[1];
      }
    } catch {
      // Ignore
    }
  }

  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  return { host, port, secure, user, pass, from };
}

/**
 * Generate Google OAuth Consent URL
 */
export function getGoogleOAuthUrl(): string {
  const { clientId, redirectUri } = getGmailCredentials();
  
  const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange Authorization Code for Refresh and Access Tokens
 */
export async function exchangeCodeForTokens(code: string) {
  const { clientId, clientSecret, redirectUri } = getGmailCredentials();

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'Gagal menukar kode otorisasi Google');
  }

  // Get user's email address
  let email = '';
  try {
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      email = userData.email || '';
    }
  } catch (e) {
    console.error('Error fetching Google userinfo:', e);
  }

  return {
    refreshToken: tokenData.refresh_token,
    accessToken: tokenData.access_token,
    expiresIn: tokenData.expires_in,
    email,
  };
}

/**
 * Save Tokens back into .env file safely
 */
export function updateEnvTokens(refreshToken: string, senderEmail: string) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) return false;

    let envContent = fs.readFileSync(envPath, 'utf8');

    if (refreshToken) {
      if (envContent.includes('GMAIL_REFRESH_TOKEN=')) {
        envContent = envContent.replace(
          /GMAIL_REFRESH_TOKEN=["']?[^"'\r\n]*["']?/,
          `GMAIL_REFRESH_TOKEN="${refreshToken}"`
        );
      } else {
        envContent += `\nGMAIL_REFRESH_TOKEN="${refreshToken}"`;
      }
      process.env.GMAIL_REFRESH_TOKEN = refreshToken;
    }

    if (senderEmail) {
      if (envContent.includes('GMAIL_SENDER_EMAIL=')) {
        envContent = envContent.replace(
          /GMAIL_SENDER_EMAIL=["']?[^"'\r\n]*["']?/,
          `GMAIL_SENDER_EMAIL="${senderEmail}"`
        );
      } else {
        envContent += `\nGMAIL_SENDER_EMAIL="${senderEmail}"`;
      }
      process.env.GMAIL_SENDER_EMAIL = senderEmail;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to update .env with Google Tokens:', err);
    return false;
  }
}

let cachedSmtpTransporter: Transporter | null = null;

function getPooledSmtpTransporter(smtp: ReturnType<typeof getSmtpCredentials>) {
  if (cachedSmtpTransporter) {
    return cachedSmtpTransporter;
  }

  cachedSmtpTransporter = nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    maxMessages: 100,
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 25000,
    greetingTimeout: 25000,
    socketTimeout: 25000,
  });

  return cachedSmtpTransporter;
}

function resetSmtpTransporter() {
  if (cachedSmtpTransporter) {
    try {
      cachedSmtpTransporter.close();
    } catch {}
    cachedSmtpTransporter = null;
  }
}

/**
 * Send Email via SMTP (Primary) or Gmail API (Fallback)
 */
export async function sendPasswordResetEmail({
  toEmail,
  recipientName,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<{ success: boolean; messageId?: string; error?: string; simulated?: boolean; via?: string }> {
  // 1. Try sending via SMTP (mail.go.id / perpusnas.go.id)
  const smtp = getSmtpCredentials();
  if (smtp.host && smtp.user && smtp.pass) {
    const htmlBody = generatePasswordResetHtml({ recipientName, resetUrl });
    const fromAddress = smtp.from || `Cakrawala Portal Intranet <${smtp.user}>`;

    let lastSmtpError: any = null;

    // Retry up to 3 times to handle government gateway greeting timeouts / rate-limiting
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const transporter = getPooledSmtpTransporter(smtp);
        const info = await transporter.sendMail({
          from: fromAddress,
          to: toEmail,
          subject: 'Permintaan Atur Ulang Kata Sandi - Cakrawala Portal Intranet',
          html: htmlBody,
        });

        return {
          success: true,
          messageId: info.messageId,
          via: 'SMTP',
        };
      } catch (smtpError: any) {
        lastSmtpError = smtpError;
        console.warn(`[SMTP SEND ATTEMPT ${attempt} FAILED]:`, smtpError.message);
        resetSmtpTransporter();
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    console.error('[SMTP SEND ALL ATTEMPTS FAILED]:', lastSmtpError);
    // If Gmail API is not configured, return SMTP error directly
    const { clientId, clientSecret, refreshToken } = getGmailCredentials();
    if (!clientId || !clientSecret || !refreshToken) {
      return {
        success: false,
        error: `Gagal mengirim email via SMTP (${smtp.host}): ${lastSmtpError?.message || 'Koneksi ke mail server gagal'}`,
      };
    }
  }

  // 2. Fallback to Gmail API (REST)
  const { clientId, clientSecret, refreshToken, senderEmail: configSender } = getGmailCredentials();
  const senderEmail = configSender || 'persuratan@perpusnas.go.id';

  // Check if refresh token is present
  if (!clientId || !clientSecret || !refreshToken) {
    console.warn(
      `[EMAIL CONFIG WARNING] Baik SMTP maupun Gmail API belum dikonfigurasi dengan lengkap di .env.`
    );
    return {
      success: false,
      simulated: true,
      error: 'Pengiriman email belum siap. Konfigurasi SMTP atau Gmail API belum lengkap di .env.',
    };
  }

  try {
    // 1. Get new access token using refresh token
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

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[GMAIL API ERROR] Refresh token error:', tokenData);
      return {
        success: false,
        error: tokenData.error_description || 'Gagal merefresh access token Google',
      };
    }

    const accessToken = tokenData.access_token;
    const htmlBody = generatePasswordResetHtml({ recipientName, resetUrl });

    // 2. Build RFC 2822 email format
    const subject = 'Permintaan Atur Ulang Kata Sandi - Cakrawala Portal Intranet';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

    const rawEmail = [
      `From: Cakrawala Portal Intranet <${senderEmail}>`,
      `Reply-To: <${senderEmail}>`,
      `To: ${toEmail}`,
      `Subject: ${utf8Subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: base64`,
      ``,
      Buffer.from(htmlBody).toString('base64'),
    ].join('\r\n');

    // 3. Base64url encode for Gmail API
    const base64UrlEmail = Buffer.from(rawEmail)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // 4. Send via Gmail API endpoint
    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: base64UrlEmail,
      }),
    });

    const sendData = await sendRes.json();
    if (!sendRes.ok) {
      console.error('[GMAIL API SEND ERROR]:', sendData);
      return {
        success: false,
        error: sendData.error?.message || 'Gagal mengirim email melalui Gmail API',
      };
    }

    return {
      success: true,
      messageId: sendData.id,
      via: 'GMAIL_API',
    };
  } catch (error: any) {
    console.error('[EMAIL EXCEPTION]:', error);
    return {
      success: false,
      error: error.message || 'Kendala saat mengirim email',
    };
  }
}
