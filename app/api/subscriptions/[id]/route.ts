// app/api/subscriptions/[id]/route.ts
import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET: Fetch a subscription plan by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: String(id) },
    });
    if (plan) return NextResponse.json(plan);
    else return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscription plan' }, { status: 500 });
  }
}

// PUT: Update a subscription plan by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, price, duration, maxConnections, discount, originalPrice, status } = await request.json();
  try {
    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id: String(id) },
      data: {
        name,
        price,
        duration,
        maxConnections,
        discount,
        originalPrice,
        status,
      },
    });
    return NextResponse.json(updatedPlan, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update subscription plan' }, { status: 500 });
  }
}

// DELETE: Delete a subscription plan by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.subscriptionPlan.delete({
      where: { id: String(id) },
    });
    return NextResponse.json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete subscription plan' }, { status: 500 });
  }
}
