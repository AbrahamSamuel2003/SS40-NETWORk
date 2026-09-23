import { Metadata } from 'next';
import { AllProductsDisplay } from '@/components/products/AllProductsDisplay';

export const metadata: Metadata = {
    title: 'Complete Software & SaaS Product Suite | SS40 NETWORK PRIVATE LIMITED',
    description: 'Browse the complete suite of innovative software products and enterprise tools by SS40 NETWORK PRIVATE LIMITED.',
    alternates: {
        canonical: 'https://ss40network.com/products/all-products',
    },
};

export default function AllProductsPage() {
    return (
        <div className="w-full flex-col flex">
            <AllProductsDisplay />
        </div>
    );
}
