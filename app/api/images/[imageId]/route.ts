// app/api/images/[imageId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';
import { headers } from 'next/headers';

export async function DELETE(
  req: Request,
  { params }: { params: { imageId: string } }
) {
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

    // Verify token
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const currentUser = decodedToken.uid;

    // Get the image and verify ownership
    const image = await prisma.userImage.findUnique({
      where: { id: params.imageId },
      include: { user: true }
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    if (image.user.firebaseId !== currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not own this image' },
        { status: 403 }
      );
    }

    // Delete from database
    await prisma.userImage.delete({
      where: { id: params.imageId }
    });

    return NextResponse.json({
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
