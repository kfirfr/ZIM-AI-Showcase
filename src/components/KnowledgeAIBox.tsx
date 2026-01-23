"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Lightbulb, ArrowRight, Database } from 'lucide-react';

export const KnowledgeAIBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [step, setStep] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            setStep(prev => (prev < 3 ? prev + 1 : 0));
        }, 2500);
    };

    useEffect(() => {
        if (state === 'playing') {
            runSimulation();
        } else if (state === 'paused') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (state === 'idle') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setStep(0);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [state]);

    return (
        <div className="relative w-full h-full min-h-[400px] bg-slate-950/50 flex flex-col overflow-hidden">
            <SimulationControls
                state={state}
                onPlay={() => setState('playing')}
                onPause={() => setState('paused')}
                onStop={() => setState('idle')}
            />

            <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
                <AnimatePresence mode="wait">
                    {/* Step 1: Query */}
                    {step === 0 && (
                        <motion.div
                            key="query"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="bg-slate-800 border border-white/10 p-6 rounded-2xl w-full max-w-sm text-center"
                        >
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-blue-500/20 rounded-full">
                                    <Search size={32} className="text-blue-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Agent Query</h3>
                            <p className="text-slate-400">"What is the procedure for hazardous cargo declarations?"</p>
                        </motion.div>
                    )}

                    {/* Step 2: Semantic Search */}
                    {step === 1 && (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="relative w-full max-w-sm h-64 flex items-center justify-center"
                        >
                            <div className="absolute inset-0 border-2 border-dashed border-zim-teal/30 rounded-full animate-spin-slow" />
                            <div className="absolute inset-8 border-2 border-dashed border-purple-500/30 rounded-full animate-spin-slow animation-reverse" />

                            <div className="text-center z-10">
                                <Database size={48} className="text-zim-teal mx-auto mb-3" />
                                <div className="text-zim-teal font-mono font-bold">Scanning Knowledge Base</div>
                                <div className="text-xs text-slate-500 mt-2">Vector Search Active...</div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Insight */}
                    {step === 2 && (
                        <motion.div
                            key="insight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gradient-to-br from-zim-teal/10 to-transparent border border-zim-teal/50 p-6 rounded-2xl w-full max-w-sm"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Lightbulb size={24} className="text-zim-teal" />
                                <h3 className="text-lg font-bold text-white">Suggested Answer</h3>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-zim-teal/20 mb-3">
                                <div className="text-xs text-zim-teal uppercase mb-1">Source: Standard Operating Procedures</div>
                                <p className="text-sm text-slate-200">"Dangerous Goods (DG) declarations must be submitted 24 hours prior to cut-off. Use Form DG-404."</p>
                            </div>
                            <div className="flex justify-end">
                                <button className="px-3 py-1 bg-zim-teal text-black text-xs font-bold rounded hover:scale-105 transition">
                                    Insert to Chat
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Time Saved */}
                    {step === 3 && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            className="text-center"
                        >
                            <div className="inline-block p-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mb-4">
                                <BookOpen size={48} className="text-emerald-400" />
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-2">90% Faster</h2>
                            <p className="text-slate-400">Time to resolution significantly reduced</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
