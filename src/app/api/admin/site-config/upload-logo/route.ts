import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('logo') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const ext = path.extname(file.name).toLowerCase() || '.png';
        const isImage = file.type.startsWith('image/') || Boolean(ext.match(/\.(jpe?g|png|webp|svg|avif)$/));

        if (!isImage) {
            return NextResponse.json({ success: false, error: 'File must be an image' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer);

        const uploadDir = path.join(process.cwd(), 'storage', 'uploads', 'logos');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Compress raster logos using Sharp while preserving transparency
        if (!file.type.includes('svg') && ext !== '.svg') {
            try {
                let sharpInstance = sharp(buffer);
                const metadata = await sharpInstance.metadata();

                if ((metadata.width && metadata.width > 1200) || (metadata.height && metadata.height > 1200)) {
                    sharpInstance = sharpInstance.resize({
                        width: 1200,
                        height: 1200,
                        fit: 'inside',
                        withoutEnlargement: true
                    });
                }

                if (file.type === 'image/png' || ext === '.png' || file.type === 'image/x-png') {
                    buffer = await sharpInstance.png({ compressionLevel: 7, effort: 3 }).toBuffer();
                } else if (file.type === 'image/webp' || ext === '.webp') {
                    buffer = await sharpInstance.webp({ quality: 90, effort: 4 }).toBuffer();
                } else {
                    buffer = await sharpInstance.jpeg({ quality: 90, mozjpeg: true }).toBuffer();
                }
            } catch (err) {
                console.warn('Logo optimization fallback to raw buffer:', err);
            }
        }

        const fileName = `logo-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, buffer);

        const fileUrl = `/api/uploads/logos/${fileName}`;
        return NextResponse.json({ success: true, url: fileUrl }, { status: 200 });
    } catch (error) {
        console.error('Error uploading logo:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while uploading logo' }, { status: 500 });
    }
}
