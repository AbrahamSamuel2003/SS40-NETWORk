import dynamic from "next/dynamic";
import { Hero } from "@/components/digital-solutions/Hero";
import { WhatWeBuild } from "@/components/digital-solutions/WhatWeBuild";

// Dynamically import heavy interactive layers below the fold
const DevelopmentLifecycle = dynamic(() => import("@/components/digital-solutions/DevelopmentLifecycle").then(mod => mod.DevelopmentLifecycle), { ssr: true });
const ClientProjects = dynamic(() => import("@/components/digital-solutions/ClientProjects").then(mod => mod.ClientProjects), { ssr: true });
const Happimonials = dynamic(() => import("@/components/digital-solutions/Happimonials").then(mod => mod.Happimonials), { ssr: true });
const TrustedClients = dynamic(() => import("@/components/digital-solutions/TrustedClients").then(mod => mod.TrustedClients), { ssr: true });
const GetQuote = dynamic(() => import("@/components/digital-solutions/GetQuote").then(mod => mod.GetQuote), { ssr: true });

export default function DigitalSolutionsPage() {
    return (
        <div className="w-full flex-col flex">
            {/* Above the fold (Critical Path) */}
            <Hero />
            <WhatWeBuild />

            {/* Below the fold (Deferred JavaScript Chunks) */}
            <DevelopmentLifecycle />
            <ClientProjects />
            <Happimonials />
            <TrustedClients />
            <GetQuote />
        </div>
    );
}
