import dynamic from "next/dynamic";
import { Hero } from "@/components/academics/Hero";
import { StudentImpacts } from "@/components/academics/StudentImpacts";

import { prisma } from "@/lib/prisma";

// Dynamically import heavy interactive layers below the fold
const BestProjects = dynamic(() => import("@/components/academics/BestProjects").then(mod => mod.BestProjects), { ssr: true });
const Placements = dynamic(() => import("@/components/academics/Placements").then(mod => mod.Placements), { ssr: true });
const Collaborations = dynamic(() => import("@/components/academics/Collaborations").then(mod => mod.Collaborations), { ssr: true });
const Collaborate = dynamic(() => import("@/components/academics/Collaborate").then(mod => mod.Collaborate), { ssr: true });

export const metadata = {
    title: "Academics",
    description: "Empowering the next generation of engineers with real-world skills, industry projects, and career-launching placements.",
};

export const revalidate = 0; // Dynamic route

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

            {/* Below the fold (Deferred JavaScript Chunks) */}
            <BestProjects projects={studentProjects} />
            <Placements />
            <Collaborations logos={academicLogos} />
            <Collaborate />
        </div>
    );
}
