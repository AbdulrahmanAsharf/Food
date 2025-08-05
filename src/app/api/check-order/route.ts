// app/api/check-order/route.ts
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { userId } = await auth()
    console.log("📌 Current Clerk userId:", userId)
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })
    console.log("👤 DB user:", user)
    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const order = await db.order.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { products: true },
    })

    console.log("📦 All recent orders:", order)
    if (!order) {
      return new NextResponse('Order not found', { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('❌ Error in check-order route:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
