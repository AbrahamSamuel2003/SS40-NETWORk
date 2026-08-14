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
        const file = formData.get('contactImage') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ success: false, error: 'File must be an image' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'contact');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const ext = path.extname(file.name) || '.png';
        const fileName = `contact-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, buffer);

        const fileUrl = `/uploads/contact/${fileName}`;
        return NextResponse.json({ success: true, url: fileUrl }, { status: 200 });
    } catch (error) {
        console.error('Error uploading contact image:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while uploading contact image' }, { status: 500 });
    }
}
