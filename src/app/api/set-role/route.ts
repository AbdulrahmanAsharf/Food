/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/set-role/route.ts
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type');
    console.log('[set-role] contentType:', contentType);

    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid Content-Type' }, { status: 400 });
    }

    const body = await req.json();
    console.log('[set-role] body:', body);

    const { userId } = body;
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid userId' }, { status: 400 });
    }

    console.log('✅ Incoming userId:', userId);

    // ✅ جلب بيانات المستخدم
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    console.log('[set-role] user email:', email);

    if (!email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    // ✅ حدد الدور
    const role = email === 'admin@email.com' ? 'admin' : 'user';

    // ✅ عدّل بيانات المستخدم
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    console.log(`[set-role] Role set to "${role}" for ${email}`);

    // ✅ رجّع الاستجابة
    return NextResponse.json({ success: true, role });
  } catch (err: any) {
    console.error('[set-role] caught error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
