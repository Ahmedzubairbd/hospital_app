import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("Next@722833", 10);
  await prisma.user.upsert({
    where: { email: "ahmedzubairbd@gmail.com" },
    update: {},
    create: {
      name: "Ahmed Zubair",
      email: "ahmedzubairbd@gmail.com",
      role: Role.ADMIN,
      passwordHash,
      emailVerifiedAt: new Date(),
    },
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});

