// app/api/create-order/route.ts

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// Named export for POST method
export async function POST(req: Request) {
  const { amount, currency } = await req.json();

  const options = {
    amount: amount * 100, // Razorpay works with smallest currency unit (paise for INR)
    currency: currency || 'INR',
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Unable to create order' }, { status: 500 });
  }
}
