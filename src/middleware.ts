import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'experimental-edge';

const apiHitsByIP: Record<string, number> = {};

export function middleware(request: NextRequest) {
    const ipAddress = request.ip;
    console.log(`IP address: ${ipAddress}`);

    if (ipAddress && request.nextUrl.pathname.startsWith('/api')) {
        apiHitsByIP[ipAddress] = (apiHitsByIP[ipAddress] || 0) + 1;
        console.log(`API hits for IP ${ipAddress}: ${apiHitsByIP[ipAddress]}`);
    }

    return NextResponse.next();
}
