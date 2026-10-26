import { NextResponse } from 'next/server';
import { getGoogleOAuthUrl } from '@/lib/gmail';

export async function GET() {
  const url = getGoogleOAuthUrl();
  return NextResponse.redirect(url);
}
