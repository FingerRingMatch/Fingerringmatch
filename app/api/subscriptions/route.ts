// app/api/subscriptions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure Prisma is initialized

// GET: Fetch all subscription plans
export async function GET() {
  try {
    const plans = await prisma.subscriptionPlan.findMany();
    return NextResponse.json(plans);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch subscription plans' }, { status: 500 });
  }
}

// POST: Create a new subscription plan
export async function POST(request: Request) {
  const {
    name,
    price,
    duration,
    maxConnections,
    discount,
    originalPrice,
    status,
    orderId,
    razorpayPaymentId,
    razorpaySignature,
  } = await request.json();

  try {
    const newPlan = await prisma.subscriptionPlan.create({
      data: {
        name,
        price,
        duration,
        maxConnections,
        discount,
        originalPrice,
        status,
        orderId,
        razorpayPaymentId,
        razorpaySignature,
      },
    });
    return NextResponse.json(newPlan, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create subscription plan' }, { status: 500 });
  }
}
