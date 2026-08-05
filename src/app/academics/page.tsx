import { Hero } from "@/components/academics/Hero";
import { StudentImpacts } from "@/components/academics/StudentImpacts";
import { BestProjects } from "@/components/academics/BestProjects";
import { Placements } from "@/components/academics/Placements";
import { Collaborations } from "@/components/academics/Collaborations";
import { Collaborate } from "@/components/academics/Collaborate";

export const metadata = {
    title: "Academics | SS40 NETWORK",
    description: "Empowering the next generation of engineers with real-world skills, industry projects, and career-launching placements.",
};

export default function AcademicsPage() {
    return (
        <div className="w-full flex-col flex">
            <Hero />
            <StudentImpacts />
            <BestProjects />
            <Placements />
            <Collaborations />
            <Collaborate />
        </div>
    );
}
