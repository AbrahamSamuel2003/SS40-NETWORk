import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendLeadAcknowledgementEmail, sendAdminNewLeadNotificationEmail } from '@/lib/mail';

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            fullName,
            email,
            phone,
            company,
            serviceInterest,
            message,
            source,
            sourcePage,
            landingPage,
            referrer
        } = body;

        // Validation for required fields
        if (
            !fullName || typeof fullName !== 'string' || fullName.trim() === '' ||
            !email || typeof email !== 'string' || email.trim() === '' ||
            !phone || typeof phone !== 'string' || phone.trim() === '' ||
            !serviceInterest || typeof serviceInterest !== 'string' || serviceInterest.trim() === '' ||
            !message || typeof message !== 'string' || message.trim() === ''
        ) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid required fields' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) {
            return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
        }

        const newLead = await prisma.lead.create({
            data: {
                fullName: fullName.trim(),
                email: normalizedEmail,
                phone: phone.trim(),
                serviceInterest: serviceInterest.trim(),
                message: message.trim(),
                company: (company && typeof company === 'string' && company.trim() !== '') ? company.trim() : null,
                status: 'NEW',
                isArchived: false,
                source: (source && typeof source === 'string' && source.trim() !== '') ? source.trim() : null,
                sourcePage: (sourcePage && typeof sourcePage === 'string' && sourcePage.trim() !== '') ? sourcePage.trim() : null,
                landingPage: (landingPage && typeof landingPage === 'string' && landingPage.trim() !== '') ? landingPage.trim() : null,
                referrer: (referrer && typeof referrer === 'string' && referrer.trim() !== '') ? referrer.trim() : null,
            }
        });

        try {
            await Promise.allSettled([
                sendLeadAcknowledgementEmail({
                    fullName: newLead.fullName,
                    email: newLead.email,
                }),
                sendAdminNewLeadNotificationEmail({
                    fullName: newLead.fullName,
                    email: newLead.email,
                    phone: newLead.phone,
                    company: newLead.company,
                    serviceInterest: newLead.serviceInterest,
                    message: newLead.message,
                    source: newLead.source || 'WEBSITE_CONTACT_FORM',
                    sourcePage: newLead.sourcePage,
                    submittedAt: newLead.createdAt,
                })
            ]);
        } catch (emailError) {
            console.error('Lead saved, but notification email failed:', emailError);
        }

        // Do not return internal IDs or notes to the public
        return NextResponse.json({
            success: true,
            data: {
                fullName: newLead.fullName,
                email: newLead.email,
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating Lead publicly:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
