/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/prisma'; // تأكد إن المسار صحيح

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartItems, user, subTotal, deliveryFee, totalPrice } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // ✅ تأكد من وجود المستخدم في قاعدة البيانات
    let dbUser = await db.user.findUnique({
  where: { clerkId: user.id },
});

// 👇 لو مش لاقيه بالـ clerkId، جرب تدور عليه بالـ email
if (!dbUser) {
  dbUser = await db.user.findUnique({
    where: { email: user.email },
  });
}

// 👇 لو لسه مش موجود، ساعتها اعمله إنشاء
if (!dbUser) {
  dbUser = await db.user.create({
    data: {
      clerkId: user.id,
      email: user.email,
      name: user.username,
      phone: user.phone || '',
      streetAddress: user.streetAddress || '',
      postalCode: user.postalCode || '',
      city: user.city || '',
      country: user.country || '',
      image: '/default-avatar.png',
    },
  });
}


   

    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    console.log("📦 User info before session:", dbUser);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      metadata: {
        cartItems: JSON.stringify(cartItems.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
        }))),
       user: JSON.stringify({
    clerkId: dbUser.clerkId,
    email: dbUser.email,
    username: dbUser.name || '',
    phone: dbUser.phone || '',
    streetAddress: dbUser.streetAddress || '',
    postalCode: dbUser.postalCode || '',
    city: dbUser.city || '',
    country: dbUser.country || '',
    image: dbUser.image || '',
  }),
        subTotal: String(subTotal),
        deliveryFee: String(deliveryFee),
        totalPrice: String(totalPrice),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
