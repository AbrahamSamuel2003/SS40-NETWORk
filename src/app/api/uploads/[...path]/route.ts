import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define the content types based on file extensions
const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        // Await the params object (required in Next.js 15+)
        const resolvedParams = await params;
        const filePathArray = resolvedParams.path;
        
        if (!filePathArray || filePathArray.length === 0) {
            return new NextResponse('File not found', { status: 404 });
        }

        // Secure the path to prevent directory traversal attacks
        const cleanPath = filePathArray.map(p => path.basename(p)).join('/');
        
        // Target the storage directory outside of public/
        const absolutePath = path.join(process.cwd(), 'storage', 'uploads', ...cleanPath.split('/'));

        try {
            // Check if file exists
            await fs.access(absolutePath);
        } catch {
            return new NextResponse('File not found', { status: 404 });
        }

        // Read file
        const fileBuffer = await fs.readFile(absolutePath);
        
        // Determine content type
        const ext = path.extname(absolutePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Return file with caching headers
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
