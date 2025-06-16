import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await prisma.Users.findFirst({
    where: { id: session.user.id, role: "1" },
  });

  if (!isAdmin) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  const { uname, password, role } = await request.json();

  // 生成盐值并哈希密码
  const salt = await bcrypt.genSalt(4); // 盐值复杂度
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.Users.create({
      data: { uname, password: hashedPassword, role },
    });
    return NextResponse.json({ code: 200, msg: "添加成功", data: null });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await prisma.Users.findFirst({
    where: { id: session.user.id, role: "1" },
  });

  if (!isAdmin) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  try {
    const users = await prisma.Users.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
