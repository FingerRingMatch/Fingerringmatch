import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'User ID is required and must be a string.' }, { status: 400 });
  }

  try {
    // Count the total number of pending connection requests (both sent and received)
    const pendingRequests = await prisma.connectionRequest.count({
      where: {
        OR: [
          { fromUserId: userId, status: 'pending' }, // Requests sent by the user that are still pending
          { toUserId: userId, status: 'pending' }    // Requests received by the user that are still pending
        ],
      },
    });

    // Count the number of accepted connections
    const totalConnections = await prisma.connectionRequest.count({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId }
        ],
        status: 'accepted'
      },
    });

    // Return the counts
    return NextResponse.json({
      pendingRequests, // Return pendingRequests count
      totalConnections,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
