import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Створюємо клієнт тільки якщо його ще немає в глобальній пам'яті
if (!globalForPrisma.prisma) {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);

    globalForPrisma.prisma = new PrismaClient({ adapter });
}

// Одразу оголошуємо const, ESLint буде задоволений
const prisma = globalForPrisma.prisma;

export { prisma };
