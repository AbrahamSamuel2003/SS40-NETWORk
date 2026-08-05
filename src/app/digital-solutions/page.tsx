import { Hero } from "@/components/digital-solutions/Hero";
import { WhatWeBuild } from "@/components/digital-solutions/WhatWeBuild";
import { DevelopmentLifecycle } from "@/components/digital-solutions/DevelopmentLifecycle";
import { ClientProjects } from "@/components/digital-solutions/ClientProjects";
import { Happimonials } from "@/components/digital-solutions/Happimonials";
import { GetQuote } from "@/components/digital-solutions/GetQuote";

import { TrustedClients } from "@/components/digital-solutions/TrustedClients";

export default function DigitalSolutionsPage() {
    return (
        <div className="w-full flex-col flex">
            <Hero />
            <WhatWeBuild />
            <DevelopmentLifecycle />
            <ClientProjects />
            <Happimonials />
            <TrustedClients />
            <GetQuote />
        </div>
    );
}
