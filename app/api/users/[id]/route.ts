// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET method to fetch a user by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
    });
    if (user) return NextResponse.json(user);
    else return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT method to update a user by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, email, phone, city } = await request.json();
  try {
    const updatedUser = await prisma.user.update({
      where: { id: String(id) },
      data: { name, email, phone, city },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE method to delete a user by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.user.delete({ where: { id: String(id) } });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
