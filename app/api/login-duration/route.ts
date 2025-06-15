import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
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
    const sessions = await prisma.session.findMany({
      select: {
        expires: true,
        createdAt: true,
        user: { select: { uname: true } }
      }
    });

    const loginDurations = sessions.map(session => ({
      user: session.user.uname,
      duration: Math.floor((new Date(session.expires).getTime() - new Date(session.createdAt).getTime()) / (1000 * 60)) // in minutes
    }));

    return NextResponse.json(loginDurations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch login durations' }, { status: 500 });
  }
}  