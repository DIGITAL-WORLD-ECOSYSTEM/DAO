import { NextRequest, NextResponse } from 'next/server';
import { Login } from '@asppibra/contracts/http';

const HONO_URL = process.env.NEXT_PUBLIC_API_URL || 'https://staging.app.asppibra.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = Login.Schema.parse(body);

    const honoRes = await fetch(`${HONO_URL}/api/core/identity/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!honoRes.ok) {
      const errJson = await honoRes.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, message: errJson.message || 'Falha na autenticação' },
        { status: honoRes.status }
      );
    }

    const data = await honoRes.json();
    
    // Configura a resposta
    const response = NextResponse.json({ success: true, user: data.user }, { status: 200 });

    // Armazena o Token no Cookie HttpOnly
    response.cookies.set({
      name: 'asppibra_session',
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Error' },
      { status: 500 }
    );
  }
}
