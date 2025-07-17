// src/app/api/get-role/route.ts
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    console.log('❌ No userId found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata?.role || 'user';

    return NextResponse.json({ role });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to get user role' }, { status: 500 });
  }
}
