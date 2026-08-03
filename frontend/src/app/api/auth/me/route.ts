import { NextRequest, NextResponse } from 'next/server';

const HONO_URL = process.env.NEXT_PUBLIC_API_URL || 'https://staging.app.asppibra.com';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('asppibra_session')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const honoRes = await fetch(`${HONO_URL}/api/core/identity/me`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
    });

    const data = await honoRes.json();
    return NextResponse.json(data, { status: honoRes.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('asppibra_session')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const honoRes = await fetch(`${HONO_URL}/api/core/identity/me`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(body)
    });

    const data = await honoRes.json();
    return NextResponse.json(data, { status: honoRes.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
