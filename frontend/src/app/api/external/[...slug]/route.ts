// frontend/src/app/api/external/[...slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Misconfiguration: `NEXT_PUBLIC_API_URL` is not defined.");
}

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug ? slug.join('/') : '';
  let fullApiUrl = `${API_URL}/${path}`;

  // Smart Trailing Slash Handling
  const lastSegment = slug && slug.length > 0 ? slug[slug.length - 1] : '';
  
  // Check if it's an ID (numeric)
  const isId = !isNaN(Number(lastSegment)) && lastSegment.trim() !== '';

  if (isId) {
    // If it's an ID (e.g. /tasks/5), remove trailing slash
    if (fullApiUrl.endsWith('/')) {
      fullApiUrl = fullApiUrl.slice(0, -1);
    }
  } else {
    // If it's a collection (e.g. /tasks), force trailing slash
    if (!fullApiUrl.endsWith('/') && !fullApiUrl.includes('?')) {
      fullApiUrl += '/';
    }
  }

  fullApiUrl += req.nextUrl.search;

  const headers = new Headers(req.headers);
  headers.delete('host');

  try {
    const response = await fetch(fullApiUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
      // @ts-ignore
      duplex: 'half',
      redirect: 'manual',
      cache: 'no-store',
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error(`[API PROXY] Error forwarding to ${fullApiUrl}:`, error);
    return NextResponse.json(
      { detail: 'Error connecting to the backend service.' },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, props: any) { return handler(req, props); }
export async function POST(req: NextRequest, props: any) { return handler(req, props); }
export async function PUT(req: NextRequest, props: any) { return handler(req, props); }
export async function DELETE(req: NextRequest, props: any) { return handler(req, props); }
export async function PATCH(req: NextRequest, props: any) { return handler(req, props); }
export async function OPTIONS(req: NextRequest, props: any) { return handler(req, props); }
