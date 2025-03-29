import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/logout'];
  
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload  = await verifyToken(token);
    
    if (path === '/login') {
      return NextResponse.redirect(new URL('/collections', request.url));
    }

    const headers = new Headers(request.headers);
    headers.set('x-user-id', payload?.userId as string);
    
    return NextResponse.next({ request: { headers } });
    
  } catch (error) {
    console.error('Error de verificación JWT:', error);
    
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};