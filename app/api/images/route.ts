// app/api/images/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth, adminStorage } from '@/lib/firebase-admin';
import { headers } from 'next/headers';

export async function GET() {
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

    // Get images from database
    let images = await prisma.userImage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // If we need to refresh signed URLs
    const bucket = adminStorage.bucket();

    // Update signed URLs if they're expired or about to expire
    images = await Promise.all(
      images.map(async (image) => {
        try {
          if (image.imageUrl) {
            const file = bucket.file(image.imageUrl);
            const [signedUrl] = await file.getSignedUrl({
              action: 'read',
              expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
            });

            // Update the image URL in the database
            const updatedImage = await prisma.userImage.update({
              where: { id: image.id },
              data: { imageUrl: signedUrl },
            });

            return updatedImage;
          }
          return image;
        } catch (error) {
          console.error(`Error refreshing signed URL for image ${image.id}:`, error);
          return image;
        }
      })
    );

    return NextResponse.json({ 
      images,
      message: 'Images fetched successfully' 
    });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
