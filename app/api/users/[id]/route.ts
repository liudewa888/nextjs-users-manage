import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await prisma.user.findFirst({
    where: { id: session.user.id, role: 'ADMIN' }
  });

  if (!isAdmin) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  const { email, password, role } = await request.json();

  try {
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { email, password, role }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await prisma.user.findFirst({
    where: { id: session.user.id, role: 'ADMIN' }
  });

  if (!isAdmin) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}  