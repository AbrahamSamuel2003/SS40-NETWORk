import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'media');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Sanitize filename to avoid weird character issues
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const ext = path.extname(originalName) || '';
        const baseName = path.basename(originalName, ext);
        const fileName = `${baseName}-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, buffer);

        const fileUrl = `/uploads/media/${fileName}`;
        return NextResponse.json({
            success: true,
            data: {
                url: fileUrl,
                fileName: originalName,
                mimeType: file.type,
                size: file.size
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error uploading media:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while uploading media' }, { status: 500 });
    }
}
