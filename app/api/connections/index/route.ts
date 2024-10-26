import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get userId from URL search params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const connectionRequests = await prisma.connectionRequest.findMany({
      where: { 
        toUserId: userId, 
        status: 'pending' 
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
            dob: true,
            city: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ connectionRequests });
    
  } catch (error) {
    console.error('Error fetching connection requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connection requests' },
      { status: 500 }
    );
  }
}

// Handle accept/reject requests
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { requestId, action } = body;

    if (!requestId || !action) {
      return NextResponse.json(
        { error: 'Request ID and action are required' },
        { status: 400 }
      );
    }

    if (action !== 'accept' && action !== 'reject') {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.connectionRequest.update({
      where: { id: requestId },
      data: { status: action === 'accept' ? 'accepted' : 'rejected' },
    });

    return NextResponse.json({ updatedRequest });
    
  } catch (error) {
    console.error('Error updating connection request:', error);
    return NextResponse.json(
      { error: 'Failed to update connection request' },
      { status: 500 }
    );
  }
}