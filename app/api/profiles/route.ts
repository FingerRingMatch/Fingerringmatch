import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
}

export async function GET() {
  try {
    // Fetch profiles from the database
    const profiles = await prisma.user.findMany({
      select: {
        id: true,
        firebaseId: true,
        name: true,
        dob: true,
        gender: true,
        religion: true,
        language: true,
        city: true,
        liveWithFamily: true,
        subCommunity: true,
        qualification: true,
        jobType: true,
        role: true,
        company: true,
        incomeRange: true,
        profilePic: true,
      },
    });
    
    if (!profiles) {
      return NextResponse.json({ error: 'No profiles found' }, { status: 404 });
    }

    // Transform the data to include calculated age and format other fields
    const transformedProfiles = profiles.map(profile => ({
      ...profile,
      age: calculateAge(profile.dob),
      income: profile.incomeRange, // Rename incomeRange to income for frontend consistency
      livesWithFamily: profile.liveWithFamily, // Rename to match frontend
      // Convert the date to ISO string for serialization
      dob: profile.dob.toISOString(),
    }));

    return NextResponse.json({ profiles: transformedProfiles });
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' }, 
      { status: 500 }
    );
  }
}