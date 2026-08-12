import { LegalHero, LegalSummaryBlocks, LegalSidebarLayout, LegalCTA } from "@/components/legal/LegalComponents";
import { refundPolicyData } from "@/data/refund-policy";

export const metadata = {
    title: "Refund & Cancellation Policy",
    description: "Read our policies on refunds, cancellations, and service commitments for SS40 NETWORK.",
};

export default function RefundPolicyPage() {
    return (
        <div className="w-full flex-col flex bg-white">
            <LegalHero
                title={refundPolicyData.title}
                description={refundPolicyData.description}
                lastUpdated={refundPolicyData.lastUpdated}
            />
            <LegalSummaryBlocks summaries={refundPolicyData.summaries} />
            <LegalSidebarLayout sections={refundPolicyData.sections} />
            <LegalCTA
                heading={refundPolicyData.cta.heading}
                text={refundPolicyData.cta.text}
            />
        </div>
    );
}
