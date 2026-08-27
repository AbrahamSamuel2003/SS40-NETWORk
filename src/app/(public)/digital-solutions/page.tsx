import type { Metadata } from "next";
import { Hero } from "@/components/digital-solutions/Hero";
import { WhatWeBuild } from "@/components/digital-solutions/WhatWeBuild";
import { DevelopmentLifecycle } from "@/components/digital-solutions/DevelopmentLifecycle";
import { ClientProjects } from "@/components/digital-solutions/ClientProjects";
import { Happimonials } from "@/components/digital-solutions/Happimonials";
import { TrustedClients } from "@/components/digital-solutions/TrustedClients";
import { GetQuote } from "@/components/digital-solutions/GetQuote";

export const metadata: Metadata = {
    title: "Custom Software & Web Development in Tirunelveli",
    description: "Best IT Company in Tirunelveli offering custom software, web applications, mobile apps, AI solutions, and business automation from SS40 NETWORK.",
};

export const revalidate = 60;

export default function DigitalSolutionsPage() {
    return (
        <div className="w-full flex-col flex">
            {/* Above the fold (Critical Path) */}
            <Hero />
            <WhatWeBuild />

            {/* Below the fold (Clean direct imports, 0 preload fragmentation) */}
            <DevelopmentLifecycle />
            <ClientProjects />
            <Happimonials />
            <TrustedClients />
            <GetQuote />
        </div>
    );
}
