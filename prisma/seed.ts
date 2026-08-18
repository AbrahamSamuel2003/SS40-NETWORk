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

    // Seed default SiteConfig
    const config = await prisma.siteConfig.upsert({
        where: { id: 1 },
        update: {}, // Do nothing if it already exists
        create: {
            id: 1,
            companyName: 'SS40 NETWORK',
            legalName: 'SS40 NETWORK Private Limited',
            contactEmail: 'support@ss40network.com',
            contactPhone: '+91 1234567890',
            whatsappNumber: '+91 1234567890',
            addressText: 'Bangalore, India',
            businessHours: '9:00 AM - 6:00 PM',
            footerDescription: 'Empowering your digital growth.',
            seoDefaultTitle: 'SS40 NETWORK | Tech & Academics',
            seoDefaultDescription: 'Premium digital solutions, IT services, and academics.',
        },
    });

    console.log(`Seed finished. Setup admin account: ${admin.email} and SiteConfig ID: ${config.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
