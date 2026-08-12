import { prisma } from './prisma';

interface LogOptions {
    adminId: string;
    action: string;
    entity: string;
    entityId?: string;
    description: string;
    ipAddress?: string | null;
    userAgent?: string | null;
}

export async function logAdminActivity(opts: LogOptions) {
    try {
        await prisma.adminActivityLog.create({
            data: {
                adminUserId: opts.adminId,
                action: opts.action,
                entity: opts.entity,
                entityId: opts.entityId,
                description: opts.description,
                ipAddress: opts.ipAddress,
                userAgent: opts.userAgent,
            },
        });
    } catch (error) {
        console.error('Failed to log admin activity:', error);
    }
}
