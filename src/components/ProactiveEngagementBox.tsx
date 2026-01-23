"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Mail, Bell, Package, ArrowRight } from 'lucide-react';

export const ProactiveEngagementBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [step, setStep] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const steps = [
        { id: 'trigger', text: "Event Trigger" },
        { id: 'prediction', text: "Needs Prediction" },
        { id: 'outreach', text: "Proactive Outreach" },
        { id: 'resolution', text: "Pre-empted Issue" },
    ];

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            setStep(prev => (prev < steps.length - 1 ? prev + 1 : 0));
        }, 3000);
    };

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state === 'playing') {
            if (containerRef.current) {
                setTimeout(() => {
                    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
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
        <div ref={containerRef} className="relative w-full h-full min-h-[400px] bg-slate-950/50 flex flex-col overflow-hidden">
            <SimulationControls
                state={state}
                onPlay={() => setState('playing')}
                onPause={() => setState('paused')}
                onStop={() => setState('idle')}
            />

            <div className="flex-1 p-6 relative">
                {/* Connection Line */}
                <div className="absolute left-[39px] top-12 bottom-12 w-0.5 bg-slate-800" />

                <div className="space-y-8 relative z-10">
                    {/* Trigger Event */}
                    <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: step >= 0 ? 1 : 0.3 }}
                        className="flex items-center gap-4"
                    >
                        <div className={`
                            w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-500
                            ${step >= 0 ? 'bg-amber-900/20 border-amber-500 text-amber-500' : 'bg-slate-900 border-slate-700 text-slate-700'}
                        `}>
                            <Package size={20} />
                        </div>
                        <div className="bg-slate-900/80 border border-white/10 p-3 rounded-lg flex-1">
                            <div className="text-xs text-slate-400 uppercase">System Event</div>
                            <div className="text-white font-medium">Potential delay detected at Port of LA</div>
                        </div>
                    </motion.div>

                    {/* AI Prediction */}
                    <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: step >= 1 ? 1 : 0.3 }}
                        className="flex items-center gap-4"
                    >
                        <div className={`
                            w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-500
                            ${step >= 1 ? 'bg-purple-900/20 border-purple-500 text-purple-500' : 'bg-slate-900 border-slate-700 text-slate-700'}
                        `}>
                            <Radio size={20} className={step === 1 ? 'animate-pulse' : ''} />
                        </div>
                        <div className="bg-slate-900/80 border border-white/10 p-3 rounded-lg flex-1">
                            <div className="text-xs text-slate-400 uppercase">AI Prediction</div>
                            <div className="text-white font-medium">Customer will ask about rescheduling</div>
                        </div>
                    </motion.div>

                    {/* Outreach */}
                    <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: step >= 2 ? 1 : 0.3 }}
                        className="flex items-center gap-4"
                    >
                        <div className={`
                            w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-500
                            ${step >= 2 ? 'bg-zim-teal/20 border-zim-teal text-zim-teal' : 'bg-slate-900 border-slate-700 text-slate-700'}
                        `}>
                            <Mail size={20} />
                        </div>
                        <div className="bg-slate-900/80 border border-white/10 p-3 rounded-lg flex-1 relative overflow-hidden">
                            {step === 2 && (
                                <motion.div
                                    className="absolute inset-0 bg-zim-teal/10"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 1.5 }}
                                />
                            )}
                            <div className="text-xs text-slate-400 uppercase">Auto-Action</div>
                            <div className="text-white font-medium">Sent proactive rescheduling options email</div>
                        </div>
                    </motion.div>

                    {/* Result */}
                    <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: step >= 3 ? 1 : 0.3 }}
                        className="flex items-center gap-4"
                    >
                        <div className={`
                            w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-500
                            ${step >= 3 ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500' : 'bg-slate-900 border-slate-700 text-slate-700'}
                        `}>
                            <Bell size={20} />
                        </div>
                        <div className="bg-slate-900/80 border border-white/10 p-3 rounded-lg flex-1">
                            <div className="text-xs text-slate-400 uppercase">Outcome</div>
                            <div className="text-white font-medium">Customer confirmed new slot. No call needed.</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
