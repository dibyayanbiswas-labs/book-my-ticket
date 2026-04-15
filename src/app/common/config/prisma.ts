
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!prisma) {
    const url = process.env.DATABASE_URL!;

    if (!url) {
      throw new Error("DATABASE_URL is not defined. Check your .env file.");
    }

    try {
      const adapter = new PrismaPg({ connectionString: url });
      prisma = new PrismaClient({ adapter });
    } catch (error) {
      throw new Error(`Failed to initialize Prisma client: ${error}`);
    }
  }
  return prisma;
}

export default getPrisma();