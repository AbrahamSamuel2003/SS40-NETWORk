import { prisma } from './src/lib/prisma';

async function main() {
    console.log("Executing raw SQL...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "OrganizationLogo" ADD COLUMN "showTextOnCard" BOOLEAN NOT NULL DEFAULT false;`);
    await prisma.$executeRawUnsafe(`DROP TABLE "User";`);
    await prisma.$executeRawUnsafe(`DROP TYPE "UserRole";`);
    console.log("Migration executed!");
}

main()
    .catch((e) => {
        console.error("Migration failed:", e);
        process.exit(1);
    })
