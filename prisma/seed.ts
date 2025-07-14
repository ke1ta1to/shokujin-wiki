import { PrismaClient } from "@/generated/prisma";
import type { Prisma } from "@/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    authId: "1",
  },
  {
    authId: "2",
  },
  {
    authId: "3",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
