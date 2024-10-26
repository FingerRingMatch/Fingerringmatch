import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { requestId } = await req.json();

  try {
    // Find the connection request
    const connectionRequest = await prisma.connectionRequest.findUnique({
      where: { id: requestId },
    });

    if (!connectionRequest) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 });
    }

    // Update the request status to accepted
    await prisma.connectionRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    });

    // Optionally, update the connection count of both users here
    const { fromUserId, toUserId } = connectionRequest;

    await prisma.user.updateMany({
      where: { id: { in: [fromUserId, toUserId] } },
      data: { connectionsMade: { increment: 1 } },
    });

    return NextResponse.json({ message: 'Connection request accepted' });
  } catch (error) {
    console.error('Error accepting connection request:', error);
    return NextResponse.json({ error: 'Failed to accept connection request.' }, { status: 500 });
  }
}
