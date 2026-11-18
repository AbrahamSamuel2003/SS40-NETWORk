export function extractYouTubeVideoId(url: string | null | undefined): string | null {
    if (!url || url.trim() === '') return null;
    try {
        const parsed = new URL(url.trim());
        const host = parsed.hostname.replace('www.', '');
        if (host === 'youtube.com') {
            if (parsed.pathname === '/watch') {
                const v = parsed.searchParams.get('v');
                return v && /^[a-zA-Z0-9_-]{11}$/.test(v) ? v : null;
            }
            if (parsed.pathname.startsWith('/shorts/')) {
                const parts = parsed.pathname.split('/');
                const id = parts[2];
                return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
            }
            if (parsed.pathname.startsWith('/embed/')) {
                const parts = parsed.pathname.split('/');
                const id = parts[2];
                return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
            }
        } else if (host === 'youtu.be') {
            const id = parsed.pathname.slice(1).split('/')[0];
            return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
        }
    } catch {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        return match ? match[1] : null;
    }
    return null;
}
