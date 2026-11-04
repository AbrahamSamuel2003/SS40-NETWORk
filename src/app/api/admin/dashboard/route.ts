import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const [
            productsCount,
            clientProjectsCount,
            studentProjectsCount,
            leadsCount,
            visitorsCount,
            mediaCount,
            recentLeads,
            activities
        ] = await Promise.all([
            prisma.product.count(),
            prisma.clientProject.count(),
            prisma.studentProject.count(),
            prisma.lead.count(),
            prisma.visitor.count(),
            prisma.media.count(),
            prisma.lead.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    serviceInterest: true,
                    status: true,
                    createdAt: true
                }
            }),
            prisma.adminActivityLog.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    adminUser: {
                        select: {
                            id: true,
                            fullName: true,
                            username: true,
                            email: true
                        }
                    }
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                counts: {
                    products: productsCount,
                    clientProjects: clientProjectsCount,
                    studentProjects: studentProjectsCount,
                    leads: leadsCount,
                    visitors: visitorsCount,
                    media: mediaCount
                },
                recentLeads,
                activities
            }
        });
    } catch (error: any) {
        console.error('Error in /api/admin/dashboard:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error?.message },
            { status: 500 }
        );
    }
}
