"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1.1, 0.9]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });

    return (
        <section
            ref={containerRef}
            className="relative min-h-[140vh] flex flex-col items-center justify-start pt-32 perspective-1000 overflow-visible z-10"
        >
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-zim-teal/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Text Content */}
            <div className="relative z-20 text-center mb-16 space-y-6 max-w-4xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zim-teal uppercase tracking-widest backdrop-blur-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-zim-teal animate-pulse" />
                    System Operational
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter text-white"
                >
                    Scale Your <span className="bg-gradient-to-r from-zim-teal via-white to-gen-orange bg-clip-text text-transparent">Operations</span>
                    <br /> With Intelligent AI
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                >
                    Deploy autonomous agents that summarize, analyze, and optimize customer interactions in real-time.
                </motion.p>
            </div>

            {/* 3D Dashboard Mockup */}
            <motion.div
                style={{
                    rotateX: springRotateX,
                    scale: scale,
                    transformPerspective: 1200,
                }}
                className="relative w-full max-w-5xl aspect-video mx-auto"
            >
                <div className="relative w-full h-full bg-black/40 backdrop-blur-2xl rounded-xl border border-white/10 shadow-[0_0_50px_-10px_rgba(45,212,191,0.2)] overflow-hidden">
                    {/* Header of Dashboard */}
                    <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/5">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                        <div className="text-xs font-mono text-slate-500">GENESYS_AI_COMMAND_CENTER_V2.0</div>
                    </div>

                    {/* Dashboard Content Grid */}
                    <div className="p-6 grid grid-cols-3 gap-6 h-[calc(100%-48px)]">
                        {/* Left Col */}
                        <div className="col-span-1 space-y-4">
                            <div className="h-32 rounded-lg bg-white/5 border border-white/5 p-4 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-zim-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Live Interactions</div>
                                <div className="text-3xl font-bold text-white">4,281</div>
                                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">↑ 12% vs last hour</div>
                            </div>
                            <div className="h-48 rounded-lg bg-white/5 border border-white/5 p-4">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-4">Sentiment Analysis</div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs text-slate-300">
                                        <span>Positive</span>
                                        <span>68%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[68%]" />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-300">
                                        <span>Neutral</span>
                                        <span>24%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[24%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Center Col - Main Visual */}
                        <div className="col-span-2 rounded-lg bg-white/5 border border-white/5 p-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zim-teal to-transparent opacity-50 animate-scan-sweep" />
                            <div className="text-xs text-slate-400 uppercase tracking-wider mb-4">Semantic Vector Map</div>

                            {/* Fake nodes graph */}
                            <div className="relative w-full h-64 flex items-center justify-center">
                                <div className="absolute w-64 h-64 border border-zim-teal/20 rounded-full animate-spin-slow opacity-30" />
                                <div className="absolute w-48 h-48 border border-gen-orange/20 rounded-full animate-[spin-slow_6s_reverse_linear_infinite] opacity-30" />

                                <div className="grid grid-cols-4 gap-8 opacity-50">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
