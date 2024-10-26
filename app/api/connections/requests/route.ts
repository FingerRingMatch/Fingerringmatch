import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromUserId, toUserId } = body;

    if (!fromUserId || !toUserId) {
      return NextResponse.json(
        { error: 'Both fromUserId and toUserId are required' },
        { status: 400 }
      );
    }

    // Fetch the user making the request
    const user = await prisma.user.findUnique({
      where: { 
        id: fromUserId
      },
      include: {
        subscriptionPlan: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if a connection request already exists
    const existingRequest = await prisma.connectionRequest.findFirst({
      where: {
        AND: [
          { fromUserId: fromUserId },
          { toUserId: toUserId },
          { status: 'pending' }
        ]
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Connection request already sent' },
        { status: 400 }
      );
    }

    const currentConnections = user.connectionsMade || 0;
    const maxConnections = user.subscriptionPlan?.maxConnections || 0;

    if (currentConnections >= maxConnections) {
      return NextResponse.json(
        { error: 'Maximum connections reached' },
        { status: 403 }
      );
    }

    // Create the connection request
    const connectionRequest = await prisma.connectionRequest.create({
      data: {
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: 'pending',
      },
    });

    // Increment the connectionsMade count for the user
    await prisma.user.update({
      where: { id: fromUserId },
      data: { connectionsMade: currentConnections + 1 },
    });

    return NextResponse.json(connectionRequest);
    
  } catch (error) {
    console.error('Error sending connection request:', error);
    return NextResponse.json(
      { error: 'Failed to send connection request' },
      { status: 500 }
    );
  }
}