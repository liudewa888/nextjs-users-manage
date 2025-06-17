import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const isAdmin = await prisma.Users.findFirst({
    where: { id: session.user.id, role: "1" },
  });

  if (!isAdmin) {
    return NextResponse.json({ error: "没有权限" }, { status: 403 });
  }

  const { uname, password, role } = await request.json();
  try {
    const data = { uname, role };
    if (password) {
      // 生成盐值并哈希密码
      const salt = await bcrypt.genSalt(4); // 盐值复杂度
      const hashedPassword = await bcrypt.hash(password, salt);
      data.password = hashedPassword;
    }
    const user = await prisma.Users.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await prisma.user.findFirst({
    where: { id: session.user.id, role: "ADMIN" },
  });

  if (!isAdmin) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
