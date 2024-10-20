import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const uid = params.uid;
    if (!uid) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    const updatedProfile = await prisma.user.update({
      where: { firebaseId: uid },
      data: {
        city: data.city,
        liveWithFamily: data.liveWithFamily,
        familyCity: data.familyCity,
        maritalStatus: data.maritalStatus,
        diet: data.diet,
        height: data.height,
        subCommunity: data.subCommunity,
        qualification: data.qualification,
        collegeName: data.collegeName,
        jobType: data.jobType,
        role: data.role,
        company: data.company,
        incomeRange: data.incomeRange,
        bio: data.bio,
        profilePic: data.profilePicUrl,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    
    // Check if error is due to record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}