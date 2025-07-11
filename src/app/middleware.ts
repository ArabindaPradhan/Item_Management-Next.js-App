import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) return NextResponse.next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === 'object' && decoded !== null) {
      const role = (decoded as JwtPayload).role;
      const permissions = (decoded as JwtPayload).permissions || [];

      // Clone the request and override headers
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-role', role);
      requestHeaders.set('x-user-permissions', JSON.stringify(permissions));

      const response = NextResponse.next();
      response.headers.set('x-user-role', role);
      response.headers.set('x-user-permissions', JSON.stringify(permissions));

      return response;
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Invalid token in middleware:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
