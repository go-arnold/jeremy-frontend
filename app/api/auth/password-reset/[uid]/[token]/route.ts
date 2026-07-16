import { NextResponse } from 'next/server';

/**
 * This route handles cases where the backend password reset email 
 * uses a URL pattern like /api/v1/auth/password/reset/confirm/{uid}/{token}/
 * and redirects to the frontend reset-password page.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string; token: string }> }
) {
  const { uid, token } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  return NextResponse.redirect(
    `${appUrl}/auth/reset-password?uid=${uid}&token=${token}`
  );
}
