import { Hero } from "@/components/academics/Hero";
import { StudentImpacts } from "@/components/academics/StudentImpacts";
import { BestProjects } from "@/components/academics/BestProjects";
import { Placements } from "@/components/academics/Placements";
import { Collaborations } from "@/components/academics/Collaborations";
import { Collaborate } from "@/components/academics/Collaborate";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "IT Training & Academic Projects in Tirunelveli",
    description: "Master modern web development, AI, and software engineering with industry-grade academic training and final-year student projects at SS40 NETWORK.",
};

// Sub-15ms TTFB: ISR memory caching with 60s background revalidation
export const revalidate = 60;

export default async function AcademicsPage() {
    const studentProjects = await prisma.studentProject.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

    const studentImpactRecords = await prisma.studentImpact.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

    const academicLogos = await prisma.organizationLogo.findMany({
        where: { pageScope: 'ACADEMICS', isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

    return (
        <div className="w-full flex-col flex">
            {/* Above the fold (Critical Path) */}
            <Hero />
            <StudentImpacts impacts={studentImpactRecords} />

            {/* Below the fold */}
            <BestProjects projects={studentProjects} />
            <Placements />
            <Collaborations logos={academicLogos} />
            <Collaborate />
        </div>
    );
}
