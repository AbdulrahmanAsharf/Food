// /app/api/create-user/route.ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  const { userId } =await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existingUser = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!existingUser) {
    await db.user.create({
      data: {
        clerkId: userId,
        role: 'USER',
      },
    });
  }

  return NextResponse.json({ success: true });
}
