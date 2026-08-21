import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const requestedScope = (formData.get('pageScope') as string) || 'GLOBAL';

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer);

        const uploadDir = path.join(process.cwd(), 'storage', 'uploads', 'media');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Sanitize filename
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        let ext = path.extname(originalName).toLowerCase() || '';
        const baseName = path.basename(originalName, ext);
        let finalMimeType = file.type || 'application/octet-stream';

        // 1. Intelligent Compression using Sharp for raster images
        const isCompressibleImage = file.type.startsWith('image/') && !file.type.includes('svg') && !file.type.includes('gif');
        
        if (isCompressibleImage) {
            try {
                let sharpInstance = sharp(buffer).rotate(); // auto-rotate via EXIF
                const metadata = await sharpInstance.metadata();

                // Scale down if dimensions are huge (> 2000px) preserving exact aspect ratio
                if ((metadata.width && metadata.width > 2000) || (metadata.height && metadata.height > 2000)) {
                    sharpInstance = sharpInstance.resize({
                        width: 2000,
                        height: 2000,
                        fit: 'inside',
                        withoutEnlargement: true
                    });
                }

                if (file.type === 'image/jpeg' || file.type === 'image/jpg' || ext === '.jpg' || ext === '.jpeg') {
                    buffer = await sharpInstance.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
                    finalMimeType = 'image/jpeg';
                } else if (file.type === 'image/png' || ext === '.png') {
                    buffer = await sharpInstance.png({ compressionLevel: 8, effort: 6 }).toBuffer();
                    finalMimeType = 'image/png';
                } else if (file.type === 'image/webp' || ext === '.webp') {
                    buffer = await sharpInstance.webp({ quality: 85, effort: 6 }).toBuffer();
                    finalMimeType = 'image/webp';
                } else if (file.type === 'image/avif' || ext === '.avif') {
                    buffer = await sharpInstance.avif({ quality: 80 }).toBuffer();
                    finalMimeType = 'image/avif';
                } else {
                    // Fallback to high-quality webp
                    buffer = await sharpInstance.webp({ quality: 85 }).toBuffer();
                    ext = '.webp';
                    finalMimeType = 'image/webp';
                }
            } catch (compressionError) {
                console.warn('Image compression bypassed, saving raw image:', compressionError);
            }
        }

        // 2. Duplication Check: Compute content hash & check existing database entries
        const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');
        const hashSignature = `HASH:${fileHash}`;

        // Check if an identical file or filename already exists in the central media library
        const existingMedia = await prisma.media.findFirst({
            where: {
                isActive: true,
                OR: [
                    { altText: hashSignature },
                    { fileName: originalName, fileSize: buffer.length },
                    { fileName: originalName }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });

        if (existingMedia && existingMedia.fileUrl) {
            // Verify that the file physically exists on the disk
            const relativePath = existingMedia.fileUrl.replace('/api/uploads/', '');
            const diskPath = path.join(process.cwd(), 'storage', 'uploads', ...relativePath.split('/'));
            
            let fileExists = false;
            try {
                await fs.access(diskPath);
                fileExists = true;
            } catch {
                fileExists = false;
            }

            if (fileExists) {
                // Reuse existing media - do not duplicate on disk or in DB
                return NextResponse.json({
                    success: true,
                    data: {
                        url: existingMedia.fileUrl,
                        fileName: existingMedia.fileName,
                        mimeType: existingMedia.mimeType,
                        size: existingMedia.fileSize || buffer.length
                    }
                }, { status: 200 });
            }
        }

        // 3. New File: Write to storage
        const fileName = `${baseName}-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, buffer);

        const fileUrl = `/api/uploads/media/${fileName}`;

        // Determine MediaType
        let mediaType: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'OTHER' = 'OTHER';
        if (finalMimeType.startsWith('image/')) {
            mediaType = 'IMAGE';
        } else if (finalMimeType.startsWith('video/')) {
            mediaType = 'VIDEO';
        } else if (finalMimeType.includes('pdf')) {
            mediaType = 'DOCUMENT';
        }

        // 4. Automatically sync / register new unique asset in Central Media table
        try {
            await prisma.media.create({
                data: {
                    fileName: originalName,
                    fileUrl: fileUrl,
                    mimeType: finalMimeType,
                    fileSize: buffer.length,
                    mediaType: mediaType,
                    pageScope: requestedScope,
                    altText: hashSignature,
                    uploadedBy: admin.username || admin.email || 'Admin',
                    isActive: true
                }
            });
        } catch (dbError) {
            console.warn('Could not auto-register in media table:', dbError);
        }

        return NextResponse.json({
            success: true,
            data: {
                url: fileUrl,
                fileName: originalName,
                mimeType: finalMimeType,
                size: buffer.length
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error uploading media:', error);
        return NextResponse.json({ success: false, error: 'Internal server error while uploading media' }, { status: 500 });
    }
}
