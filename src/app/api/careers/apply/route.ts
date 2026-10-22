import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let careerId: string | null = null;
        let roleTitle: string = '';
        let department: string | null = null;
        let fullName: string = '';
        let email: string = '';
        let phone: string = '';
        let experienceLevel: string | null = null;
        let currentOrg: string | null = null;
        let portfolioUrl: string | null = null;
        let linkedinUrl: string | null = null;
        let resumeUrl: string | null = null;
        let coverLetter: string | null = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            careerId = (formData.get('careerId') as string) || null;
            roleTitle = (formData.get('roleTitle') as string) || '';
            department = (formData.get('department') as string) || null;
            fullName = (formData.get('fullName') as string) || '';
            email = (formData.get('email') as string) || '';
            phone = (formData.get('phone') as string) || '';
            experienceLevel = (formData.get('experienceLevel') as string) || null;
            currentOrg = (formData.get('currentOrg') as string) || null;
            portfolioUrl = (formData.get('portfolioUrl') as string) || null;
            linkedinUrl = (formData.get('linkedinUrl') as string) || null;
            coverLetter = (formData.get('coverLetter') as string) || null;
            resumeUrl = (formData.get('resumeUrl') as string) || null;

            // Handle file upload if provided
            const resumeFile = formData.get('resumeFile') as File | null;
            if (resumeFile && resumeFile.size > 0) {
                // Restrict resume size to 5MB
                if (resumeFile.size > 5 * 1024 * 1024) {
                    return NextResponse.json({
                        success: false,
                        error: 'Resume file size exceeds the 5MB limit. Please upload a smaller file.'
                    }, { status: 400 });
                }

                const arrayBuffer = await resumeFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
                try {
                    await fs.access(uploadDir);
                } catch {
                    await fs.mkdir(uploadDir, { recursive: true });
                }

                const ext = path.extname(resumeFile.name).toLowerCase() || '.pdf';
                const sanitizedName = `${Date.now()}-${fullName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}${ext}`;
                const filePath = path.join(uploadDir, sanitizedName);
                await fs.writeFile(filePath, buffer);
                resumeUrl = `/uploads/resumes/${sanitizedName}`;
            }
        } else {
            const body = await request.json();
            careerId = body.careerId || null;
            roleTitle = body.roleTitle || '';
            department = body.department || null;
            fullName = body.fullName || '';
            email = body.email || '';
            phone = body.phone || '';
            experienceLevel = body.experienceLevel || null;
            currentOrg = body.currentOrg || null;
            portfolioUrl = body.portfolioUrl || null;
            linkedinUrl = body.linkedinUrl || null;
            resumeUrl = body.resumeUrl || null;
            coverLetter = body.coverLetter || null;
        }

        if (!roleTitle.trim() || !fullName.trim() || !email.trim() || !phone.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Please fill in all required fields (Full Name, Email, Phone, and Role).'
            }, { status: 400 });
        }

        // Resilient Prisma Client fallback
        let db = prisma;
        if (!db?.jobApplication) {
            const { PrismaClient } = await import('@/generated/prisma');
            const { Pool } = await import('pg');
            const { PrismaPg } = await import('@prisma/adapter-pg');
            const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/placeholder';
            const pool = new Pool({ connectionString });
            const adapter = new PrismaPg(pool);
            db = new PrismaClient({ adapter });
        }

        const application = await db.jobApplication.create({
            data: {
                careerId: careerId && careerId.trim() !== '' ? careerId.trim() : null,
                roleTitle: roleTitle.trim(),
                department: department ? department.trim() : null,
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                experienceLevel: experienceLevel ? experienceLevel.trim() : null,
                currentOrg: currentOrg ? currentOrg.trim() : null,
                portfolioUrl: portfolioUrl ? portfolioUrl.trim() : null,
                linkedinUrl: linkedinUrl ? linkedinUrl.trim() : null,
                resumeUrl: resumeUrl ? resumeUrl.trim() : null,
                coverLetter: coverLetter ? coverLetter.trim() : null,
                status: 'PENDING'
            }
        });

        // Query career role if careerId exists to check for custom applyEmail
        let targetCareersEmail = 'careers@ss40network.com';
        if (careerId && db.career) {
            try {
                const career = await db.career.findUnique({
                    where: { id: careerId.trim() },
                    select: { applyEmail: true }
                });
                if (career?.applyEmail) {
                    targetCareersEmail = career.applyEmail;
                }
            } catch (err) {
                console.warn('Could not query career applyEmail:', err);
            }
        }

        // Automated Email Dispatches (Non-blocking)
        try {
            const { 
                sendCareerApplicationNotification, 
                sendApplicantAcknowledgementEmail 
            } = await import('@/lib/mail');

            // 1. Send complete application dossier to careers@ss40network.com
            sendCareerApplicationNotification({
                fullName: application.fullName,
                email: application.email,
                phone: application.phone,
                roleTitle: application.roleTitle,
                department: application.department,
                experienceLevel: application.experienceLevel,
                currentOrg: application.currentOrg,
                portfolioUrl: application.portfolioUrl,
                linkedinUrl: application.linkedinUrl,
                resumeUrl: application.resumeUrl,
                coverLetter: application.coverLetter,
                submittedAt: application.createdAt,
                targetEmail: targetCareersEmail
            }).catch(mailErr => console.error('Failed to dispatch notification to careers email:', mailErr));

            // 2. Send Option A confirmation email to the applicant
            sendApplicantAcknowledgementEmail({
                fullName: application.fullName,
                email: application.email,
                roleTitle: application.roleTitle
            }).catch(ackErr => console.error('Failed to dispatch acknowledgement email to applicant:', ackErr));
        } catch (mailImportErr) {
            console.error('Mail system error on career application:', mailImportErr);
        }

        return NextResponse.json({
            success: true,
            data: application,
            message: 'Thank you for applying! Our team has received your application. We will review your profile and contact you soon.'
        }, { status: 201 });
    } catch (error: any) {
        console.error('Job application error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error while submitting application.'
        }, { status: 500 });
    }
}
