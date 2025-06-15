import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  // 插入用户数据
  const users = await prisma.Users.createMany({
    data: [{ uname: "liudewa", password: "123123", role: '1' }],
  });

  console.log("Created users:", users);
}

seed()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
