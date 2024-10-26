// app/api/preferences/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import based on your project structure

export async function POST(req: Request) {
  const {
    userId,
    preferredGender,
    minAge,
    maxAge,
    minHeight,
    maxHeight,
    preferredReligion,
    preferredDiet,
  } = await req.json();

  try {
    const preferences = await prisma.preferences.create({
      data: {
        userId,
        preferredGender,
        minAge,
        maxAge,
        minHeight,
        maxHeight,
        preferredReligion,
        preferredDiet,
      },
    });
    return NextResponse.json(preferences, { status: 201 });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
