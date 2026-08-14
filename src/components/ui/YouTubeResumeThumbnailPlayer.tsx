"use client";

import * as React from "react";
import { Play } from "lucide-react";

type YouTubeResumeThumbnailPlayerProps = {
    youtubeUrl: string;
    title: string;
    thumbnailUrl?: string | null;
    className?: string;
    iframeClassName?: string;
    overlayClassName?: string;
    onPlayingChange?: (isPlaying: boolean) => void;
};

export function getYouTubeVideoId(url: string) {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace("www.", "");

        if (host === "youtube.com" || host === "m.youtube.com") {
            if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
            if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/embed/")[1]?.split("/")[0] || null;
            if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/shorts/")[1]?.split("/")[0] || null;
        }

        if (host === "youtu.be") {
            return parsed.pathname.slice(1).split("/")[0] || null;
        }
    } catch {
        const match = url.match(/(?:youtu\.be\/|watch\?v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
        return match?.[1] || null;
    }

    return null;
}

export function getYouTubeThumbnailUrl(url: string, fallback?: string | null) {
    if (fallback) return fallback;

    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}

export function YouTubeResumeThumbnailPlayer({
    youtubeUrl,
    title,
    thumbnailUrl,
    className = "relative w-full h-full",
    iframeClassName = "absolute inset-0 w-full h-full border-0",
    overlayClassName = "",
    onPlayingChange,
}: YouTubeResumeThumbnailPlayerProps) {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isReady, setIsReady] = React.useState(false);
    const videoId = getYouTubeVideoId(youtubeUrl);
    const resolvedThumbnail = getYouTubeThumbnailUrl(youtubeUrl, thumbnailUrl);

    const setPlayingState = React.useCallback((nextIsPlaying: boolean) => {
        setIsPlaying((current) => {
            if (current !== nextIsPlaying) onPlayingChange?.(nextIsPlaying);
            return nextIsPlaying;
        });
    }, [onPlayingChange]);

    const postPlayerCommand = React.useCallback((func: string) => {
        iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({
                event: "command",
                func,
                args: [],
            }),
            "*"
        );
    }, []);

    React.useEffect(() => {
        if (!videoId) return;

        function onMessage(event: MessageEvent) {
            if (event.source !== iframeRef.current?.contentWindow) return;
            if (event.origin !== "https://www.youtube.com" && event.origin !== "https://www.youtube-nocookie.com") return;

            try {
                const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
                const state = msg?.event === "onStateChange"
                    ? msg.info
                    : msg?.event === "infoDelivery"
                        ? msg?.info?.playerState
                        : undefined;

                if (typeof state === "number") {
                    setPlayingState(state === 1 || state === 3);
                }
            } catch {
                // Ignore unrelated browser or extension messages.
            }
        }

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [setPlayingState, videoId]);

    if (!videoId) return null;

    const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        enablejsapi: "1",
        playsinline: "1",
    });

    return (
        <div className={className} onClick={(event) => event.stopPropagation()}>
            <iframe
                ref={iframeRef}
                src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
                title={title}
                className={iframeClassName}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                onLoad={(event) => {
                    setIsReady(true);
                    event.currentTarget.contentWindow?.postMessage(JSON.stringify({ event: "listening" }), "*");
                }}
            />

            <button
                type="button"
                aria-label={`Play ${title}`}
                onClick={(event) => {
                    event.stopPropagation();
                    postPlayerCommand("playVideo");
                }}
                className={`absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-gray-100 transition-opacity duration-300 ${isPlaying ? "pointer-events-none opacity-0" : "opacity-100"} ${overlayClassName}`}
            >
                {resolvedThumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={resolvedThumbnail}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                )}
                <span className="absolute inset-0 bg-black/15" />
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#6B9F91] shadow-xl backdrop-blur-sm transition-transform duration-300 hover:scale-105 md:h-16 md:w-16">
                    <Play className="ml-1 h-6 w-6 fill-current" />
                </span>
                {!isReady && <span className="sr-only">Loading video</span>}
            </button>
        </div>
    );
}
