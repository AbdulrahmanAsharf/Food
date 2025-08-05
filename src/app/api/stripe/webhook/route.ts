/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/send-email'

// دالة لتحويل stream إلى buffer
async function bufferFromReadableStream(readable: ReadableStream<Uint8Array> | null): Promise<Buffer> {
  if (!readable) return Buffer.from('')
  const reader = readable.getReader()
  const chunks = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }

  return Buffer.concat(chunks)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const rawBody = await bufferFromReadableStream(req.body)
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return new NextResponse('Webhook Error', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    console.log('✅ Stripe checkout.session.completed triggered')

    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata
    if (!metadata) return new NextResponse('No metadata', { status: 400 })

    const cartItems = JSON.parse(metadata.cartItems || '[]')
    const user = JSON.parse(metadata.user || '{}')

    try {
      let dbUser = await db.user.findUnique({
        where: { clerkId: user.clerkId },
      })

      // ✅ إذا المستخدم مش موجود، نحاول إنشاؤه
      if (!dbUser) {
        console.warn('⚠️ User not found, creating new user...')
        dbUser = await db.user.create({
          data: {
            clerkId: user.clerkId,
            email: user.email ,
            name: user.username || '',
            phone: user.phone || '',
            streetAddress: user.streetAddress || '',
            postalCode: user.postalCode || '',
            city: user.city || '',
            country: user.country || '',
             image: user.image || '/default-avatar.png',
          },
        })
        console.log('👤 New user created with ID:', dbUser.id)
      }

      // ✅ إنشاء الطلب
      const newOrder= await db.order.create({
        data: {
          paid: true,
          userId: dbUser.id,
          userEmail: dbUser.email,
          name: dbUser.name || null,
          phone: dbUser.phone || null,
          streetAddress: dbUser.streetAddress || null,
          postalCode: dbUser.postalCode || null,
          city: dbUser.city || null,
          country: dbUser.country || null,
          subTotal: Number(metadata.subTotal),
          deliveryFee: Number(metadata.deliveryFee),
          totalPrice: Number(metadata.totalPrice),
          products: {
            create: cartItems.map((item: any) => ({
              quantity: item.quantity,
              product: { connect: { id: item.productId } },
              user: { connect: { id: dbUser.id } },
            })),
          },
        },
      })
      console.log('✅ Webhook: Order saved successfully:', newOrder.id)

console.log('🔥 Saved order for userId:', dbUser.id)

      await sendOrderConfirmationEmail(dbUser.email, dbUser.name, newOrder.id);


      console.log('🛒 Order saved for:', dbUser.id)
      return NextResponse.json({ received: true })
    } catch (error) {
      console.error('❌ DB Error:', error)
      return new NextResponse('DB Error', { status: 500 })
    }
  }

  return new NextResponse('Unhandled event type', { status: 400 })
}
