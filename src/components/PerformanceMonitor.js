'use client';
import { useState, useEffect } from 'react';

export default function PerformanceMonitor() {
    const [stats, setStats] = useState({ fps: 0, ram: 0, maxRam: 0 });

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let animationFrameId;

        const updateStats = () => {
            const now = performance.now();
            frameCount++;

            if (now - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (now - lastTime));
                frameCount = 0;
                lastTime = now;

                let ram = 0;
                let maxRam = 0;
                if (performance.memory) {
                    ram = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                    maxRam = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024);
                }

                setStats({ fps, ram, maxRam });
            }

            animationFrameId = requestAnimationFrame(updateStats);
        };

        animationFrameId = requestAnimationFrame(updateStats);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="fixed top-2 left-2 pb-1 px-3 bg-black/60 text-emerald-400 text-xs font-mono rounded-lg shadow-lg z-[999999] pointer-events-none border border-emerald-500/30 backdrop-blur-sm shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <div className="font-bold border-b border-emerald-500/30 pt-1 pb-1 mb-1 text-white">SYSTEM VITAL</div>
            <div>FPS: {stats.fps}</div>
            {stats.ram > 0 && <div>RAM: {stats.ram} MB / {stats.maxRam} MB</div>}
        </div>
    );
}
