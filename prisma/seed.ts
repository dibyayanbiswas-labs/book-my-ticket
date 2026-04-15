import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createHmac, randomBytes } from 'crypto';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding...');

    // seed user
    const salt = randomBytes(32).toString('hex');
    const password = createHmac('sha256', salt).update('password123').digest('hex');

    await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            username: 'testuser',
            email: 'test@example.com',
            password,
            salt,
        }
    });

    console.log('User seeded — email: test@example.com, password: password123');

    // seed 30 seats
    const seats = Array.from({ length: 30 }, (_, i) => ({
        number: i + 1,
        isBooked: false
    }));

    await prisma.seat.createMany({
        data: seats,
        skipDuplicates: true
    });

    console.log('30 seats seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });