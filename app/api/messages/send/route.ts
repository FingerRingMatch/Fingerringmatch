import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const { senderId, recipientId, content } = await request.json();

  if (!senderId || !recipientId || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        content,
      },
    });

    // Emit through the socket emit endpoint
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    await fetch(`${protocol}://${host}/api/socket/emit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'newMessage',
        senderId,
        recipientId,
        message,
      }),
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}