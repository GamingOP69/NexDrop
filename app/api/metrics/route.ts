import { NextResponse } from 'next/server';
import { register } from '@/lib/metrics';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, { status: 200, headers: { 'Content-Type': register.contentType } });
  } catch (e) {
    console.error('Metrics error', e);
    return new NextResponse('Error', { status: 500 });
  }
}
