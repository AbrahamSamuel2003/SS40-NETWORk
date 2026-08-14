import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const config = await prisma.siteConfig.findUnique({
            where: { id: 1 },
            select: {
                id: true,
                companyName: true,
                legalName: true,
                logoUrl: true,
                uploadedLogoUrl: true,
                contactEmail: true,
                contactPhone: true,
                whatsappNumber: true,
                addressText: true,
                businessHours: true,
                footerDescription: true,
                contactSectionImageUrl: true,
                googleMapsIframeUrl: true,
                urlLinkedin: true,
                urlYoutube: true,
                urlInstagram: true,
                seoDefaultTitle: true,
                seoDefaultDescription: true,
            }
        });

        if (!config) {
            return NextResponse.json({ success: false, error: 'Site configuration not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: config }, { status: 200 });
    } catch (error) {
        console.error('Error fetching site configuration:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch site configuration' }, { status: 500 });
    }
}

export async function POST() {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}
