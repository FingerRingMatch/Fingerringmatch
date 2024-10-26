import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This will handle requests to /api/messages/[userId]
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params; // Extracting userId from the URL parameters
  const senderId = req.headers.get('senderId'); // Example of getting senderId from headers (or adjust as needed)

  if (!userId || !senderId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId as string, recipientId: userId as string },
          { senderId: userId as string, recipientId: senderId as string },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
