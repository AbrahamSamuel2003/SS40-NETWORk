import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
    try {
        // Perform a minimal database query
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json(
            { success: true, database: 'connected' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Database connection error in health check:', error);
        return NextResponse.json(
            { success: false, database: 'disconnected' },
            { status: 500 }
        );
    }
}
