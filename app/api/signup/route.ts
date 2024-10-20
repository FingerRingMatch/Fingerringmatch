// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  console.log('API route hit'); // Debug log

  try {
    const body = await request.json();
    console.log('Received data:', body); // Debug log

    const { email, firebaseUid, formData, profilePic } = body;

    if (!email || !firebaseUid || !formData || !profilePic) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        firebaseId: firebaseUid,
        email: email,
        name: formData.name || '',
        dob: new Date(formData.dob),
        gender: formData.gender || '',
        religion: formData.religion || '',
        language: formData.language || '',
        phone: formData.phone || '',
        city: formData.city || '',
        liveWithFamily: formData.liveWithFamily || false,
        familyCity: formData.familyCity || '',
        maritalStatus: formData.maritalStatus || '',
        diet: formData.diet || '',
        height: formData.height || '',
        subCommunity: formData.subCommunity || '',
        qualification: formData.qualification || '',
        collegeName: formData.collegeName || '',
        jobType: formData.jobType || '',
        role: formData.role || '',
        company: formData.company || '',
        incomeRange: formData.incomeRange || '',
        bio: formData.bio || '',
        profilePic: profilePic,
      },
    });

    console.log('User created:', newUser); // Debug log

    return NextResponse.json(
      { message: 'User created successfully', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error); // Debug log
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}