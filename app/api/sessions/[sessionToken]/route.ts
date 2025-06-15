import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest, { params }: { params: { sessionToken: string } }) {
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
    await prisma.session.delete({ where: { sessionToken: params.sessionToken } });
    return NextResponse.json({ message: 'Session revoked' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to revoke session' }, { status: 500 });
  }
}  