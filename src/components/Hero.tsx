"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { AnimatedTitle } from "./AnimatedTitle";

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1.1, 0.9]);

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
                    AI Operations Live
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    <AnimatedTitle as="h1" className="text-5xl md:text-7xl tracking-tighter mb-4">
                        ZIM AI Execution
                    </AnimatedTitle>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                >
                    Genesys Cloud AI powers ZIM's global shipping operations with intelligent automation across every customer touchpoint.
                </motion.p>
            </div>

            {/* 3D Dashboard Mockup - ZIM AI Orchestration Hub */}
            <motion.div
                style={{
                    rotateX: springRotateX,
                    scale: scale,
                    transformPerspective: 1200,
                }}
                className="relative w-full max-w-5xl aspect-video mx-auto"
            >
                <div className="relative w-full h-full bg-black/40 backdrop-blur-2xl rounded-xl border border-white/10 shadow-[0_0_50px_-10px_rgba(45,212,191,0.2)] overflow-hidden">
                    {/* Header */}
                    <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/5">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500/50 border border-emerald-500" />
                            <div className="text-xs font-mono text-slate-300">ZIM_AI_ORCHESTRATION_HUB</div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online</span>
                        </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="p-6 grid grid-cols-3 gap-6 h-[calc(100%-48px)]">
                        {/* Left: Live Metrics */}
                        <div className="col-span-1 space-y-4">
                            <div className="h-28 rounded-lg bg-white/5 border border-white/5 p-4 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-zim-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Active Conversations</div>
                                <div className="text-3xl font-bold text-white">1,247</div>
                                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    18% vs last hour
                                </div>
                            </div>
                            <div className="h-48 rounded-lg bg-white/5 border border-white/5 p-4">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-4">AI Resolution Rate</div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs text-slate-300">
                                        <span>Auto-Resolved</span>
                                        <span className="text-zim-teal font-bold">62%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '62%' }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-zim-teal to-blue-500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-300">
                                        <span>Agent-Assisted</span>
                                        <span className="text-slate-400 font-bold">38%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '38%' }}
                                            transition={{ duration: 1.5, delay: 0.7 }}
                                            className="h-full bg-slate-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Center: AI Routing Visualization */}
                        <div className="col-span-2 rounded-lg bg-white/5 border border-white/5 p-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zim-teal to-transparent opacity-50 animate-scan-sweep" />
                            <div className="text-xs text-slate-400 uppercase tracking-wider mb-4">Smart Routing Engine</div>

                            {/* Routing Flow */}
                            <div className="relative w-full h-64 flex items-center justify-center">
                                {/* Customer Node */}
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-gen-orange/20 border-2 border-gen-orange flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gen-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <span className="text-[9px] text-slate-400">Customer</span>
                                </div>

                                {/* AI Layer */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                        className="w-16 h-16 rounded-full bg-zim-teal/10 border-2 border-zim-teal flex items-center justify-center relative"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-zim-teal/20 border border-zim-teal/50 flex items-center justify-center">
                                            <span className="text-xs font-bold text-zim-teal">AI</span>
                                        </div>
                                    </motion.div>
                                    <span className="text-[9px] text-slate-400">Routing Engine</span>
                                </div>

                                {/* Agent Nodes */}
                                <div className="absolute right-8 top-8 flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                                        <span className="text-xs text-blue-400">A1</span>
                                    </div>
                                    <span className="text-[8px] text-slate-500">Billing</span>
                                </div>
                                <div className="absolute right-8 bottom-8 flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                                        <span className="text-xs text-emerald-400">A2</span>
                                    </div>
                                    <span className="text-[8px] text-slate-500">Logistics</span>
                                </div>

                                {/* Connection Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <motion.line
                                        x1="15%" y1="50%" x2="45%" y2="50%"
                                        stroke="#2dd4bf"
                                        strokeWidth="2"
                                        strokeDasharray="4"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
