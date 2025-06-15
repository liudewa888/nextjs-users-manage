import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await prisma.Users.findFirst({
    where: { id: session.user.id, role: 'ADMIN' }
  });

  if (!isAdmin) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  const { email, password, role } = await request.json();

  try {
    const user = await prisma.Users.create({
      data: { email, password, role }
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await prisma.Users.findFirst({
    where: { id: session.user.id, role: '1' }
  });

  if (!isAdmin) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const users = await prisma.Users.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}  