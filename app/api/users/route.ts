import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import based on your project's structure

// GET /api/users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        subscriptionPlan: true, // Include the subscription plan details
      },
    });
    return NextResponse.json(users); // Return the users with their subscription plans
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}
