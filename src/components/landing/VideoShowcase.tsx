'use client';

import { useEffect, useRef } from "react";

export default function VideoShowcase() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const targetRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || !targetRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const height = window.innerHeight;
            const start = height * 0.95;
            const end = height * 0.15;
            const current = rect.top;

            let progress = (start - current) / (start - end);
            progress = Math.max(0, Math.min(1, progress));
            const easeProgress = 1 - Math.pow(1 - progress, 3)

            targetRef.current.style.setProperty("--progress", easeProgress.toString());
        };

        document.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            document.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <section ref={containerRef} className="relative z-20 w-full bg-background flex justify-center overflow-hidden px-2 sm:px-6 md:px-12 py-20 md:py-36">
            <div
                ref={targetRef}
                className="relative z-20 w-full max-w-[1536px] mx-auto rounded-3xl sm:rounded-[2.5rem] md:rounded-[3rem] bg-zinc-950 ring-1 ring-white/10 border border-zinc-800/90 shadow-[0_50px_140px_rgba(0,0,0,0.95)] overflow-hidden"
                style={{
                    ["--progress" as string]: "0",
                    transform: `perspective(1200px) scale(calc(0.35 + var(--progress) * 0.75)) translateY(calc((1 - var(--progress)) * 100px))` ,
                    opacity: `calc(0.35 + var(--progress) * 0.65)`,
                    willChange: "transform, opacity",
                }}
            >
                <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/videos/hero-bg.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>            
        </section>
    );
}