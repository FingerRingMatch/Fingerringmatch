import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function PUT(request: Request) {
  try {
    const uid = request.headers.get('uid');
    if (!uid) {
      return NextResponse.json(
        { error: 'UID is required in headers' },
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
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}