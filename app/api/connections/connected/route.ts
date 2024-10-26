import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/connections/connected
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // First, get all accepted connection requests
    const connections = await prisma.connectionRequest.findMany({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId }
        ],
        status: 'accepted'
      }
    });

    // Then, fetch the complete user data for all connected users
    const formattedConnections = await Promise.all(
      connections.map(async (connection) => {
        // Determine which user ID is the connected user (not the requesting user)
        const connectedUserId = connection.fromUserId === userId 
          ? connection.toUserId 
          : connection.fromUserId;

        // Fetch the complete user data for the connected user
        const connectedUser = await prisma.user.findUnique({
          where: { id: connectedUserId },
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
            dob: true,
            city: true,
            role: true,
            // Add any other user fields you want to include
          }
        });

        return {
          id: connection.id,
          connectedAt: connection.createdAt,
          connectedUser: connectedUser || {
            id: connectedUserId,
            name: 'Unknown User',
            email: '',
          }
        };
      })
    );

    return NextResponse.json({ connections: formattedConnections });

  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}

// DELETE /api/connections/connected
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { connectionId } = body;

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      );
    }

    const updatedConnection = await prisma.connectionRequest.update({
      where: { id: connectionId },
      data: { status: 'removed' },
    });

    return NextResponse.json({ 
      message: 'Connection removed successfully',
      connection: updatedConnection 
    });

  } catch (error) {
    console.error('Error removing connection:', error);
    return NextResponse.json(
      { error: 'Failed to remove connection' },
      { status: 500 }
    );
  }
}