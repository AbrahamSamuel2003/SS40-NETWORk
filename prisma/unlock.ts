import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/index.js';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'admin123@gmail.com';
    
    try {
        const admin = await prisma.adminUser.update({
            where: { email },
            data: {
                failedLoginAttempts: 0,
                lockUntil: null,
                isActive: true
            }
        });
        console.log(`Successfully unlocked and reset attempts for account: ${admin.email}`);
    } catch (error) {
        console.error("Error unlocking admin user. Make sure your database contains the seeded admin user admin123@gmail.com. Error:", error);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
