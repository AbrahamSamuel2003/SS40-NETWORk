import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/index.js';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'admin123@gmail.com';
    const passwordHash = await bcrypt.hash('admin123', 10);

    const admin = await prisma.adminUser.upsert({
        where: { email },
        update: {}, // Do nothing if it already exists to avoid overwriting auth state unnecessarily
        create: {
            email,
            username: 'admin123@gmail.com',
            fullName: 'System Administrator',
            passwordHash,
            isActive: true,
        },
    });

    console.log(`Seed finished. Setup admin account: ${admin.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
