"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { MousePointer2, MessageCircle, Search, Navigation, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { ClientOnly } from './ClientOnly';

// --- Types ---
type JourneyPhase = 'idle' | 'browsing' | 'typing_pol' | 'typing_pod' | 'struggle' | 'detected' | 'intervention' | 'resolved';

export const ProactiveEngagementBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [phase, setPhase] = useState<JourneyPhase>('idle');
    const [polValue, setPolValue] = useState("");
    const [podValue, setPodValue] = useState("");
    const [frustrationScore, setFrustrationScore] = useState(0);

    const cursorControls = useAnimation();

    // Refs for safe async loop access
    const stateRef = useRef(state);
    stateRef.current = state;

    const isLoopingRef = useRef(false);

    // --- Robust Wait Logic ---
    const wait = async (ms: number) => {
        const start = Date.now();
        let passed = 0;
        while (passed < ms) {
            // Check state
            if (stateRef.current === 'idle') throw new Error("STOPPED");

            // If playing, advance time
            if (stateRef.current === 'playing') {
                passed += 100; // Check tick
            }
            // If paused, just loop without advancing passed (freeze time)

            await new Promise(r => setTimeout(r, 100));
        }
    };

    const waitForPlay = async () => {
        while (stateRef.current !== 'playing') {
            if (stateRef.current === 'idle') throw new Error("STOPPED");
            await new Promise(r => setTimeout(r, 100));
        }
    };

    // Reset Visuals
    const reset = () => {
        setPhase('idle');
        setPolValue("");
        setPodValue("");
        setFrustrationScore(0);
        cursorControls.set({ x: 50, y: 50 });
    };

    // --- Main Simulation Loop ---
    useEffect(() => {
        if (state === 'idle') {
            reset();
            return;
        }

        if (state === 'playing' && !isLoopingRef.current) {
            isLoopingRef.current = true;

            const loop = async () => {
                try {
                    while (true) {
                        if (stateRef.current === 'idle') break;

                        // 1. Start Browsing - Move to POL
                        await waitForPlay();
                        setPhase('browsing');
                        setFrustrationScore(10);
                        reset(); // Ensure clean start of loop

                        await cursorControls.start({ x: 80, y: 180, transition: { duration: 1, ease: "easeInOut" } });

                        // 2. Type POL
                        await waitForPlay();
                        setPhase('typing_pol');
                        await typeText("Shanghai", setPolValue);

                        // 3. Move to POD
                        await waitForPlay();
                        await cursorControls.start({ x: 80, y: 260, transition: { duration: 0.8, ease: "easeInOut" } });

                        // 4. Type POD
                        await waitForPlay();
                        setPhase('typing_pod');
                        await typeText("Los Angel", setPodValue);
                        setPodValue("Los Angeles");

                        // 5. Struggle Phase
                        await waitForPlay();
                        setPhase('struggle');

                        // Simulate erratic movement
                        const struggleMoves = [
                            { x: 300, y: 220 },
                            { x: 100, y: 350 }, // Date
                            { x: 350, y: 180 },
                            { x: 100, y: 260 }, // Back to POD
                            { x: 200, y: 400 }, // Near Search
                        ];

                        // Build frustration in parallel with moves
                        let currentScore = 15;
                        const scoreTimer = setInterval(() => {
                            if (stateRef.current === 'playing') {
                                currentScore += 3;
                                if (currentScore > 100) currentScore = 100;
                                setFrustrationScore(currentScore);
                            }
                        }, 100);

                        for (const move of struggleMoves) {
                            await waitForPlay();
                            await cursorControls.start({ x: move.x, y: move.y, transition: { duration: 0.6, ease: "linear" } });
                            await new Promise(r => setTimeout(r, 100)); // Short natural pause, acceptable not to deeply freeze
                        }

                        clearInterval(scoreTimer);
                        setFrustrationScore(92); // Critical
                        setPhase('detected');
                        await wait(500);

                        // 6. Intervention
                        await waitForPlay();
                        setPhase('intervention');

                        await wait(2500); // User reads

                        // 7. Click Yes
                        await waitForPlay();
                        await cursorControls.start({ x: 200, y: 540, transition: { duration: 1 } }); // Move to button
                        await wait(200);

                        // 8. Resolved
                        await waitForPlay();
                        setPhase('resolved');
                        setFrustrationScore(0);

                        await wait(3000); // Show success before looping
                    }
                } catch (e) {
                    if (e instanceof Error && e.message === "STOPPED") {
                        // Clean exit
                    } else {
                        console.error(e);
                    }
                } finally {
                    isLoopingRef.current = false;
                }
            };
            loop();
        }
    }, [state]); // Only run when state switches to playing initially

    const typeText = async (text: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        for (let i = 0; i <= text.length; i++) {
            await waitForPlay();
            setter(text.slice(0, i));
            await wait(50 + Math.random() * 50);
        }
    };

    return (
        <ClientOnly>
            {/* Full Container acts as the site */}
            <div className="relative w-full h-full min-h-[500px] bg-slate-950 flex flex-col overflow-hidden border border-cyan-500/20 font-sans group">

                {/* Background Grid - Dark Futuristic */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-90" />

                <SimulationControls
                    state={state}
                    onPlay={() => setState('playing')}
                    onPause={() => setState('paused')}
                    onStop={() => setState('idle')}
                />

                {/* --- ZIM HEADER (Full Bleed) --- */}
                <div className="relative z-10 w-full h-16 bg-slate-900/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <img src="/ZIM80Logo.png" alt="ZIM" className="h-8 w-auto object-contain" />
                        <div className="h-4 w-px bg-white/20" />
                        <span className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase">Global Shipping</span>
                    </div>

                    {/* Header Controls */}
                    <div className="flex gap-4 items-center">
                        <div className="w-20 h-2 bg-white/5 rounded-full" />
                        <div className="w-12 h-2 bg-white/5 rounded-full" />
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* --- CONTENT AREA (Vessel Schedule) --- */}
                <div className="relative z-10 flex-1 p-8 overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-8 mt-4">
                        <div className="flex-1 max-w-lg">
                            {/* Page Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Find Vessel <br />Schedules</h2>
                                <p className="text-slate-400 text-lg max-w-[240px] leading-tight">Search real-time schedules for all trade lanes.</p>
                            </motion.div>

                            {/* Search Form */}
                            <div className="space-y-6">
                                {/* POL Input */}
                                <div className="relative group/input">
                                    <label className="text-[10px] font-bold text-cyan-500/70 uppercase mb-1 block tracking-wider">Origin (POL)</label>
                                    <div className="h-12 bg-slate-800/50 border border-white/10 rounded-lg flex items-center px-4 group-hover/input:border-cyan-500/30 transition-colors">
                                        <Navigation size={16} className="text-slate-500 mr-3" />
                                        <span className="text-slate-200 font-mono text-sm">{polValue}</span>
                                        {phase === 'typing_pol' && <span className="w-0.5 h-5 bg-cyan-400 animate-pulse ml-0.5" />}
                                    </div>
                                </div>

                                {/* POD Input */}
                                <div className="relative group/input">
                                    <label className="text-[10px] font-bold text-cyan-500/70 uppercase mb-1 block tracking-wider">Destination (POD)</label>
                                    <div className="h-12 bg-slate-800/50 border border-white/10 rounded-lg flex items-center px-4 group-hover/input:border-cyan-500/30 transition-colors">
                                        <Navigation size={16} className="text-slate-500 mr-3" />
                                        <span className="text-slate-200 font-mono text-sm">{podValue}</span>
                                        {phase === 'typing_pod' && <span className="w-0.5 h-5 bg-cyan-400 animate-pulse ml-0.5" />}
                                    </div>
                                </div>

                                {/* Date Input */}
                                <div className="relative group/input">
                                    <label className="text-[10px] font-bold text-cyan-500/70 uppercase mb-1 block tracking-wider">Departure</label>
                                    <div className="h-12 bg-slate-800/50 border border-white/10 rounded-lg flex items-center px-4 opacity-50">
                                        <span className="text-slate-500 font-mono text-sm">Select Date...</span>
                                    </div>
                                </div>

                                {/* Search Button */}
                                <button className="w-full h-12 bg-zim-orange hover:bg-orange-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20">
                                    <Search size={16} />
                                    SEARCH ROUTES
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- HOLOGRAPHIC HUD (Engagement Meter) --- */}
                <motion.div
                    animate={{ opacity: state === 'playing' ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-24 right-8 z-30"
                >
                    <div className="relative w-56 p-5 rounded-2xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.15)] ring-1 ring-white/5">
                        {/* Scanline */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent bg-[length:100%_200%] animate-[scan_3s_linear_infinite] pointer-events-none rounded-2xl" />

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded bg-cyan-500/10">
                                    <Activity size={14} className="text-cyan-400" />
                                </div>
                                <span className="text-[10px] font-bold text-cyan-300 tracking-widest uppercase">CX Monitor</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${frustrationScore > 80 ? 'bg-red-500 animate-ping' : 'bg-cyan-500'}`} />
                        </div>

                        {/* Numeric & Bar */}
                        <div className="flex items-end justify-between mb-3">
                            <span className="text-[10px] text-slate-400 font-mono mb-1">FRICTION_INDEX</span>
                            <span className={`text-3xl font-black font-mono tracking-tighter ${frustrationScore > 60 ? 'text-red-400' : 'text-cyan-400'}`}>
                                {frustrationScore.toString().padStart(3, '0')}%
                            </span>
                        </div>

                        {/* Segmented Bar */}
                        <div className="h-2 flex gap-1">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-[1px] transition-colors duration-200 
                                        ${i < (frustrationScore / 100) * 12
                                            ? (frustrationScore > 80 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]')
                                            : 'bg-slate-800'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* --- AI INTERVENTION POPUP --- */}
                <AnimatePresence>
                    {(phase === 'intervention' || phase === 'resolved') && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 50, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="absolute bottom-8 right-8 left-8 z-40"
                        >
                            <div className="relative bg-slate-900/95 backdrop-blur-xl border border-zim-teal/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(45,212,191,0.2)] overflow-hidden">
                                {/* Glitch Border Effect */}
                                <div className="absolute inset-0 border border-zim-teal/20 rounded-2xl animate-pulse" />

                                <div className="flex gap-4">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zim-teal to-cyan-600 flex items-center justify-center shadow-lg shadow-zim-teal/20">
                                            <MessageCircle size={24} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Zap size={12} className="text-zim-orange" fill="currentColor" />
                                            <span className="text-xs font-bold text-zim-teal uppercase tracking-wider">Proactive Assist</span>
                                        </div>
                                        <h4 className="text-white font-bold text-lg mb-2">Need help booking this route?</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                            I noticed you're exploring <span className="text-white font-bold decoration-zim-teal decoration-2 underline underline-offset-2">Shanghai</span> to <span className="text-white font-bold decoration-zim-teal decoration-2 underline underline-offset-2">Los Angeles</span>. I can instantly find the best schedule for you.
                                        </p>

                                        {phase === 'resolved' ? (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 font-bold text-sm"
                                            >
                                                <CheckCircle2 size={16} />
                                                Schedule Found
                                            </motion.div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <button className="px-6 py-2.5 bg-zim-teal hover:bg-teal-400 text-slate-900 font-bold rounded-lg transition-transform hover:scale-105 shadow-lg shadow-zim-teal/20">
                                                    Yes, Show Options
                                                </button>
                                                <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors">
                                                    No Thanks
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- CURSOR --- */}
                <motion.div
                    animate={cursorControls}
                    initial={{ x: 50, y: 50 }}
                    className="absolute top-0 left-0 pointer-events-none z-50 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                >
                    <MousePointer2
                        size={32}
                        className="text-black fill-white"
                        style={{ transform: "rotate(-10deg)" }}
                    />
                    {/* Ring Pulse when 'clicking' */}
                    {phase === 'resolved' && (
                        <span className="absolute -top-4 -left-4 w-16 h-16 border-2 border-zim-teal rounded-full animate-ping opacity-50" />
                    )}
                </motion.div>

            </div>
        </ClientOnly>
    );
};
