// app/api/images/upload/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth, adminStorage } from '@/lib/firebase-admin';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Get authorization header
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    // Get and verify the ID token
    const token = authorization.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    const currentUser = decodedToken.uid;

    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Get user from database using Firebase UID
    const user = await prisma.user.findUnique({
      where: { firebaseId: currentUser }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Add file validation
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      const isValidType = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
      ].includes(file.type);
      
      return isValidSize && isValidType;
    });

    if (validFiles.length !== files.length) {
      return NextResponse.json(
        { 
          error: 'Invalid files detected. Files must be images under 5MB.',
          validFiles: validFiles.length,
          totalFiles: files.length
        },
        { status: 400 }
      );
    }

    const uploadPromises = validFiles.map(async (file) => {
      try {
        // Create a unique filename
        const filename = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const bucket = adminStorage.bucket();
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Create a new blob in the bucket
        const blob = bucket.file(`users/${filename}`);
        
        // Upload the file
        await blob.save(fileBuffer, {
          contentType: file.type,
          metadata: {
            metadata: {
              originalName: file.name,
              uploadedBy: user.id
            }
          }
        });

        // Make the file publicly accessible
        await blob.makePublic();

        // Get the public URL
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/users/${filename}`;

        // Save to database
        return prisma.userImage.create({
          data: {
            userId: user.id,
            imageUrl,
          },
        });
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        throw error;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return NextResponse.json({ 
      images: uploadedImages,
      message: 'Images uploaded successfully' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}