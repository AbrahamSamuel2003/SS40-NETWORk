import dynamic from "next/dynamic";
import { Hero } from "@/components/academics/Hero";
import { StudentImpacts } from "@/components/academics/StudentImpacts";

// Dynamically import heavy interactive layers below the fold
const BestProjects = dynamic(() => import("@/components/academics/BestProjects").then(mod => mod.BestProjects), { ssr: true });
const Placements = dynamic(() => import("@/components/academics/Placements").then(mod => mod.Placements), { ssr: true });
const Collaborations = dynamic(() => import("@/components/academics/Collaborations").then(mod => mod.Collaborations), { ssr: true });
const Collaborate = dynamic(() => import("@/components/academics/Collaborate").then(mod => mod.Collaborate), { ssr: true });

export const metadata = {
    title: "Academics",
    description: "Empowering the next generation of engineers with real-world skills, industry projects, and career-launching placements.",
};

export default function AcademicsPage() {
    return (
        <div className="w-full flex-col flex">
            {/* Above the fold (Critical Path) */}
            <Hero />
            <StudentImpacts />

            {/* Below the fold (Deferred JavaScript Chunks) */}
            <BestProjects />
            <Placements />
            <Collaborations />
            <Collaborate />
        </div>
    );
}
