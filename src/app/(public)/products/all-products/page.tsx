import { Metadata } from 'next';
import { AllProductsDisplay } from '@/components/products/AllProductsDisplay';

export const metadata: Metadata = {
    title: 'All Products | SS40 NETWORK',
    description: 'Browse the complete suite of innovative products from SS40 NETWORK.',
};

export default function AllProductsPage() {
    return (
        <div className="w-full flex-col flex">
            <AllProductsDisplay />
        </div>
    );
}
