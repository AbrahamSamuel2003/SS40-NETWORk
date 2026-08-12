import { LegalHero, LegalSummaryBlocks, LegalSidebarLayout, LegalCTA } from "@/components/legal/LegalComponents";
import { privacyPolicyData } from "@/data/privacy-policy";

export const metadata = {
    title: "Privacy Policy",
    description: "Learn about how we protect and manage your personal information.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="w-full flex-col flex bg-white">
            <LegalHero
                title={privacyPolicyData.title}
                description={privacyPolicyData.description}
                lastUpdated={privacyPolicyData.lastUpdated}
            />
            <LegalSummaryBlocks summaries={privacyPolicyData.summaries} />
            <LegalSidebarLayout sections={privacyPolicyData.sections} />
            <LegalCTA
                heading={privacyPolicyData.cta.heading}
                text={privacyPolicyData.cta.text}
            />
        </div>
    );
}
