import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const isValidUrl = (url: string | null) => {
    if (!url) return true;
    if (url.startsWith('/')) return true;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const config = await prisma.siteConfig.findFirst();
        if (!config) {
            return NextResponse.json(
                { success: false, error: 'Site configuration not found. Initialization required.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: config }, { status: 200 });
    } catch (error) {
        console.error('Error fetching SiteConfig:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const existing = await prisma.siteConfig.findFirst();
        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Site configuration not found. Initialization required.' },
                { status: 404 }
            );
        }

        const body = await request.json();

        // Destructure only allowed fields
        const {
            companyName,
            legalName,
            logoUrl,
            contactEmail,
            contactPhone,
            whatsappNumber,
            addressText,
            businessHours,
            footerDescription,
            googleMapsIframeUrl,
            urlLinkedin,
            urlYoutube,
            urlInstagram,
            seoDefaultTitle,
            seoDefaultDescription,
            uploadedLogoUrl,
        } = body;

        // Validate required strictly
        const requiredStrings = [
            companyName,
            legalName,
            contactEmail,
            contactPhone,
            whatsappNumber,
            addressText,
            businessHours,
            footerDescription,
            seoDefaultTitle,
            seoDefaultDescription,
        ];

        if (requiredStrings.some((val) => typeof val !== 'string' || val.trim() === '')) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid required fields' },
                { status: 400 }
            );
        }

        if (!isValidEmail(contactEmail)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const urlFields = [
            logoUrl,
            googleMapsIframeUrl,
            urlLinkedin,
            urlYoutube,
            urlInstagram,
        ];

        if (urlFields.some((url) => url && typeof url === 'string' && !isValidUrl(url))) {
            return NextResponse.json(
                { success: false, error: 'Invalid URL format provided' },
                { status: 400 }
            );
        }

        // Attempt to update
        const updatedConfig = await prisma.siteConfig.update({
            where: { id: existing.id },
            data: {
                companyName: companyName.trim(),
                legalName: legalName.trim(),
                logoUrl: logoUrl ? logoUrl.trim() : null,
                contactEmail: contactEmail.trim(),
                contactPhone: contactPhone.trim(),
                whatsappNumber: whatsappNumber.trim(),
                addressText: addressText.trim(),
                businessHours: businessHours.trim(),
                footerDescription: footerDescription.trim(),
                googleMapsIframeUrl: googleMapsIframeUrl ? googleMapsIframeUrl.trim() : null,
                uploadedLogoUrl: uploadedLogoUrl ? uploadedLogoUrl.trim() : null,
                urlLinkedin: urlLinkedin ? urlLinkedin.trim() : null,
                urlYoutube: urlYoutube ? urlYoutube.trim() : null,
                urlInstagram: urlInstagram ? urlInstagram.trim() : null,
                seoDefaultTitle: seoDefaultTitle.trim(),
                seoDefaultDescription: seoDefaultDescription.trim(),
            },
        });

        // Handle extraction safely if headers is bypassed locally depending on mock environments
        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch {
            // fallback
        }

        await logAdminActivity({
            adminId: admin.id,
            action: 'SITE_CONFIG_UPDATED',
            entity: 'SiteConfig',
            entityId: updatedConfig.id.toString(),
            description: 'Global site configuration was updated successfully',
            ipAddress,
            userAgent,
        });

        return NextResponse.json({ success: true, data: updatedConfig }, { status: 200 });
    } catch (error) {
        console.error('Error updating SiteConfig:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
