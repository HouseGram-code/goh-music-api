import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByApiKey } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.nextUrl.searchParams.get('apiKey');
    
    if (!apiKey) {
      // If no API key, create a new user for the demo
      const newUser = createUser();
      return NextResponse.json(newUser);
    }

    const user = getUserByApiKey(apiKey);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('User API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  const newUser = createUser();
  return NextResponse.json(newUser);
}
