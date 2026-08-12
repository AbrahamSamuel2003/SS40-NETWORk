import { LegalHero, LegalSummaryBlocks, LegalSidebarLayout, LegalCTA } from "@/components/legal/LegalComponents";
import { termsData } from "@/data/terms";

export const metadata = {
    title: "Terms of Service",
    description: "Read the Terms of Service for using SS40 NETWORK's website, products, and services.",
};

export default function TermsPage() {
    return (
        <div className="w-full flex-col flex bg-white">
            <LegalHero
                title={termsData.title}
                description={termsData.description}
                lastUpdated={termsData.lastUpdated}
            />
            <LegalSummaryBlocks summaries={termsData.summaries} />
            <LegalSidebarLayout sections={termsData.sections} />
            <LegalCTA
                heading={termsData.cta.heading}
                text={termsData.cta.text}
            />
        </div>
    );
}
