import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the profile' }, { status: 500 });
  }
}
