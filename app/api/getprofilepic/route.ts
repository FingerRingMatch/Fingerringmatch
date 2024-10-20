import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Make sure the path to prisma is correct
// Define the GET method
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email) }, // Use email field here
      select: { profilePic: true },
    });

    if (!user || !user.profilePic) {
      return NextResponse.json({ message: 'Profile picture not found' }, { status: 404 });
    }

    return NextResponse.json({ profilePic: user.profilePic }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
