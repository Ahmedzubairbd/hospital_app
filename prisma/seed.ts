import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("Admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Demo Admin",
      email: "admin@example.com",
      role: Role.ADMIN,
      passwordHash,
      emailVerifiedAt: new Date(),
    },
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
