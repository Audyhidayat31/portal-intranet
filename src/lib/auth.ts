import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'perpusnas_intranet_default_secret_key_2026';
const TOKEN_COOKIE_NAME = 'perpusnas_token';

export interface TokenPayload {
  userId: string;
  nip: string;
  name: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<(TokenPayload & { avatarUrl?: string | null; unitKerja?: string | null; position?: string | null }) | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    // Verify user still exists and is ACTIVE with auto-retry
    const user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          role: true,
          profile: true,
        },
      })
    );

    if (!user || user.status !== 'ACTIVE') {
      return null;
    }

    return {
      userId: user.id,
      nip: user.nip,
      name: user.name,
      email: user.email,
      role: user.role.name,
      avatarUrl: user.profile?.avatarUrl,
      unitKerja: user.profile?.unitKerja,
      position: user.profile?.position,
    };
  } catch (error) {
    console.error('getCurrentUser error (graceful fallback to JWT payload):', error);
    return {
      userId: payload.userId,
      nip: payload.nip,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  }
}

export async function getSessionUserFromRequest(request: NextRequest): Promise<TokenPayload | null> {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
