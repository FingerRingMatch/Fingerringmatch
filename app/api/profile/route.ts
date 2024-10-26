// app/api/profile/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const uid = req.headers.get('uid'); // Get the UID from the request headers

  if (!uid) {
    return NextResponse.json({ message: 'Invalid user UID' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        firebaseId: uid, // Assuming 'firebaseId' is the field in your Prisma schema for Firebase UID
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
