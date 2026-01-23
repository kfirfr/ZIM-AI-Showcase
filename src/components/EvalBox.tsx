"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, AlertCircle, Scan, ShieldCheck, BarChart3 } from 'lucide-react';

export const EvalBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [phase, setPhase] = useState<"scanning" | "checking" | "scoring" | "complete">("scanning");
    const [checklistIndex, setChecklistIndex] = useState(0);
    const [score, setScore] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const checklist = [
        { id: 1, text: "Greeting & Verification", status: "pass" },
        { id: 2, text: "Empathy & Tone", status: "pass" },
        { id: 3, text: "Correct Process Followed", status: "pass" },
        { id: 4, text: "Compliance Statement", status: "pass" },
        { id: 5, text: "Resolution Confirmation", status: "pass" },
    ];

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let scoreInterval: NodeJS.Timeout;

        if (state === 'playing') {
            if (containerRef.current) {
                setTimeout(() => {
                    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
            const runSequence = async () => {
                // Phase 1: Scanning
                setPhase("scanning");
                setChecklistIndex(0);
                setScore(0);

                await new Promise(r => setTimeout(r, 3000));

                // Phase 2: Checking Criteria
                setPhase("checking");
                for (let i = 0; i < checklist.length; i++) {
                    setChecklistIndex(i + 1);
                    await new Promise(r => setTimeout(r, 800));
                }

                // Phase 3: Scoring
                setPhase("scoring");
                const targetScore = 100;
                let currentScore = 0;
                const duration = 2000;
                const stepTime = 20;
                const steps = duration / stepTime;
                const increment = targetScore / steps;

                scoreInterval = setInterval(() => {
                    currentScore += increment;
                    if (currentScore >= targetScore) {
                        currentScore = targetScore;
                        clearInterval(scoreInterval);
                        setPhase("complete");
                        // Reset loop
                        timeout = setTimeout(runSequence, 3000);
                    }
                    setScore(Math.floor(currentScore));
                }, stepTime);
            };

            runSequence();
        } else if (state === 'paused') {
            // Pause logic could be improved to actually pause the timeline
        } else if (state === 'idle') {
            setPhase("scanning");
            setChecklistIndex(0);
            setScore(0);
            if (scoreInterval!) clearInterval(scoreInterval);
        }

        return () => {
            clearTimeout(timeout);
            if (scoreInterval) clearInterval(scoreInterval);
        };
    }, [state]);

    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[400px] bg-slate-950/50 flex flex-col group overflow-hidden">
            <SimulationControls
                state={state}
                onPlay={() => setState('playing')}
                onPause={() => setState('paused')}
                onStop={() => setState('idle')}
            />

            <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
                <AnimatePresence mode="wait">
                    {/* Phase 1: Scanning Transcript */}
                    {phase === "scanning" && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden"
                        >
                            <div className="flex items-center gap-3 mb-4 text-slate-300">
                                <FileText size={20} />
                                <span className="font-mono text-sm">TRANSCRIPT_#2994.txt</span>
                            </div>

                            <div className="space-y-3 opacity-50 relative">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-2 bg-slate-600 rounded-full w-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
                                ))}
                            </div>

                            {/* Scanning Beam */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-1 bg-zim-teal/50 shadow-[0_0_15px_rgba(45,212,191,0.8)] z-10"
                                animate={{ top: ["0%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <div className="flex flex-col items-center gap-2">
                                    <Scan size={32} className="text-zim-teal animate-pulse" />
                                    <span className="text-zim-teal font-bold tracking-widest text-sm">ANALYZING...</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Phase 2: Checklist */}
                    {(phase === "checking" || phase === "scoring" || phase === "complete") && (
                        <motion.div
                            key="checklist"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-sm space-y-4"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <ShieldCheck className="text-zim-teal" size={24} />
                                <h3 className="text-xl font-bold text-white">Compliance Check</h3>
                            </div>

                            <div className="space-y-3">
                                {checklist.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{
                                            opacity: index < checklistIndex ? 1 : 0.3,
                                            x: 0
                                        }}
                                        className={`flex items-center justify-between p-3 rounded-lg border ${index < checklistIndex ? "bg-emerald-900/20 border-emerald-500/30" : "bg-white/5 border-white/5"
                                            }`}
                                    >
                                        <span className="text-sm font-medium text-slate-200">{item.text}</span>
                                        {index < checklistIndex && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                            >
                                                <CheckCircle2 size={18} className="text-emerald-400" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Phase 3 & 4: Scoring Result */}
                    {(phase === "scoring" || phase === "complete") && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-6 right-6 bg-slate-900 border border-zim-teal/50 p-4 rounded-xl shadow-2xl flex items-center gap-4"
                        >
                            <div className="p-3 bg-zim-teal/10 rounded-full">
                                <BarChart3 size={24} className="text-zim-teal" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">Quality Score</div>
                                <div className="text-3xl font-bold font-mono text-white">
                                    {score}<span className="text-zim-teal">%</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
